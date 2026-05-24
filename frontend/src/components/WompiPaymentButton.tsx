import { useEffect, useRef } from 'react'

interface WidgetParams {
  publicKey: string
  currency: string
  amountInCents: number
  reference: string
  signature: { integrity: string }
}

interface WidgetCheckoutInstance {
  open: (callback?: (result: any) => void) => void
  renderPurchaseButton: (container: HTMLElement) => void
}

declare global {
  interface Window {
    WidgetCheckout?: new (config: WidgetParams) => WidgetCheckoutInstance
  }
}

interface WompiPaymentButtonProps {
  params: WidgetParams
}

/**
 * Renderiza el botón oficial de Wompi usando renderPurchaseButton().
 *
 * A diferencia de data-render="button" (que requiere carga estática del script
 * con el atributo), este método usa el mismo WidgetCheckout pero llama
 * directamente a renderPurchaseButton() en un contenedor.
 *
 * widget.js se carga desde index.html. El usuario ve el botón oficial
 * de Wompi, lo cliquea, y se abre el modal.
 */
export default function WompiPaymentButton({ params }: WompiPaymentButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current || renderedRef.current) return
    if (!window.WidgetCheckout) return

    renderedRef.current = true

    try {
      const checkout = new window.WidgetCheckout(params)
      checkout.renderPurchaseButton(containerRef.current)
    } catch (e) {
      console.error('[Wompi] Error al renderizar botón:', e)
      // Fallback: si no funciona renderPurchaseButton, renderizamos uno manual
      const btn = document.createElement('button')
      btn.textContent = 'Pagar con Wompi'
      btn.className = 'w-full max-w-md bg-[#0051FF] hover:bg-[#0040CC] text-white font-semibold py-3.5 px-6 rounded-lg text-sm'
      btn.onclick = () => {
        try {
          const checkout = new window.WidgetCheckout(params)
          checkout.open((result: any) => {
            const tx = result?.transaction
            const txParam = tx?.id ? `&transaction=${tx.id}` : ''
            window.location.href = `/pago/resultado?reference=${params.reference}${txParam}`
          })
        } catch (err) {
          console.error('[Wompi] Error:', err)
          window.location.href = `/pago/resultado?reference=${params.reference}`
        }
      }
      containerRef.current.appendChild(btn)
    }
  }, [params])

  return (
    <div className="w-full flex justify-center py-2">
      <div ref={containerRef} />
    </div>
  )
}
