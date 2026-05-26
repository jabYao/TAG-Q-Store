<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function __construct(
        private readonly CloudinaryService $cloudinary
    ) {}

    /**
     * Upload image for a product.
     */
    public function uploadProductImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'nullable|exists:products,id',
            'image' => 'required|image|mimes:jpeg,png,webp|max:5120', // 5MB max
            'is_primary' => 'nullable|boolean',
            'alt_text' => 'nullable|string|max:255',
        ]);

        $file = $request->file('image');
        $productId = $validated['product_id'] ?? null;

        // Subir a Cloudinary
        $folder = $productId ? "tag-q/products/{$productId}" : 'tag-q/products/pending';
        $result = $this->cloudinary->upload($file, ['folder' => $folder]);

        // Si hay product_id, crear registro en BD
        if ($productId) {
            $productImage = ProductImage::create([
                'product_id' => $productId,
                'cloudinary_url' => $result['secure_url'],
                'cloudinary_public_id' => $result['public_id'],
                'alt_text' => $validated['alt_text'] ?? null,
                'is_primary' => $validated['is_primary'] ?? false,
                'sort_order' => ProductImage::where('product_id', $productId)->max('sort_order') + 1,
                'type' => 'gallery',
            ]);

            if ($productImage->is_primary) {
                ProductImage::where('product_id', $productId)
                    ->where('id', '!=', $productImage->id)
                    ->update(['is_primary' => false]);
            }

            return response()->json([
                'data' => [
                    'id' => $productImage->id,
                    'url' => $productImage->cloudinary_url,
                    'public_id' => $productImage->cloudinary_public_id,
                    'alt_text' => $productImage->alt_text,
                    'is_primary' => $productImage->is_primary,
                    'sort_order' => $productImage->sort_order,
                ],
            ], 201);
        }

        // Sin product_id: solo devolver la URL
        return response()->json([
            'data' => [
                'url' => $result['secure_url'],
                'public_id' => $result['public_id'],
            ],
        ], 201);
    }

    /**
     * Delete a product image.
     */
    public function destroyProductImage(ProductImage $productImage): JsonResponse
    {
        // Eliminar de Cloudinary solo si tenemos el public_id
        if ($productImage->cloudinary_public_id) {
            try {
                $this->cloudinary->delete($productImage->cloudinary_public_id);
            } catch (\Exception $e) {
                // Log pero continuar — el registro debe eliminarse igual
            }
        }

        $productImage->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente.']);
    }

    /**
     * Reorder images for a product.
     */
    public function reorderImages(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:product_images,id',
            'images.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['images'] as $item) {
            ProductImage::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Orden actualizado.']);
    }

    /**
     * Upload a banner image.
     */
    public function uploadBannerImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,webp|max:10240', // 10MB
            'public_id' => 'nullable|string',
        ]);

        $file = $request->file('image');

        $result = $this->cloudinary->upload($file, [
            'folder' => 'tag-q/banners',
            'public_id' => $validated['public_id'] ?? null,
            'transformation' => [
                'quality' => 'auto:best',
                'fetch_format' => 'auto',
                'width' => 1920,
                'crop' => 'limit',
            ],
        ]);

        return response()->json([
            'data' => [
                'url' => $result['secure_url'],
                'public_id' => $result['public_id'],
            ],
        ], 201);
    }
}
