<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\Payment;
use App\Models\Setting;
use App\Services\WompiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    private const SHIPPING_FREE_MINIMUM = 400000;
    private const TAX_PERCENTAGE = 0;

    public function __construct(
        private readonly WompiService $wompi
    ) {}

    /**
     * Calcular resumen del checkout (subtotal, envío, impuestos, total).
     */
    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->with(['items.product', 'items.product.primaryImage'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío.'], 422);
        }

        $shippingFreeMinimum = (int) Setting::getValue('envio_gratis_minimo', self::SHIPPING_FREE_MINIMUM);
        $subtotal = $cart->subtotal;
        $shippingCost = $subtotal >= $shippingFreeMinimum ? 0 : 15000;
        $discount = 0;
        $tax = round($subtotal * self::TAX_PERCENTAGE / 100, 2);
        $total = round($subtotal + $shippingCost + $tax - $discount, 2);

        return response()->json([
            'data' => [
                'items' => $cart->items->map(fn($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'price' => (float) $item->unit_price,
                    'quantity' => $item->quantity,
                    'image_url' => $item->product->primaryImage?->cloudinary_url,
                    'total' => (float) ($item->unit_price * $item->quantity),
                ]),
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'shipping_free_minimum' => $shippingFreeMinimum,
                'shipping_is_free' => $shippingCost === 0,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $total,
            ],
        ]);
    }

    /**
     * Crear la orden y redirigir al método de pago.
     */
    public function placeOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:wompi,contraentrega',
            'notes' => 'nullable|string|max:500',
            'items' => 'nullable|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $user = $request->user();

        // Verificar si el usuario está bloqueado por demasiados rechazos
        if ($user->blocked_until && $user->blocked_until->isFuture()) {
            $minutesLeft = now()->diffInMinutes($user->blocked_until);
            return response()->json([
                'message' => "Tu cuenta está temporalmente bloqueada por seguridad. Intentá de nuevo en {$minutesLeft} minutos.",
            ], 429);
        }

        // Verify address belongs to user
        $address = $user->addresses()->find($validated['address_id']);
        if (!$address) {
            return response()->json(['message' => 'Dirección inválida.'], 422);
        }

        // Resolve items: from request body (client-side cart) or DB cart
        $orderItemsData = [];
        $subtotal = 0;

        if (!empty($validated['items'])) {
            // Client-side cart: items come in the request
            foreach ($validated['items'] as $input) {
                $product = \App\Models\Product::findOrFail($input['product_id']);

                if ($input['quantity'] > $product->stock) {
                    return response()->json([
                        'message' => "Stock insuficiente para {$product->name}.",
                    ], 422);
                }

                $unitPrice = (float) $product->price;
                $lineTotal = $unitPrice * $input['quantity'];
                $subtotal += $lineTotal;

                $orderItemsData[] = [
                    'product' => $product,
                    'product_id' => $input['product_id'],
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'unit_price' => $unitPrice,
                    'quantity' => $input['quantity'],
                    'total' => $lineTotal,
                ];
            }

            // Mark any active DB cart as converted (if exists)
            Cart::where('user_id', $user->id)
                ->where('status', 'active')
                ->update(['status' => 'converted']);
        } else {
            // Server-side cart (legacy): read from DB
            $cart = Cart::where('user_id', $user->id)
                ->where('status', 'active')
                ->with(['items.product'])
                ->first();

            if (!$cart || $cart->items->isEmpty()) {
                return response()->json(['message' => 'El carrito está vacío.'], 422);
            }

            foreach ($cart->items as $item) {
                if ($item->quantity > $item->product->stock) {
                    return response()->json([
                        'message' => "Stock insuficiente para {$item->product->name}.",
                    ], 422);
                }

                $orderItemsData[] = [
                    'product' => $item->product,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->product->sku,
                    'unit_price' => $item->unit_price,
                    'quantity' => $item->quantity,
                    'total' => $item->unit_price * $item->quantity,
                ];
            }

            $subtotal = $cart->subtotal;

            // Mark cart as converted
            $cart->update(['status' => 'converted']);
        }

        // Calculate totals
        $shippingFreeMinimum = (int) Setting::getValue('envio_gratis_minimo', self::SHIPPING_FREE_MINIMUM);
        $shippingCost = $subtotal >= $shippingFreeMinimum ? 0 : 15000;
        $discount = 0;
        $tax = round($subtotal * self::TAX_PERCENTAGE / 100, 2);
        $total = round($subtotal + $shippingCost + $tax - $discount, 2);

        // Create order
        $isInternal = $user->hasRole('admin') || $user->hasRole('operador');

        $order = Order::create([
            'order_number' => 'TAG-' . strtoupper(Str::random(8)),
            'user_id' => $user->id,
            'address_id' => $address->id,
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
            'status' => $validated['payment_method'] === 'contraentrega' ? 'contraentrega_pending' : 'pending',
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'is_internal' => $isInternal,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Create order items and decrement stock
        foreach ($orderItemsData as $data) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $data['product_id'],
                'product_name' => $data['product_name'],
                'product_sku' => $data['product_sku'],
                'unit_price' => $data['unit_price'],
                'quantity' => $data['quantity'],
                'total' => $data['total'],
            ]);

            $data['product']->decrement('stock', $data['quantity']);
        }

        // Log status
        OrderStatus::create([
            'order_id' => $order->id,
            'status' => $order->status,
            'comment' => 'Orden creada',
        ]);

        // Create payment record
        Payment::create([
            'order_id' => $order->id,
            'reference' => $order->order_number,
            'status' => 'pending',
            'amount' => $total,
            'amount_in_cents' => (int) round($total * 100),
        ]);

        // WhatsApp contacto para contraentrega
        $whatsapp = \App\Models\Setting::getValue('whatsapp_contacto', '573152429172');

        // If Wompi payment, generate redirect URL via WompiService
        $paymentUrl = null;
        if ($validated['payment_method'] === 'wompi') {
            $paymentUrl = $this->wompi->generatePaymentUrl(
                reference: $order->order_number,
                amount: $total,
                currency: 'COP',
                extra: ['redirect_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/pago/resultado?reference=' . $order->order_number]
            );
        }

        return response()->json([
            'data' => [
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'payment_method' => $order->payment_method,
                ],
                'payment_url' => $paymentUrl,
                'whatsapp' => $whatsapp,
                'widget' => $validated['payment_method'] === 'wompi'
                    ? $this->wompi->getWidgetParams(
                        $order->order_number,
                        $total,
                        'COP'
                    )
                    : null,
            ],
            'message' => 'Orden creada correctamente.',
        ], 201);
    }


}
