<?php

namespace Database\Seeders;

use App\Models\Hero;
use Illuminate\Database\Seeder;

class HeroSeeder extends Seeder
{
    public function run(): void
    {
        $heroes = [
            [
                'title' => 'TAG-Q',
                'subtitle' => 'Relojería de Lujo en Colombia',
                'cta_text' => 'Ver catálogo',
                'cta_link' => '/catalogo',
                'image_url' => 'https://res.cloudinary.com/dg6iut6sl/image/upload/v1747678800/cld-sample-5.jpg',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Nueva Colección',
                'subtitle' => 'Descubre los últimos lanzamientos',
                'cta_text' => 'Explorar',
                'cta_link' => '/catalogo?sort=newest',
                'image_url' => 'https://res.cloudinary.com/dg6iut6sl/image/upload/v1747678800/cld-sample-4.jpg',
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($heroes as $hero) {
            Hero::create($hero);
        }

        $this->command->info('Heroes seeded: ' . count($heroes));
    }
}
