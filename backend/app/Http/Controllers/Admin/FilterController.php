<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FilterGroup;
use App\Models\FilterValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    // ─── Groups ───

    public function index(): JsonResponse
    {
        $groups = FilterGroup::with('values')->orderBy('sort_order')->get();

        return response()->json(['data' => $groups]);
    }

    public function storeGroup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:filter_groups,slug',
            'display_type' => 'required|in:checkbox,radio',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $group = FilterGroup::create($validated);

        return response()->json(['data' => $group->load('values')], 201);
    }

    public function updateGroup(Request $request, FilterGroup $filterGroup): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'slug' => 'sometimes|string|max:100|unique:filter_groups,slug,' . $filterGroup->id,
            'display_type' => 'sometimes|in:checkbox,radio',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $filterGroup->update($validated);

        return response()->json(['data' => $filterGroup->load('values')]);
    }

    public function destroyGroup(FilterGroup $filterGroup): JsonResponse
    {
        $filterGroup->delete();

        return response()->json(['message' => 'Grupo de filtro eliminado.']);
    }

    // ─── Values ───

    public function storeValue(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'filter_group_id' => 'required|exists:filter_groups,id',
            'value' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:filter_values,slug',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $value = FilterValue::create($validated);

        return response()->json(['data' => $value], 201);
    }

    public function updateValue(Request $request, FilterValue $filterValue): JsonResponse
    {
        $validated = $request->validate([
            'filter_group_id' => 'sometimes|exists:filter_groups,id',
            'value' => 'sometimes|string|max:100',
            'slug' => 'sometimes|string|max:100|unique:filter_values,slug,' . $filterValue->id,
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $filterValue->update($validated);

        return response()->json(['data' => $filterValue]);
    }

    public function destroyValue(FilterValue $filterValue): JsonResponse
    {
        $filterValue->delete();

        return response()->json(['message' => 'Valor de filtro eliminado.']);
    }
}
