<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Public, auth, and admin API routes for TAG-Q.
|
*/

// Public routes
Route::get('/productos', function () {
    return response()->json(['data' => []]);
});

Route::get('/categorias', function () {
    return response()->json(['data' => []]);
});

// Guest auth routes
Route::post('/login', function (Request $request) {
    return response()->json(['message' => 'Login endpoint'], 501);
});

Route::post('/register', function (Request $request) {
    return response()->json(['message' => 'Register endpoint'], 501);
});

Route::post('/logout', function () {
    return response()->json(['message' => 'Logout endpoint'], 501);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/carrito', function () {
        return response()->json(['data' => []]);
    });

    Route::post('/carrito', function () {
        return response()->json(['message' => 'Add to cart'], 501);
    });

    Route::get('/ordenes', function () {
        return response()->json(['data' => []]);
    });
});

// Admin routes (TODO: add admin middleware in Phase 4)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Admin dashboard']);
    });

    Route::get('/productos', function () {
        return response()->json(['data' => []]);
    });

    Route::get('/pedidos', function () {
        return response()->json(['data' => []]);
    });

    Route::get('/clientes', function () {
        return response()->json(['data' => []]);
    });
});

// Webhooks (no auth)
Route::post('/wompi/webhook', function () {
    return response()->json(['message' => 'Webhook received']);
})->name('wompi.webhook');
