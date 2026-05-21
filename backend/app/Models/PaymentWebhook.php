<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentWebhook extends Model
{
    protected $fillable = [
        'event',
        'wompi_transaction_id',
        'reference',
        'status',
        'payload',
        'signature_valid',
        'processed',
        'error_message',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'signature_valid' => 'boolean',
            'processed' => 'boolean',
            'processed_at' => 'datetime',
        ];
    }

    public function scopeUnprocessed($query)
    {
        return $query->where('processed', false);
    }
}
