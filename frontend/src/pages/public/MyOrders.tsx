import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { OrderListSkeleton } from '@/components/Skeleton'

const mockOrders = [
  { id: 'TAG-2026-001234', date: '19/05/2026', total: 210000, items: 2, status: 'En preparación', statusIcon: '🕐', statusColor: 'text-amber-600 bg-amber-50' },
  { id: 'TAG-2026-001233', date: '15/05/2026', total: 350000, items: 3, status: 'Entregado', statusIcon: '✅', statusColor: 'text-green-600 bg-green-50' },
  { id: 'TAG-2026-001232', date: '10/05/2026', total: 95000, items: 1, status: 'Cancelado', statusIcon: '❌', statusColor: 'text-red-600 bg-red-50' },
  { id: 'TAG-2026-001231', date: '05/05/2026', total: 420000, items: 2, status: 'Entregado', statusIcon: '✅', statusColor: 'text-green-600 bg-green-50' },
  { id: 'TAG-2026-001230', date: '28/04/2026', total: 185000, items: 1, status: 'Entregado', statusIcon: '✅', statusColor: 'text-green-600 bg-green-50' },
  { id: 'TAG-2026-001229', date: '20/04/2026', total: 520000, items: 4, status: 'En preparación', statusIcon: '🕐', statusColor: 'text-amber-600 bg-amber-50' },
  { id: 'TAG-2026-001228', date: '15/04/2026', total: 78000, items: 1, status: 'Cancelado', statusIcon: '❌', statusColor: 'text-red-600 bg-red-50' },
  { id: 'TAG-2026-001227', date: '10/04/2026', total: 315000, items: 2, status: 'Entregado', statusIcon: '✅', statusColor: 'text-green-600 bg-green-50' },
]

const statusFilters = ['Todos', 'En preparación', 'Entregado', 'Cancelado']

export default function MyOrders() {
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('Todos')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <OrderListSkeleton count={5} />
      </div>
    )
  }
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = mockOrders.filter((o) => {
    if (statusFilter !== 'Todos' && o.status !== statusFilter) return false
    if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const itemsPerPage = 5
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/perfil" className="hover:text-primary">Mi Cuenta</Link>
        <span className="mx-1">/</span>
        <span className="text-carbon">Mis Pedidos</span>
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-carbon">Mis Pedidos</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {statusFilters.map((f) => (
              <button
                key={f}
                onClick={() => { setStatusFilter(f); setCurrentPage(1) }}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  statusFilter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
            <div className="flex-1" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="🔍 Buscar pedido..."
              className="w-full md:w-48 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Orders list */}
          {paginated.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl">📦</span>
              <p className="text-sm text-gray-400 mt-3">No hay pedidos con estos filtros</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginated.map((order) => (
                <Link
                  key={order.id}
                  to={`/mis-pedidos/${order.id}`}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{order.statusIcon}</span>
                    <div>
                      <p className="text-sm font-semibold text-carbon">{order.id}</p>
                      <p className="text-xs text-gray-400">{order.date} · {order.items} producto{order.items !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm text-carbon hover:bg-gray-100 rounded-lg disabled:opacity-30">&lt;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${p === currentPage ? 'bg-primary text-white' : 'text-carbon hover:bg-gray-100'}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm text-carbon hover:bg-gray-100 rounded-lg disabled:opacity-30">&gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
