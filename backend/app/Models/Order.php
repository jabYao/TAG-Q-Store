<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function getRouteKeyName(): string
    {
        return 'order_number';
    }

    protected $fillable = [
        'order_number',
        'user_id',
        'address_id',
        'subtotal',
        'shipping_cost',
        'discount',
        'tax',
        'total',
        'status',
        'payment_method',
        'payment_status',
        'wompi_transaction_id',
        'notes',
        'is_internal',
        'paid_at',
        'shipped_at',
        'delivered_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'discount' => 'decimal:2',
            'tax' => 'decimal:2',
            'total' => 'decimal:2',
            'is_internal' => 'boolean',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statuses(): HasMany
    {
        return $this->hasMany(OrderStatus::class);
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', ['pending', 'contraentrega_pending']);
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = 'TAG-' . strtoupper(\Illuminate\Support\Str::random(8));
            }
        });
    }
}
