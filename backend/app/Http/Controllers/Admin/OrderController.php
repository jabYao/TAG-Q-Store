<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['items', 'user'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('order_number', 'like', "%{$s}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$s}%"));
            });
        }

        $orders = $query->paginate(20);

        return response()->json([
            'data' => $orders->map(fn($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'customer' => $o->user?->name ?? '—',
                'total' => (float) $o->total,
                'status' => $o->status,
                'payment_method' => $o->payment_method,
                'payment_status' => $o->payment_status,
                'items_count' => $o->items->count(),
                'created_at' => $o->created_at,
            ]),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['items', 'user', 'address', 'statuses']);

        return response()->json([
            'data' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user ? [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone,
                ] : null,
                'address' => $order->address,
                'subtotal' => (float) $order->subtotal,
                'shipping_cost' => (float) $order->shipping_cost,
                'discount' => (float) $order->discount,
                'tax' => (float) $order->tax,
                'total' => (float) $order->total,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'notes' => $order->notes,
                'items' => $order->items->map(fn($i) => [
                    'id' => $i->id,
                    'product_name' => $i->product_name,
                    'product_sku' => $i->product_sku,
                    'unit_price' => (float) $i->unit_price,
                    'quantity' => $i->quantity,
                    'total' => (float) $i->total,
                ]),
                'statuses' => $order->statuses,
                'created_at' => $order->created_at,
                'paid_at' => $order->paid_at,
                'shipped_at' => $order->shipped_at,
                'delivered_at' => $order->delivered_at,
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,paid,rejected,contraentrega_pending,preparing,shipped,delivered,cancelled',
            'comment' => 'nullable|string|max:500',
        ]);

        $order->update(['status' => $validated['status']]);

        OrderStatus::create([
            'order_id' => $order->id,
            'status' => $validated['status'],
            'comment' => $validated['comment'] ?? "Estado actualizado a {$validated['status']}",
        ]);

        // Update timestamps based on status
        $timestamps = [];
        if ($validated['status'] === 'paid') $timestamps['paid_at'] = now();
        if ($validated['status'] === 'shipped') $timestamps['shipped_at'] = now();
        if ($validated['status'] === 'delivered') $timestamps['delivered_at'] = now();

        if (!empty($timestamps)) {
            $order->update($timestamps);
        }

        return response()->json(['message' => 'Estado actualizado.']);
    }
}
