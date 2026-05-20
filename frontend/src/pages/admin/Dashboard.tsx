import { Link } from 'react-router-dom'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

export default function AdminDashboard() {
  const stats = [
    { label: 'Ventas del mes', value: formatPrice(12500000), change: '+12%', icon: '💰' },
    { label: 'Pedidos este mes', value: '342', change: '+8%', icon: '📦' },
    { label: 'Clientes nuevos', value: '89', change: '+15%', icon: '👤' },
  ]

  const recentOrders = [
    { id: 'TAG-241', client: 'Juan Pérez', date: '19/05', total: 320000, status: 'Pendiente', statusColor: 'text-amber-600 bg-amber-50' },
    { id: 'TAG-240', client: 'María López', date: '19/05', total: 185000, status: 'Pagado', statusColor: 'text-green-600 bg-green-50' },
    { id: 'TAG-239', client: 'Ana García', date: '18/05', total: 95000, status: 'Fallido', statusColor: 'text-red-600 bg-red-50' },
    { id: 'TAG-238', client: 'Carlos Ruiz', date: '18/05', total: 450000, status: 'Contraentrega', statusColor: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-carbon mb-1">Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6">Bienvenido al panel de administración</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-carbon">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-carbon">Pedidos recientes</h2>
            <Link to="/admin/pedidos" className="text-xs text-primary hover:underline">Ver todos →</Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/admin/pedidos/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-carbon">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.client} · {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-carbon mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/productos" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 transition-colors">
              <span className="text-2xl block mb-1">📦</span>
              <span className="text-xs font-medium text-carbon">Nuevo producto</span>
            </Link>
            <Link to="/admin/pedidos" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 transition-colors">
              <span className="text-2xl block mb-1">📋</span>
              <span className="text-xs font-medium text-carbon">Ver pedidos</span>
            </Link>
            <Link to="/admin/categorias" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 transition-colors">
              <span className="text-2xl block mb-1">📁</span>
              <span className="text-xs font-medium text-carbon">Categorías</span>
            </Link>
            <Link to="/admin/configuracion" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 transition-colors">
              <span className="text-2xl block mb-1">⚙️</span>
              <span className="text-xs font-medium text-carbon">Configuración</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
