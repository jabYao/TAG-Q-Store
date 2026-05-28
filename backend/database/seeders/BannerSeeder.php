<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'title' => 'Colección Verano 2026',
                'subtitle' => 'Luce los mejores relojes esta temporada',
                'cta_text' => 'Ver colección',
                'cta_link' => '/catalogo',
                'image_url' => 'https://res.cloudinary.com/dg6iut6sl/image/upload/v1779478924/promociones_h5ocxe.png',
                'type' => 'promo',
                'is_active' => true,
                'sort_order' => 1,
                'bg_color' => '#0B2977',
                'starts_at' => Carbon::now()->subMonth(),
                'ends_at' => Carbon::now()->addMonths(3),
            ],
            [
                'title' => 'Envío gratis desde $400.000',
                'subtitle' => 'A toda Colombia',
                'cta_text' => 'Comprar ahora',
                'cta_link' => '/catalogo',
                'image_url' => 'https://res.cloudinary.com/dg6iut6sl/image/upload/v1779478924/promociones_h5ocxe.png',
                'type' => 'shipping',
                'is_active' => true,
                'sort_order' => 2,
                'bg_color' => '#D4AF37',
                'starts_at' => Carbon::now()->subMonth(),
                'ends_at' => Carbon::now()->addMonths(6),
            ],
        ];

        foreach ($banners as $banner) {
            Banner::create($banner);
        }

        $this->command->info('Banners seeded: ' . count($banners));
    }
}
