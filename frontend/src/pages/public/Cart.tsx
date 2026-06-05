import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/stores/cartStore'
import { toast } from '@/stores/toastStore'
import SEO from '@/components/SEO'
import Breadcrumbs from '@/components/Breadcrumbs'
import { CartSkeleton } from '@/components/Skeleton'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

export default function Cart() {
 return (
 <>
 <SEO
 title="Carrito de Compras"
 description="Revisá tu carrito de compras en TAG-Q. Finalizá tu pedido con envío gratis desde $400.000 COP."
 url="/carrito"
 />
 <CartContent />
 </>
 )
}

function CartContent() {
 const navigate = useNavigate()
 const { items, count, total, updateQuantity, removeItem, clearCart } = useCartStore()
 const [hydrated, setHydrated] = useState(false)

 useEffect(() => {
 const unsub = useCartStore.persist.onFinishHydration(() => setHydrated(true))
 if (useCartStore.persist.hasHydrated()) setHydrated(true)
 return () => unsub()
 }, [])

 const subtotal = total
 const shippingFreeMinimum = 400000
 const shippingCost = subtotal >= shippingFreeMinimum ? 0 : 15000
 const remainingForFree = shippingFreeMinimum - subtotal
 const grandTotal = subtotal + shippingCost

 if (!hydrated) {
 return (
 <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
 <Breadcrumbs items={[
 { label: 'Home', href: '/' },
 { label: 'Carrito' },
 ]} />
 <h1 className="text-2xl md:text-3xl font-semibold text-carbon mb-6">Carrito</h1>
 <CartSkeleton />
 </div>
 )
 }

 return (
 <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
 <Breadcrumbs items={[
 { label: 'Home', href: '/' },
 { label: 'Carrito' },
 ]} />
 {/* Header */}
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl md:text-3xl font-semibold text-carbon">Carrito</h1>
 <p className="text-sm text-gray-400 mt-1">
 {items.length === 0 ? 'Tu carrito está vacío' : `${count} producto(s) en tu carrito`}
 </p>
 </div>
 {items.length > 0 && (
 <button
 onClick={() => {
 clearCart()
 toast.success('Carrito vaciado')
 }}
 className="text-sm text-red-500 hover:underline"
 >
 Vaciar carrito
 </button>
 )}
 </div>

 {items.length === 0 ? (
 <div className="text-center py-16">
 <span className="text-6xl">🛒</span>
 <h2 className="text-lg font-semibold text-carbon mt-4">Tu carrito está vacío</h2>
 <p className="text-sm text-gray-400 mt-2">Agregá productos para empezar tu compra</p>
 <Link
 to="/catalogo"
 className="inline-block mt-6 bg-primary text-white px-8 py-3 font-semibold text-sm hover:bg-primary-dark transition-all duration-200"
 >
 VER CATÁLOGO
 </Link>
 </div>
 ) : (
 <div className="flex flex-col lg:flex-row gap-8">
 {/* Items */}
 <div className="flex-1 space-y-4">
 {/* Free shipping progress */}
 {remainingForFree > 0 ? (
 <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
 🚚 ¡Agregá <strong>{formatPrice(remainingForFree)}</strong> más para obtener <strong>envío gratis</strong>!
 </div>
 ) : (
 <div className="bg-green-50 border border-green-200 p-4 text-sm text-green-700">
 🚚 ¡Tenés <strong>envío gratis</strong> en tu compra!
 </div>
 )}

 {items.map((item) => (
 <div key={item.id} className="bg-white p-4 border border-gray-100 shadow-sm flex gap-4">
 {/* Image */}
 <Link
 to={`/producto/${item.slug ?? item.id}`}
 className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0"
 >
 {item.image_url ? (
 <img src={item.image_url} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
 ) : (
 <span className="text-3xl">⌚</span>
 )}
 </Link>

 {/* Info */}
 <div className="flex-1 min-w-0">
 <Link
 to={`/producto/${item.slug ?? item.id}`}
 className="text-sm font-semibold text-carbon hover:text-primary transition-colors line-clamp-1"
 >
 {item.name}
 </Link>
 <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.price)} c/u</p>

 <div className="flex items-center justify-between mt-3">
 {/* Quantity selector */}
 <div className="flex items-center border border-gray-200 ">
 <button
 onClick={() => {
 if (item.quantity <= 1) {
 removeItem(item.id)
 } else {
 updateQuantity(item.id, item.quantity - 1)
 }
 }}
 className="px-2.5 py-1.5 text-carbon hover:bg-gray-50 transition-colors text-sm"
 >
 −
 </button>
 <span className="px-3 py-1.5 text-sm font-medium text-carbon border-x border-gray-200 min-w-[32px] text-center">
 {item.quantity}
 </span>
 <button
 onClick={() => updateQuantity(item.id, item.quantity + 1)}
 className="px-2.5 py-1.5 text-carbon hover:bg-gray-50 transition-colors text-sm"
 >
 +
 </button>
 </div>

 <div className="flex items-center gap-3">
 <span className="text-sm font-bold text-carbon">
 {formatPrice(item.price * item.quantity)}
 </span>
 <button
 onClick={() => {
 removeItem(item.id)
 toast.success('Producto eliminado')
 }}
 className="text-xs text-gray-400 hover:text-red-500 transition-colors"
 >
 ✕
 </button>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Summary sidebar */}
 <div className="w-full lg:w-[380px] shrink-0">
 <div className="bg-white border border-gray-100 p-6 shadow-sm sticky top-24">
 <h2 className="text-sm font-semibold text-carbon uppercase tracking-wide mb-4">Resumen</h2>

 <div className="space-y-3 text-sm">
 <div className="flex justify-between">
 <span className="text-gray-500">Subtotal</span>
 <span className="font-medium text-carbon">{formatPrice(subtotal)}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-500">Envío</span>
 <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-carbon'}`}>
 {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
 </span>
 </div>
 <div className="border-t border-gray-100 pt-3 flex justify-between">
 <span className="font-semibold text-carbon">Total</span>
 <span className="font-bold text-lg text-carbon">{formatPrice(grandTotal)}</span>
 </div>
 </div>

 <button
 onClick={() => navigate('/checkout')}
 className="w-full mt-6 bg-primary text-white py-3 font-semibold text-sm hover:bg-primary-dark transition-all duration-200"
 >
 INICIAR CHECKOUT →
 </button>

 <Link
 to="/catalogo"
 className="block text-center mt-3 text-xs text-gray-400 hover:text-primary transition-colors"
 >
 ← Seguir comprando
 </Link>

 {/* Payment methods */}
 <div className="mt-6 pt-4 border-t border-gray-100">
 <p className="text-[10px] text-gray-300 text-center uppercase tracking-wider">Métodos de pago aceptados</p>
 <div className="flex justify-center gap-3 mt-2 text-xs text-gray-400">
 <span>💳 Wompi</span>
 <span>💰 Contraentrega</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
