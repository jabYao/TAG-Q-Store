<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()->orderByDesc('is_default')->orderByDesc('created_at')->get();

        return response()->json(['data' => $addresses]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line' => 'required|string|max:500',
            'barrio' => 'nullable|string|max:200',
            'city' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'zip' => 'nullable|string|max:20',
            'reference' => 'nullable|string|max:500',
            'is_default' => 'nullable|boolean',
        ]);

        $validated['user_id'] = $request->user()->id;

        // If this is the first address or marked as default, unset others
        if ($validated['is_default'] ?? false) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = Address::create($validated);

        return response()->json(['data' => $address], 201);
    }

    public function update(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address_line' => 'sometimes|string|max:500',
            'barrio' => 'nullable|string|max:200',
            'city' => 'sometimes|string|max:100',
            'department' => 'sometimes|string|max:100',
            'zip' => 'nullable|string|max:20',
            'reference' => 'nullable|string|max:500',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json(['data' => $address]);
    }

    public function destroy(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $address->delete();

        return response()->json(['message' => 'Dirección eliminada.']);
    }
}
