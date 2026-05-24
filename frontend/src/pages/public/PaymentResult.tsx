import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '@/api/client'
import { useCartStore } from '@/stores/cartStore'
import SEO from '@/components/SEO'
import { Skeleton } from '@/components/Skeleton'

interface PaymentResultData {
  order_id: number
  order_number: string
  status: string
  payment_status: string
}

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

const POLL_INTERVAL_MS = 3000
const MAX_POLL_SECONDS = 60

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const transactionId = searchParams.get('id') || searchParams.get('transaction')

  const [result, setResult] = useState<PaymentResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const pollCountRef = useRef(0)
  const maxPollsRef = useRef(Math.floor(MAX_POLL_SECONDS / (POLL_INTERVAL_MS / 1000)))
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Limpiar carrito al llegar a esta página (post-pago)
  useEffect(() => {
    useCartStore.getState().clearCart()
  }, [])

  const fetchStatus = useCallback(async () => {
    if (!reference) {
      setError('No se encontró referencia de pago.')
      setLoading(false)
      return null
    }

    const params = new URLSearchParams({ reference })
    if (transactionId) params.set('id', transactionId)

    try {
      const res = await api.get<{ data: PaymentResultData }>(`/pago/resultado?${params.toString()}`)
      setResult(res.data.data)
      setLoading(false)
      return res.data.data
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al consultar el pago.')
      setLoading(false)
      return null
    }
  }, [reference, transactionId])

  // Primer fetch al montar
  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Polling: si el estado es 'pending', reintentar cada 3s hasta 60s
  useEffect(() => {
    const status = result?.payment_status ?? result?.status
    if (!status || status !== 'pending' || pollCountRef.current >= maxPollsRef.current) {
      return
    }

    setPolling(true)

    timerRef.current = setInterval(async () => {
      pollCountRef.current++

      if (pollCountRef.current >= maxPollsRef.current) {
        clearInterval(timerRef.current!)
        setPolling(false)
        return
      }

      const updated = await fetchStatus()
      if (updated && updated.payment_status !== 'pending' && updated.status !== 'pending') {
        clearInterval(timerRef.current!)
        setPolling(false)
      }
    }, POLL_INTERVAL_MS)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setPolling(false)
    }
  }, [result?.payment_status, result?.status, fetchStatus])

  const isApproved = result?.payment_status === 'approved' || result?.status === 'paid'
  const isRejected = result?.payment_status === 'rejected' || result?.status === 'declined' || result?.status === 'rejected'
  const isPending = (result?.payment_status === 'pending' || result?.status === 'pending') && !isApproved && !isRejected

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
      <SEO title={isApproved ? 'Pago exitoso' : isRejected ? 'Pago rechazado' : 'Pago pendiente'} noIndex />
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
        <p className={`text-sm mb-2 ${
          isApproved ? 'text-green-600' : isRejected ? 'text-red-500' : 'text-amber-600'
        }`}>
          {isApproved
            ? 'Tu pago fue aprobado. Estamos preparando tu pedido.'
            : isRejected
              ? 'El pago no pudo ser procesado. Intentá de nuevo o elegí otro método.'
              : 'Estamos esperando la confirmación del pago.'}
        </p>
        {isPending && polling && (
          <p className="text-xs text-gray-400 mb-6 flex items-center justify-center gap-1.5">
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
            Verificando estado...
          </p>
        )}
        {isPending && !polling && pollCountRef.current >= maxPollsRef.current && (
          <p className="text-xs text-amber-500 mb-6">
            El pago aún no se confirma. Podés <button onClick={fetchStatus} className="underline cursor-pointer">verificar de nuevo</button> o revisar tus pedidos más tarde.
          </p>
        )}

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
              to={`/mis-pedidos/${result.order_number}`}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Ver pedido
            </Link>
          )}
          {!isApproved && (
            <Link
              to={`/mis-pedidos/${result.order_number}`}
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
