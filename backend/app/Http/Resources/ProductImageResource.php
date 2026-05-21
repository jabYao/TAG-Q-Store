<?php

namespace App\Http\Resources;

use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => CloudinaryService::optimizeUrl($this->cloudinary_url, 800),
            'thumbnail' => CloudinaryService::optimizeUrl($this->cloudinary_url, 300, 300),
            'alt_text' => $this->alt_text,
            'sort_order' => $this->sort_order,
            'is_primary' => $this->is_primary,
            'type' => $this->type,
        ];
    }
}
