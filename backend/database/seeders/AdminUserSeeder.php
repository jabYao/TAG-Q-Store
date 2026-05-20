<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@tagq.co'],
            [
                'name' => 'Admin TAG-Q',
                'password' => bcrypt('admin123'),
                'phone' => '3001234567',
            ]
        );

        if (! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        $operador = User::firstOrCreate(
            ['email' => 'operador@tagq.co'],
            [
                'name' => 'Operador TAG-Q',
                'password' => bcrypt('operador123'),
                'phone' => '3007654321',
            ]
        );

        if (! $operador->hasRole('operador')) {
            $operador->assignRole('operador');
        }

        $cliente = User::firstOrCreate(
            ['email' => 'cliente@tagq.co'],
            [
                'name' => 'Cliente TAG-Q',
                'password' => bcrypt('cliente123'),
                'phone' => '3001112233',
            ]
        );

        if (! $cliente->hasRole('cliente')) {
            $cliente->assignRole('cliente');
        }

        $this->command->info('Users seeded: admin, operador, cliente');
    }
}
