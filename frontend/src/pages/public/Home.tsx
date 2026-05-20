import HeroBanner from '@/components/HeroBanner'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import PromoBanner from '@/components/PromoBanner'

const categories = [
  { name: 'Dama', slug: 'dama', emoji: '👩', count: 12 },
  { name: 'Caballero', slug: 'caballero', emoji: '👔', count: 28 },
  { name: 'Branded', slug: 'branded', emoji: '⭐', count: 8 },
]

const featuredProducts = [
  { name: 'Tommy Hilfiger Chronograph', slug: 'tommy-chronograph', price: 250000, originalPrice: undefined, badge: { label: 'MÁS VENDIDO', variant: 'gold' as const } },
  { name: 'Casio G-Shock Digital', slug: 'casio-gshock', price: 180000, originalPrice: 220000, badge: { label: '-18%', variant: 'gold' as const } },
  { name: 'Titan Edge Automatic', slug: 'titan-edge', price: 320000, originalPrice: undefined, badge: undefined },
  { name: 'Guess Ultra Thin', slug: 'guess-ultra', price: 195000, originalPrice: undefined, badge: { label: 'NUEVO', variant: 'primary' as const } },
  { name: 'Tommy Hilfiger Classic', slug: 'tommy-classic', price: 145000, originalPrice: undefined, badge: undefined },
  { name: 'Citizen Eco-Drive', slug: 'citizen-eco', price: 450000, originalPrice: undefined, badge: { label: 'PREMIUM', variant: 'primary' as const } },
  { name: 'Casio Vintage', slug: 'casio-vintage', price: 89000, originalPrice: 120000, badge: { label: '-26%', variant: 'gold' as const } },
  { name: 'Michael Kors Access', slug: 'mk-access', price: 380000, originalPrice: undefined, badge: undefined },
]

const newArrivals = [
  { name: 'Tommy Hilfiger Chronograph', slug: 'tommy-chronograph-new', price: 99000, originalPrice: 250000, badge: { label: '-60%', variant: 'gold' as const } },
  { name: 'Tommy Hilfiger Classic', slug: 'tommy-classic-new', price: 62000, originalPrice: undefined, badge: undefined },
  { name: 'Titan Edge Automatic', slug: 'titan-edge-new', price: 75000, originalPrice: undefined, badge: undefined },
  { name: 'Guess Ultra Thin', slug: 'guess-ultra-new', price: 55000, originalPrice: undefined, badge: { label: 'NUEVO', variant: 'primary' as const } },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <HeroBanner
        title="Timex Men Leather Straps Analogue Watch"
        subtitle="Descubrí la colección premium de relojería con diseño clásico y movimientos suizos. Elegancia que trasciende el tiempo."
        cta="SHOP NOW →"
        ctaLink="/catalogo"
      />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-carbon text-center mb-2">
          Comprá por Categoría
        </h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          Explorá nuestra selección curada para cada estilo
        </p>

        {/* Mobile/Tablet: carousel — Desktop: grid */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible md:snap-none pb-2 md:pb-0">
          {categories.map((cat) => (
            <div key={cat.slug} className="snap-start shrink-0 w-[280px] md:w-auto md:shrink">
              <CategoryCard {...cat} />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-12 md:py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-carbon text-center mb-2">
            Productos Destacados
          </h2>
          <p className="text-sm text-gray-400 text-center mb-8">
            Lo más elegido por nuestros clientes
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} {...product} />
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/catalogo"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all duration-200"
            >
              VER TODOS LOS PRODUCTOS →
            </a>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner
        title="🔥 Hasta 40% OFF en relojes seleccionados"
        subtitle="Aprovechá nuestra colección de temporada con descuentos exclusivos. Válido hasta agotar stock."
        cta="QUIERO MI DESCUENTO →"
        ctaLink="/catalogo?promo=40off"
        bgColor="bg-carbon"
        accentColor="text-gold"
      />

      {/* New Arrivals */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-carbon text-center mb-2">
            Nuevos Arribos
          </h2>
          <p className="text-sm text-gray-400 text-center mb-8">
            Los más buscados de la temporada
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.slug} {...product} />
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/catalogo"
              className="inline-block text-primary font-semibold text-sm hover:underline transition-all"
            >
              VER TODO →
            </a>
          </div>
        </div>
      </section>

      {/* Nuestras Marcas */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-carbon text-center mb-2">
            Nuestras Marcas
          </h2>
          <p className="text-sm text-gray-400 text-center mb-10">
            Trabajamos con las mejores marcas del mundo
          </p>

          {/* Mobile/Tablet: carousel — Desktop: grid */}
          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible md:snap-none pb-2 md:pb-0 items-center">
            <div className="snap-start shrink-0 md:shrink md:w-auto">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <span className="text-2xl font-bold text-primary text-center leading-tight text-xs">TOMMY<br/>HILFIGER</span>
              </div>
            </div>
            <div className="snap-start shrink-0 md:shrink md:w-auto">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <span className="text-2xl font-bold text-carbon text-center leading-tight text-xs">CASIO</span>
              </div>
            </div>
            <div className="snap-start shrink-0 md:shrink md:w-auto">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <span className="text-2xl font-bold text-primary text-center leading-tight text-xs">TITAN</span>
              </div>
            </div>
            <div className="snap-start shrink-0 md:shrink md:w-auto">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <span className="text-2xl font-bold text-carbon text-center leading-tight text-xs">GUESS</span>
              </div>
            </div>
            <div className="snap-start shrink-0 md:shrink md:w-auto">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <span className="text-2xl font-bold text-primary text-center leading-tight text-xs">CITIZEN</span>
              </div>
            </div>
            <div className="snap-start shrink-0 md:shrink md:w-auto">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <span className="text-2xl font-bold text-carbon text-center leading-tight text-xs">MICHAEL<br/>KORS</span>
              </div>
            </div>
            <div className="snap-start shrink-0 md:shrink md:w-auto">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <span className="text-2xl font-bold text-primary text-center leading-tight text-xs">TIMEX</span>
              </div>
            </div>
            <div className="snap-start shrink-0 md:shrink md:w-auto">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <span className="text-2xl font-bold text-carbon text-center leading-tight text-xs">FOSSIL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <span className="text-3xl">🚚</span>
              <h4 className="text-sm font-semibold text-carbon mt-2">Envío Gratis</h4>
              <p className="text-xs text-gray-400 mt-1">Desde $400.000 COP</p>
            </div>
            <div className="p-4">
              <span className="text-3xl">💳</span>
              <h4 className="text-sm font-semibold text-carbon mt-2">Pago Seguro</h4>
              <p className="text-xs text-gray-400 mt-1">Wompi protegido</p>
            </div>
            <div className="p-4">
              <span className="text-3xl">↩️</span>
              <h4 className="text-sm font-semibold text-carbon mt-2">Devoluciones</h4>
              <p className="text-xs text-gray-400 mt-1">15 días de garantía</p>
            </div>
            <div className="p-4">
              <span className="text-3xl">📞</span>
              <h4 className="text-sm font-semibold text-carbon mt-2">Soporte 24/7</h4>
              <p className="text-xs text-gray-400 mt-1">WhatsApp directo</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
