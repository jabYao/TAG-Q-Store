<?php

namespace App\Console\Commands;

use App\Models\ProductImage;
use Illuminate\Console\Command;

class CleanProductImageDuplicates extends Command
{
    protected $signature = 'tagq:clean-image-duplicates';

    protected $description = 'Elimina imágenes duplicadas de productos (misma URL en el mismo producto)';

    public function handle(): int
    {
        $duplicates = ProductImage::select('product_id', 'cloudinary_url')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('product_id', 'cloudinary_url')
            ->having('count', '>', 1)
            ->get();

        if ($duplicates->isEmpty()) {
            $this->info('✅ No se encontraron imágenes duplicadas.');
            return Command::SUCCESS;
        }

        $totalDeleted = 0;

        foreach ($duplicates as $dup) {
            $images = ProductImage::where('product_id', $dup->product_id)
                ->where('cloudinary_url', $dup->cloudinary_url)
                ->orderBy('is_primary', 'desc') // keep primary if exists
                ->orderBy('id')
                ->get();

            // Keep the first one, delete the rest
            $toDelete = $images->slice(1);

            foreach ($toDelete as $img) {
                $img->delete();
                $totalDeleted++;
            }
        }

        $this->info("✅ Se eliminaron {$totalDeleted} imagen(es) duplicada(s).");

        return Command::SUCCESS;
    }
}
