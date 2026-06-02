import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchOrder } from '@/api'
import Breadcrumbs from '@/components/Breadcrumbs'
import { DetailSkeleton } from '@/components/Skeleton'

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

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id!),
    enabled: !!id,
  })

  const breadcrumbs = (orderNumber?: string) => [
    { label: 'Home', href: '/' },
    { label: 'Mi Cuenta', href: '/perfil' },
    { label: 'Mis Pedidos', href: '/mis-pedidos' },
    ...(orderNumber ? [{ label: orderNumber }] : [{ label: 'Pedido' }]),
  ] as const

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumbs items={breadcrumbs()} />
        <DetailSkeleton />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16 text-center">
        <Breadcrumbs items={breadcrumbs()} />
        <span className="text-5xl">🔍</span>
        <h2 className="text-lg font-semibold text-carbon mt-4">Pedido no encontrado</h2>
        <Link to="/mis-pedidos" className="inline-block mt-4 text-primary hover:underline text-sm">Volver a mis pedidos</Link>
      </div>
    )
  }

  const status = statusLabels[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-700' }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
      <Breadcrumbs items={breadcrumbs(order.order_number)} />
      {/* Header */}
      <Link to="/mis-pedidos" className="text-sm text-primary hover:underline inline-block mb-4">
        ← Mis pedidos
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-carbon">Pedido {order.order_number}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(order.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-6">
        {/* Items */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Productos</h2>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-xl">⌚</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-carbon">{item.product_name}</p>
                  <p className="text-xs text-gray-400">SKU: {item.product_sku ?? '—'}</p>
                  <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.unit_price)}</p>
                </div>
                <span className="text-sm font-medium text-carbon">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-carbon mb-2 uppercase tracking-wide">Dirección de envío</h2>
            <p className="text-sm text-gray-600">{order.address.name}</p>
            <p className="text-xs text-gray-500">{order.address.address_line}</p>
            <p className="text-xs text-gray-500">{order.address.city}, {order.address.department}</p>
            <p className="text-xs text-gray-400">📞 {order.address.phone}</p>
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-carbon">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Envío</span>
              <span className={`font-medium ${order.shipping_cost === 0 ? 'text-green-600' : 'text-carbon'}`}>
                {order.shipping_cost === 0 ? 'GRATIS' : formatPrice(order.shipping_cost)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="font-semibold text-carbon">Total</span>
              <span className="font-bold text-lg text-carbon">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {order.statuses && order.statuses.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Estado del pedido</h2>
            <div className="space-y-3">
              {order.statuses.map((s: any, i: number) => {
                const st = statusLabels[s.status] ?? { label: s.status, color: 'bg-gray-100 text-gray-700' }
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${i === order.statuses.length - 1 ? 'bg-primary' : 'bg-gray-300'}`} />
                      {i < order.statuses.length - 1 && <div className="w-px h-full bg-gray-200 my-1" />}
                    </div>
                    <div className="pb-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(s.created_at).toLocaleString('es-CO')}
                      </p>
                      {s.comment && <p className="text-xs text-gray-500 mt-0.5">{s.comment}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Payment method */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-carbon mb-2 uppercase tracking-wide">Método de pago</h2>
          <p className="text-sm text-gray-600">
            {order.payment_method === 'wompi' ? '💳 Pago online (Wompi)' : '💰 Contraentrega'}
          </p>
          {order.payment_status && (
            <p className="text-xs text-gray-400 mt-1">
              Estado del pago: {order.payment_status}
            </p>
          )}
          {order.notes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">📝 {order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
