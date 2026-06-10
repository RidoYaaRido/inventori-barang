<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ActivityLogSecurityMonitoringTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Http::fake([
            'ip-api.com/*' => Http::response([
                'status' => 'success',
                'country' => 'Indonesia',
                'city' => 'Jakarta',
                'isp' => 'Test ISP',
            ]),
        ]);
    }

    #[Test]
    public function admin_bisa_melihat_activity_logs(): void
    {
        $admin = $this->makeAdmin();
        ActivityLog::factory()->create(['user_id' => $admin->id, 'action' => 'login']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/activity-logs');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data.data');
    }

    #[Test]
    public function staff_tidak_bisa_melihat_activity_logs(): void
    {
        $staff = $this->makeStaff();

        $this->actingAs($staff, 'sanctum')
            ->getJson('/api/v1/admin/activity-logs')
            ->assertForbidden();
    }

    #[Test]
    public function login_user_menghasilkan_activity_log(): void
    {
        $user = $this->makeStaff(['password' => Hash::make('secret123')]);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ])->assertOk();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'action' => 'login',
        ]);
    }

    #[Test]
    public function logout_user_menghasilkan_activity_log(): void
    {
        $user = $this->makeStaff();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'action' => 'logout',
        ]);
    }

    #[Test]
    public function create_update_delete_barang_menghasilkan_log(): void
    {
        $admin = $this->makeAdmin();
        $category = Category::factory()->create();

        $create = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/items', [
                'category_id' => $category->id,
                'name' => 'Laptop Test',
                'sku' => 'SKU-LOG-001',
                'unit_price' => 12000000,
                'stock_quantity' => 10,
                'unit' => 'pcs',
                'is_active' => true,
            ])
            ->assertCreated();

        $itemId = $create->json('data.id');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/items/{$itemId}", ['name' => 'Laptop Test Updated'])
            ->assertOk();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/items/{$itemId}")
            ->assertOk();

        $this->assertDatabaseHas('activity_logs', ['action' => 'tambah_barang', 'model_id' => $itemId]);
        $this->assertDatabaseHas('activity_logs', ['action' => 'edit_barang', 'model_id' => $itemId]);
        $this->assertDatabaseHas('activity_logs', ['action' => 'hapus_barang', 'model_id' => $itemId]);
    }

    #[Test]
    public function ip_address_dan_user_agent_tersimpan(): void
    {
        $admin = $this->makeAdmin(['password' => Hash::make('secret123')]);

        $this->withHeaders([
            'CF-Connecting-IP' => '8.8.8.8',
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
        ])->postJson('/api/v1/auth/login', [
            'email' => $admin->email,
            'password' => 'secret123',
        ])
            ->assertOk();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $admin->id,
            'ip_address' => '8.8.8.8',
            'browser' => 'Chrome',
            'operating_system' => 'Windows',
            'device_type' => 'desktop',
        ]);
    }

    #[Test]
    public function summary_security_monitoring_hanya_bisa_diakses_admin(): void
    {
        $admin = $this->makeAdmin();
        $staff = $this->makeStaff();

        $this->actingAs($staff, 'sanctum')
            ->getJson('/api/v1/admin/security-monitoring/summary')
            ->assertForbidden();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/security-monitoring/summary')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'total_login_today',
                    'total_failed_login',
                    'total_activity_today',
                    'unique_ips_today',
                    'top_user',
                    'latest_activity',
                    'suspicious_ips',
                ],
            ]);
    }

    private function makeAdmin(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'role' => 'admin',
            'is_active' => true,
        ], $attributes));
    }

    private function makeStaff(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'role' => 'staff',
            'is_active' => true,
        ], $attributes));
    }
}
