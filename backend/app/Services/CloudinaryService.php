<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Transformation\Background;
use Cloudinary\Transformation\Transformation;
use Illuminate\Http\UploadedFile;
use RuntimeException;

class CloudinaryService
{
    private Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => config('cloudinary.cloud.cloud_name'),
                'api_key' => config('cloudinary.cloud.api_key'),
                'api_secret' => config('cloudinary.cloud.api_secret'),
            ],
        ]);
    }

    /**
     * Upload an image to Cloudinary.
     *
     * @param  UploadedFile|string  $file  File instance or public path
     * @param  array  $options  ['folder', 'public_id', 'overwrite', 'transformation']
     * @return array{url: string, public_id: string, secure_url: string}
     */
    public function upload(UploadedFile|string $file, array $options = []): array
    {
        $uploadOptions = [
            'folder' => $options['folder'] ?? 'tag-q',
            'overwrite' => $options['overwrite'] ?? false,
            'resource_type' => 'image',
        ];

        if (isset($options['public_id'])) {
            $uploadOptions['public_id'] = $options['public_id'];
        }

        // Transformations for optimization
        if (isset($options['transformation'])) {
            $uploadOptions['transformation'] = $options['transformation'];
        } else {
            // Default: auto format and quality for web performance
            $uploadOptions['transformation'] = [
                'quality' => 'auto:best',
                'fetch_format' => 'auto',
            ];
        }

        if ($file instanceof UploadedFile) {
            $result = $this->cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                $uploadOptions
            );
        } else {
            $result = $this->cloudinary->uploadApi()->upload(
                $file,
                $uploadOptions
            );
        }

        return [
            'url' => $result['secure_url'],
            'public_id' => $result['public_id'],
            'secure_url' => $result['secure_url'],
            'width' => $result['width'] ?? null,
            'height' => $result['height'] ?? null,
            'format' => $result['format'] ?? null,
        ];
    }

    /**
     * Delete an image from Cloudinary.
     */
    public function delete(string $publicId): bool
    {
        try {
            $result = $this->cloudinary->uploadApi()->destroy($publicId);
            return ($result['result'] ?? '') === 'ok';
        } catch (\Exception $e) {
            report($e);
            return false;
        }
    }

    /**
     * Get an optimized image URL with transformations.
     */
    public function getUrl(string $publicId, array $transformations = []): string
    {
        return $this->cloudinary->image($publicId)
            ->secure()
            ->quality('auto:best')
            ->format('auto')
            ->toUrl();
    }

    /**
     * Get a thumbnail URL (for product grids).
     */
    public function getThumbnailUrl(string $publicId, int $width = 300, int $height = 300): string
    {
        return $this->cloudinary->image($publicId)
            ->secure()
            ->resize(crop()->width($width)->height($height)->gravity('auto'))
            ->quality('auto:best')
            ->format('auto')
            ->toUrl();
    }

    /**
     * Append responsive transformations to an existing Cloudinary URL.
     * This is used when the URL is already stored in the database.
     */
    public static function optimizeUrl(?string $url, int $width = 0, int $height = 0): ?string
    {
        if (empty($url)) {
            return null;
        }

        // Only modify Cloudinary URLs
        if (!str_contains($url, 'cloudinary.com/')) {
            return $url;
        }

        // Insert transformations before the file name (after /upload/)
        $transform = 'q_auto:best,f_auto';
        if ($width > 0) {
            $transform .= ',w_' . $width;
        }
        if ($height > 0) {
            $transform .= ',c_fill,g_auto,h_' . $height;
        }

        return str_replace('/upload/', "/upload/{$transform}/", $url);
    }
}
