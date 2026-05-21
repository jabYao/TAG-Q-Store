<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::role('cliente')->withCount(['orders'])->orderByDesc('created_at');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%");
            });
        }

        $clients = $query->paginate(20);

        return response()->json([
            'data' => $clients->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'orders_count' => $u->orders_count,
                'created_at' => $u->created_at,
            ]),
            'meta' => [
                'current_page' => $clients->currentPage(),
                'last_page' => $clients->lastPage(),
                'total' => $clients->total(),
            ],
        ]);
    }

    public function show(User $user): JsonResponse
    {
        $user->loadCount('orders');
        $user->load(['orders' => fn($q) => $q->latest()->take(10)]);

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'orders_count' => $user->orders_count,
                'recent_orders' => $user->orders->map(fn($o) => [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'total' => (float) $o->total,
                    'status' => $o->status,
                    'created_at' => $o->created_at,
                ]),
                'created_at' => $user->created_at,
            ],
        ]);
    }
}
