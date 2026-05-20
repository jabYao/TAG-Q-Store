import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import { toast } from '@/stores/toastStore'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

const steps = ['Resumen', 'Envío', 'Pago', 'Confirmación']

// Mock data
const initialItems = [
  { id: 1, name: 'Tommy Hilfiger Chronograph', price: 250000, quantity: 1, image: '⌚', variant: '38mm · Plateado' },
  { id: 2, name: 'Casio Vintage', price: 89000, quantity: 1, image: '⌚', variant: 'Dorado · 36mm' },
]

const addresses = [
  { id: 1, label: 'Casa', name: 'Juan Pérez', street: 'Calle 123 #45-67', city: 'Bogotá', region: 'Cundinamarca', phone: '+57 300 000 0000', default: true },
  { id: 2, label: 'Oficina', name: 'Juan Pérez', street: 'Cra 98 #76-54, Apto 302', city: 'Medellín', region: 'Antioquia', phone: '+57 310 000 0000', default: false },
]

export default function Checkout() {
  const { items, count, total } = useCartStore()
  const [step, setStep] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id)
  const [paymentMethod, setPaymentMethod] = useState('wompi')
  const [notes, setNotes] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [email] = useState('juan@email.com')
  const [phone] = useState('+57 300 000 0000')

  const cartItems = items.length > 0 ? items : initialItems
  const cartTotal = total > 0 ? total : initialItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const shipping = cartTotal >= 400000 ? 0 : 15000
  const finalTotal = cartTotal + shipping

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step
                  ? 'bg-green-500 text-white'
                  : i === step
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </span>
            <span
              className={`text-xs font-medium hidden md:inline ${
                i === step ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 md:w-16 h-0.5 mx-2 ${
                i < step ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const SummarySidebar = () => (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-semibold text-carbon">Resumen</h2>

      <div className="space-y-3">
        {cartItems.map((item: any) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 text-xl">
              {item.image || '⌚'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-carbon line-clamp-1">{item.name}</p>
              <p className="text-[10px] text-gray-400">{item.variant || ''}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Cant: {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Subtotal ({count > 0 ? count : initialItems.reduce((a, i) => a + i.quantity, 0)})</span>
          <span className="text-carbon">{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Envío</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-carbon'}>
            {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-gold">🚚 Agregá {formatPrice(400000 - cartTotal)} más para envío gratis</p>
        )}
      </div>

      <hr className="border-gray-100" />

      <div className="flex justify-between text-lg">
        <span className="font-semibold text-carbon">Total</span>
        <span className="font-bold text-primary">{formatPrice(finalTotal)}</span>
      </div>

      {step === 2 && (
        <div className="text-xs text-gray-400 space-y-1 pt-1">
          <p><span className="font-medium text-carbon">Enviar a:</span> {addresses.find((a) => a.id === selectedAddress)?.name}</p>
          <p>{addresses.find((a) => a.id === selectedAddress)?.street}</p>
          <p>{addresses.find((a) => a.id === selectedAddress)?.city}</p>
        </div>
      )}

      {/* Trust */}
      <div className="pt-2 space-y-1.5 text-xs text-gray-400">
        <div className="flex items-center gap-2"><span>🚚</span> Envío gratis desde $400.000</div>
        <div className="flex items-center gap-2"><span>🔄</span> 30 días de cambio gratis</div>
        <div className="flex items-center gap-2"><span>💳</span> Pago seguro con Wompi</div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-2">
        <nav className="text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/carrito" className="hover:text-primary">Carrito</Link>
          <span className="mx-1">/</span>
          <span className="text-carbon">Checkout</span>
        </nav>

        <StepIndicator />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Step 0: Resumen */}
            {step === 0 && (
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-carbon mb-6">Revisá tu pedido</h1>

                <div className="space-y-3">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 text-2xl">
                        {item.image || '⌚'}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-carbon">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.variant || ''}</p>
                          <p className="text-xs text-gray-500 mt-1">Cant: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-primary shrink-0 ml-4">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Link to="/carrito" className="text-sm text-primary hover:underline">
                    ← Volver al carrito
                  </Link>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full md:w-auto bg-primary text-white px-10 py-3.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all"
                  >
                    CONTINUAR AL ENVÍO →
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Envío */}
            {step === 1 && (
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-carbon mb-6">Datos de envío</h1>

                <div className="space-y-3 mb-6">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedAddress === addr.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1 accent-primary"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-carbon">{addr.label}</span>
                            {addr.default && <span className="text-[10px] bg-gold text-carbon px-1.5 py-0.5 rounded font-medium">PREDETERMINADA</span>}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{addr.name}</p>
                          <p className="text-sm text-gray-500">{addr.street}</p>
                          <p className="text-sm text-gray-500">{addr.city}, {addr.region}</p>
                          <p className="text-sm text-gray-500">{addr.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <button className="text-sm text-primary hover:underline mb-6 block">
                  + Agregar nueva dirección
                </button>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={phone}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Notas del pedido (opcional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Ej: Dejar en portería, horario de entrega..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(0)} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    ← Volver
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="bg-primary text-white px-10 py-3.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all"
                  >
                    CONTINUAR AL PAGO →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Pago */}
            {step === 2 && (
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-carbon mb-6">Método de pago</h1>

                <div className="space-y-3 mb-6">
                  {[
                    { value: 'wompi', label: 'Pago con Wompi (PSE, Nequi, tarjeta)', icon: '💳' },
                    { value: 'card', label: 'Tarjeta de crédito/débito', icon: '💳' },
                    { value: 'contraentrega', label: 'Contraentrega (pago al recibir)', icon: '📦' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-sm text-carbon font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'contraentrega' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-amber-800 font-medium mb-1">📦 Contraentrega</p>
                    <p className="text-xs text-amber-700">
                      Pagás en efectivo o con tarjeta cuando recibís el producto.
                      Tiene un recargo de $10.000 por gestión de cobro.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Número de tarjeta</label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Vencimiento</label>
                        <input type="text" placeholder="MM/AA" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">CVC</label>
                        <input type="text" placeholder="123" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Nombre en la tarjeta</label>
                      <input type="text" placeholder="Juan Pérez" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                )}

                {/* Coupon */}
                <div className="mb-6">
                  <label className="text-xs text-gray-400 block mb-1">¿Tenés un cupón?</label>
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Código"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="px-4 py-2 bg-carbon text-white text-sm rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Aplicar
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    ← Volver
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-primary text-white px-10 py-3.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all"
                  >
                    REVISAR Y CONFIRMAR →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmación */}
            {step === 3 && (
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-carbon mb-6">Confirmá tu compra</h1>

                <div className="space-y-6">
                  {/* Shipping info */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-carbon">Dirección de envío</h3>
                      <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline">Editar</button>
                    </div>
                    {(() => {
                      const addr = addresses.find((a) => a.id === selectedAddress)
                      return addr ? (
                        <div className="text-sm text-gray-500">
                          <p className="font-medium text-carbon">{addr.name}</p>
                          <p>{addr.street}</p>
                          <p>{addr.city}, {addr.region}</p>
                          <p>{addr.phone}</p>
                        </div>
                      ) : null
                    })()}
                  </div>

                  {/* Payment info */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-carbon">Método de pago</h3>
                      <button onClick={() => setStep(2)} className="text-xs text-primary hover:underline">Editar</button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {paymentMethod === 'wompi' && '💳 Pago con Wompi'}
                      {paymentMethod === 'card' && '💳 Tarjeta de crédito/débito'}
                      {paymentMethod === 'contraentrega' && '📦 Contraentrega'}
                    </p>
                  </div>

                  {/* Items summary */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-carbon mb-3">Productos</h3>
                    <div className="space-y-2">
                      {cartItems.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            {item.name} <span className="text-gray-400">×{item.quantity}</span>
                          </span>
                          <span className="text-carbon font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {notes && (
                    <div className="bg-white border border-gray-100 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-carbon mb-1">Notas</h3>
                      <p className="text-sm text-gray-500">{notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => toast.success('Pedido confirmado', `Tu pedido fue registrado por ${formatPrice(finalTotal)}. Recibirás un email con los detalles.`)}
                    className="w-full bg-gold text-carbon py-3.5 rounded-lg font-semibold text-sm hover:bg-[#e0c456] transition-all duration-200 text-center block"
                  >
                    CONFIRMAR Y PAGAR — {formatPrice(finalTotal)}
                  </button>
                  <div className="text-center">
                    <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-primary transition-colors">
                      ← Volver al pago
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="w-full lg:w-[380px] shrink-0">
            <SummarySidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
