<?php

namespace App\Http\Resources;

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
            'price' => (float) $this->price,
            'original_price' => $this->original_price ? (float) $this->original_price : null,
            'stock' => (int) $this->stock,
            'sku' => $this->sku,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'brand' => $this->brand,
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'badges' => $this->getBadges(),
            'specs' => $this->whenLoaded('specs', fn() => $this->specs),
            'created_at' => $this->created_at,
        ];
    }
}
