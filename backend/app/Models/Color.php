<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Color extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'hex',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'color_product');
    }

    protected static function booted(): void
    {
        static::creating(function (Color $color) {
            if (empty($color->slug)) {
                $color->slug = Str::slug($color->name);
            }
        });
    }
}
