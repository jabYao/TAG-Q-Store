<?php

namespace App\Http\Resources;

use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'price' => (float) $this->price,
            'original_price' => $this->original_price ? (float) $this->original_price : null,
            'discount_percent' => $this->discount_percent,
            'sku' => $this->sku,
            'stock' => $this->stock,
            'is_out_of_stock' => $this->is_out_of_stock,
            'gender' => $this->gender,
            'movement' => $this->movement,
            'is_featured' => $this->is_featured,
            'is_new' => $this->is_new,
            'specs' => $this->specs,
            'brand' => BrandResource::make($this->whenLoaded('brand')),
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'primary_image' => $this->whenLoaded('primaryImage', function () {
                return CloudinaryService::optimizeUrl($this->primaryImage?->cloudinary_url, 800);
            }),
            'thumbnail' => $this->whenLoaded('primaryImage', function () {
                return CloudinaryService::optimizeUrl($this->primaryImage?->cloudinary_url, 300, 300);
            }),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
        ];
    }
}
