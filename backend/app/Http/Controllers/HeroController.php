<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function index(): JsonResponse
    {
        $heroes = Hero::orderBy('sort_order')->get();

        return response()->json([
            'data' => $heroes,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'cta_text' => 'required|string|max:100',
            'cta_link' => 'required|string|max:500',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $hero = Hero::create($validated);

        return response()->json(['data' => $hero], 201);
    }

    public function update(Request $request, Hero $hero): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'cta_text' => 'sometimes|string|max:100',
            'cta_link' => 'sometimes|string|max:500',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $hero->update($validated);

        return response()->json(['data' => $hero]);
    }

    public function destroy(Hero $hero): JsonResponse
    {
        $hero->delete();

        return response()->json(['message' => 'Hero eliminado.']);
    }
}
