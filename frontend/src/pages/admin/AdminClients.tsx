const clients = [
  { id: 1, name: 'Juan Pérez', email: 'juan@email.com', phone: '+57 300 000 0000', orders: 5, total: 890000, since: '2026' },
  { id: 2, name: 'María López', email: 'maria@email.com', phone: '+57 310 000 0000', orders: 3, total: 520000, since: '2026' },
  { id: 3, name: 'Ana García', email: 'ana@email.com', phone: '+57 320 000 0000', orders: 1, total: 95000, since: '2026' },
  { id: 4, name: 'Carlos Ruiz', email: 'carlos@email.com', phone: '+57 300 000 0001', orders: 8, total: 1250000, since: '2025' },
]

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

export default function AdminClients() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-carbon">Clientes</h1>
        <input type="text" placeholder="🔍 Buscar cliente..." className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Teléfono</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase">Pedidos</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Total</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase">Desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-carbon">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                <td className="px-4 py-3 text-gray-500">{c.phone}</td>
                <td className="px-4 py-3 text-center font-medium text-carbon">{c.orders}</td>
                <td className="px-4 py-3 text-right font-medium text-carbon">{formatPrice(c.total)}</td>
                <td className="px-4 py-3 text-center text-gray-500">{c.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
