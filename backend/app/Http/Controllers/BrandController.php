<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BrandController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index']),
            new Middleware('admin', only: ['store', 'update', 'destroy']),
        ];
    }

    /**
     * Listado de marcas activas.
     */
    public function index(Request $request): JsonResponse
    {
        $brands = Cache::remember('brands.all', 3600, function () {
            $collection = Brand::where('is_active', true)
                ->withCount('products')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get();

            return BrandResource::collection($collection)->toArray(request());
        });

        // Cachea array transformado; filtramos en memoria si hace falta
        $data = $brands;
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $data = array_values(array_filter($brands, fn($b) => str_contains(strtolower($b['name']), $search)));
        }

        return response()->json([
            'data' => $data,
        ]);
    }

    public function show(Brand $brand): JsonResponse
    {
        return response()->json([
            'data' => BrandResource::make($brand->loadCount('products')),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:brands,slug',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $brand = Brand::create($validated);

        Cache::forget('brands.all');

        return response()->json([
            'data' => BrandResource::make($brand),
        ], 201);
    }

    public function update(Request $request, Brand $brand): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:brands,slug,' . $brand->id,
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $brand->update($validated);

        Cache::forget('brands.all');

        return response()->json([
            'data' => BrandResource::make($brand),
        ]);
    }

    public function destroy(Brand $brand): JsonResponse
    {
        if ($brand->products()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar una marca con productos asociados.',
            ], 409);
        }

        $brand->delete();

        Cache::forget('brands.all');

        return response()->json(['message' => 'Marca eliminada correctamente.']);
    }
}
