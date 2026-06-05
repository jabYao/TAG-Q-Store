import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'

interface CartDrawerProps {
 open: boolean
 onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
 const { items, count, total, updateQuantity, removeItem } = useCartStore()

 // Cerrar con Escape
 useEffect(() => {
 if (!open) return
 const handler = (e: KeyboardEvent) => {
 if (e.key === 'Escape') onClose()
 }
 document.addEventListener('keydown', handler)
 return () => document.removeEventListener('keydown', handler)
 }, [open, onClose])

 // Prevenir scroll del body cuando está abierto
 useEffect(() => {
 if (open) {
 document.body.style.overflow = 'hidden'
 } else {
 document.body.style.overflow = ''
 }
 return () => { document.body.style.overflow = '' }
 }, [open])

 const formatPrice = (amount: number) =>
 `$${amount.toLocaleString('es-CO')}`

 if (!open) return null

 return (
 <>
 {/* Backdrop */}
 <div
 className="fixed inset-0 bg-black/50 z-50 transition-opacity"
 onClick={onClose}
 />

 {/* Drawer */}
 <div className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-50 shadow-2xl animate-slide-in-right flex flex-col">
 {/* Header */}
 <div className="flex items-center justify-between px-5 h-[72px] border-b border-gray-200 shrink-0">
 <h2 className="text-lg font-semibold text-carbon">
 Carrito ({count})
 </h2>
 <button
 onClick={onClose}
 className="text-gray-400 hover:text-carbon p-1 transition-colors"
 aria-label="Cerrar carrito"
 >
 ✕
 </button>
 </div>

 {/* Items */}
 <div className="flex-1 overflow-y-auto px-5 py-4">
 {items.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full text-center">
 <span className="text-5xl mb-4">🛒</span>
 <p className="text-carbon font-medium mb-1">Tu carrito está vacío</p>
 <p className="text-sm text-gray-400 mb-6">Agregá productos para empezar</p>
 <button
 onClick={onClose}
 className="bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors"
 >
 SEGUIR COMPRANDO
 </button>
 </div>
 ) : (
 <ul className="space-y-4">
 {items.map((item) => (
 <li key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
 {/* Image */}
 <div className="w-20 h-20 shrink-0 bg-gray-50 overflow-hidden">
 {item.image_url ? (
 <img
 src={item.image_url}
 alt={item.name}
 className="w-full h-full object-cover"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-2xl">
 ⌚
 </div>
 )}
 </div>

 {/* Info */}
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-carbon truncate">
 {item.name}
 </p>
 <p className="text-sm font-bold text-primary mt-0.5">
 {formatPrice(item.price)}
 </p>

 {/* Quantity controls */}
 <div className="flex items-center gap-2 mt-2">
 <button
 onClick={() => {
 if (item.quantity <= 1) {
 removeItem(item.id)
 } else {
 updateQuantity(item.id, item.quantity - 1)
 }
 }}
 className="w-7 h-7 border border-gray-200 flex items-center justify-center text-sm text-carbon hover:bg-gray-50 transition-colors"
 aria-label="Reducir cantidad"
 >
 −
 </button>
 <span className="text-sm font-medium text-carbon w-6 text-center">
 {item.quantity}
 </span>
 <button
 onClick={() => updateQuantity(item.id, item.quantity + 1)}
 className="w-7 h-7 border border-gray-200 flex items-center justify-center text-sm text-carbon hover:bg-gray-50 transition-colors"
 aria-label="Aumentar cantidad"
 >
 +
 </button>
 </div>
 </div>

 {/* Remove */}
 <button
 onClick={() => removeItem(item.id)}
 className="text-gray-300 hover:text-red-500 transition-colors self-start p-1"
 aria-label="Eliminar producto"
 >
 ✕
 </button>
 </li>
 ))}
 </ul>
 )}
 </div>

 {/* Footer */}
 {items.length > 0 && (
 <div className="border-t border-gray-200 px-5 py-4 shrink-0 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-sm text-gray-400">Subtotal</span>
 <span className="text-lg font-bold text-carbon">{formatPrice(total)}</span>
 </div>
 <p className="text-[11px] text-gray-400">
 {total >= 400000
 ? '✅ Envío gratis'
 : `🚚 Faltan ${formatPrice(400000 - total)} para envío gratis`}
 </p>
 <Link
 to="/checkout"
 onClick={onClose}
 className="block w-full bg-primary text-white text-center px-4 py-3 text-sm font-semibold hover:bg-primary-dark transition-colors"
 >
 FINALIZAR COMPRA →
 </Link>
 <Link
 to="/carrito"
 onClick={onClose}
 className="block w-full text-center text-sm text-carbon hover:text-primary transition-colors py-1"
 >
 Ver carrito completo
 </Link>
 </div>
 )}
 </div>
 </>
 )
}
