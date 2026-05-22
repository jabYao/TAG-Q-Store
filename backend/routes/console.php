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
