# Integración Wompi — TAG-Q

## Enfoque: Widget Checkout (NO redirect)

TAG-Q usa el **Widget Checkout embebido** de Wompi, no el flujo de redirección.

### Arquitectura

```
Frontend (Checkout.tsx)
    │
    ├── POST /api/checkout/orden  →  crea orden, descuenta stock
    │                                  devuelve {order, payment_url, widget}
    │
    └── widget.js (checkout.wompi.co/widget.js)
            │
            └── WidgetCheckout.open()
                    │
                    ├── Modal embebido en la página
                    ├── Usuario paga (tarjeta, PSE, Nequi, etc.)
                    └── Callback → navega a /pago/resultado
```

### Widget Checkout (recomendado)

```javascript
const checkout = new window.WidgetCheckout({
    publicKey: 'pub_test_xxx',
    currency: 'COP',
    amountInCents: 10000000,
    reference: 'TAG-ABC123',
    signature: { integrity: 'sha256...' },
    // Sin redirectUrl: CloudFront de Wompi bloquea localhost
})
```

### URL del script

| Entorno | URL |
|---------|-----|
| Sandbox | `https://checkout.wompi.co/widget.js` |
| Producción | `https://checkout.wompi.co/widget.js` |

**Importante:** Las llaves de sandbox funcionan contra `checkout.wompi.co`, no contra `sandbox.wompi.co`.

### Flujo completo

1. Usuario completa checkout → click **PAGAR**
2. Backend crea la Order en `pending`, descuenta stock, crea Payment
3. Backend devuelve `widget` params con firma de integridad
4. Frontend renderiza `WompiPaymentButton`
5. Usuario click → se abre modal de Wompi
6. Usuario paga (tarjetas de prueba en sandbox)
7. Wompi procesa y envía webhook al backend
8. Widget callback navega a `/pago/resultado?reference=XXX`
9. PaymentResult hace polling cada 3s hasta 60s

### Tarjetas de prueba (sandbox)

| Tarjeta | Resultado |
|---------|-----------|
| `4242 4242 4242 4242` | Aprobado ✅ |
| `4000 0000 0000 0002` | Rechazado ❌ |
| Cualquier fecha futura y CVV 123 | — |

### Webhook

Endpoint: `POST /api/wompi/webhook`

- Valida firma con `sha256(payload + integrity_key)`
- Ignora la validación en entorno local (`local` o `testing`) si no hay checksum
- Dispara eventos `PaymentApproved` o `PaymentRejected`
- El listener marca la orden como `paid` o `rejected` y, en caso de rechazo, **restaura el stock**

### Protecciones

- Rate limiting: 3 rechazos en 1h → usuario bloqueado 2h
- Expiración automática: cron cada 10min libera stock de órdenes >30min sin pagar
- Precio validado contra BD (nunca del cliente)

### Variables de entorno

```
WOMPI_PUBLIC_KEY=pub_test_xxx
WOMPI_PRIVATE_KEY=prv_test_xxx
WOMPI_INTEGRITY_KEY=test_integrity_xxx
WOMPI_API_URL=https://sandbox.wompi.co/v1
FRONTEND_URL=http://localhost:5173
```
