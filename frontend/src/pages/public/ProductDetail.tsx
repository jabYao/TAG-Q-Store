import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchProduct, fetchProducts, addToCart } from '@/api'
import ProductCard from '@/components/ProductCard'
import SEO from '@/components/SEO'
import { DetailSkeleton } from '@/components/Skeleton'
import { toast } from '@/stores/toastStore'
import { useCartStore } from '@/stores/cartStore'
import Button from '@/components/ui/Button'

function QuantitySelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="px-3 py-2 text-carbon hover:bg-gray-50 transition-colors text-lg"
      >
        −
      </button>
      <span className="px-4 py-2 text-sm font-medium text-carbon min-w-[40px] text-center border-x border-gray-200">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="px-3 py-2 text-carbon hover:bg-gray-50 transition-colors text-lg"
      >
        +
      </button>
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState(0)
  const [zoom, setZoom] = useState({ show: false, x: 50, y: 50 })
  const [mainImageError, setMainImageError] = useState(false)

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug!),
    enabled: !!slug,
  })

  const { data: relatedData } = useQuery({
    queryKey: ['products', 'related', product?.category?.slug],
    queryFn: () => fetchProducts({ category: product!.category!.slug, per_page: 4, sort: 'recent' }),
    enabled: !!product?.category?.slug,
  })

  const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

  // ── Hooks incondicionales (antes de cualquier early return) ──
  const addToCartMutation = useMutation({
    mutationFn: () => product ? addToCart(product.id, quantity) : Promise.reject(),
    onSuccess: () => {
      if (product) {
        useCartStore.getState().addItem({
          id: product.id,
          product_id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          quantity,
          image_url: product.primary_image ?? '',
        })
        toast.success(`${product.name} agregado al carrito`)
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Error al agregar al carrito')
    },
  })

  const handleBuyNow = () => {
    addToCartMutation.mutate(undefined, {
      onSuccess: () => navigate('/checkout'),
    })
  }

  // ── Valores calculados (después del chequeo de loading/error, product existe) ──
  let discount = 0
  let images: any[] = []
  let specsEntries: [string, string][] = []
  let details: { label: string; value: string }[] = []

  if (product) {
    discount = product.original_price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0

    images = product.images?.length
      ? product.images
      : [{ url: null, alt_text: null, is_primary: true, sort_order: 0, type: 'product', id: 0 }]

    specsEntries = product.specs ? Object.entries(product.specs) : []

    details = [
      ...(product.brand ? [{ label: 'Marca', value: product.brand.name }] : []),
      { label: 'SKU', value: product.sku },
      ...(product.gender ? [{ label: 'Género', value: product.gender === 'male' ? 'Masculino' : product.gender === 'female' ? 'Femenino' : 'Unisex' }] : []),
      ...(product.movement ? [{ label: 'Movimiento', value: product.movement }] : []),
      ...(product.specs?.garantia ? [{ label: 'Garantía', value: product.specs.garantia }] : []),
      ...(product.specs?.origen ? [{ label: 'Origen', value: product.specs.origen }] : []),
    ]
  }

  if (isLoading) {
    return (
      <>
        <SEO title="Cargando..." />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <DetailSkeleton />
        </div>
      </>
    )
  }

  if (isError || !product) {
    return (
      <>
        <SEO title="Producto no encontrado" noIndex />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 text-center">
        <span className="text-5xl">🔍</span>
        <h2 className="text-xl font-semibold text-carbon mt-4">Producto no encontrado</h2>
        <p className="text-sm text-gray-400 mt-2">El producto que buscás no existe o fue eliminado.</p>
        <Link to="/catalogo" className="inline-block mt-6 text-primary hover:underline text-sm">Volver al catálogo</Link>
      </div>
    </>
    )
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.short_description || product.description?.slice(0, 160)}
        image={product.primary_image || undefined}
        url={`/producto/${product.slug}`}
        type="product"
        publishedAt={product.published_at}
      />
      <div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-2">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Catálogo', href: '/catalogo' },
          { label: product.name },
        ]} />
      </div>

      {/* Main section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="w-full lg:w-[55%]">
            <div
              className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-100 mb-4 overflow-hidden cursor-crosshair relative"
              onMouseMove={(e) => {
                if (!images[selectedImage]?.url) return
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                setZoom({ show: true, x, y })
              }}
              onMouseLeave={() => setZoom(z => ({ ...z, show: false }))}
            >
              {images[selectedImage]?.url && !mainImageError ? (
                <img
                  src={images[selectedImage].url}
                  alt={images[selectedImage].alt_text ?? product.name}
                  className="w-full h-full object-cover transition-transform duration-75"
                  style={{
                    transform: zoom.show ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  }}
                  onError={() => setMainImageError(true)}
                />
              ) : (
                <span className="text-8xl md:text-9xl">⌚</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setMainImageError(false) }}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 flex items-center justify-center bg-gray-50 overflow-hidden transition-all ${
                      i === selectedImage
                        ? 'border-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {img.url ? (
                      <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <span className="text-2xl">⌚</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="w-full lg:w-[45%]">
            {product.brand && (
              <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">
                {product.brand.name}
              </p>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-carbon leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-carbon">{formatPrice(product.price)}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.original_price)}</span>
                  <span className="text-xs font-bold text-carbon bg-gold px-2 py-0.5 rounded">-{discount}%</span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mb-6">
              {product.is_out_of_stock ? (
                <p className="text-sm text-red-500 font-medium">⛔ Agotado</p>
              ) : product.stock <= 5 ? (
                <p className="text-sm text-amber-600 font-medium">⚠️ Solo quedan {product.stock} unidades</p>
              ) : (
                <p className="text-sm text-green-600 font-medium">✅ En stock</p>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{product.short_description}</p>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                variant="primary"
                size="md"
                disabled={product.is_out_of_stock}
                loading={addToCartMutation.isPending}
                onClick={() => addToCartMutation.mutate()}
                className="flex-1"
              >
                {product.is_out_of_stock ? 'AGOTADO' : 'AGREGAR AL CARRITO'}
              </Button>
            </div>

            {/* Buy now */}
            {!product.is_out_of_stock && (
              <Button
                variant="outline"
                size="md"
                onClick={handleBuyNow}
                className="w-full mb-6"
              >
                COMPRAR AHORA
              </Button>
            )}

            {/* Shipping info */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 space-y-2">
              <p>🚚 Envío gratis a todo Colombia por compras superiores a $400.000</p>
              <p>↩️ Devoluciones gratis dentro de los 30 días posteriores a la compra</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-0 border-b border-gray-200">
            {['Descripción', 'Detalles', 'Especificaciones Técnicas', 'Envíos y devoluciones'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium transition-all border-b-2 -mb-[1px] ${
                  activeTab === i
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 0 && (
              <div className="max-w-3xl">
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                  {product.description || 'Sin descripción disponible.'}
                </p>
              </div>
            )}

            {activeTab === 1 && (
              <div className="max-w-xl">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {details.map((d, i) => (
                      <tr key={i}>
                        <td className="py-3 pr-8 text-gray-400 font-medium w-40">{d.label}</td>
                        <td className="py-3 text-carbon">{d.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 2 && (
              <div className="max-w-xl">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {specsEntries.map(([key, value], i) => (
                      <tr key={i}>
                        <td className="py-3 pr-8 text-gray-400 font-medium w-40 capitalize">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </td>
                        <td className="py-3 text-carbon">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 3 && (
              <div className="max-w-2xl text-sm text-gray-500 leading-relaxed space-y-4">
                <p><strong className="text-carbon">Envío gratis</strong> a todo Colombia por compras superiores a $400.000 COP.</p>
                <p>Tiempo de entrega estimado: <strong className="text-carbon">3-5 días hábiles</strong> en principales ciudades.</p>
                <p>
                  <strong className="text-carbon">Devoluciones gratis</strong> dentro de los 30 días posteriores a la compra.
                  El producto debe estar sin uso y en su empaque original.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedData && relatedData.data.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-carbon mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedData.data.filter(p => p.slug !== product.slug).slice(0, 4).map((p) => (
                <ProductCard
                  key={p.slug}
                  productId={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={p.price}
                  originalPrice={p.original_price ?? undefined}
                  imageUrl={p.primary_image ?? undefined}
                  reference={(p as any).sku}
                  isOutOfStock={p.is_out_of_stock}
                  badge={
                    p.discount_percent && p.discount_percent >= 10
                      ? { label: `-${p.discount_percent}%`, variant: 'gold' as const }
                      : p.is_new
                        ? { label: 'NUEVO', variant: 'primary' as const }
                        : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
    </>
  )
}
