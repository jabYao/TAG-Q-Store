<?php

namespace App\Listeners;

use App\Events\PaymentApproved;
use App\Events\PaymentRejected;
use App\Models\OrderStatus;
use App\Models\User;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Sentry\Laravel\Facade as Sentry;

class UpdateOrderPaymentStatus
{
    private const MAX_REJECTED_ATTEMPTS = 3;
    private const RATE_LIMIT_WINDOW_MINUTES = 60;
    private const BLOCK_DURATION_MINUTES = 120;

    public function handlePaymentApproved(PaymentApproved $event): void
    {
        $order = $event->order;

        $order->update([
            'status' => 'paid',
            'payment_status' => 'approved',
            'paid_at' => now(),
        ]);

        OrderStatus::create([
            'order_id' => $order->id,
            'status' => 'paid',
            'comment' => 'Pago aprobado por Wompi',
        ]);

        Log::info('Pago aprobado', [
            'order' => $order->order_number,
            'transaction' => $event->wompiData['transaction_id'] ?? null,
        ]);

        Sentry::captureMessage(
            'Pago aprobado — ' . $order->order_number,
            \Sentry\Severity::info()
        );
    }

    public function handlePaymentRejected(PaymentRejected $event): void
    {
        $order = $event->order;

        // Solo procesar si la orden sigue en estado pendiente
        if (!in_array($order->status, ['pending', 'contraentrega_pending'])) {
            return;
        }

        $order->update([
            'status' => 'rejected',
            'payment_status' => 'rejected',
        ]);

        OrderStatus::create([
            'order_id' => $order->id,
            'status' => 'rejected',
            'comment' => $event->reason ?: 'Pago rechazado por Wompi',
        ]);

        // Restaurar stock de cada producto
        foreach ($order->items as $item) {
            $item->product?->increment('stock', $item->quantity);
        }

        Log::warning('Pago rechazado — stock restaurado', [
            'order' => $order->order_number,
            'reason' => $event->reason,
            'items_restored' => $order->items->count(),
        ]);

        Sentry::captureMessage(
            'Pago rechazado — ' . $order->order_number . ' — ' . ($event->reason ?? 'Sin motivo'),
            \Sentry\Severity::warning()
        );

        // Rate limiting: track rechazos por usuario
        $this->trackRejection($order->user);
    }

    /**
     * Track rejected payments y bloquear temporalmente si excede el límite.
     */
    private function trackRejection(?User $user): void
    {
        if (!$user) {
            return;
        }

        $cacheKey = "payment_block:user:{$user->id}";
        $attempts = (int) Cache::get($cacheKey, 0);
        $attempts++;

        Cache::put($cacheKey, $attempts, now()->addMinutes(self::RATE_LIMIT_WINDOW_MINUTES));

        if ($attempts >= self::MAX_REJECTED_ATTEMPTS) {
            $user->update([
                'blocked_until' => now()->addMinutes(self::BLOCK_DURATION_MINUTES),
            ]);

            Log::warning('Usuario bloqueado por demasiados rechazos de pago', [
                'user_id' => $user->id,
                'email' => $user->email,
                'attempts' => $attempts,
                'blocked_until' => $user->blocked_until,
            ]);

            Sentry::captureMessage(
                'Usuario bloqueado por rechazos — ID: ' . $user->id,
                \Sentry\Severity::warning()
            );
        }
    }

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(PaymentApproved::class, [self::class, 'handlePaymentApproved']);
        $events->listen(PaymentRejected::class, [self::class, 'handlePaymentRejected']);
    }
}
