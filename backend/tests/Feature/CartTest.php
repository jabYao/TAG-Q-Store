<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->product = Product::factory()->create(['is_active' => true]);
    }

    public function test_guest_cannot_access_cart(): void
    {
        $this->getJson('/api/carrito')
            ->assertUnauthorized();
    }

    public function test_authenticated_user_has_empty_cart(): void
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/carrito');

        $response->assertOk();
    }

    public function test_can_add_item_to_cart(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $this->product->id,
                'quantity' => 2,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.count', 2);
    }

    public function test_cannot_add_inactive_product(): void
    {
        $inactive = Product::factory()->inactive()->create();

        $response = $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $inactive->id,
                'quantity' => 1,
            ]);

        $response->assertStatus(422);
    }

    public function test_cannot_add_out_of_stock_product(): void
    {
        $outOfStock = Product::factory()->outOfStock()->create(['is_active' => true]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $outOfStock->id,
                'quantity' => 1,
            ]);

        $response->assertStatus(422);
    }

    public function test_can_update_cart_item_quantity(): void
    {
        $addResponse = $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $this->product->id,
                'quantity' => 1,
            ]);
        $addResponse->assertOk();

        $cart = Cart::where('user_id', $this->user->id)->first();
        $this->assertNotNull($cart);
        $item = $cart->items()->first();
        $this->assertNotNull($item);

        $response = $this->actingAs($this->user)
            ->putJson("/api/carrito/{$item->id}", ['quantity' => 5]);

        $response->assertOk();
    }

    public function test_can_remove_cart_item(): void
    {
        // Add item first
        $addResponse = $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $this->product->id,
                'quantity' => 1,
            ]);
        $addResponse->assertOk();

        $cart = Cart::where('user_id', $this->user->id)->first();
        $this->assertNotNull($cart, 'Cart should exist after adding item');
        $item = $cart->items()->first();
        $this->assertNotNull($item, 'Cart should have items');

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/carrito/{$item->id}");

        $response->assertOk();
    }

    public function test_can_clear_cart(): void
    {
        // Add item first
        $addResponse = $this->actingAs($this->user)
            ->postJson('/api/carrito', [
                'product_id' => $this->product->id,
                'quantity' => 1,
            ]);
        $addResponse->assertOk();

        $response = $this->actingAs($this->user)
            ->deleteJson('/api/carrito');

        $response->assertOk();
    }
}
