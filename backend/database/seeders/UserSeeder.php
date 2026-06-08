<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@inventory.local'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password123'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Staff user
        User::updateOrCreate(
            ['email' => 'staff1@inventory.local'],
            [
                'name' => 'Staff User',
                'password' => bcrypt('password123'),
                'role' => 'staff',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
