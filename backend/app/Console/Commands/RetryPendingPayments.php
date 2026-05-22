<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Models\OrderStatus;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Sentry\Laravel\Facade as Sentry;

class RetryPendingPayments extends Command
{
    protected $signature = 'payments:retry-pending
        {--hours=2 : Ventana de horas hacia atrás para buscar pagos pendientes}
        {--max-retries=3 : Máximo de reintentos por pago}';

    protected $description = 'Reintenta pagos pendientes que no han sido procesados';

    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $maxRetries = (int) $this->option('max-retries');

        $this->info("Buscando pagos pendientes de las últimas {$hours} horas...");

        $pendingPayments = Payment::pending()
            ->where('retry_count', '<', $maxRetries)
            ->where('created_at', '>=', now()->subHours($hours))
            ->get();

        if ($pendingPayments->isEmpty()) {
            $this->info('No se encontraron pagos pendientes para reintentar.');
            return self::SUCCESS;
        }

        $this->info("Se encontraron {$pendingPayments->count()} pagos pendientes.");

        foreach ($pendingPayments as $payment) {
            $this->line("Procesando pago #{$payment->id} — Ref: {$payment->reference}");

            try {
                $payment->increment('retry_count');

                // Buscar la transacción en Wompi
                $wompiService = app(\App\Services\WompiService::class);

                if ($payment->wompi_transaction_id) {
                    $transaction = $wompiService->getTransaction($payment->wompi_transaction_id);

                    if ($transaction && ($transaction['status'] ?? '') !== $payment->status) {
                        $newStatus = $transaction['status'] ?? '';

                        $payment->update([
                            'status' => strtolower($newStatus),
                            'processed_at' => now(),
                        ]);

                        if (in_array($newStatus, ['APPROVED', 'DECLINED', 'REJECTED', 'VOIDED', 'ERROR'])) {
                            $order = $payment->order;
                            $eventClass = $newStatus === 'APPROVED'
                                ? \App\Events\PaymentApproved::class
                                : \App\Events\PaymentRejected::class;

                            $reason = $newStatus === 'APPROVED' ? '' : "Pago {$newStatus} (reintento)";
                            event(new $eventClass(
                                $order,
                                ['transaction_id' => $payment->wompi_transaction_id, 'payment_id' => $payment->id],
                                $reason
                            ));

                            $this->info("  → Pago actualizado a {$newStatus}");
                        }
                    }
                } else {
                    // Pago sin transaction_id — probablemente contraentrega o pendiente inicial
                    // Verificar si pasó mucho tiempo desde la creación
                    if ($payment->created_at->diffInHours(now()) > 24) {
                        $payment->order->update([
                            'status' => 'expired',
                            'payment_status' => 'expired',
                        ]);

                        OrderStatus::create([
                            'order_id' => $payment->order_id,
                            'status' => 'expired',
                            'comment' => 'Orden expirada por falta de pago (reintento automático)',
                        ]);

                        $this->warn("  → Orden #{$payment->order->order_number} expirada por falta de pago");
                    }
                }
            } catch (\Exception $e) {
                $this->error("  → Error: {$e->getMessage()}");
                Log::error('Error en retry de pago', [
                    'payment_id' => $payment->id,
                    'error' => $e->getMessage(),
                ]);
                Sentry::captureException($e);
            }
        }

        $this->info('Reintentos completados.');
        return self::SUCCESS;
    }
}
