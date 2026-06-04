<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Telescope: prune entries older than 7 days daily
Artisan::command('telescope:prune-daily', function () {
    $this->call('telescope:prune', ['--hours' => 168]);
})->purpose('Prune Telescope entries older than 7 days')->daily();

// Retry pending payments every 30 minutes
Artisan::command('payments:retry-pending:regular', function () {
    $this->call('payments:retry-pending', ['--hours' => 4, '--max-retries' => 3]);
})->purpose('Reintentar pagos pendientes cada 30 minutos')->everyThirtyMinutes();

// Release expired stock every 10 minutes
Artisan::command('orders:release-expired-stock:regular', function () {
    $this->call('orders:release-expired-stock', [
        '--pending-minutes' => 30,
        '--contraentrega-hours' => 144,
    ]);
})->purpose('Liberar stock de órdenes vencidas (pending: 30min, contraentrega: 72h) cada 10 minutos')->everyTenMinutes();
