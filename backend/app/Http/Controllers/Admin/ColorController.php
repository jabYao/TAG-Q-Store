<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Color;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Color::orderBy('sort_order')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'slug' => 'nullable|string|max:50|unique:colors,slug',
            'hex' => 'required|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $color = Color::create($validated);

        return response()->json(['data' => $color], 201);
    }

    public function update(Request $request, Color $color): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:50',
            'slug' => 'sometimes|string|max:50|unique:colors,slug,' . $color->id,
            'hex' => 'sometimes|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $color->update($validated);

        return response()->json(['data' => $color]);
    }

    public function destroy(Color $color): JsonResponse
    {
        $color->delete();

        return response()->json(['message' => 'Color eliminado.']);
    }
}
