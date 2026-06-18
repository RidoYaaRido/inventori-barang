<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\StockIn;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SecurityRemediationTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function register_menolak_email_duplikat_dengan_response_jelas(): void
    {
        User::factory()->create(['email' => 'duplikat@example.test']);

        $this->postJson('/api/v1/auth/register', [
            'name' => 'User Baru',
            'email' => 'duplikat@example.test',
            'password' => 'Password1',
            'password_confirmation' => 'Password1',
        ])
            ->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Email sudah digunakan',
            ]);
    }

    #[Test]
    public function register_publik_selalu_membuat_staff_meski_payload_meminta_admin(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Calon Admin',
            'email' => 'calon.admin@example.test',
            'password' => 'Password1',
            'password_confirmation' => 'Password1',
            'role' => 'admin',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.user.role', 'staff');
    }

    #[Test]
    public function endpoint_inventory_menolak_request_tanpa_token(): void
    {
        foreach ([
            '/api/v1/items',
            '/api/v1/categories',
            '/api/v1/stock-ins',
            '/api/v1/stock-outs',
            '/api/v1/admin/reports',
            '/api/v1/admin/activity-logs',
            '/api/v1/admin/users',
            '/api/v1/admin/dashboard',
        ] as $endpoint) {
            $this->getJson($endpoint)->assertUnauthorized();
        }
    }

    #[Test]
    public function staff_tidak_bisa_mengelola_user_membuat_item_atau_hapus_transaksi(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'is_active' => true]);
        $category = Category::factory()->create();
        $stockIn = StockIn::factory()->create(['user_id' => $staff->id]);

        $this->actingAs($staff, 'sanctum')
            ->getJson('/api/v1/admin/users')
            ->assertForbidden();

        $this->actingAs($staff, 'sanctum')
            ->postJson('/api/v1/items', [
                'category_id' => $category->id,
                'name' => 'Barang Staff',
                'sku' => 'STF-001',
                'unit_price' => 1000,
                'stock_quantity' => 1,
                'unit' => 'pcs',
            ])
            ->assertForbidden();

        $this->actingAs($staff, 'sanctum')
            ->deleteJson("/api/v1/stock-ins/{$stockIn->id}")
            ->assertForbidden();
    }
}
