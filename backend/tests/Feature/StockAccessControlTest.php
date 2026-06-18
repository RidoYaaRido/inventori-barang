<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Pengujian Broken Access Control (IDOR) pada endpoint stock-ins & stock-outs.
 *
 * Skenario yang diuji:
 *  1. Staff hanya melihat transaksi miliknya sendiri (listing).
 *  2. Staff mendapat 404 jika mencoba show transaksi milik staff lain.
 *  3. Staff mendapat 404 jika mencoba update transaksi milik staff lain.
 *  4. Staff mendapat 404 jika mencoba delete transaksi milik staff lain.
 *  5. Staff mendapat 404 jika mencoba upload bukti milik staff lain.
 *  6. Admin bisa mengakses semua transaksi (listing & show).
 *  7. Admin bisa show detail transaksi milik staff mana pun.
 */
class StockAccessControlTest extends TestCase
{
    use RefreshDatabase;

    // ─────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────

    private function makeStaff(string $name = 'staff'): User
    {
        return User::factory()->create([
            'role'      => 'staff',
            'is_active' => true,
            'name'      => $name,
        ]);
    }

    private function makeAdmin(): User
    {
        return User::factory()->create([
            'role'      => 'admin',
            'is_active' => true,
        ]);
    }

    private function makeStockIn(User $owner): StockIn
    {
        return StockIn::factory()->create(['user_id' => $owner->id]);
    }

    private function makeStockOut(User $owner): StockOut
    {
        return StockOut::factory()->create(['user_id' => $owner->id]);
    }

    // ═══════════════════════════════════════════════════════════════
    //  STOCK-IN  –  INDEX
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function staff_hanya_melihat_stock_in_miliknya_sendiri(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');

        $siA = $this->makeStockIn($staffA);
        $siB = $this->makeStockIn($staffB);

        $response = $this->actingAs($staffA, 'sanctum')
            ->getJson('/api/v1/stock-ins');

        $response->assertStatus(200);

        $ids = collect($response->json('data.data'))->pluck('id')->all();

        $this->assertContains($siA->id, $ids, 'Stock-in milik Staff A harus tampil');
        $this->assertNotContains($siB->id, $ids, 'Stock-in milik Staff B TIDAK boleh tampil');
    }

    #[Test]
    public function staff_tidak_bisa_show_stock_in_milik_staff_lain(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');

        $siB = $this->makeStockIn($staffB);

        $this->actingAs($staffA, 'sanctum')
            ->getJson("/api/v1/stock-ins/{$siB->id}")
            ->assertStatus(404);
    }

    #[Test]
    public function staff_bisa_show_stock_in_miliknya_sendiri(): void
    {
        $staffA = $this->makeStaff('Rido');
        $siA    = $this->makeStockIn($staffA);

        $this->actingAs($staffA, 'sanctum')
            ->getJson("/api/v1/stock-ins/{$siA->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.id', $siA->id);
    }

    #[Test]
    public function staff_tidak_bisa_update_stock_in_milik_staff_lain(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');

        $siB = $this->makeStockIn($staffB);

        $this->actingAs($staffA, 'sanctum')
            ->putJson("/api/v1/stock-ins/{$siB->id}", ['notes' => 'hacked'])
            ->assertStatus(404);
    }

    #[Test]
    public function staff_tidak_bisa_delete_stock_in_milik_staff_lain(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');

        $siB = $this->makeStockIn($staffB);

        $this->actingAs($staffA, 'sanctum')
            ->deleteJson("/api/v1/stock-ins/{$siB->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('stock_ins', ['id' => $siB->id]);
    }

    // ═══════════════════════════════════════════════════════════════
    //  STOCK-IN  –  ADMIN
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function admin_bisa_melihat_semua_stock_in(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');
        $admin  = $this->makeAdmin();

        $siA = $this->makeStockIn($staffA);
        $siB = $this->makeStockIn($staffB);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/stock-ins');

        $response->assertStatus(200);

        $ids = collect($response->json('data.data'))->pluck('id')->all();

        $this->assertContains($siA->id, $ids, 'Admin harus melihat stock-in Staff A');
        $this->assertContains($siB->id, $ids, 'Admin harus melihat stock-in Staff B');
    }

    #[Test]
    public function admin_bisa_show_stock_in_milik_siapapun(): void
    {
        $staffB = $this->makeStaff('Andi');
        $admin  = $this->makeAdmin();

        $siB = $this->makeStockIn($staffB);

        $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/stock-ins/{$siB->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.id', $siB->id);
    }

    // ═══════════════════════════════════════════════════════════════
    //  STOCK-OUT  –  INDEX
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function staff_hanya_melihat_stock_out_miliknya_sendiri(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');

        $soA = $this->makeStockOut($staffA);
        $soB = $this->makeStockOut($staffB);

        $response = $this->actingAs($staffA, 'sanctum')
            ->getJson('/api/v1/stock-outs');

        $response->assertStatus(200);

        $ids = collect($response->json('data.data'))->pluck('id')->all();

        $this->assertContains($soA->id, $ids, 'Stock-out milik Staff A harus tampil');
        $this->assertNotContains($soB->id, $ids, 'Stock-out milik Staff B TIDAK boleh tampil');
    }

    #[Test]
    public function staff_tidak_bisa_show_stock_out_milik_staff_lain(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');

        $soB = $this->makeStockOut($staffB);

        $this->actingAs($staffA, 'sanctum')
            ->getJson("/api/v1/stock-outs/{$soB->id}")
            ->assertStatus(404);
    }

    #[Test]
    public function staff_bisa_show_stock_out_miliknya_sendiri(): void
    {
        $staffA = $this->makeStaff('Rido');
        $soA    = $this->makeStockOut($staffA);

        $this->actingAs($staffA, 'sanctum')
            ->getJson("/api/v1/stock-outs/{$soA->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.id', $soA->id);
    }

    #[Test]
    public function staff_tidak_bisa_update_stock_out_milik_staff_lain(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');

        $soB = $this->makeStockOut($staffB);

        $this->actingAs($staffA, 'sanctum')
            ->putJson("/api/v1/stock-outs/{$soB->id}", ['notes' => 'hacked'])
            ->assertStatus(404);
    }

    #[Test]
    public function staff_tidak_bisa_delete_stock_out_milik_staff_lain(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');

        $soB = $this->makeStockOut($staffB);

        $this->actingAs($staffA, 'sanctum')
            ->deleteJson("/api/v1/stock-outs/{$soB->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('stock_outs', ['id' => $soB->id]);
    }

    // ═══════════════════════════════════════════════════════════════
    //  STOCK-OUT  –  ADMIN
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function admin_bisa_melihat_semua_stock_out(): void
    {
        $staffA = $this->makeStaff('Rido');
        $staffB = $this->makeStaff('Andi');
        $admin  = $this->makeAdmin();

        $soA = $this->makeStockOut($staffA);
        $soB = $this->makeStockOut($staffB);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/stock-outs');

        $response->assertStatus(200);

        $ids = collect($response->json('data.data'))->pluck('id')->all();

        $this->assertContains($soA->id, $ids, 'Admin harus melihat stock-out Staff A');
        $this->assertContains($soB->id, $ids, 'Admin harus melihat stock-out Staff B');
    }

    #[Test]
    public function admin_bisa_show_stock_out_milik_siapapun(): void
    {
        $staffB = $this->makeStaff('Andi');
        $admin  = $this->makeAdmin();

        $soB = $this->makeStockOut($staffB);

        $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/stock-outs/{$soB->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.id', $soB->id);
    }
}
