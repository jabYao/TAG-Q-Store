<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $operador = Role::firstOrCreate(['name' => 'operador', 'guard_name' => 'web']);
        $cliente = Role::firstOrCreate(['name' => 'cliente', 'guard_name' => 'web']);

        // Admin — all permissions
        $admin->syncPermissions(Permission::all());

        // Operador
        $operador->syncPermissions([
            'dashboard.view',
            'products.create',
            'products.edit',
            'orders.view',
            'orders.update_status',
            'clients.view',
        ]);

        // Cliente
        $cliente->syncPermissions([
            'orders.my_view',
            'addresses.manage',
            'profile.manage',
        ]);

        $this->command->info('Roles seeded: admin, operador, cliente');
    }
}
