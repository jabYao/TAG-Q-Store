import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '@/api/client'
import SEO from '@/components/SEO'
import { Skeleton } from '@/components/Skeleton'

interface PaymentResultData {
  order_id: number
  order_number: string
  status: string
  payment_status: string
}

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const transactionId = searchParams.get('id')

  const [result, setResult] = useState<PaymentResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reference) {
      setError('No se encontró referencia de pago.')
      setLoading(false)
      return
    }

    const params = new URLSearchParams({ reference })
    if (transactionId) params.set('id', transactionId)

    api.get<{ data: PaymentResultData }>(`/pago/resultado?${params.toString()}`)
      .then((res) => {
        setResult(res.data.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Error al consultar el pago.')
        setLoading(false)
      })
  }, [reference, transactionId])

  const isApproved = result?.payment_status === 'approved' || result?.status === 'paid'
  const isRejected = result?.payment_status === 'rejected' || result?.payment_status === 'declined'
  const isPending = result?.payment_status === 'pending' && !isApproved && !isRejected

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-56 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    )
  }

  if (error || !result) {
    return (
      <>
        <SEO title="Error de pago" noIndex />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <span className="text-5xl">❌</span>
          <h2 className="text-xl font-semibold text-carbon mt-4">Error al consultar el pago</h2>
          <p className="text-sm text-gray-400 mt-2">{error || 'No pudimos verificar el estado de tu pago.'}</p>
          <Link to="/mis-pedidos" className="inline-block mt-6 text-primary hover:underline text-sm">
            Ver mis pedidos
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title={isApproved ? 'Pago exitoso' : 'Pago pendiente'} noIndex />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        {/* Icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isApproved ? 'bg-green-100' : isRejected ? 'bg-red-100' : 'bg-amber-100'
        }`}>
          <span className="text-4xl">
            {isApproved ? '✅' : isRejected ? '❌' : '⏳'}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-carbon mb-2">
          {isApproved ? '¡Pago Exitoso!' : isRejected ? 'Pago Rechazado' : 'Pago Pendiente'}
        </h1>
        <p className={`text-sm mb-8 ${
          isApproved ? 'text-green-600' : isRejected ? 'text-red-500' : 'text-amber-600'
        }`}>
          {isApproved
            ? 'Tu pago fue aprobado. Estamos preparando tu pedido.'
            : isRejected
              ? 'El pago no pudo ser procesado. Intentá de nuevo o elegí otro método.'
              : 'Estamos esperando la confirmación del pago.'}
        </p>

        {/* Order info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Pedido</span>
            <span className="text-sm font-bold text-primary">{result.order_number}</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Estado</span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
              isApproved
                ? 'bg-green-100 text-green-800'
                : isRejected
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
            }`}>
              {isApproved ? 'Aprobado' : isRejected ? 'Rechazado' : 'Pendiente'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isApproved && (
            <Link
              to={`/mis-pedidos/${result.order_id}`}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Ver pedido
            </Link>
          )}
          {!isApproved && (
            <Link
              to={`/mis-pedidos/${result.order_id}`}
              className="text-primary hover:underline text-sm font-medium"
            >
              Ver detalle del pedido →
            </Link>
          )}
          <Link to="/catalogo" className="text-gray-400 hover:text-carbon text-sm transition-colors">
            Seguir comprando
          </Link>
        </div>
      </div>
    </>
  )
}
