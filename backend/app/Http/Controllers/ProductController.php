<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ProductController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show']),
            new Middleware('admin', only: ['store', 'update', 'destroy']),
        ];
    }

    /**
     * Listado público de productos activos.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::active()->published()
            ->with(['brand', 'category', 'primaryImage']);

        // Filtros
        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('brand')) {
            $query->whereHas('brand', fn($q) => $q->where('slug', $request->brand));
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->filled('movement')) {
            $query->where('movement', $request->movement);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('brand', fn($b) => $b->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Ordenamiento
        $sort = $request->sort ?? 'recent';
        $query = match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name_asc' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            default => $query->orderByDesc('published_at'),
        };

        $perPage = min((int) $request->per_page, 50) ?: 12;

        $products = $query->paginate($perPage);

        return response()->json([
            'data' => ProductResource::collection($products),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * Detalle de producto por slug.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::active()->published()
            ->with(['brand', 'category', 'primaryImage', 'images' => fn($q) => $q->ordered()])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'data' => ProductResource::make($product),
        ]);
    }

    /**
     * Crear producto (admin).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0|gte:price',
            'sku' => 'required|string|max:100|unique:products,sku',
            'stock' => 'nullable|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'gender' => 'nullable|string|max:20',
            'movement' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
            'specs' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'primary_image' => 'nullable|string|max:2000',
            'gallery' => 'nullable|array',
            'gallery.*' => 'string|max:2000',
        ]);

        $product = Product::create($validated);

        // Crear imagen principal si se envió una URL
        if (!empty($validated['primary_image'])) {
            // Limpiar transformaciones acumuladas (ej: q_auto:best,f_auto,w_800 repetido)
            $cleanUrl = preg_replace('#(/upload/)(?:q_[^/]*(?:,[^/]*)*/)+#', '/upload/', $validated['primary_image']);
            $product->images()->create([
                'cloudinary_url' => $cleanUrl,
                'is_primary' => true,
                'sort_order' => 0,
                'type' => 'gallery',
            ]);
        }

        // Crear imágenes de galería (sin duplicados)
        if (!empty($validated['gallery'])) {
            $existingUrls = $product->images()->pluck('cloudinary_url');
            $newIndex = 0;
            foreach ($validated['gallery'] as $index => $url) {
                if ($existingUrls->contains($url)) continue;
                $cleanUrl = preg_replace('#(/upload/)(?:q_[^/]*(?:,[^/]*)*/)+#', '/upload/', $url);
                $product->images()->create([
                    'cloudinary_url' => $cleanUrl,
                    'is_primary' => false,
                    'sort_order' => $index + 1,
                    'type' => 'gallery',
                ]);
                $newIndex++;
            }
        }

        return response()->json([
            'data' => ProductResource::make($product->load(['brand', 'category', 'primaryImage', 'images'])),
        ], 201);
    }

    /**
     * Actualizar producto (admin).
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'sometimes|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'sku' => 'sometimes|string|max:100|unique:products,sku,' . $product->id,
            'stock' => 'nullable|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'gender' => 'nullable|string|max:20',
            'movement' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
            'specs' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'primary_image' => 'nullable|string|max:2000',
            'gallery' => 'nullable|array',
            'gallery.*' => 'string|max:2000',
        ]);

        $product->update($validated);

        // Actualizar o crear imagen principal
        if (!empty($validated['primary_image'])) {
            // Limpiar transformaciones acumuladas
            $cleanUrl = preg_replace('#(/upload/)(?:q_[^/]*(?:,[^/]*)*/)+#', '/upload/', $validated['primary_image']);
            $existing = $product->primaryImage;
            if ($existing) {
                $existing->update(['cloudinary_url' => $cleanUrl]);
            } else {
                $product->images()->create([
                    'cloudinary_url' => $cleanUrl,
                    'is_primary' => true,
                    'sort_order' => 0,
                    'type' => 'gallery',
                ]);
            }
        }

        // Agregar nuevas imágenes de galería (sin duplicados)
        if (!empty($validated['gallery'])) {
            $existingUrls = $product->images()->pluck('cloudinary_url');
            $maxSort = $product->images()->max('sort_order') ?? 0;
            $newIndex = 0;
            foreach ($validated['gallery'] as $index => $url) {
                if ($existingUrls->contains($url)) continue;
                $cleanUrl = preg_replace('#(/upload/)(?:q_[^/]*(?:,[^/]*)*/)+#', '/upload/', $url);
                $product->images()->create([
                    'cloudinary_url' => $cleanUrl,
                    'is_primary' => false,
                    'sort_order' => $maxSort + $newIndex + 1,
                    'type' => 'gallery',
                ]);
                $newIndex++;
            }
        }

        Cache::forget("product.slug.{$product->slug}");

        return response()->json([
            'data' => ProductResource::make($product->load(['brand', 'category', 'primaryImage', 'images'])),
        ]);
    }

    /**
     * Eliminar producto (admin).
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        Cache::forget("product.slug.{$product->slug}");

        return response()->json(['message' => 'Producto eliminado correctamente.']);
    }

    /**
     * Mostrar producto para edición (admin).
     */
    public function adminShow(Product $product): JsonResponse
    {
        $product->load(['brand', 'category', 'primaryImage', 'images']);

        return response()->json([
            'data' => ProductResource::make($product),
        ]);
    }
}
