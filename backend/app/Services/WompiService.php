<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WompiService
{
    private string $publicKey;
    private string $privateKey;
    private string $integrityKey;
    private string $baseUrl;
    public function __construct()
    {
        $this->publicKey = env('WOMPI_PUBLIC_KEY', 'test_public_key');
        $this->privateKey = env('WOMPI_PRIVATE_KEY', '');
        $this->integrityKey = env('WOMPI_INTEGRITY_KEY', 'test_integrity_key');
        $this->baseUrl = env('WOMPI_API_URL', 'https://sandbox.wompi.co/v1');
    }

    /**
     * Validar firma del webhook según documentación Wompi.
     *
     * Wompi envía: checksum en el header x-event-checksum
     * Se calcula: sha256(properties.content + secret)
     */
    public function validateSignature(string $payload, string $checksum): bool
    {
        $expected = hash('sha256', $payload . $this->integrityKey);
        return hash_equals($expected, $checksum);
    }

    /**
     * Generar firma para URL de redirección de transacción.
     */
    public function generateSignature(string $reference, float $amount, string $currency = 'COP'): string
    {
        $amountInCents = (int) round($amount * 100);
        return hash('sha256', "{$reference}{$amountInCents}{$currency}{$this->integrityKey}");
    }

    /**
     * Generar URL de redirección para pago Wompi.
     */
    public function generatePaymentUrl(string $reference, float $amount, string $currency = 'COP', array $extra = []): string
    {
        $amountInCents = (int) round($amount * 100);
        $signature = $this->generateSignature($reference, $amount, $currency);

        $params = http_build_query([
            'currency' => $currency,
            'amount-in-cents' => $amountInCents,
            'reference' => $reference,
            'signature:integrity' => $signature,
            'redirect-url' => $extra['redirect_url'] ?? url('/api/pago/resultado'),
        ]);

        if (!empty($extra['customer_email'])) {
            $params .= '&customer-email=' . urlencode($extra['customer_email']);
        }

        // Wompi redirect URL format: /transactions/{public-key}/redirect?params
        return "{$this->baseUrl}/transactions/{$this->publicKey}/redirect?{$params}";
    }

    /**
     * Consultar transacción en Wompi por ID.
     */
    public function getTransaction(string $transactionId): ?array
    {
        try {
            $response = Http::withToken($this->privateKey)
                ->get("{$this->baseUrl}/transactions/{$transactionId}");

            if ($response->successful()) {
                return $response->json();
            }

            Log::warning('Wompi: Error al consultar transacción', [
                'transaction_id' => $transactionId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Wompi: Excepción al consultar transacción', [
                'transaction_id' => $transactionId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Obtener evento de webhook para re-procesar.
     */
    public function getEvent(string $eventId): ?array
    {
        try {
            $response = Http::withToken($this->privateKey)
                ->get("{$this->baseUrl}/events/{$eventId}");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Wompi: Excepción al consultar evento', [
                'event_id' => $eventId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    public function getPublicKey(): string
    {
        return $this->publicKey;
    }

    public function getIntegrityKey(): string
    {
        return $this->integrityKey;
    }
}
