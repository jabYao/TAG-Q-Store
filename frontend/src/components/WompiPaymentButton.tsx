import { useEffect, useRef, useState } from 'react'

interface WidgetParams {
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
 * Usa data-render="button" para que Wompi pinte su botón oficial,
 * pero intercepta el click para usar la API programática que sí funciona.
 */
export default function WompiPaymentButton({ params }: WompiPaymentButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    el.innerHTML = ''

    const form = document.createElement('form')

    const script = document.createElement('script')
    script.src = `https://checkout.wompi.co/widget.js?_=${Date.now()}`
    script.setAttribute('data-render', 'button')
    script.setAttribute('data-public-key', params.publicKey)
    script.setAttribute('data-currency', params.currency)
    script.setAttribute('data-amount-in-cents', String(params.amountInCents))
    script.setAttribute('data-reference', params.reference)
    script.setAttribute('data-signature:integrity', params.signature.integrity)

    form.appendChild(script)
    el.appendChild(form)

    // Esperar a que Wompi pinte el botón, luego interceptar su click
    const observer = new MutationObserver(() => {
      const btn = el.querySelector('button')
      if (btn) {
        observer.disconnect()
        if (!cancelled) setLoading(false)
        // Reemplazar el click del botón por la API programática
        btn.onclick = (e) => {
          e.preventDefault()
          if (!window.WidgetCheckout) return
          try {
            const checkout = new window.WidgetCheckout(params)
            checkout.open((result: any) => {
              const tx = result?.transaction
              const txParam = tx?.id ? `&transaction=${tx.id}` : ''
              window.location.href = `/pago/resultado?reference=${params.reference}${txParam}`
            })
          } catch (e) {
            console.error('[Wompi] Error:', e)
            window.location.href = `/pago/resultado?reference=${params.reference}`
          }
        }
      }
    })

    observer.observe(el, { childList: true, subtree: true })

    // Timeout: si Wompi no pinta el botón en 8s, mostrar botón manual
    const timeout = setTimeout(() => {
      if (!cancelled && !el.querySelector('button')) {
        observer.disconnect()
        setLoading(false)
        // Botón manual de respaldo
        el.innerHTML = ''
        const btn = document.createElement('button')
        btn.textContent = 'Pagar con Wompi'
        btn.className = 'w-full max-w-md bg-[#056bff] hover:bg-[#1a7aff] text-white font-semibold py-3.5 px-6 rounded-lg text-sm cursor-pointer'
        btn.onclick = () => {
          if (!window.WidgetCheckout) return
          try {
            const checkout = new window.WidgetCheckout(params)
            checkout.open((result: any) => {
              const tx = result?.transaction
              const txParam = tx?.id ? `&transaction=${tx.id}` : ''
              window.location.href = `/pago/resultado?reference=${params.reference}${txParam}`
            })
          } catch (e) {
            console.error('[Wompi] Error:', e)
            window.location.href = `/pago/resultado?reference=${params.reference}`
          }
        }
        el.appendChild(btn)
      }
    }, 8000)

    return () => {
      cancelled = true
      observer.disconnect()
      clearTimeout(timeout)
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [params])

  return (
    <div className="w-full flex justify-center py-2 min-h-[60px]">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          Cargando...
        </div>
      )}
      <div ref={containerRef} className={loading ? 'hidden' : ''} />
    </div>
  )
}
