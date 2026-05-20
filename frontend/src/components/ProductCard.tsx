import { Link } from 'react-router-dom'

interface ProductCardProps {
  name: string
  slug: string
  price: number
  originalPrice?: number
  imageUrl?: string
  badge?: { label: string; variant: 'gold' | 'primary' }
}

export default function ProductCard({ name, slug, price, originalPrice, badge }: ProductCardProps) {
  const formatPrice = (amount: number) =>
    `$${amount.toLocaleString('es-CO')}`

  return (
    <Link
      to={`/producto/${slug}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
          ⌚
        </span>

        {/* Badge */}
        {badge && (
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
        <h3 className="text-sm font-semibold text-carbon line-clamp-2 mb-1">
          {name}
        </h3>

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
      </div>
    </Link>
  )
}
