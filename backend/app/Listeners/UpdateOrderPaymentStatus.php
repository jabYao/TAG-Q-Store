<?php

namespace App\Listeners;

use App\Events\PaymentApproved;
use App\Events\PaymentRejected;
use App\Models\OrderStatus;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Sentry\Laravel\Facade as Sentry;

class UpdateOrderPaymentStatus
{
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

        $order->update([
            'status' => 'rejected',
            'payment_status' => 'rejected',
        ]);

        OrderStatus::create([
            'order_id' => $order->id,
            'status' => 'rejected',
            'comment' => $event->reason ?: 'Pago rechazado por Wompi',
        ]);

        Log::warning('Pago rechazado', [
            'order' => $order->order_number,
            'reason' => $event->reason,
        ]);

        Sentry::captureMessage(
            'Pago rechazado — ' . $order->order_number . ' — ' . ($event->reason ?? 'Sin motivo'),
            \Sentry\Severity::warning()
        );
    }

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(PaymentApproved::class, [self::class, 'handlePaymentApproved']);
        $events->listen(PaymentRejected::class, [self::class, 'handlePaymentRejected']);
    }
}
