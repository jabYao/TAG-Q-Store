import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

const statusLabels: Record<string, { label: string; color: string }> = {
 pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
 paid: { label: 'Pagado', color: 'bg-green-100 text-green-700' },
 rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-700' },
 expired: { label: 'Expirado', color: 'bg-gray-100 text-gray-700' },
 contraentrega_pending: { label: 'Pendiente contraentrega', color: 'bg-blue-100 text-blue-700' },
 preparing: { label: 'En preparación', color: 'bg-primary/10 text-primary' },
 shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-700' },
 delivered: { label: 'Entregado', color: 'bg-green-100 text-green-700' },
 cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
}

export default function AdminOrders() {
 const [statusFilter, setStatusFilter] = useState('')
 const [search, setSearch] = useState('')
 const [page, setPage] = useState(1)

 const { data } = useQuery({
 queryKey: ['admin', 'orders', statusFilter, search, page],
 queryFn: async () => {
 const params = new URLSearchParams()
 if (statusFilter) params.set('status', statusFilter)
 if (search) params.set('search', search)
 params.set('page', String(page))
 const { data } = await api.get(`/admin/pedidos?${params}`)
 return data
 },
 })

 const orders = data?.data ?? []
 const meta = data?.meta

 return (
 <div className="p-6">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-carbon">Pedidos</h1>
 <p className="text-sm text-gray-400">{meta?.total ?? 0} pedidos</p>
 </div>
 </div>

 <div className="flex gap-2 mb-4">
 <input type="text" placeholder="🔍 Buscar por número o cliente..." value={search}
 onChange={e => { setSearch(e.target.value); setPage(1) }}
 className="max-w-xs px-3 py-2 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
 className="px-3 py-2 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
 <option value="">Todos los estados</option>
 <option value="pending">Pendiente</option>
 <option value="paid">Pagado</option>
 <option value="contraentrega_pending">Contraentrega</option>
 <option value="preparing">En preparación</option>
 <option value="shipped">Enviado</option>
 <option value="delivered">Entregado</option>
 <option value="cancelled">Cancelado</option>
 </select>
 </div>

 <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
 <table className="w-full text-sm">
 <thead className="bg-gray-50 border-b border-gray-100">
 <tr>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Pedido</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Pago</th>
 <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
 <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
 <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {orders.map((o: any) => {
 const st = statusLabels[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-700' }
 return (
 <tr key={o.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin/pedidos/${o.order_number}`}>
 <td className="px-4 py-3 font-medium text-carbon">
 {o.order_number}
 {o.is_internal && <span className="ml-2 text-[10px] px-1.5 py-0.5 font-medium bg-purple-100 text-purple-700">Interna</span>}
 </td>
 <td className="px-4 py-3 text-gray-500">{o.customer}</td>
 <td className="px-4 py-3 text-xs text-gray-400">{o.payment_method === 'wompi' ? '💳' : '💰'} {o.payment_method}</td>
 <td className="px-4 py-3 text-center"><span className={`text-[10px] px-2 py-0.5 font-medium ${st.color}`}>{st.label}</span></td>
 <td className="px-4 py-3 text-right font-medium text-carbon">{formatPrice(o.total)}</td>
 <td className="px-4 py-3 text-right text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString('es-CO')}</td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>

 {meta && meta.last_page > 1 && (
 <div className="flex justify-center items-center gap-2 mt-6">
 <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
 className="px-3 py-1.5 text-xs border border-gray-200 disabled:opacity-40">← Anterior</button>
 <span className="text-xs text-gray-400">Página {meta.current_page} de {meta.last_page}</span>
 <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page}
 className="px-3 py-1.5 text-xs border border-gray-200 disabled:opacity-40">Siguiente →</button>
 </div>
 )}
 </div>
 )
}
