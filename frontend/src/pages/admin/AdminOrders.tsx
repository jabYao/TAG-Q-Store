import { Link } from 'react-router-dom'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

const orders = [
  { id: 'TAG-241', client: 'Juan Pérez', date: '19/05/2026', total: 320000, status: 'Pendiente de pago', statusColor: 'text-amber-600 bg-amber-50' },
  { id: 'TAG-240', client: 'María López', date: '19/05/2026', total: 185000, status: 'Pagado', statusColor: 'text-green-600 bg-green-50' },
  { id: 'TAG-239', client: 'Ana García', date: '18/05/2026', total: 95000, status: 'Fallido', statusColor: 'text-red-600 bg-red-50' },
  { id: 'TAG-238', client: 'Carlos Ruiz', date: '18/05/2026', total: 450000, status: 'Contraentrega', statusColor: 'text-purple-600 bg-purple-50' },
  { id: 'TAG-237', client: 'Laura Gómez', date: '17/05/2026', total: 210000, status: 'En preparación', statusColor: 'text-blue-600 bg-blue-50' },
  { id: 'TAG-236', client: 'Pedro Martínez', date: '16/05/2026', total: 620000, status: 'Entregado', statusColor: 'text-green-600 bg-green-50' },
]

export default function AdminOrders() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-carbon">Pedidos</h1>
        <div className="flex gap-2">
          <input type="text" placeholder="🔍 Buscar pedido..." className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['Todos', 'Pendiente', 'Pagado', 'En preparación', 'Enviado', 'Entregado', 'Fallido'].map((f) => (
          <button key={f} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${f === 'Todos' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Pedido</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Fecha</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Total</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-carbon">{o.id}</td>
                <td className="px-4 py-3 text-gray-500">{o.client}</td>
                <td className="px-4 py-3 text-gray-500">{o.date}</td>
                <td className="px-4 py-3 text-right font-medium text-carbon">{formatPrice(o.total)}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded ${o.statusColor}`}>{o.status}</span></td>
                <td className="px-4 py-3 text-right"><Link to={`/admin/pedidos/${o.id}`} className="text-primary hover:underline text-xs">Ver detalle →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>Mostrando 6 de 58 pedidos</span>
        <div className="flex gap-1">
          <button className="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
          <button className="px-2 py-1 rounded bg-primary text-white">1</button>
          <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
          <button className="px-2 py-1 rounded hover:bg-gray-100">3</button>
          <button className="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </div>
  )
}
