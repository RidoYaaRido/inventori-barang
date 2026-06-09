<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\StockIn;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockIn>
 */
class StockInFactory extends Factory
{
    protected $model = StockIn::class;

    public function definition(): array
    {
        return [
            'item_id'          => Item::factory(),
            'user_id'          => User::factory(),
            'quantity'         => $this->faker->numberBetween(1, 50),
            'reference_number' => 'SI-' . strtoupper($this->faker->unique()->bothify('??####')),
            'notes'            => $this->faker->optional()->sentence(),
            'status'           => 'completed',
            'received_at'      => now(),
        ];
    }
}
