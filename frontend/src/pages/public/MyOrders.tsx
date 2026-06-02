import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchOrders } from '@/api'
import Breadcrumbs from '@/components/Breadcrumbs'
import { OrderListSkeleton } from '@/components/Skeleton'

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

export default function MyOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  })

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Mi Cuenta', href: '/perfil' },
    { label: 'Mis Pedidos' },
  ]

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-2xl font-semibold text-carbon mb-6">Mis Pedidos</h1>
        <OrderListSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-2xl font-semibold text-carbon mb-6">Mis Pedidos</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">📦</span>
          <h2 className="text-lg font-semibold text-carbon mt-4">No tenés pedidos</h2>
          <p className="text-sm text-gray-400 mt-1">Tus compras aparecerán acá</p>
          <Link to="/catalogo" className="inline-block mt-6 text-primary hover:underline text-sm">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusLabels[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-700' }
            return (
              <Link key={order.id} to={`/mis-pedidos/${order.order_number}`}
                className="block bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="text-sm font-semibold text-carbon">{order.order_number}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-400">{order.items?.length ?? 0} producto(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-carbon">{formatPrice(order.total)}</p>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
