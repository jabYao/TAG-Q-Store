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
        {--minutes=30 : Minutos de tolerancia antes de liberar stock de órdenes pendientes}';

    protected $description = 'Libera el stock de órdenes en estado pendiente que superaron el tiempo de expiración';

    public function handle(): int
    {
        $minutes = (int) $this->option('minutes');
        $cutoff = now()->subMinutes($minutes);

        $this->info("Buscando órdenes pendientes creadas antes de {$cutoff->toDateTimeString()}...");

        // Buscar órdenes pending o contraentrega_pending que estén vencidas
        $expiredOrders = Order::whereIn('status', ['pending', 'contraentrega_pending'])
            ->where('created_at', '<=', $cutoff)
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
                    'comment' => "Stock liberado automáticamente después de {$minutes} minutos sin pago.",
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
