<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\StockOut;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockOut>
 */
class StockOutFactory extends Factory
{
    protected $model = StockOut::class;

    public function definition(): array
    {
        return [
            'item_id'          => Item::factory(),
            'user_id'          => User::factory(),
            'quantity'         => $this->faker->numberBetween(1, 10),
            'reference_number' => 'SO-' . strtoupper($this->faker->unique()->bothify('??####')),
            'notes'            => $this->faker->optional()->sentence(),
            'status'           => 'completed',
            'released_at'      => now(),
        ];
    }
}
