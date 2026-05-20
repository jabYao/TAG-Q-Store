<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'dashboard.view',
            'products.create',
            'products.edit',
            'products.delete',
            'categories.manage',
            'images.manage',
            'orders.view',
            'orders.update_status',
            'clients.view',
            'coupons.manage',
            'roles.manage',
            'settings.manage',
            'logs.view',
            'orders.my_view',
            'addresses.manage',
            'profile.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $this->command->info('Permissions seeded: ' . count($permissions));
    }
}
