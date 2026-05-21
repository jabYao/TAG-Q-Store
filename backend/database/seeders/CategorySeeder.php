<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Dama', 'slug' => 'dama', 'description' => 'Relojes diseñados para mujer con estilo y elegancia.', 'sort_order' => 1],
            ['name' => 'Caballero', 'slug' => 'caballero', 'description' => 'Relojes para hombre: desde clásicos hasta deportivos.', 'sort_order' => 2],
            ['name' => 'Branded', 'slug' => 'branded', 'description' => 'Relojes de marcas premium y ediciones especiales.', 'sort_order' => 3],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
