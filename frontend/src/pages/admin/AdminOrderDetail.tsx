import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { toast } from '@/stores/toastStore'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

const statusLabels: Record<string, string> = {
  pending: 'Pendiente', paid: 'Pagado', rejected: 'Rechazado',
  contraentrega_pending: 'Pendiente contraentrega', preparing: 'En preparación',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
}

const statusTransitions: Record<string, string[]> = {
  pending: ['paid', 'rejected', 'cancelled'],
  paid: ['preparing', 'cancelled'],
  contraentrega_pending: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
  rejected: [],
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/pedidos/${id}`)
      return data.data
    },
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: async ({ status, comment }: { status: string; comment?: string }) => {
      await api.put(`/admin/pedidos/${id}/status`, { status, comment })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      toast.success('Estado actualizado')
    },
    onError: () => toast.error('Error al actualizar'),
  })

  if (isLoading) return <div className="p-6 text-sm text-gray-400">Cargando...</div>
  if (!order) return <div className="p-6 text-sm text-gray-400">Pedido no encontrado</div>

  const availableTransitions = statusTransitions[order.status] ?? []

  return (
    <div className="p-6 max-w-4xl">
      <button onClick={() => navigate('/admin/pedidos')} className="text-sm text-primary hover:underline inline-block mb-4">← Pedidos</button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-carbon">
            {order.order_number}
            {order.is_internal && <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">Interna</span>}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{new Date(order.created_at).toLocaleString('es-CO')}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          order.status === 'paid' || order.status === 'delivered' ? 'bg-green-100 text-green-700' :
          order.status === 'cancelled' || order.status === 'rejected' ? 'bg-red-100 text-red-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Productos</h2>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="text-carbon font-medium">{item.product_name}</p>
                  <p className="text-xs text-gray-400">SKU: {item.product_sku ?? '—'} · {item.quantity} × {formatPrice(item.unit_price)}</p>
                </div>
                <span className="font-medium text-carbon">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer */}
        <div className="space-y-6">
          {order.customer && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-carbon mb-3 uppercase tracking-wide">Cliente</h2>
              <p className="text-sm text-carbon font-medium">{order.customer.name}</p>
              <p className="text-xs text-gray-500">{order.customer.email}</p>
              <p className="text-xs text-gray-500">📞 {order.customer.phone ?? '—'}</p>
            </div>
          )}

          {order.address && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-carbon mb-3 uppercase tracking-wide">Dirección</h2>
              <p className="text-sm text-carbon">{order.address.name}</p>
              <p className="text-xs text-gray-500">{order.address.address_line}</p>
              <p className="text-xs text-gray-500">{order.address.city}, {order.address.department}</p>
              <p className="text-xs text-gray-400">📞 {order.address.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-6">
        <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Resumen</h2>
        <div className="space-y-2 text-sm max-w-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium text-carbon">{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Envío</span><span className={order.shipping_cost === 0 ? 'text-green-600 font-medium' : 'text-carbon'}>{order.shipping_cost === 0 ? 'GRATIS' : formatPrice(order.shipping_cost)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Descuento</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="border-t border-gray-100 pt-2 flex justify-between"><span className="font-semibold text-carbon">Total</span><span className="font-bold text-lg text-carbon">{formatPrice(order.total)}</span></div>
        </div>
        {order.payment_method && <p className="text-xs text-gray-400 mt-3">Pago: {order.payment_method === 'wompi' ? '💳 Wompi' : '💰 Contraentrega'} · Estado: {order.payment_status ?? '—'}</p>}
        {order.notes && <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">📝 {order.notes}</div>}
      </div>

      {/* Change status */}
      {availableTransitions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-6">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Actualizar estado</h2>
          <div className="flex flex-wrap gap-2">
            {availableTransitions.map(st => (
              <button key={st} onClick={() => {
                const comment = st === 'cancelled' ? prompt('Motivo de cancelación:') || 'Cancelado' : undefined
                updateMutation.mutate({ status: st, comment })
              }} disabled={updateMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-lg border transition-colors hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50">
                {statusLabels[st] ?? st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {order.statuses?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-6">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Historial</h2>
          <div className="space-y-3">
            {order.statuses.map((s: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${i === order.statuses.length - 1 ? 'bg-primary' : 'bg-gray-300'}`} />
                  {i < order.statuses.length - 1 && <div className="w-px h-full bg-gray-200 my-1" />}
                </div>
                <div className="pb-2">
                  <span className="text-xs font-medium text-carbon">{statusLabels[s.status] ?? s.status}</span>
                  <p className="text-[10px] text-gray-400">{new Date(s.created_at).toLocaleString('es-CO')}</p>
                  {s.comment && <p className="text-xs text-gray-500 mt-0.5">{s.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
