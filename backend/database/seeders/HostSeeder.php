<?php

namespace Database\Seeders;

use App\Models\Host;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HostSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Host::create([
            'full_name' => 'Budi Santoso',
            'email' => 'budi.santoso@company.com',
            'department' => 'Information Technology',
        ]);

        Host::create([
            'full_name' => 'Siti Nurhaliza',
            'email' => 'siti.nurhaliza@company.com',
            'department' => 'Human Resources',
        ]);

        Host::create([
            'full_name' => 'Ahmad Rahman',
            'email' => 'ahmad.rahman@company.com',
            'department' => 'Finance',
        ]);

        Host::create([
            'full_name' => 'Rina Wijaya',
            'email' => 'rina.wijaya@company.com',
            'department' => 'Marketing',
        ]);

        Host::create([
            'full_name' => 'Doni Hermawan',
            'email' => 'doni.hermawan@company.com',
            'department' => 'Operations',
        ]);

        Host::create([
            'full_name' => 'Lina Kusuma',
            'email' => 'lina.kusuma@company.com',
            'department' => 'Customer Service',
        ]);
    }
}
