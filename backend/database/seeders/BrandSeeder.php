<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['name' => 'Tommy Hilfiger', 'slug' => 'tommy-hilfiger', 'description' => 'Relojes con estilo americano clásico y contemporáneo.', 'sort_order' => 1],
            ['name' => 'Casio', 'slug' => 'casio', 'description' => 'Relojes digitales y analógicos con la mejor relación calidad-precio.', 'sort_order' => 2],
            ['name' => 'Citizen', 'slug' => 'citizen', 'description' => 'Tecnología Eco-Drive: relojes que funcionan con luz.', 'sort_order' => 3],
            ['name' => 'Seiko', 'slug' => 'seiko', 'description' => 'Pioneros en relojería japonesa con movimientos automáticos.', 'sort_order' => 4],
            ['name' => 'Fossil', 'slug' => 'fossil', 'description' => 'Relojes de moda con diseño vintage y smartwatches.', 'sort_order' => 5],
            ['name' => 'Michael Kors', 'slug' => 'michael-kors', 'description' => 'Lujo accesible con diseño sofisticado y moderno.', 'sort_order' => 6],
            ['name' => 'Guess', 'slug' => 'guess', 'description' => 'Relojes juveniles con estilo trendy y atrevido.', 'sort_order' => 7],
            ['name' => 'Titan', 'slug' => 'titan', 'description' => 'Relojería india premium con diseños elegantes.', 'sort_order' => 8],
            ['name' => 'Timex', 'slug' => 'timex', 'description' => 'Relojes duraderos y asequibles con diseño clásico.', 'sort_order' => 9],
            ['name' => 'Orient', 'slug' => 'orient', 'description' => 'Relojes automáticos japoneses con excelente relación calidad-precio.', 'sort_order' => 10],
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }
    }
}
