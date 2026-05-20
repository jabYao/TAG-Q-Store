import { Link, useParams } from 'react-router-dom'

const mockOrder = {
  id: 'TAG-2026-001234',
  date: '19 de mayo, 2026',
  time: '14:32',
  status: 'En preparación',
  statusIcon: '🕐',
  paymentMethod: 'Pago con Wompi',
  transactionId: 'wompi_abc123def456',
  shippingAddress: {
    name: 'Juan Pérez',
    street: 'Calle 123 #45-67',
    city: 'Bogotá',
    region: 'Cundinamarca',
    phone: '+57 300 000 0000',
  },
  items: [
    { name: 'Tommy Hilfiger Chronograph', price: 250000, quantity: 1, image: '⌚' },
    { name: 'Casio Vintage', price: 89000, quantity: 1, image: '⌚' },
  ],
  subtotal: 339000,
  shipping: 0,
  total: 339000,
  timeline: [
    { status: 'Pedido creado', date: '19/05 14:30', done: true },
    { status: 'Pago confirmado', date: '19/05 14:35', done: true },
    { status: 'En preparación', date: '19/05 16:00', done: true },
    { status: 'Enviado', date: '—', done: false },
    { status: 'Entregado', date: '—', done: false },
  ],
}

export default function OrderDetail() {
  const { id } = useParams()
  const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/perfil" className="hover:text-primary">Mi Cuenta</Link>
        <span className="mx-1">/</span>
        <Link to="/mis-pedidos" className="hover:text-primary">Mis Pedidos</Link>
        <span className="mx-1">/</span>
        <span className="text-carbon">{id || mockOrder.id}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="md:sticky md:top-6 space-y-1">
            <Link to="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              <span>👤</span> Perfil
            </Link>
            <Link to="/mis-pedidos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-primary text-white transition-colors">
              <span>📦</span> Mis Pedidos
            </Link>
            <Link to="/direcciones" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              <span>📍</span> Direcciones
            </Link>
            <hr className="my-3 border-gray-100" />
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-100 transition-colors w-full text-left">
              <span>🚪</span> Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link to="/mis-pedidos" className="text-sm text-primary hover:underline inline-block mb-4">← Volver a mis pedidos</Link>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-carbon">{id || mockOrder.id}</h1>
                <p className="text-sm text-gray-400">{mockOrder.date} · {mockOrder.time}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                mockOrder.status === 'En preparación' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
              }`}>
                {mockOrder.statusIcon} {mockOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipping */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Dirección de envío</h3>
                <p className="text-sm font-medium text-carbon">{mockOrder.shippingAddress.name}</p>
                <p className="text-sm text-gray-500">{mockOrder.shippingAddress.street}</p>
                <p className="text-sm text-gray-500">{mockOrder.shippingAddress.city}, {mockOrder.shippingAddress.region}</p>
                <p className="text-sm text-gray-500">{mockOrder.shippingAddress.phone}</p>
              </div>

              {/* Payment */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Método de pago</h3>
                <p className="text-sm font-medium text-carbon">{mockOrder.paymentMethod}</p>
                <p className="text-xs text-gray-400 mt-1">ID: {mockOrder.transactionId}</p>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-carbon mb-3">Productos</h3>
              <div className="divide-y divide-gray-100">
                {mockOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <p className="text-sm font-medium text-carbon">{item.name}</p>
                        <p className="text-xs text-gray-400">Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-carbon">{formatPrice(mockOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Envío</span>
                <span className="text-green-600 font-medium">{mockOrder.shipping === 0 ? 'Gratis' : formatPrice(mockOrder.shipping)}</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
                <span className="font-semibold text-carbon">Total</span>
                <span className="font-bold text-primary">{formatPrice(mockOrder.total)}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-carbon mb-4">Estado del pedido</h3>
              <div className="space-y-3">
                {mockOrder.timeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <span className="text-xs">{step.done ? '✓' : '○'}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${step.done ? 'text-carbon' : 'text-gray-400'}`}>
                        {step.status}
                      </p>
                      <p className="text-xs text-gray-400">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
