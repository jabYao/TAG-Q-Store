<?php

namespace Tests\Unit;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_has_fillable_attributes(): void
    {
        $product = new Product();
        $fillable = $product->getFillable();

        $this->assertContains('name', $fillable);
        $this->assertContains('price', $fillable);
        $this->assertContains('slug', $fillable);
        $this->assertContains('sku', $fillable);
        $this->assertContains('stock', $fillable);
    }

    public function test_belongs_to_brand(): void
    {
        $brand = Brand::factory()->create();
        $product = Product::factory()->create(['brand_id' => $brand->id]);

        $this->assertInstanceOf(Brand::class, $product->brand);
        $this->assertEquals($brand->id, $product->brand->id);
    }

    public function test_belongs_to_category(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $this->assertInstanceOf(Category::class, $product->category);
        $this->assertEquals($category->id, $product->category->id);
    }

    public function test_discount_percent_is_null_when_no_original_price(): void
    {
        $product = Product::factory()->create([
            'price' => 100000,
            'original_price' => null,
        ]);

        $this->assertNull($product->discount_percent);
    }

    public function test_discount_percent_is_calculated_correctly(): void
    {
        $product = Product::factory()->create([
            'price' => 75000,
            'original_price' => 100000,
        ]);

        $this->assertEquals(25, $product->discount_percent);
    }

    public function test_is_out_of_stock_when_stock_is_zero(): void
    {
        $product = Product::factory()->outOfStock()->create();

        $this->assertTrue($product->is_out_of_stock);
    }

    public function test_is_not_out_of_stock_when_stock_is_positive(): void
    {
        $product = Product::factory()->create(['stock' => 5]);

        $this->assertFalse($product->is_out_of_stock);
    }

    public function test_slug_is_auto_generated_on_create(): void
    {
        $product = Product::factory()->create(['name' => 'Mi Reloj Especial', 'slug' => '']);

        $this->assertEquals('mi-reloj-especial', $product->slug);
    }

    public function test_active_scope(): void
    {
        Product::factory(2)->create(['is_active' => true]);
        Product::factory(3)->create(['is_active' => false]);

        $activeCount = Product::active()->count();

        $this->assertEquals(2, $activeCount);
    }

    public function test_featured_scope(): void
    {
        Product::factory(2)->create(['is_featured' => true]);
        Product::factory(3)->create(['is_featured' => false]);

        $featuredCount = Product::featured()->count();

        $this->assertEquals(2, $featuredCount);
    }

    public function test_low_stock_scope(): void
    {
        Product::factory()->create(['stock' => 3, 'min_stock' => 5]);
        Product::factory()->create(['stock' => 10, 'min_stock' => 5]);

        $lowStockCount = Product::lowStock()->count();

        $this->assertEquals(1, $lowStockCount);
    }

    public function test_published_scope(): void
    {
        Product::factory()->create([
            'is_active' => true,
            'published_at' => now()->subDay(),
        ]);
        Product::factory()->create([
            'is_active' => true,
            'published_at' => now()->addDay(),
        ]);

        $publishedCount = Product::published()->count();

        $this->assertEquals(1, $publishedCount);
    }
}
