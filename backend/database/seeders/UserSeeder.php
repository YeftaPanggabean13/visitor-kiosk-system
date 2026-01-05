<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Security Officer',
            'email' => 'security@example.com',
            'password' => bcrypt('password'),
            'role' => 'security',
        ]);

        User::create([
            'name' => 'Host Officer',
            'email' => 'host@example.com',
            'password' => bcrypt('password'),
            'role' => 'host',
        ]);
    }
}
