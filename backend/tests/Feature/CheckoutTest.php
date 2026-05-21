<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Product $product;
    private Address $address;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->product = Product::factory()->create([
            'is_active' => true,
            'price' => 500000,
            'stock' => 10,
        ]);
        $this->address = Address::factory()->create([
            'user_id' => $this->user->id,
        ]);
    }

    public function test_guest_cannot_checkout(): void
    {
        $this->getJson('/api/checkout/resumen')
            ->assertUnauthorized();
    }

    public function test_can_get_checkout_summary(): void
    {
        // Add item to cart
        $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $this->product->id,
                'quantity' => 2,
            ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/checkout/resumen');

        $response->assertOk();
    }

    public function test_can_place_order(): void
    {
        // Add item to cart
        $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $this->product->id,
                'quantity' => 1,
            ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/checkout/orden', [
                'address_id' => $this->address->id,
                'payment_method' => 'wompi',
            ]);

        $response->assertCreated()
            ->assertJsonStructure(['data' => ['order' => ['order_number', 'status', 'total']]]);
    }

    public function test_cannot_place_order_without_address(): void
    {
        $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $this->product->id,
                'quantity' => 1,
            ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/checkout/orden', [
                'payment_method' => 'wompi',
            ]);

        $response->assertStatus(422);
    }

    public function test_cannot_place_order_with_empty_cart(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/checkout/orden', [
                'address_id' => $this->address->id,
                'payment_method' => 'wompi',
            ]);

        $response->assertStatus(422);
    }
}
