<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    public function run(): void
    {
        $colors = [
            ['name' => 'Negro', 'hex' => '#000000', 'sort_order' => 1],
            ['name' => 'Blanco', 'hex' => '#FFFFFF', 'sort_order' => 2],
            ['name' => 'Plateado', 'hex' => '#C0C0C0', 'sort_order' => 3],
            ['name' => 'Dorado', 'hex' => '#D4AF37', 'sort_order' => 4],
            ['name' => 'Azul', 'hex' => '#1E3A8A', 'sort_order' => 5],
            ['name' => 'Rojo', 'hex' => '#DC2626', 'sort_order' => 6],
            ['name' => 'Verde', 'hex' => '#16A34A', 'sort_order' => 7],
            ['name' => 'Marrón', 'hex' => '#92400E', 'sort_order' => 8],
            ['name' => 'Gris', 'hex' => '#6B7280', 'sort_order' => 9],
            ['name' => 'Rosado', 'hex' => '#EC4899', 'sort_order' => 10],
            ['name' => 'Turquesa', 'hex' => '#14B8A6', 'sort_order' => 11],
            ['name' => 'Crema', 'hex' => '#FDE68A', 'sort_order' => 12],
        ];

        foreach ($colors as $color) {
            Color::firstOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($color['name'])],
                $color
            );
        }

        $this->command->info('Colors seeded successfully.');
    }
}
