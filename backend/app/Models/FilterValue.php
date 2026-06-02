<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class FilterValue extends Model
{
    protected $fillable = [
        'filter_group_id',
        'value',
        'slug',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(FilterGroup::class, 'filter_group_id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_filter_value');
    }

    protected static function booted(): void
    {
        static::creating(function (FilterValue $value) {
            if (empty($value->slug)) {
                $value->slug = Str::slug($value->value);
            }
        });
    }
}
