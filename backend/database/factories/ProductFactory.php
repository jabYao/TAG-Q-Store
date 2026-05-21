<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'brand_id' => Brand::factory(),
            'category_id' => Category::factory(),
            'name' => fake()->unique()->words(3, true),
            'slug' => fn(array $attrs) => \Illuminate\Support\Str::slug($attrs['name']),
            'description' => fake()->paragraphs(3, true),
            'short_description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 100000, 10000000),
            'original_price' => null,
            'sku' => strtoupper(fake()->bothify('SKU-####-????')),
            'stock' => fake()->numberBetween(0, 100),
            'min_stock' => fake()->numberBetween(1, 10),
            'gender' => fake()->randomElement(['male', 'female', 'unisex']),
            'movement' => fake()->randomElement(['automatic', 'quartz', 'mechanical', 'solar']),
            'is_active' => true,
            'is_featured' => false,
            'is_new' => false,
            'specs' => [
                'case_material' => fake()->randomElement(['stainless steel', 'titanium', 'gold plated']),
                'water_resistance' => fake()->randomElement(['30m', '50m', '100m', '200m']),
            ],
            'published_at' => now(),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn() => ['is_featured' => true]);
    }

    public function isNew(): static
    {
        return $this->state(fn() => ['is_new' => true]);
    }

    public function inactive(): static
    {
        return $this->state(fn() => [
            'is_active' => false,
            'published_at' => null,
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn() => ['stock' => 0]);
    }

    public function onSale(): static
    {
        return $this->state(fn() => [
            'original_price' => fake()->randomFloat(2, 200000, 15000000),
            'price' => fn(array $attrs) => $attrs['original_price'] * fake()->randomFloat(2, 0.5, 0.85),
        ]);
    }

    public function lowStock(): static
    {
        return $this->state(fn() => [
            'stock' => 3,
            'min_stock' => 5,
        ]);
    }
}
