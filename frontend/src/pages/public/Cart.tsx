import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import ProductCard from '@/components/ProductCard'
import { CartSkeleton } from '@/components/Skeleton'

const recommendedProducts = [
  { name: 'Tommy Hilfiger Classic', slug: 'tommy-classic', price: 145000, originalPrice: undefined, badge: undefined },
  { name: 'Casio Vintage', slug: 'casio-vintage', price: 89000, originalPrice: 120000, badge: { label: '-26%', variant: 'gold' as const } },
  { name: 'Titan Edge Automatic', slug: 'titan-edge', price: 320000, originalPrice: undefined, badge: undefined },
  { name: 'Guess Ultra Thin', slug: 'guess-ultra', price: 195000, originalPrice: undefined, badge: { label: 'NUEVO', variant: 'primary' as const } },
]

// Mock initial cart items
const initialItems = [
  {
    id: 1,
    product_id: 1,
    name: 'Tommy Hilfiger Chronograph',
    price: 250000,
    quantity: 1,
    image_url: '',
    variant: '38mm · Plateado',
  },
  {
    id: 2,
    product_id: 2,
    name: 'Casio Vintage',
    price: 89000,
    quantity: 1,
    image_url: '',
    variant: 'Dorado · 36mm',
  },
]

export default function Cart() {
  const [loading, setLoading] = useState(true)
  const { items, count, total } = useCartStore()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <CartSkeleton />
      </div>
    )
  }
  const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

  // Use store items if not empty, otherwise use initial mock data
  const cartItems = items.length > 0 ? items : initialItems
  const cartCount = count > 0 ? count : initialItems.reduce((acc, i) => acc + i.quantity, 0)
  const cartTotal = total > 0 ? total : initialItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const shipping = cartTotal >= 400000 ? 0 : 15000
  const finalTotal = cartTotal + shipping

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-2">
        <nav className="text-xs text-gray-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-carbon">Carrito</span>
        </nav>
      </div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-carbon">
          Tu Carrito
        </h1>
        <p className="text-sm text-gray-400 mt-1">{cartCount} producto{cartCount !== 1 ? 's' : ''}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 min-w-0 space-y-4">
            {cartItems.length === 0 ? (
              /* Empty state */
              <div className="text-center py-16">
                <span className="text-5xl">🛒</span>
                <h2 className="text-xl font-semibold text-carbon mt-4">Tu carrito está vacío</h2>
                <p className="text-sm text-gray-400 mt-2 mb-6">
                  Agregá productos para empezar tu compra
                </p>
                <Link
                  to="/catalogo"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all"
                >
                  EXPLORAR PRODUCTOS →
                </Link>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                      <span className="text-3xl">⌚</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/producto/${item.product_id}`}
                        className="text-sm md:text-base font-semibold text-carbon hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{(item as any).variant || 'Reloj de cuarzo'}</p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Price */}
                        <span className="text-base md:text-lg font-bold text-primary">
                          {formatPrice(item.price)}
                        </span>

                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button className="px-2.5 py-1.5 text-carbon hover:bg-gray-50 transition-colors text-sm">
                            −
                          </button>
                          <span className="px-3 py-1.5 text-sm font-medium text-carbon border-x border-gray-200 min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button className="px-2.5 py-1.5 text-carbon hover:bg-gray-50 transition-colors text-sm">
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button className="text-gray-300 hover:text-red-500 transition-colors text-lg p-1">
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue shopping */}
                <Link
                  to="/catalogo"
                  className="inline-block text-sm text-primary hover:underline mt-2"
                >
                  ← Seguir comprando
                </Link>
              </>
            )}
          </div>

          {/* Summary sidebar */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="lg:sticky lg:top-6 bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-carbon">Resumen del pedido</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal ({cartCount})</span>
                    <span className="text-carbon font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Envío</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-carbon'}>
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gold font-medium">
                      🚚 Agregá {formatPrice(400000 - cartTotal)} más para envío gratis
                    </p>
                  )}
                </div>

                <hr className="border-gray-100" />

                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-carbon">Total</span>
                  <span className="font-bold text-primary">{formatPrice(finalTotal)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-primary text-white text-center py-3.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all duration-200"
                >
                  INICIAR CHECKOUT →
                </Link>

                {/* Coupon */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">¿Tenés un cupón?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="px-4 py-2 bg-carbon text-white text-sm rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="pt-2 space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>🚚</span> Envío gratis desde $400.000
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔄</span> 30 días de cambio gratis
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💳</span> Pago seguro con Wompi
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommended */}
        {cartItems.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-carbon">Completá tu look</h2>
              <Link to="/catalogo" className="text-sm text-primary hover:underline">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recommendedProducts.map((p) => (
                <ProductCard key={p.slug} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
