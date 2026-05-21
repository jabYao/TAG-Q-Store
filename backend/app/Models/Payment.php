<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'wompi_transaction_id',
        'reference',
        'status',
        'payment_method',
        'payment_method_type',
        'amount',
        'amount_in_cents',
        'currency',
        'customer_email',
        'installments',
        'wompi_response',
        'retry_count',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'amount_in_cents' => 'decimal:2',
            'wompi_response' => 'array',
            'retry_count' => 'integer',
            'processed_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }
}
