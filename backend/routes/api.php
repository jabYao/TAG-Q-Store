<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\ColorController as AdminColorController;
use App\Http\Controllers\Admin\FilterController as AdminFilterController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — TAG-Q E-commerce
|--------------------------------------------------------------------------
|
| Public, auth, and admin API routes.
|
*/

// ─── Public routes ───
Route::get('/productos', [ProductController::class, 'index']);
Route::get('/productos/{slug}', [ProductController::class, 'show']);
Route::get('/categorias', [CategoryController::class, 'index']);
Route::get('/categorias/{slug}', [CategoryController::class, 'show']);
Route::get('/marcas', [BrandController::class, 'index']);
Route::get('/colores', function () {
    return response()->json([
        'data' => \App\Models\Color::orderBy('sort_order')->get()
    ]);
});
Route::get('/opciones-filtro', function () {
    return response()->json([
        'data' => \App\Models\FilterGroup::with('activeValues')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
    ]);
});

// ─── Banners públicos ───
Route::get('/banners', function () {
    return response()->json([
        'data' => \App\Models\Banner::active()
            ->orderBy('sort_order')
            ->get(['title', 'subtitle', 'cta_text', 'cta_link', 'image_url', 'bg_color'])
    ]);
});

// ─── Heroes públicos ───
Route::get('/heroes', function () {
    return response()->json([
        'data' => \App\Models\Hero::active()
            ->get(['title', 'subtitle', 'cta_text', 'cta_link', 'image_url'])
    ]);
});

// ─── Settings públicos ───
Route::get('/settings/contacto', function () {
    return response()->json([
        'whatsapp' => \App\Models\Setting::getValue('whatsapp_contacto', '573152429172'),
        'envio_minimo' => \App\Models\Setting::getValue('envio_gratis_minimo', 400000),
    ]);
});

Route::get('/settings/top-bar', function () {
    $messages = \App\Models\Setting::getValue('top_bar_messages', []);
    $envioMinimo = \App\Models\Setting::getValue('envio_gratis_minimo', 400000);
    return response()->json([
        'messages' => $messages,
        'envio_minimo' => $envioMinimo,
    ]);
});

// ─── Guest auth routes (throttled) ───
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:3,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:3,1');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:3,1');

// ─── Protected + guest cart routes ───
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/carrito', [CartController::class, 'show']);
    Route::post('/carrito', [CartController::class, 'add']);
    Route::put('/carrito/{cartItem}', [CartController::class, 'updateQuantity']);
    Route::delete('/carrito/{cartItem}', [CartController::class, 'remove']);
    Route::delete('/carrito', [CartController::class, 'clear']);

    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Addresses
    Route::apiResource('/direcciones', AddressController::class)->parameters(['direcciones' => 'address']);

    // Checkout
    Route::get('/checkout/resumen', [CheckoutController::class, 'summary']);
    Route::post('/checkout/orden', [CheckoutController::class, 'placeOrder']);

    // Orders (user's own orders)
    Route::get('/ordenes', function (Illuminate\Http\Request $request) {
        return response()->json([
            'data' => \App\Models\Order::where('user_id', $request->user()->id)
                ->with('items')
                ->orderByDesc('created_at')
                ->get()
        ]);
    });

    Route::get('/ordenes/{order}', function (Illuminate\Http\Request $request, \App\Models\Order $order) {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }
        $order->load('items.product', 'address', 'statuses');

        $whatsapp = \App\Models\Setting::getValue('whatsapp_contacto', '573152429172');

        return response()->json([
            'data' => $order,
            'whatsapp' => $whatsapp,
        ]);
    });
});

// ─── Admin routes (Sanctum + admin middleware) ───
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Colors
    Route::get('/colores', [AdminColorController::class, 'index']);
    Route::post('/colores', [AdminColorController::class, 'store']);
    Route::put('/colores/{color}', [AdminColorController::class, 'update']);
    Route::delete('/colores/{color}', [AdminColorController::class, 'destroy']);

    // Filter management
    Route::get('/filtros', [AdminFilterController::class, 'index']);
    Route::post('/filtros/grupos', [AdminFilterController::class, 'storeGroup']);
    Route::put('/filtros/grupos/{filterGroup}', [AdminFilterController::class, 'updateGroup']);
    Route::delete('/filtros/grupos/{filterGroup}', [AdminFilterController::class, 'destroyGroup']);
    Route::post('/filtros/valores', [AdminFilterController::class, 'storeValue']);
    Route::put('/filtros/valores/{filterValue}', [AdminFilterController::class, 'updateValue']);
    Route::delete('/filtros/valores/{filterValue}', [AdminFilterController::class, 'destroyValue']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/pedidos', [AdminOrderController::class, 'index']);
    Route::get('/pedidos/{order}', [AdminOrderController::class, 'show']);
    Route::put('/pedidos/{order}/status', [AdminOrderController::class, 'updateStatus']);
    Route::get('/clientes', [ClientController::class, 'index']);
    Route::get('/clientes/{user}', [ClientController::class, 'show']);

    // Roles
    Route::get('/roles', [RoleController::class, 'index']);
    Route::put('/roles/{role}', [RoleController::class, 'updateRole']);
    Route::put('/roles/usuario/{user}', [RoleController::class, 'updateUserRole']);

    // Settings
    Route::get('/configuracion', function () {
        return response()->json(['data' => \App\Models\Setting::all()]);
    });
    Route::put('/configuracion', function (Illuminate\Http\Request $request) {
        foreach ($request->all() as $key => $value) {
            \App\Models\Setting::where('key', $key)->update(['value' => $value]);
        }
        return response()->json(['message' => 'Configuración actualizada.']);
    });

    Route::get('/productos', [ProductController::class, 'adminIndex']);
    Route::get('/productos/{product}', [ProductController::class, 'adminShow']);
    Route::post('/productos', [ProductController::class, 'store']);
    Route::put('/productos/{product}', [ProductController::class, 'update']);
    Route::delete('/productos/{product}', [ProductController::class, 'destroy']);

    Route::post('/categorias', [CategoryController::class, 'store']);
    Route::put('/categorias/{category}', [CategoryController::class, 'update']);
    Route::delete('/categorias/{category}', [CategoryController::class, 'destroy']);

    Route::post('/marcas', [BrandController::class, 'store']);
    Route::put('/marcas/{brand}', [BrandController::class, 'update']);
    Route::delete('/marcas/{brand}', [BrandController::class, 'destroy']);

    // Banners
    Route::get('/banners', function () {
        return response()->json(['data' => \App\Models\Banner::orderBy('sort_order')->get()]);
    });
    Route::post('/banners', function (Illuminate\Http\Request $request) {
        $banner = \App\Models\Banner::create($request->only(['title', 'subtitle', 'cta_text', 'cta_link', 'type', 'is_active']));
        return response()->json(['data' => $banner], 201);
    });
    Route::put('/banners/{banner}', function (Illuminate\Http\Request $request, \App\Models\Banner $banner) {
        $banner->update($request->only(['title', 'subtitle', 'cta_text', 'cta_link', 'image_url', 'is_active', 'bg_color']));
        return response()->json(['data' => $banner]);
    });
    Route::delete('/banners/{banner}', function (\App\Models\Banner $banner) {
        $banner->delete();
        return response()->json(['message' => 'Banner eliminado.']);
    });

    // Heroes
    Route::get('/heroes', [HeroController::class, 'index']);
    Route::post('/heroes', [HeroController::class, 'store']);
    Route::put('/heroes/{hero}', [HeroController::class, 'update']);
    Route::delete('/heroes/{hero}', [HeroController::class, 'destroy']);

    // Contacto (admin)
    Route::get('/contacto', [ContactController::class, 'index']);
    Route::put('/contacto/{contactMessage}/leer', [ContactController::class, 'markRead']);
    Route::delete('/contacto/{contactMessage}', [ContactController::class, 'destroy']);

    // Image management
    Route::post('/imagenes/producto', [ImageController::class, 'uploadProductImage']);
    Route::delete('/imagenes/producto/{productImage}', [ImageController::class, 'destroyProductImage']);
    Route::put('/imagenes/reordenar', [ImageController::class, 'reorderImages']);
    Route::post('/imagenes/banner', [ImageController::class, 'uploadBannerImage']);
    Route::post('/imagenes/hero', [ImageController::class, 'uploadHeroImage']);
    Route::post('/imagenes/promocion', [ImageController::class, 'uploadPromotionImage']);
});

// ─── Webhooks Wompi (no auth) ───
Route::post('/wompi/webhook', [WebhookController::class, 'handleWompi'])->name('wompi.webhook');
Route::get('/pago/resultado', [WebhookController::class, 'paymentResult'])->name('pago.resultado');
