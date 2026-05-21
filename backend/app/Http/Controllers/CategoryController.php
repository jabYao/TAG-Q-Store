<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CategoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show']),
            new Middleware('admin', only: ['store', 'update', 'destroy']),
        ];
    }

    /**
     * Listado público de categorías activas.
     */
    public function index(Request $request): JsonResponse
    {
        $key = $request->boolean('parents_only') ? 'categories.parents' : 'categories.all';

        $categories = Cache::remember($key, 3600, function () use ($request) {
            $query = Category::where('is_active', true)
                ->withCount('products');

            if ($request->boolean('parents_only')) {
                $query->whereNull('parent_id');
            }

            return $query->orderBy('sort_order')->orderBy('name')->get();
        });

        return response()->json([
            'data' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Detalle de categoría por slug.
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with(['children' => fn($q) => $q->withCount('products')])
            ->withCount('products')
            ->firstOrFail();

        return response()->json([
            'data' => CategoryResource::make($category),
        ]);
    }

    /**
     * Crear categoría (admin).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $category = Category::create($validated);

        Cache::forget('categories.all');
        Cache::forget('categories.parents');

        return response()->json([
            'data' => CategoryResource::make($category),
        ], 201);
    }

    /**
     * Actualizar categoría (admin).
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $category->update($validated);

        Cache::forget('categories.all');
        Cache::forget('categories.parents');

        return response()->json([
            'data' => CategoryResource::make($category),
        ]);
    }

    /**
     * Eliminar categoría (admin).
     */
    public function destroy(Category $category): JsonResponse
    {
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar una categoría con productos asociados.',
            ], 409);
        }

        $category->delete();

        Cache::forget('categories.all');
        Cache::forget('categories.parents');

        return response()->json(['message' => 'Categoría eliminada correctamente.']);
    }
}
