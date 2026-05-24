import { useParams, Link } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'

const mockProducts = [
  { productId: 1, name: 'Tommy Hilfiger Chronograph', slug: 'tommy-chronograph', price: 250000, originalPrice: undefined, badge: { label: 'MÁS VENDIDO', variant: 'gold' as const } },
  { productId: 2, name: 'Casio G-Shock Digital', slug: 'casio-gshock', price: 180000, originalPrice: 220000, badge: { label: '-18%', variant: 'gold' as const } },
  { productId: 3, name: 'Titan Edge Automatic', slug: 'titan-edge', price: 320000, originalPrice: undefined, badge: undefined },
  { productId: 4, name: 'Guess Ultra Thin', slug: 'guess-ultra', price: 195000, originalPrice: undefined, badge: { label: 'NUEVO', variant: 'primary' as const } },
  { productId: 5, name: 'Tommy Hilfiger Classic', slug: 'tommy-classic', price: 145000, originalPrice: undefined, badge: undefined },
  { productId: 6, name: 'Citizen Eco-Drive', slug: 'citizen-eco', price: 450000, originalPrice: undefined, badge: { label: 'PREMIUM', variant: 'primary' as const } },
  { productId: 7, name: 'Casio Vintage', slug: 'casio-vintage', price: 89000, originalPrice: 120000, badge: { label: '-26%', variant: 'gold' as const } },
  { productId: 8, name: 'Michael Kors Access', slug: 'mk-access', price: 380000, originalPrice: undefined, badge: undefined },
]

const collections: Record<string, { name: string; tagline: string; description: string; products: typeof mockProducts }> = {
  'verano-2026': {
    name: 'Verano 2026',
    tagline: 'Ligereza y estilo para los días más soleados',
    description: 'Una colección pensada para el verano. Relojes con correas de silicona y nylon, colores vibrantes y resistencia al agua mejorada. Diseños frescos que combinan con cualquier look playero o urbano.',
    products: mockProducts.slice(0, 4),
  },
  'edicion-limitada': {
    name: 'Edición Limitada',
    tagline: 'Piezas únicas para coleccionistas',
    description: 'Relojes de edición limitada con numeración individual. Movimientos suizos, materiales premium y diseños exclusivos que no encontrarás en ninguna otra parte.',
    products: mockProducts.slice(4, 8),
  },
}

export default function Landing() {
  const { slug } = useParams<{ slug: string }>()
  const collection = slug ? collections[slug] : null

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-5xl">🔍</span>
        <h1 className="text-xl font-semibold text-carbon mt-4">Colección no encontrada</h1>
        <p className="text-sm text-gray-400 mt-2">La colección que buscás no existe o fue eliminada.</p>
        <Link to="/catalogo" className="inline-block mt-6 text-sm text-primary hover:underline">Ver catálogo →</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0B2977] to-[#081d55] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gold/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Colección</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {collection.name}
            </h1>
            <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
              {collection.tagline}
            </p>
            <Link
              to="/catalogo"
              className="inline-block bg-gold text-carbon px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-[#e0c456] transition-all duration-200"
            >
              EXPLORAR COLECCIÓN →
            </Link>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-carbon mb-4">La Colección</h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">
            {collection.description}
          </p>
          <Link to="/catalogo" className="text-sm text-primary hover:underline font-medium">
            Ver detalles de la colección →
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-semibold text-carbon text-center mb-8">
            Piezas destacadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {collection.products.map((p) => (
              <ProductCard key={p.slug} {...p} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/catalogo" className="text-sm text-primary hover:underline font-medium">
              Ver todos los productos →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 text-center">
        <h3 className="text-xl font-semibold text-carbon mb-2">¿Tenés dudas sobre esta colección?</h3>
        <p className="text-sm text-gray-400 mb-6">Escribinos y te asesoramos personalmente</p>
        <Link to="/contacto" className="inline-block bg-primary text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all">
          CONTACTANOS
        </Link>
      </section>
    </div>
  )
}
