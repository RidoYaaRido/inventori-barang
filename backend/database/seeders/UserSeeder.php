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
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@inventory.local',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Staff user
        User::create([
            'name' => 'Staff User',
            'email' => 'staff1@inventory.local',
            'password' => bcrypt('password123'),
            'role' => 'staff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
