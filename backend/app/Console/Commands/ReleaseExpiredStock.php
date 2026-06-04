<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Sentry\Laravel\Facade as Sentry;

class ReleaseExpiredStock extends Command
{
    protected $signature = 'orders:release-expired-stock
        {--pending-minutes=30 : Minutos de tolerancia para órdenes pendientes (Wompi)}'.
        '{--contraentrega-hours=144 : Horas de tolerancia para contraentrega}';

    private const CONTRADELIVERY_TTL = 144; // 6 días

    protected $description = 'Libera el stock de órdenes en estado pendiente que superaron el tiempo de expiración';

    public function handle(): int
    {
        $pendingMinutes = (int) $this->option('pending-minutes');
        $contraentregaHours = (int) $this->option('contraentrega-hours');

        $pendingCutoff = now()->subMinutes($pendingMinutes);
        $contraentregaCutoff = now()->subHours($contraentregaHours);

        $this->info("Buscando órdenes vencidas...");
        $this->line("  - Pending (Wompi): creadas antes de {$pendingCutoff->toDateTimeString()}");
        $this->line("  - Contraentrega: creadas antes de {$contraentregaCutoff->toDateTimeString()}");

        // Buscar órdenes vencidas según su tipo
        $expiredOrders = Order::where(function ($q) use ($pendingCutoff, $contraentregaCutoff) {
                $q->where('status', 'pending')
                  ->where('created_at', '<=', $pendingCutoff);
            })->orWhere(function ($q) use ($pendingCutoff, $contraentregaCutoff) {
                $q->where('status', 'contraentrega_pending')
                  ->where('created_at', '<=', $contraentregaCutoff);
            })
            ->with('items.product')
            ->get();

        if ($expiredOrders->isEmpty()) {
            $this->info('No se encontraron órdenes vencidas para liberar.');
            return self::SUCCESS;
        }

        $this->info("Se encontraron {$expiredOrders->count()} órdenes vencidas.");

        $restoredCount = 0;

        foreach ($expiredOrders as $order) {
            $this->line("Procesando orden #{$order->order_number}...");

            try {
                // Restaurar stock de cada producto
                foreach ($order->items as $item) {
                    if ($item->product) {
                        $item->product->increment('stock', $item->quantity);
                        $restoredCount++;
                    }
                }

                // Marcar orden como expirada
                $order->update([
                    'status' => 'expired',
                    'payment_status' => 'expired',
                ]);

                OrderStatus::create([
                    'order_id' => $order->id,
                    'status' => 'expired',
                    'comment' => $order->status === 'contraentrega_pending'
                        ? "Stock liberado automáticamente después de {$contraentregaHours} horas (" . round($contraentregaHours / 24) . " d\303\255as) sin confirmar entrega."
                        : "Stock liberado automáticamente después de {$pendingMinutes} minutos sin pago.",
                ]);

                $this->info("  → Orden {$order->order_number} expirada, stock liberado.");
            } catch (\Exception $e) {
                $this->error("  → Error en orden {$order->order_number}: {$e->getMessage()}");
                Log::error('Error al liberar stock de orden expirada', [
                    'order_id' => $order->id,
                    'error' => $e->getMessage(),
                ]);
                Sentry::captureException($e);
            }
        }

        $this->info("Proceso completado. {$expiredOrders->count()} órdenes expiradas, {$restoredCount} unidades de stock liberadas.");
        return self::SUCCESS;
    }
}
