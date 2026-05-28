<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    private array $cloudinaryImages = [
        'v1747678800/cld-sample',
        'v1747678800/cld-sample-3',
        'v1747678800/cld-sample-4',
        'v1747678800/cld-sample-5',
        'v1747678800/samples/food/dessert',
        'v1747678800/samples/smile',
        'v1747678800/samples/landscapes/nature-mountains',
    ];

    public function run(): void
    {
        $products = Product::all();

        foreach ($products as $i => $product) {
            $imgIndex = $i % count($this->cloudinaryImages);
            $imgId = $this->cloudinaryImages[$imgIndex];

            // Primary image
            ProductImage::create([
                'product_id' => $product->id,
                'cloudinary_url' => "https://res.cloudinary.com/dg6iut6sl/image/upload/{$imgId}.jpg",
                'cloudinary_public_id' => $imgId,
                'alt_text' => "{$product->name} — imagen principal",
                'sort_order' => 0,
                'is_primary' => true,
                'type' => 'product',
            ]);

            // Secondary image (different sample)
            $secIndex = ($imgIndex + 1) % count($this->cloudinaryImages);
            $secId = $this->cloudinaryImages[$secIndex];
            ProductImage::create([
                'product_id' => $product->id,
                'cloudinary_url' => "https://res.cloudinary.com/dg6iut6sl/image/upload/{$secId}.jpg",
                'cloudinary_public_id' => $secId,
                'alt_text' => "{$product->name} — imagen adicional",
                'sort_order' => 1,
                'is_primary' => false,
                'type' => 'product',
            ]);
        }

        $this->command->info('Product images seeded: ' . ($products->count() * 2));
    }
}
