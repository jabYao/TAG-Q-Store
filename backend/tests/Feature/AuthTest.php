<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\PermissionSeeder::class);
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    private function createUser(string $role = 'cliente'): User
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);
        $user->assignRole($role);
        return $user;
    }

    // ─── REGISTER ───────────────────────────────────────

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'phone' => '3001112233',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'roles']]);

        $this->assertDatabaseHas('users', ['email' => 'new@example.com']);
        $this->assertTrue(User::where('email', 'new@example.com')->first()->hasRole('cliente'));
    }

    public function test_register_validates_required_fields(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'phone', 'password']);
    }

    public function test_register_requires_password_confirmation(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '3001112233',
            'password' => 'password123',
            'password_confirmation' => 'different',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_register_rejects_duplicate_email(): void
    {
        $this->createUser();

        $response = $this->postJson('/api/register', [
            'name' => 'Another',
            'email' => User::first()->email,
            'phone' => '3001112233',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    // ─── LOGIN ──────────────────────────────────────────

    public function test_user_can_login(): void
    {
        $user = $this->createUser();

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'roles'], 'token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = $this->createUser();

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'noexiste@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    // ─── USER (GET CURRENT AUTHENTICATED) ──────────────

    public function test_authenticated_user_can_fetch_profile(): void
    {
        $user = $this->createUser();

        $response = $this->actingAs($user)->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJsonPath('user.email', $user->email);
    }

    public function test_guest_cannot_fetch_profile(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    // ─── LOGOUT ─────────────────────────────────────────

    public function test_authenticated_user_can_logout(): void
    {
        $user = $this->createUser();
        $token = $user->createToken('api-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Sesión cerrada correctamente.']);

        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $user->id]);
    }

    // ─── FORGOT PASSWORD ────────────────────────────────

    public function test_forgot_password_sends_reset_link(): void
    {
        $user = $this->createUser();

        $response = $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message']);

        $this->assertDatabaseHas('password_reset_tokens', ['email' => $user->email]);
    }

    public function test_forgot_password_validates_email_exists(): void
    {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'noexiste@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    // ─── RESET PASSWORD ─────────────────────────────────

    public function test_user_can_reset_password_with_valid_token(): void
    {
        $user = $this->createUser();
        $token = 'test-reset-token-123';

        \DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => now(),
        ]);

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Contraseña actualizada correctamente.']);

        // Verify new password works
        $loginResponse = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'newpassword123',
        ]);
        $loginResponse->assertStatus(200);
    }

    public function test_reset_password_rejects_invalid_token(): void
    {
        $user = $this->createUser();

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => 'invalid-token',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(400)
            ->assertJson(['message' => 'Token inválido o expirado.']);
    }

    public function test_reset_password_rejects_expired_token(): void
    {
        $user = $this->createUser();
        $token = 'expired-token';

        \DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => now()->subHours(2),
        ]);

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(400)
            ->assertJson(['message' => 'Token expirado. Solicitá un nuevo link de recuperación.']);
    }

    // ─── ROLE-BASED ACCESS ──────────────────────────────

    public function test_admin_can_access_admin_routes(): void
    {
        $admin = $this->createUser('admin');

        $response = $this->actingAs($admin)->getJson('/api/admin/dashboard');

        $response->assertStatus(200);
    }

    public function test_operador_can_access_admin_routes(): void
    {
        $operador = $this->createUser('operador');

        $response = $this->actingAs($operador)->getJson('/api/admin/dashboard');

        $response->assertStatus(200);
    }

    public function test_cliente_cannot_access_admin_routes(): void
    {
        $cliente = $this->createUser('cliente');

        $response = $this->actingAs($cliente)->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_admin_routes(): void
    {
        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(401);
    }
}
