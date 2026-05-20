import { Link } from 'react-router-dom'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

const order = {
  id: 'TAG-241',
  client: 'Juan Pérez',
  email: 'juan@email.com',
  phone: '+57 300 000 0000',
  address: 'Calle 123 #45-67, Bogotá, Cundinamarca',
  date: '19/05/2026 14:32',
  status: 'Pendiente de pago',
  statusColor: 'text-amber-600 bg-amber-50',
  payment: 'Wompi',
  transactionId: 'wompi_abc123',
  items: [
    { name: 'Tommy Hilfiger Chronograph', price: 250000, quantity: 1 },
    { name: 'Casio Vintage', price: 89000, quantity: 1 },
  ],
  subtotal: 339000,
  shipping: 0,
  total: 339000,
}

export default function AdminOrderDetail() {
  return (
    <div className="p-6 max-w-4xl">
      <Link to="/admin/pedidos" className="text-sm text-primary hover:underline inline-block mb-4">← Volver a pedidos</Link>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-carbon">{order.id}</h1>
            <p className="text-sm text-gray-400">{order.date}</p>
          </div>
          <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${order.statusColor}`}>{order.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Cliente</h3>
            <p className="text-sm font-medium text-carbon">{order.client}</p>
            <p className="text-sm text-gray-500">{order.email}</p>
            <p className="text-sm text-gray-500">{order.phone}</p>
            <p className="text-sm text-gray-500 mt-2">{order.address}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Pago</h3>
            <p className="text-sm font-medium text-carbon">{order.payment}</p>
            <p className="text-xs text-gray-400">ID: {order.transactionId}</p>
            <select className="mt-3 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full">
              <option>Actualizar estado</option>
              <option>Pagado</option>
              <option>En preparación</option>
              <option>Enviado</option>
              <option>Entregado</option>
              <option>Cancelado</option>
            </select>
          </div>
        </div>

        {/* Items */}
        <table className="w-full text-sm mb-4">
          <thead><tr><th className="text-left py-2 text-xs text-gray-400">Producto</th><th className="text-center py-2 text-xs text-gray-400">Cant</th><th className="text-right py-2 text-xs text-gray-400">Total</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2 text-carbon font-medium">{item.name}</td>
                <td className="py-2 text-center text-gray-500">{item.quantity}</td>
                <td className="py-2 text-right text-carbon font-medium">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-gray-100 pt-3 space-y-1 text-sm text-right">
          <div className="flex justify-end gap-8"><span className="text-gray-400">Subtotal</span><span className="text-carbon">{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-end gap-8"><span className="text-gray-400">Envío</span><span className="text-green-600">{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-end gap-8 text-lg font-bold"><span className="text-gray-400">Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
        </div>
      </div>
    </div>
  )
}
