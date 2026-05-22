import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchOrder } from '@/api'
import SEO from '@/components/SEO'
import { Skeleton } from '@/components/Skeleton'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>()

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(Number(id)),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-5xl">🔍</span>
        <h2 className="text-xl font-semibold text-carbon mt-4">Pedido no encontrado</h2>
        <Link to="/mis-pedidos" className="inline-block mt-4 text-primary hover:underline text-sm">
          Ver mis pedidos
        </Link>
      </div>
    )
  }

  const isContraentrega = order.payment_method === 'contraentrega'

  return (
    <>
      <SEO title="Pedido Confirmado" noIndex />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-carbon mb-2">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {isContraentrega
            ? 'Te vamos a contactar para coordinar la entrega.'
            : 'Tu pago está siendo procesado.'}
        </p>

        {/* Order card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Pedido</span>
            <span className="text-sm font-bold text-primary">{order.order_number}</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-xl font-bold text-carbon">{formatPrice(order.total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Método de pago</span>
            <span className="text-sm font-medium text-carbon capitalize">
              {isContraentrega ? 'Contraentrega' : 'Wompi'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Estado</span>
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full capitalize">
              {order.status === 'contraentrega_pending' ? 'Pendiente de contacto' : order.status}
            </span>
          </div>
        </div>

        {/* Contraentrega: WhatsApp CTA */}
        {isContraentrega && (
          <a
            href={`https://wa.me/${order.whatsapp || '573152429172'}?text=${encodeURIComponent(
              `¡Hola TAG-Q! Quiero confirmar mi pedido ${order.order_number} por $${order.total.toLocaleString('es-CO')}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-all duration-200 mb-4"
          >
            💬 Confirmar por WhatsApp
          </a>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/mis-pedidos/${order.id}`}
            className="text-primary hover:underline text-sm font-medium"
          >
            Ver detalle del pedido →
          </Link>
          <Link
            to="/catalogo"
            className="text-gray-400 hover:text-carbon text-sm transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </>
  )
}
