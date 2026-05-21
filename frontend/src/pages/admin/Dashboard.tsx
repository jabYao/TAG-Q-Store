import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '@/api/client'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
  paid: { label: 'Pagado', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-700' },
  contraentrega_pending: { label: 'Pendiente contraentrega', color: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'En preparación', color: 'bg-primary/10 text-primary' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-700' },
}

export default function Dashboard() {
  const { data: kpi, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard')
      return data.data
    },
  })

  if (isLoading) return <div className="p-6 text-sm text-gray-400">Cargando...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-carbon mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Productos</p>
          <p className="text-3xl font-bold text-carbon mt-1">{kpi?.total_products ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pedidos totales</p>
          <p className="text-3xl font-bold text-carbon mt-1">{kpi?.total_orders ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Clientes</p>
          <p className="text-3xl font-bold text-carbon mt-1">{kpi?.total_customers ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pendientes</p>
          <p className="text-3xl font-bold text-carbon mt-1">{kpi?.pending_orders ?? 0}</p>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Ingresos este mes</p>
          <p className="text-3xl font-bold text-carbon mt-1">{formatPrice(kpi?.revenue_this_month ?? 0)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Stock bajo</p>
          <p className={`text-3xl font-bold mt-1 ${kpi?.low_stock_products ? 'text-red-500' : 'text-green-600'}`}>
            {kpi?.low_stock_products ?? 0}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-carbon uppercase tracking-wide">Pedidos recientes</h2>
          <Link to="/admin/pedidos" className="text-xs text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {kpi?.recent_orders?.length > 0 ? kpi.recent_orders.map((o: any) => {
            const st = statusLabels[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-700' }
            return (
              <Link key={o.id} to={`/admin/pedidos/${o.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-carbon">{o.order_number}</p>
                  <p className="text-xs text-gray-400">{o.items_count} producto(s) · {new Date(o.created_at).toLocaleDateString('es-CO')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-carbon">{formatPrice(o.total)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                </div>
              </Link>
            )
          }) : (
            <div className="text-center py-8 text-sm text-gray-400">Sin pedidos recientes</div>
          )}
        </div>
      </div>
    </div>
  )
}
