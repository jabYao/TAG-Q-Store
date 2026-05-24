import { Link } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import { toast } from '@/stores/toastStore'

interface ProductCardProps {
  productId: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  imageUrl?: string
  thumbnail?: string
  reference?: string
  badge?: { label: string; variant: 'gold' | 'primary' }
  isOutOfStock?: boolean
}

export default function ProductCard({ productId, name, slug, price, originalPrice, imageUrl, reference, badge, isOutOfStock }: ProductCardProps) {
  const formatPrice = (amount: number) =>
    `$${amount.toLocaleString('es-CO')}`

  return (
    <Link
      to={`/producto/${slug}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
            ⌚
          </span>
        )}

        {/* Overlay AGOTADO */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-carbon text-xs font-bold px-3 py-1.5 rounded">
              AGOTADO
            </span>
          </div>
        )}

        {/* Badge */}
        {badge && !isOutOfStock && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${
              badge.variant === 'gold'
                ? 'bg-gold text-carbon'
                : 'bg-primary text-white'
            }`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-carbon line-clamp-2">
          {name}
        </h3>

        {reference && (
          <p className="text-[11px] text-gray-400 mt-0.5 mb-1.5">
            Ref: {reference}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-base font-bold text-primary">
              {formatPrice(price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              if (isOutOfStock) return
              e.preventDefault()
              e.stopPropagation()
              const addItem = useCartStore.getState().addItem
              addItem({
                id: productId,
                product_id: productId,
                name,
                slug,
                price,
                quantity: 1,
                image_url: imageUrl ?? '',
              })
              toast.success('Agregado al carrito', `${name} se agregó a tu carrito`)
            }}
            className={`transition-opacity duration-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 ${
              isOutOfStock
                ? 'opacity-0 group-hover:opacity-100 bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'opacity-0 group-hover:opacity-100 bg-primary text-white hover:bg-primary-dark'
            }`}
            aria-label={isOutOfStock ? 'Agotado' : 'Comprar'}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? '🚫 AGOTADO' : '🛒 Comprar'}
          </button>
        </div>
      </div>
    </Link>
  )
}
