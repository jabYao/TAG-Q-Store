import { useState, useCallback } from 'react'

export interface WidgetParams {
  publicKey: string
  currency: string
  amountInCents: number
  reference: string
  signature: { integrity: string }
}

declare global {
  interface Window {
    WidgetCheckout?: new (config: WidgetParams) => { open: (callback?: (result: any) => void) => void }
  }
}

interface WompiPaymentButtonProps {
  params: WidgetParams
}

/**
 * Botón "Pagar con Wompi" usando la API programática del Widget Checkout.
 * widget.js se carga desde index.html (una sola vez).
 *
 * Sin redirectUrl para evitar 403 de CloudFront en localhost.
 * El callback de WidgetCheckout recibe el resultado y navega a la página de resultado.
 */
export default function WompiPaymentButton({ params }: WompiPaymentButtonProps) {
  const [opening, setOpening] = useState(false)

  const handlePay = useCallback(() => {
    if (!window.WidgetCheckout || opening) return

    setOpening(true)

    try {
      const checkout = new window.WidgetCheckout(params)
      checkout.open((result: any) => {
        const tx = result?.transaction
        console.log('[Wompi] Transaction:', tx?.id, tx?.status)

        // Navegar al resultado usando la referencia
        if (params.reference) {
          window.location.href = `/pago/resultado?reference=${params.reference}`
        }
      })
    } catch (e) {
      console.error('[Wompi] Error:', e)
      // Fallback si algo falla
      if (params.reference) {
        window.location.href = `/pago/resultado?reference=${params.reference}`
      }
    } finally {
      setOpening(false)
    }
  }, [params, opening])

  if (!window.WidgetCheckout) {
    return (
      <div className="flex justify-center py-4">
        <p className="text-sm text-gray-400">⏳ Cargando Wompi...</p>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center py-2">
      <button
        type="button"
        onClick={handlePay}
        disabled={opening}
        className="w-full max-w-md bg-[#0051FF] hover:bg-[#0040CC] active:bg-[#0033AA] text-white font-semibold py-3.5 px-6 rounded-lg text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {opening ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Abriendo Wompi...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Pagar con Wompi
          </>
        )}
      </button>
    </div>
  )
}
