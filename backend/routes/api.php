<?php

use App\Http\Controllers\AuthController;
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

// Guest auth routes (throttled)
Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login')->middleware('throttle:5,1');
    Route::post('/register', 'register')->middleware('throttle:3,1');
});

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

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

// Admin routes (Sanctum + admin middleware)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
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
