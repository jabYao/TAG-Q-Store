<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\PermissionSeeder::class);
        $this->seed(\Database\Seeders\RoleSeeder::class);

        $this->admin = User::factory()->create(['email' => 'admin@test.com']);
        $this->admin->assignRole('admin');

        $this->regularUser = User::factory()->create();
        $this->regularUser->assignRole('cliente');
    }

    // ─── Admin Dashboard ───

    public function test_admin_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/dashboard');

        $response->assertOk()
            ->assertJsonStructure(['data' => ['total_products', 'total_orders', 'total_customers', 'revenue_this_month']]);
    }

    public function test_non_admin_cannot_access_dashboard(): void
    {
        $response = $this->actingAs($this->regularUser)
            ->getJson('/api/admin/dashboard');

        $response->assertForbidden();
    }

    // ─── Admin Products ───

    public function test_admin_can_create_product(): void
    {
        $brand = \App\Models\Brand::factory()->create();
        $category = \App\Models\Category::factory()->create();

        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/productos', [
                'brand_id' => $brand->id,
                'category_id' => $category->id,
                'name' => 'Nuevo Reloj',
                'price' => 250000,
                'sku' => 'SKU-NUEVO-001',
                'stock' => 10,
                'gender' => 'unisex',
                'movement' => 'quartz',
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Nuevo Reloj');

        $this->assertDatabaseHas('products', ['sku' => 'SKU-NUEVO-001']);
    }

    public function test_non_admin_cannot_create_product(): void
    {
        $response = $this->actingAs($this->regularUser)
            ->postJson('/api/admin/productos', ['name' => 'Test']);

        $response->assertForbidden();
    }

    public function test_admin_can_update_product(): void
    {
        $product = Product::factory()->create();
        $productId = $product->id;

        $response = $this->actingAs($this->admin)
            ->putJson("/api/admin/productos/{$productId}", [
                'name' => 'Reloj Editado',
                'price' => 999000,
            ]);

        $response->assertOk();

        // Verify via database
        $updated = Product::find($productId);
        $this->assertNotNull($updated, 'Product should exist in DB');
        $this->assertEquals('Reloj Editado', $updated->name);
        $this->assertEquals(999000, (int) $updated->price);

        // Also verify via response data
        $responseData = $response->json('data');
        $this->assertNotNull($responseData, 'Response should have data');
        $this->assertEquals('Reloj Editado', $responseData['name']);
    }

    public function test_admin_can_delete_product(): void
    {
        $product = Product::factory()->create();
        $productId = $product->id;

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/admin/productos/{$productId}");

        $response->assertOk();

        $deleted = Product::withTrashed()->find($productId);
        $this->assertNotNull($deleted, 'Product should exist with trashed');
        $this->assertNotNull($deleted->deleted_at, 'Product should be soft deleted');
    }

    // ─── Admin Orders ───

    public function test_admin_can_list_orders(): void
    {
        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/pedidos');

        $response->assertOk();
    }

    public function test_admin_can_update_order_status(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['is_active' => true]);

        $this->actingAs($user);
        $this->postJson('/api/carrito', ['product_id' => $product->id, 'quantity' => 1]);
        $address = \App\Models\Address::factory()->create(['user_id' => $user->id]);
        $orderResponse = $this->postJson('/api/checkout/orden', [
            'address_id' => $address->id,
            'payment_method' => 'wompi',
        ]);

        $orderNumber = $orderResponse->json('data.order.order_number');
        $this->assertNotNull($orderNumber, 'Order should be created. Response: ' . $orderResponse->getContent());

        $response = $this->actingAs($this->admin)
            ->putJson("/api/admin/pedidos/{$orderNumber}/status", [
                'status' => 'shipped',
            ]);

        $response->assertOk();
    }

    // ─── Admin Clients ───

    public function test_admin_can_list_clients(): void
    {
        User::factory(3)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/clientes');

        $response->assertOk();
    }

    // ─── Admin Categories ───

    public function test_admin_can_manage_categories(): void
    {
        $this->actingAs($this->admin);

        // Create
        $response = $this->postJson('/api/admin/categorias', [
            'name' => 'Nueva Categoría',
        ]);
        $response->assertCreated();

        $category = \App\Models\Category::first();

        // Update
        $this->putJson("/api/admin/categorias/{$category->id}", [
            'name' => 'Categoría Editada',
        ])->assertOk();

        // Delete
        $this->deleteJson("/api/admin/categorias/{$category->id}")->assertOk();
    }
}
