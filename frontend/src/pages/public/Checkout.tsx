import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchCheckoutSummary, placeOrder, fetchAddresses } from '@/api'
import SEO from '@/components/SEO'
import { CartSkeleton } from '@/components/Skeleton'
import { toast } from '@/stores/toastStore'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

export default function Checkout() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'resumen' | 'envio' | 'pago'>('resumen')
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'wompi' | 'contraentrega'>('wompi')
  const [notes, setNotes] = useState('')

  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ['checkout', 'summary'],
    queryFn: fetchCheckoutSummary,
    retry: false,
  })

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
  })

  const placeOrderMutation = useMutation({
    mutationFn: () => placeOrder({
      address_id: selectedAddressId!,
      payment_method: paymentMethod,
      notes: notes || undefined,
    }),
    onSuccess: (result) => {
      toast.success('Orden creada correctamente')
      if (result.payment_url) {
        window.location.href = result.payment_url
      } else {
        navigate(`/mis-pedidos/${result.order.id}`)
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Error al crear la orden')
    },
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-carbon mb-6">Checkout</h1>
        <CartSkeleton />
      </div>
    )
  }

  if (isError || !summary) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 text-center">
        <span className="text-5xl">🛒</span>
        <h2 className="text-lg font-semibold text-carbon mt-4">Tu carrito está vacío</h2>
        <Link to="/catalogo" className="inline-block mt-4 text-primary hover:underline text-sm">Ir al catálogo</Link>
      </div>
    )
  }

  const defaultAddress = addresses?.find(a => a.is_default) ?? addresses?.[0]

  // Steps progress
  const steps = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'envio', label: 'Envío' },
    { key: 'pago', label: 'Pago' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <SEO
        title="Checkout"
        description="Completá tu compra en TAG-Q de forma segura. Wompi protegido, envío gratis desde $400.000 COP."
        url="/checkout"
      />
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-2 ${step === s.key ? 'text-primary' : i < steps.indexOf({ key: step, label: '' } as any) ? 'text-green-600' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                step === s.key ? 'border-primary bg-primary text-white' : 'border-gray-300'
              }`}>
                {i + 1}
              </div>
              <span className="text-xs font-medium hidden md:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 md:w-16 h-px bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Step 1: Summary */}
          {step === 'resumen' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-carbon mb-4">Resumen de productos</h2>
              <div className="space-y-3">
                {summary.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">⌚</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/producto/${item.slug}`} className="text-sm font-medium text-carbon hover:text-primary line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-medium text-carbon">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('envio')}
                className="mt-6 w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors">
                CONTINUAR CON ENVÍO →
              </button>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 'envio' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-carbon mb-4">Dirección de envío</h2>

              {addresses && addresses.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="address" value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="sr-only" />
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedAddressId === addr.id ? 'border-primary' : 'border-gray-300'
                        }`}>
                          {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-carbon">{addr.name}</p>
                          <p className="text-xs text-gray-500">{addr.address_line}</p>
                          <p className="text-xs text-gray-500">{addr.city}, {addr.department}</p>
                          <p className="text-xs text-gray-400 mt-0.5">📞 {addr.phone}</p>
                          {addr.is_default && <span className="text-[10px] text-primary font-medium mt-1 inline-block">Predeterminada</span>}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 mb-4">No tenés direcciones guardadas</p>
                </div>
              )}

              <Link to="/direcciones" className="text-sm text-primary hover:underline inline-block mb-6">
                + Agregar nueva dirección
              </Link>

              <div className="flex gap-3">
                <button onClick={() => setStep('resumen')}
                  className="flex-1 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  ← Volver
                </button>
                <button onClick={() => {
                  if (!selectedAddressId) { toast.error('Seleccioná una dirección'); return }
                  if (!defaultAddress && !selectedAddressId) setSelectedAddressId(addresses?.[0]?.id ?? null)
                  setStep('pago')
                }}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors">
                  CONTINUAR AL PAGO →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 'pago' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-carbon mb-4">Método de pago</h2>

              <div className="space-y-3 mb-6">
                <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'wompi' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="radio" name="payment" value="wompi"
                    checked={paymentMethod === 'wompi'}
                    onChange={() => setPaymentMethod('wompi')}
                    className="sr-only" />
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'wompi' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'wompi' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-carbon">💳 Pago online — Wompi</p>
                      <p className="text-xs text-gray-400">Tarjetas débito/crédito, PSE, Nequi, Daviplata</p>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'contraentrega' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="radio" name="payment" value="contraentrega"
                    checked={paymentMethod === 'contraentrega'}
                    onChange={() => setPaymentMethod('contraentrega')}
                    className="sr-only" />
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'contraentrega' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'contraentrega' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-carbon">💰 Contraentrega</p>
                      <p className="text-xs text-gray-400">Pagás en efectivo cuando recibís el producto</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="mb-6">
                <label className="text-xs text-gray-400 mb-1 block">Notas para el pedido (opcional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  rows={2} placeholder="Ej: Dejar en portería, horario de entrega, etc."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('envio')}
                  className="flex-1 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  ← Volver
                </button>
                <button onClick={() => {
                  if (!selectedAddressId) { toast.error('Seleccioná una dirección de envío'); setStep('envio'); return }
                  placeOrderMutation.mutate()
                }}
                  disabled={placeOrderMutation.isPending}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {placeOrderMutation.isPending ? 'PROCESANDO...' : `PAGAR ${formatPrice(summary.total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-sm font-semibold text-carbon uppercase tracking-wide mb-4">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({summary.items.length} productos)</span>
                <span className="font-medium text-carbon">{formatPrice(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Envío</span>
                <span className={`font-medium ${summary.shipping_is_free ? 'text-green-600' : 'text-carbon'}`}>
                  {summary.shipping_is_free ? 'GRATIS' : formatPrice(summary.shipping_cost)}
                </span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPrice(summary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">IVA (19%)</span>
                <span className="font-medium text-carbon">{formatPrice(summary.tax)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-carbon">Total</span>
                <span className="font-bold text-lg text-carbon">{formatPrice(summary.total)}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-300 mb-2">Pago 100% seguro por Wompi</p>
              <div className="flex justify-center gap-2 text-xs text-gray-400">
                <span>🔒</span>
                <span>Datos protegidos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
