<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    protected $model = ActivityLog::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'action' => $this->faker->randomElement(['login', 'logout', 'tambah_barang']),
            'model_type' => User::class,
            'model_id' => null,
            'description' => $this->faker->sentence(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
            'browser' => 'Chrome',
            'operating_system' => 'Windows',
            'device_type' => 'desktop',
        ];
    }
}
