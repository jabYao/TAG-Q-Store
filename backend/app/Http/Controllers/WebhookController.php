<?php

namespace App\Http\Controllers;

use App\Events\PaymentApproved;
use App\Events\PaymentRejected;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentWebhook;
use App\Services\WompiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Sentry\Laravel\Facade as Sentry;

class WebhookController extends Controller
{
    public function __construct(
        private readonly WompiService $wompi
    ) {}

    /**
     * Endpoint público de webhook Wompi.
     * Wompi envía POST con payload en JSON.
     */
    public function handleWompi(Request $request): JsonResponse
    {
        $rawPayload = $request->getContent();
        $payload = $request->all();
        $checksum = $request->header('x-event-checksum', '');

        // Log del webhook recibido
        $webhookLog = PaymentWebhook::create([
            'event' => $payload['event'] ?? null,
            'wompi_transaction_id' => $payload['data']['transaction']['id'] ?? null,
            'reference' => $payload['data']['transaction']['reference'] ?? null,
            'status' => $payload['data']['transaction']['status'] ?? null,
            'payload' => $payload,
            'signature_valid' => false,
        ]);

        // Validar firma (omitir en dev/local si no hay checksum)
        $skipSignature = app()->environment('local') && empty($checksum);
        $signatureValid = $skipSignature || $this->wompi->validateSignature($rawPayload, $checksum);
        $webhookLog->update(['signature_valid' => $signatureValid]);

        if (!$signatureValid) {
            Log::warning('Wompi webhook: Firma inválida', [
                'webhook_id' => $webhookLog->id,
                'reference' => $webhookLog->reference,
            ]);
            Sentry::captureMessage(
                'Wompi webhook: Firma inválida — ID: ' . $webhookLog->id,
                \Sentry\Severity::warning()
            );
            $webhookLog->update(['error_message' => 'Firma inválida']);
            return response()->json(['message' => 'Firma inválida'], 401);
        }

        $transaction = $payload['data']['transaction'] ?? [];
        $reference = $transaction['reference'] ?? '';
        $status = $transaction['status'] ?? '';
        $transactionId = $transaction['id'] ?? '';

        if (empty($reference)) {
            $webhookLog->update(['error_message' => 'Referencia vacía']);
            return response()->json(['message' => 'Referencia requerida'], 422);
        }

        // Buscar la orden por referencia (order_number)
        $order = Order::where('order_number', $reference)->first();
        if (!$order) {
            Log::error('Wompi webhook: Orden no encontrada', ['reference' => $reference]);
            Sentry::captureMessage(
                'Wompi webhook: Orden no encontrada — Ref: ' . $reference,
                \Sentry\Severity::error()
            );
            $webhookLog->update(['error_message' => 'Orden no encontrada']);
            return response()->json(['message' => 'Orden no encontrada'], 404);
        }

        // Actualizar o crear payment
        $payment = Payment::updateOrCreate(
            ['reference' => $reference],
            [
                'order_id' => $order->id,
                'wompi_transaction_id' => $transactionId,
                'status' => $status,
                'amount' => ($transaction['amount_in_cents'] ?? 0) / 100,
                'amount_in_cents' => $transaction['amount_in_cents'] ?? 0,
                'currency' => $transaction['currency'] ?? 'COP',
                'customer_email' => $transaction['customer_email'] ?? null,
                'payment_method_type' => $transaction['payment_method_type'] ?? null,
                'installments' => $transaction['installments'] ?? null,
                'wompi_response' => $transaction,
                'processed_at' => now(),
            ]
        );

        // Disparar evento según estado
        match ($status) {
            'APPROVED' => event(new PaymentApproved($order, [
                'transaction_id' => $transactionId,
                'payment_id' => $payment->id,
            ])),
            'DECLINED', 'REJECTED', 'VOIDED', 'ERROR' => event(new PaymentRejected(
                $order,
                ['transaction_id' => $transactionId, 'payment_id' => $payment->id],
                "Pago {$status}"
            )),
            default => Log::info('Wompi webhook: Estado no manejado', [
                'status' => $status,
                'reference' => $reference,
            ]),
        };

        // Marcar webhook como procesado
        $webhookLog->update([
            'processed' => true,
            'processed_at' => now(),
        ]);

        Log::info('Wompi webhook procesado', [
            'reference' => $reference,
            'status' => $status,
            'valid' => $signatureValid,
        ]);

        return response()->json(['message' => 'Webhook recibido correctamente']);
    }

    /**
     * Endpoint de redirección después del pago Wompi.
     */
    public function paymentResult(Request $request): JsonResponse
    {
        $reference = $request->query('reference');
        $transactionId = $request->query('id') ?: $request->query('transaction');

        if (!$reference) {
            return response()->json(['message' => 'Referencia requerida'], 422);
        }

        $order = Order::where('order_number', $reference)->first();

        if (!$order) {
            return response()->json(['message' => 'Orden no encontrada'], 404);
        }

        // Si hay transaction ID y la orden sigue pending, consultar directo a Wompi
        if ($transactionId && $order->payment_status === 'pending') {
            $transaction = $this->wompi->getTransaction($transactionId);

            if ($transaction && isset($transaction['data']['status'])) {
                $status = $transaction['data']['status'];
                $amountInCents = $transaction['data']['amount_in_cents'] ?? 0;

                // Crear o actualizar payment
                Payment::updateOrCreate(
                    ['reference' => $reference],
                    [
                        'order_id' => $order->id,
                        'wompi_transaction_id' => $transactionId,
                        'status' => $status,
                        'amount' => $amountInCents / 100,
                        'amount_in_cents' => $amountInCents,
                        'currency' => $transaction['data']['currency'] ?? 'COP',
                        'customer_email' => $transaction['data']['customer_email'] ?? null,
                        'payment_method_type' => $transaction['data']['payment_method_type'] ?? null,
                        'installments' => $transaction['data']['installments'] ?? null,
                        'wompi_response' => $transaction['data'],
                        'processed_at' => now(),
                    ]
                );

                // Disparar evento según estado (solo si la orden sigue pendiente)
                match ($status) {
                    'APPROVED' => event(new PaymentApproved($order, [
                        'transaction_id' => $transactionId,
                    ])),
                    'DECLINED', 'REJECTED', 'VOIDED', 'ERROR' => event(new PaymentRejected(
                        $order,
                        ['transaction_id' => $transactionId],
                        "Pago {$status}"
                    )),
                    default => null,
                };

                // Recargar orden para reflejar cambios
                $order->refresh();
            }
        }

        return response()->json([
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
            ],
        ]);
    }
}
