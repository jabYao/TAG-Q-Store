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
    private const TAX_PERCENTAGE = 19;

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
        ]);

        $user = $request->user();

        // Verify cart exists and has items
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->with(['items.product'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío.'], 422);
        }

        // Verify address belongs to user
        $address = $user->addresses()->find($validated['address_id']);
        if (!$address) {
            return response()->json(['message' => 'Dirección inválida.'], 422);
        }

        // Verify stock for all items
        foreach ($cart->items as $item) {
            if ($item->quantity > $item->product->stock) {
                return response()->json([
                    'message' => "Stock insuficiente para {$item->product->name}.",
                ], 422);
            }
        }

        // Calculate totals
        $shippingFreeMinimum = (int) Setting::getValue('envio_gratis_minimo', self::SHIPPING_FREE_MINIMUM);
        $subtotal = $cart->subtotal;
        $shippingCost = $subtotal >= $shippingFreeMinimum ? 0 : 15000;
        $discount = 0;
        $tax = round($subtotal * self::TAX_PERCENTAGE / 100, 2);
        $total = round($subtotal + $shippingCost + $tax - $discount, 2);

        // Create order
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
            'notes' => $validated['notes'] ?? null,
        ]);

        // Create order items
        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'product_sku' => $item->product->sku,
                'unit_price' => $item->unit_price,
                'quantity' => $item->quantity,
                'total' => $item->unit_price * $item->quantity,
            ]);

            // Decrement stock
            $item->product->decrement('stock', $item->quantity);
        }

        // Log status
        OrderStatus::create([
            'order_id' => $order->id,
            'status' => $order->status,
            'comment' => 'Orden creada',
        ]);

        // Mark cart as converted
        $cart->update(['status' => 'converted']);

        // Create payment record
        Payment::create([
            'order_id' => $order->id,
            'reference' => $order->order_number,
            'status' => 'pending',
            'amount' => $total,
            'amount_in_cents' => $total,
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
                extra: ['redirect_url' => url('/api/pago/resultado?reference=' . $order->order_number)]
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
            ],
            'message' => 'Orden creada correctamente.',
        ], 201);
    }


}
