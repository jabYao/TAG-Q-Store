import { useQuery } from '@tanstack/react-query'
import { fetchProducts, fetchCategories, fetchBrands, fetchHeroes, fetchBanners } from '@/api'
import type { HeroData } from '@/api/banners'
import HeroCarousel from '@/components/HeroCarousel'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import PromoBanner from '@/components/PromoBanner'
import SEO from '@/components/SEO'
import { HeroSkeleton, ProductGridSkeleton, CategoryCardSkeleton } from '@/components/Skeleton'

function toProductCard(p: { id: number; name: string; slug: string; price: number; original_price: number | null; primary_image: string | null; thumbnail: string | null; is_featured: boolean; is_new: boolean; discount_percent: number | null; sku: string; is_out_of_stock?: boolean }) {
  const badge = p.discount_percent && p.discount_percent >= 10
    ? { label: `-${p.discount_percent}%`, variant: 'gold' as const }
    : p.is_new
      ? { label: 'NUEVO', variant: 'primary' as const }
      : p.is_featured
        ? { label: 'DESTACADO', variant: 'gold' as const }
        : undefined

  return {
    productId: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    imageUrl: p.thumbnail ?? p.primary_image ?? undefined,
    reference: p.sku,
    isOutOfStock: p.is_out_of_stock ?? false,
    badge,
  }
}

const categoryMeta: Record<string, { emoji: string; imageUrl: string }> = {
  dama: {
    emoji: '👩',
    imageUrl: 'https://res.cloudinary.com/dg6iut6sl/image/upload/v1779478950/imagen-dama-categoria._zpfbhd.png',
  },
  caballero: {
    emoji: '👔',
    imageUrl: 'https://res.cloudinary.com/dg6iut6sl/image/upload/v1779479177/imagen-caballero-cateogoria._ypo79i.png',
  },
  branded: {
    emoji: '⭐',
    imageUrl: 'https://res.cloudinary.com/dg6iut6sl/image/upload/v1779478924/promociones_h5ocxe.png',
  },
}

const brandNames = [
  { name: 'TOMMY\nHILFIGER', color: 'text-primary' },
  { name: 'CASIO', color: 'text-carbon' },
  { name: 'TITAN', color: 'text-primary' },
  { name: 'GUESS', color: 'text-carbon' },
  { name: 'CITIZEN', color: 'text-primary' },
  { name: 'MICHAEL\nKORS', color: 'text-carbon' },
  { name: 'TIMEX', color: 'text-primary' },
  { name: 'FOSSIL', color: 'text-carbon' },
]

const FALLBACK_HERO = {
  title: "Timex Men Leather Straps Analogue Watch",
  subtitle: "Descubrí la colección premium de relojería con diseño clásico y movimientos suizos. Elegancia que trasciende el tiempo.",
  cta: "SHOP NOW →",
  ctaLink: "/catalogo",
}

export default function Home() {
  const { data: heroes, isLoading: heroLoading } = useQuery({
    queryKey: ['heroes', 'home'],
    queryFn: fetchHeroes,
  })

  const { data: promoBanners } = useQuery({
    queryKey: ['banners', 'promo'],
    queryFn: fetchBanners,
  })

  const activeBanner = promoBanners?.find((b: any) => b.cta_text) || promoBanners?.[0]

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ['categories', 'home'],
    queryFn: () => fetchCategories({ parents_only: true }),
  })

  const { data: featured, isLoading: featLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchProducts({ featured: true, per_page: 8 }),
  })

  const { data: newProducts, isLoading: newLoading } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => fetchProducts({ sort: 'recent', per_page: 4 }),
  })

  const showLoading = catLoading || featLoading || newLoading

  return (
    <>
      <SEO
        title="Inicio"
        description="Relojería de lujo en Colombia. Marcas premium, envío gratis desde $400.000 COP y cuotas sin interés."
        url="/"
      />
      <div>
      {/* Hero Carousel */}
      {heroLoading ? (
        <HeroSkeleton />
      ) : (
        <HeroCarousel
          slides={
            heroes?.length
              ? heroes.map((h: HeroData) => ({
                  title: h.title,
                  subtitle: h.subtitle,
                  cta: h.cta_text || FALLBACK_HERO.cta,
                  ctaLink: h.cta_link || FALLBACK_HERO.ctaLink,
                  imageUrl: h.image_url || undefined,
                }))
              : [FALLBACK_HERO]
          }
          interval={5000}
        />
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-carbon text-center mb-2">
          Comprá por Categoría
        </h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          Explorá nuestra selección curada para cada estilo
        </p>

        {catLoading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1,2,3].map(i => <CategoryCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible md:snap-none pb-2 md:pb-0">
            {categories?.map((cat) => (
              <div key={cat.slug} className="snap-start shrink-0 w-[280px] md:w-auto md:shrink">
                <CategoryCard
                  name={cat.name}
                  slug={cat.slug}
                  emoji={categoryMeta[cat.slug]?.emoji || '⌚'}
                  imageUrl={categoryMeta[cat.slug]?.imageUrl}
                  count={cat.products_count}
                />
              </div>
            ))}
          </div>
        )}
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

          {featLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featured?.data?.map((product, index) => (
                  <div key={product.slug} className={index >= 6 ? 'md:hidden lg:block' : ''}>
                    <ProductCard {...toProductCard(product)} />
                  </div>
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
            </>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner
        title={activeBanner?.title || '🔥 Hasta 40% OFF en relojes seleccionados'}
        subtitle={activeBanner?.subtitle || 'Aprovechá nuestra colección de temporada con descuentos exclusivos. Válido hasta agotar stock.'}
        cta={activeBanner?.cta_text || 'QUIERO MI DESCUENTO →'}
        ctaLink={activeBanner?.cta_link || '/catalogo?promo=40off'}
        imageUrl={activeBanner?.image_url || undefined}
        bgColor={activeBanner?.bg_color || 'bg-carbon'}
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

          {newLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {newProducts?.data?.map((product) => (
                  <ProductCard key={product.slug} {...toProductCard(product)} />
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
            </>
          )}
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

          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible md:snap-none pb-2 md:pb-0 items-center">
            {brandNames.map((brand, i) => (
              <div key={i} className="snap-start shrink-0 md:shrink md:w-auto">
                <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <span className={`text-2xl font-bold ${brand.color} text-center leading-tight text-xs`}>
                    {brand.name}
                  </span>
                </div>
              </div>
            ))}
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
    </>
  )
}
