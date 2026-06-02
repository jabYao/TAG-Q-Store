<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    private function getOrCreateCart(Request $request): Cart
    {
        $user = $request->user();

        if ($user) {
            return Cart::firstOrCreate(
                ['user_id' => $user->id, 'status' => 'active'],
                ['session_token' => Str::random(60)]
            );
        }

        // Guest cart via session token
        $token = $request->cookie('cart_token', $request->header('X-Cart-Token'));
        if (!$token) {
            $token = Str::random(60);
        }

        return Cart::firstOrCreate(
            ['session_token' => $token, 'status' => 'active'],
            ['user_id' => null]
        );
    }

    public function show(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request);
        $cart->load(['items.product.brand', 'items.product.primaryImage']);

        return response()->json([
            'data' => [
                'id' => $cart->id,
                'items' => $cart->items->map(fn($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'price' => (float) $item->unit_price,
                    'quantity' => $item->quantity,
                    'image_url' => CloudinaryService::optimizeUrl($item->product->primaryImage?->cloudinary_url, 200),
                    'stock' => $item->product->stock,
                ]),
                'count' => $cart->count,
                'subtotal' => $cart->subtotal,
            ],
            'cart_token' => $cart->session_token,
        ])->withCookie(cookie('cart_token', $cart->session_token, 60 * 24 * 30));
    }

    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if (!$product->is_active) {
            return response()->json(['message' => 'Producto no disponible.'], 422);
        }

        if ($product->stock < $validated['quantity']) {
            return response()->json(['message' => 'Stock insuficiente.'], 422);
        }

        $cart = $this->getOrCreateCart($request);

        $existing = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            $newQty = $existing->quantity + $validated['quantity'];
            if ($newQty > $product->stock) {
                return response()->json(['message' => 'Stock insuficiente.'], 422);
            }
            $existing->update(['quantity' => $newQty]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'unit_price' => $product->price,
            ]);
        }

        $cart->load(['items.product', 'items.product.primaryImage']);

        return response()->json([
            'data' => [
                'count' => $cart->count,
                'subtotal' => $cart->subtotal,
            ],
            'message' => 'Producto agregado al carrito.',
        ]);
    }

    public function updateQuantity(Request $request, CartItem $cartItem): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $product = $cartItem->product;

        if ($product && $validated['quantity'] > $product->stock) {
            return response()->json(['message' => 'Stock insuficiente.'], 422);
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        $cart = $cartItem->cart;
        $cart->load(['items.product', 'items.product.primaryImage']);

        return response()->json([
            'data' => [
                'count' => $cart->count,
                'subtotal' => $cart->subtotal,
            ],
        ]);
    }

    public function remove(CartItem $cartItem): JsonResponse
    {
        $cart = $cartItem->cart;
        $cartItem->delete();

        $cart->load(['items.product', 'items.product.primaryImage']);

        return response()->json([
            'data' => [
                'count' => $cart->count,
                'subtotal' => $cart->subtotal,
            ],
            'message' => 'Producto eliminado del carrito.',
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request);
        $cart->items()->delete();

        return response()->json(['message' => 'Carrito vaciado.']);
    }
}
