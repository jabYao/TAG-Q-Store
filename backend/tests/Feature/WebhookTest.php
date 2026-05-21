<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebhookTest extends TestCase
{
    use RefreshDatabase;

    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->create();
        $product = Product::factory()->create(['is_active' => true, 'price' => 100000]);

        // Create an order via the checkout flow
        $this->actingAs($user);
        $this->postJson('/api/carrito', ['product_id' => $product->id, 'quantity' => 1]);

        $address = \App\Models\Address::factory()->create(['user_id' => $user->id]);

        $response = $this->postJson('/api/checkout/orden', [
            'address_id' => $address->id,
            'payment_method' => 'wompi',
        ]);

        $orderNumber = $response->json('data.order.order_number');
        $this->assertNotNull($orderNumber, 'Order was not created. Response: ' . $response->getContent());
        $this->order = Order::where('order_number', $orderNumber)->first();
        $this->assertNotNull($this->order, 'Order not found in database: ' . $orderNumber);
    }

    public function test_webhook_returns_401_without_valid_signature(): void
    {
        $response = $this->postJson('/api/wompi/webhook', [
            'event' => 'transaction.updated',
            'data' => [
                'transaction' => [
                    'id' => 'txn-001',
                    'reference' => $this->order->order_number,
                    'status' => 'APPROVED',
                    'amount_in_cents' => 10000000,
                    'currency' => 'COP',
                ],
            ],
        ]);

        $response->assertStatus(401);
    }

    public function test_webhook_validates_signature_before_reference(): void
    {
        // Without a valid signature, the webhook returns 401 regardless of reference
        $response = $this->postJson('/api/wompi/webhook', [
            'event' => 'transaction.updated',
            'data' => [
                'transaction' => [
                    'id' => 'txn-001',
                    'reference' => '',
                    'status' => 'APPROVED',
                ],
            ],
        ]);

        $response->assertStatus(401);
    }

    public function test_payment_result_endpoint(): void
    {
        $response = $this->getJson('/api/pago/resultado?reference=' . $this->order->order_number);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['order_id', 'order_number', 'status', 'payment_status']]);
    }

    public function test_payment_result_requires_reference(): void
    {
        $response = $this->getJson('/api/pago/resultado');
        $response->assertStatus(422);
    }

    public function test_payment_result_returns_404_for_unknown_order(): void
    {
        $response = $this->getJson('/api/pago/resultado?reference=NO-EXISTE');
        $response->assertNotFound();
    }
}
