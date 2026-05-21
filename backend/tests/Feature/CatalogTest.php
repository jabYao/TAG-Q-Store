<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    // ─── Products ───

    public function test_can_list_active_products(): void
    {
        Product::factory(3)->create(['is_active' => true]);
        Product::factory(2)->create(['is_active' => false]);

        $response = $this->getJson('/api/productos');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_show_product_by_slug(): void
    {
        $product = Product::factory()->create([
            'name' => 'Reloj Deportivo X',
        ]);

        $response = $this->getJson("/api/productos/{$product->slug}");

        $response->assertOk()
            ->assertJsonPath('data.name', 'Reloj Deportivo X');
    }

    public function test_returns_404_for_nonexistent_product(): void
    {
        $response = $this->getJson('/api/productos/producto-inexistente');

        $response->assertNotFound();
    }

    public function test_inactive_product_is_not_listed(): void
    {
        $product = Product::factory()->inactive()->create();

        $response = $this->getJson('/api/productos');
        $response->assertJsonMissing(['slug' => $product->slug]);
    }

    public function test_can_filter_products_by_category(): void
    {
        $cat = Category::factory()->create();
        $otherCat = Category::factory()->create();

        Product::factory(2)->create(['category_id' => $cat->id, 'is_active' => true]);
        Product::factory(3)->create(['category_id' => $otherCat->id, 'is_active' => true]);

        $response = $this->getJson("/api/productos?category={$cat->slug}");
        $response->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_can_filter_products_by_brand(): void
    {
        $brand = Brand::factory()->create();
        $otherBrand = Brand::factory()->create();

        Product::factory(2)->create(['brand_id' => $brand->id, 'is_active' => true]);
        Product::factory(3)->create(['brand_id' => $otherBrand->id, 'is_active' => true]);

        $response = $this->getJson("/api/productos?brand={$brand->slug}");
        $response->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_can_search_products_by_name(): void
    {
        Product::factory()->create(['name' => 'Reloj Casio Deportivo', 'is_active' => true]);
        Product::factory()->create(['name' => 'Reloj Rolex Clásico', 'is_active' => true]);
        Product::factory()->create(['name' => 'Bolso de Cuero', 'is_active' => true]);

        $response = $this->getJson('/api/productos?search=Rolex');
        $response->assertOk()->assertJsonCount(1, 'data');
    }

    // ─── Categories ───

    public function test_can_list_active_categories(): void
    {
        Category::factory(3)->create(['is_active' => true]);
        Category::factory(2)->create(['is_active' => false]);

        $response = $this->getJson('/api/categorias');

        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_show_category_by_slug(): void
    {
        $category = Category::factory()->create(['name' => 'Deportivos']);

        $response = $this->getJson("/api/categorias/{$category->slug}");

        $response->assertOk()
            ->assertJsonPath('data.name', 'Deportivos');
    }

    public function test_inactive_category_returns_404(): void
    {
        $category = Category::factory()->inactive()->create();

        $this->getJson("/api/categorias/{$category->slug}")
            ->assertNotFound();
    }

    public function test_category_includes_product_count(): void
    {
        $category = Category::factory()->create();
        Product::factory(5)->create(['category_id' => $category->id, 'is_active' => true]);

        $response = $this->getJson('/api/categorias');
        $response->assertOk();

        $catData = collect($response->json('data'))->firstWhere('id', $category->id);
        $this->assertNotNull($catData);
    }

    // ─── Brands ───

    public function test_can_list_active_brands(): void
    {
        Brand::factory(3)->create(['is_active' => true]);
        Brand::factory(2)->create(['is_active' => false]);

        $response = $this->getJson('/api/marcas');

        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    public function test_inactive_brand_is_not_listed(): void
    {
        Brand::factory()->inactive()->create(['name' => 'Marca Oculta']);

        $response = $this->getJson('/api/marcas');
        $response->assertJsonMissing(['name' => 'Marca Oculta']);
    }
}
