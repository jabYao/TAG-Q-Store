<?php

use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', SitemapController::class);

Route::get('/robots.txt', function () {
    return response("User-agent: *\nAllow: /\n\nSitemap: " . url('/sitemap.xml'), 200, [
        'Content-Type' => 'text/plain',
    ]);
});
