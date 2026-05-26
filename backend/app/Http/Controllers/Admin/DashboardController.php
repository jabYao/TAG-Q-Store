<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();

        // KPIs excluyen órdenes internas (admin/operador comprando)
        $ordersThisMonth = Order::where('is_internal', false)
            ->where('created_at', '>=', $startOfMonth)
            ->count();
        $revenueThisMonth = Order::where('is_internal', false)
            ->where('created_at', '>=', $startOfMonth)
            ->whereIn('status', ['paid', 'delivered'])
            ->sum('total');

        $pendingOrders = Order::whereIn('status', ['pending', 'contraentrega_pending'])->count();
        $recentOrders = Order::with('items')
            ->latest()
            ->take(10)
            ->get();

        $lowStockProducts = Product::whereColumn('stock', '<=', 'min_stock')
            ->where('is_active', true)
            ->count();

        return response()->json([
            'data' => [
                'total_products' => Product::where('is_active', true)->count(),
                'total_orders' => Order::where('is_internal', false)->count(),
                'total_customers' => User::role('cliente')->count(),
                'orders_this_month' => $ordersThisMonth,
                'revenue_this_month' => (float) $revenueThisMonth,
                'pending_orders' => $pendingOrders,
                'low_stock_products' => $lowStockProducts,
                'recent_orders' => $recentOrders->map(fn($o) => [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'total' => (float) $o->total,
                    'status' => $o->status,
                    'is_internal' => (bool) $o->is_internal,
                    'items_count' => $o->items->count(),
                    'created_at' => $o->created_at,
                ]),
            ],
        ]);
    }
}
