<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            [
                'name' => 'Elektronik',
                'description' => 'Perangkat elektronik untuk operasional kantor.',
            ],
            [
                'name' => 'ATK',
                'description' => 'Alat tulis kantor dan kebutuhan administrasi.',
            ],
            [
                'name' => 'Furniture',
                'description' => 'Meja, kursi, dan perlengkapan ruang kerja.',
            ],
            [
                'name' => 'Jaringan',
                'description' => 'Perangkat jaringan dan konektivitas.',
            ],
            [
                'name' => 'Peralatan Kantor',
                'description' => 'Peralatan pendukung pekerjaan harian kantor.',
            ],
        ])->mapWithKeys(function (array $category) {
            $model = Category::updateOrCreate(
                ['name' => $category['name']],
                [
                    'description' => $category['description'],
                    'is_active' => true,
                ]
            );

            return [$model->name => $model];
        });

        $items = [
            [
                'category' => 'Elektronik',
                'name' => 'Laptop Lenovo',
                'sku' => 'ELK-LEN-001',
                'description' => 'Laptop Lenovo untuk kebutuhan kerja harian.',
                'unit_price' => 8500000,
                'stock_quantity' => 8,
                'unit' => 'unit',
            ],
            [
                'category' => 'Elektronik',
                'name' => 'Mouse Logitech',
                'sku' => 'ELK-MOU-001',
                'description' => 'Mouse wireless Logitech.',
                'unit_price' => 175000,
                'stock_quantity' => 20,
                'unit' => 'pcs',
            ],
            [
                'category' => 'Elektronik',
                'name' => 'Keyboard Mechanical',
                'sku' => 'ELK-KEY-001',
                'description' => 'Keyboard mechanical untuk workstation.',
                'unit_price' => 650000,
                'stock_quantity' => 4,
                'unit' => 'pcs',
            ],
            [
                'category' => 'Jaringan',
                'name' => 'Router TP-Link',
                'sku' => 'JRG-RTR-001',
                'description' => 'Router TP-Link dual band.',
                'unit_price' => 480000,
                'stock_quantity' => 3,
                'unit' => 'unit',
            ],
            [
                'category' => 'Jaringan',
                'name' => 'Kabel LAN',
                'sku' => 'JRG-LAN-001',
                'description' => 'Kabel LAN Cat 6.',
                'unit_price' => 150000,
                'stock_quantity' => 15,
                'unit' => 'box',
            ],
            [
                'category' => 'Furniture',
                'name' => 'Meja Kantor',
                'sku' => 'FUR-MEJ-001',
                'description' => 'Meja kerja kantor ukuran standar.',
                'unit_price' => 1200000,
                'stock_quantity' => 6,
                'unit' => 'unit',
            ],
            [
                'category' => 'Furniture',
                'name' => 'Kursi Kantor',
                'sku' => 'FUR-KUR-001',
                'description' => 'Kursi kantor ergonomis.',
                'unit_price' => 950000,
                'stock_quantity' => 7,
                'unit' => 'unit',
            ],
            [
                'category' => 'Peralatan Kantor',
                'name' => 'Printer Epson',
                'sku' => 'PKT-PRN-001',
                'description' => 'Printer Epson ink tank.',
                'unit_price' => 2450000,
                'stock_quantity' => 2,
                'unit' => 'unit',
            ],
            [
                'category' => 'ATK',
                'name' => 'Kertas A4',
                'sku' => 'ATK-KRT-001',
                'description' => 'Kertas A4 80 gsm.',
                'unit_price' => 58000,
                'stock_quantity' => 50,
                'unit' => 'box',
            ],
            [
                'category' => 'ATK',
                'name' => 'Pulpen',
                'sku' => 'ATK-PLP-001',
                'description' => 'Pulpen tinta hitam.',
                'unit_price' => 3500,
                'stock_quantity' => 100,
                'unit' => 'pcs',
            ],
        ];

        foreach ($items as $item) {
            Item::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'category_id' => $categories[$item['category']]->id,
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'unit_price' => $item['unit_price'],
                    'stock_quantity' => $item['stock_quantity'],
                    'unit' => $item['unit'],
                    'is_active' => true,
                ]
            );
        }
    }
}
