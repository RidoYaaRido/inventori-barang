<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Item>
 */
class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition(): array
    {
        return [
            'category_id'    => Category::factory(),
            'name'           => $this->faker->words(3, true),
            'sku'            => strtoupper($this->faker->unique()->bothify('SKU-####')),
            'description'    => $this->faker->optional()->sentence(),
            'unit_price'     => $this->faker->randomFloat(2, 1000, 5000000),
            'stock_quantity' => $this->faker->numberBetween(10, 200),
            'unit'           => $this->faker->randomElement(['pcs', 'box', 'kg', 'liter']),
            'is_active'      => true,
        ];
    }
}
