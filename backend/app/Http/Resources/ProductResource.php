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
            'min_stock' => $this->min_stock ?? 5,
            'is_active' => $this->is_active ?? true,
            'brand_id' => $this->brand_id,
            'category_id' => $this->category_id,
            'filter_values' => $this->whenLoaded('filterValues', function () {
                return $this->filterValues->map(fn ($v) => [
                    'id' => $v->id,
                    'filter_group_id' => $v->filter_group_id,
                    'value' => $v->value,
                    'slug' => $v->slug,
                ]);
            }),
            'colors' => $this->whenLoaded('colors', function () {
                return $this->colors->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                    'hex' => $c->hex,
                ]);
            }),
        ];
    }
}
