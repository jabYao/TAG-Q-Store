<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $products = Product::active()->published()
            ->select('slug', 'updated_at')
            ->get();

        $categories = Category::where('is_active', true)
            ->select('slug', 'updated_at')
            ->get();

        $staticRoutes = [
            ['loc' => '/', 'priority' => '1.0'],
            ['loc' => '/catalogo', 'priority' => '0.9'],
            ['loc' => '/politicas', 'priority' => '0.3'],
            ['loc' => '/contacto', 'priority' => '0.5'],
            ['loc' => '/login', 'priority' => '0.3'],
            ['loc' => '/registro', 'priority' => '0.3'],
        ];

        $content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($staticRoutes as $route) {
            $content .= "  <url>\n";
            $content .= "    <loc>" . url($route['loc']) . "</loc>\n";
            $content .= "    <priority>{$route['priority']}</priority>\n";
            $content .= "  </url>\n";
        }

        foreach ($categories as $cat) {
            $content .= "  <url>\n";
            $content .= "    <loc>" . url("/categoria/{$cat->slug}") . "</loc>\n";
            $content .= "    <lastmod>{$cat->updated_at->toW3cString()}</lastmod>\n";
            $content .= "    <priority>0.8</priority>\n";
            $content .= "  </url>\n";
        }

        foreach ($products as $product) {
            $content .= "  <url>\n";
            $content .= "    <loc>" . url("/producto/{$product->slug}") . "</loc>\n";
            $content .= "    <lastmod>{$product->updated_at->toW3cString()}</lastmod>\n";
            $content .= "    <priority>0.7</priority>\n";
            $content .= "  </url>\n";
        }

        $content .= '</urlset>';

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
