<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class FilterGroup extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'display_type',
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

    public function values(): HasMany
    {
        return $this->hasMany(FilterValue::class, 'filter_group_id')->orderBy('sort_order');
    }

    public function activeValues(): HasMany
    {
        return $this->hasMany(FilterValue::class, 'filter_group_id')
            ->where('is_active', true)
            ->orderBy('sort_order');
    }

    protected static function booted(): void
    {
        static::creating(function (FilterGroup $group) {
            if (empty($group->slug)) {
                $group->slug = Str::slug($group->name);
            }
        });
    }
}
