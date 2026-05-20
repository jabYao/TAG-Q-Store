import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { DetailSkeleton } from '@/components/Skeleton'
import { toast } from '@/stores/toastStore'

// Mock product data
const mockProduct = {
  slug: 'tommy-chronograph',
  brand: 'Tommy Hilfiger',
  name: 'Tommy Hilfiger Chronograph Analógico de Cuarzo',
  price: 250000,
  originalPrice: 350000,

  description: `Reloj con movimiento de cuarzo suizo y caja de acero inoxidable 316L. Esfera azul con detalles cronográficos y fecha a las 3 horas. Resistente al agua hasta 5 ATM.

  Diseño clásico y sofisticado ideal para cualquier ocasión. Pulso de acero inoxidable con cierre desplegable seguro.`,
  details: [
    { label: 'Marca', value: 'Tommy Hilfiger' },
    { label: 'Modelo / Referencia', value: 'TH-CHR-001' },
    { label: 'Género / Unisex', value: 'Masculino' },
    { label: 'Estilo', value: 'Elegante' },
    { label: 'SKU', value: 'TH-CHR-001' },
    { label: 'Garantía', value: '2 años' },
    { label: 'Origen', value: 'Importado' },
  ],
  specs: [
    { label: 'Tipo de reloj', value: 'Analógico' },
    { label: 'Movimiento', value: 'Cuarzo suizo' },
    { label: 'Material de la caja', value: 'Acero inoxidable 316L' },
    { label: 'Tamaño de la caja', value: '42 mm' },
    { label: 'Grosor', value: '11 mm' },
    { label: 'Forma de la caja', value: 'Redonda' },
    { label: 'Color de la caja', value: 'Plateado' },
    { label: 'Cristal', value: 'Mineral resistente a rayones' },
    { label: 'Tipo de esfera / Dial', value: 'Analógico con cronógrafo' },
    { label: 'Color de esfera', value: 'Azul' },
    { label: 'Correa / Brazalete', value: 'Brazalete' },
    { label: 'Material de la correa', value: 'Acero inoxidable' },
    { label: 'Color de correa', value: 'Plateado' },
    { label: 'Tipo de cierre', value: 'Desplegable con seguro' },
    { label: 'Resistencia al agua', value: '5 ATM (50m)' },
    { label: 'Funciones', value: 'Cronógrafo, Fecha, GMT' },
  ],
  shipping: 'Envío gratis a todo Colombia por compras superiores a $400.000. Tiempo de entrega: 3-5 días hábiles. Devoluciones gratis dentro de los 30 días posteriores a la compra. El producto debe estar sin uso y en su empaque original.',
  colors: ['Negro', 'Plateado', 'Azul'],
  sizes: ['36mm', '38mm', '42mm'],
  images: ['⌚', '⌚', '⌚', '⌚'],
}

const relatedProducts = [
  { name: 'Tommy Hilfiger Classic', slug: 'tommy-classic', price: 145000, originalPrice: undefined, badge: undefined },
  { name: 'Casio G-Shock Digital', slug: 'casio-gshock', price: 180000, originalPrice: 220000, badge: { label: '-18%', variant: 'gold' as const } },
  { name: 'Titan Edge Automatic', slug: 'titan-edge', price: 320000, originalPrice: undefined, badge: undefined },
  { name: 'Guess Ultra Thin', slug: 'guess-ultra', price: 195000, originalPrice: undefined, badge: { label: 'NUEVO', variant: 'primary' as const } },
]

const tabs = ['Descripción', 'Detalles', 'Especificaciones Técnicas', 'Envíos y devoluciones']

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
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <DetailSkeleton />
      </div>
    )
  }
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0])
  const [selectedSize, setSelectedSize] = useState(mockProduct.sizes[1])
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState(0)

  const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`
  const discount = mockProduct.originalPrice
    ? Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    : 0

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-2">
        <nav className="text-xs text-gray-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
          <span className="mx-1">/</span>
          <span className="text-carbon">{mockProduct.name}</span>
        </nav>
      </div>

      {/* Main section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="w-full lg:w-[55%]">
            {/* Main image */}
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-100 mb-4">
              <span className="text-8xl md:text-9xl">{mockProduct.images[selectedImage]}</span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {mockProduct.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 flex items-center justify-center bg-gray-50 transition-all ${
                    i === selectedImage
                      ? 'border-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{img}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full lg:w-[45%]">
            {/* Brand */}
            <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">
              {mockProduct.brand}
            </p>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-carbon leading-tight mb-3">
              {mockProduct.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(mockProduct.price)}
              </span>
              {mockProduct.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(mockProduct.originalPrice)}
                  </span>
                  <span className="bg-gold text-carbon text-xs font-bold px-2 py-0.5 rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Free shipping badge */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-medium">
                🚚 Envío gratis desde $400.000
              </span>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                🔄 30 días de cambio gratis
              </span>
            </div>

            {/* Color */}
            <div className="mb-4">
              <label className="text-sm font-medium text-carbon block mb-2">Color</label>
              <div className="flex gap-2">
                {mockProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                      selectedColor === color
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 text-carbon hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="text-sm font-medium text-carbon block mb-2">Tamaño</label>
              <div className="flex gap-2">
                {mockProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 text-carbon hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-medium text-carbon block">Cantidad</label>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => toast.success('Agregado al carrito', `${mockProduct.name} · ${formatPrice(mockProduct.price * quantity)}`)}
                className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all duration-200 flex items-center justify-center gap-2"
              >
                🛒 AGREGAR AL CARRITO — {formatPrice(mockProduct.price * quantity)}
              </button>
              <button className="w-full bg-gold text-carbon py-3.5 rounded-lg font-semibold text-sm hover:bg-[#e0c456] transition-all duration-200">
                COMPRAR AHORA →
              </button>
            </div>

            {/* Trust */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-base">🚚</span> Envío gratis +$400.000
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-base">🔄</span> 30 días de cambio gratis
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-base">💳</span> Pago seguro con Wompi
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-12 lg:mt-16">
          {/* Tab headers */}
          <div className="border-b border-gray-200">
            <div className="flex gap-0">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-5 md:px-8 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === i
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-carbon'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="py-6 md:py-8">
            {activeTab === 0 && (
              <div className="max-w-3xl">
                {/* Brand logo */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">👔</span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Marca</p>
                    <p className="text-lg font-semibold text-carbon">Tommy Hilfiger</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                  {mockProduct.description.split('\n\n').map((p, i) => (
                    <p key={i}>{p.trim()}</p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="max-w-xl">
                <table className="w-full text-sm">
                  <tbody>
                    {mockProduct.details.map((d) => (
                      <tr key={d.label} className="border-b border-gray-100">
                        <td className="py-3 pr-8 text-gray-400 font-medium w-2/5">{d.label}</td>
                        <td className="py-3 text-carbon">{d.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 2 && (
              <div className="max-w-xl">
                <h4 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">
                  Ficha técnica
                </h4>
                <table className="w-full text-sm">
                  <tbody>
                    {mockProduct.specs.map((s) => (
                      <tr key={s.label} className="border-b border-gray-100">
                        <td className="py-3 pr-8 text-gray-400 font-medium w-2/5">{s.label}</td>
                        <td className="py-3 text-carbon">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 3 && (
              <div className="max-w-3xl text-sm text-gray-600 leading-relaxed">
                <p>{mockProduct.shipping}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-carbon">Relacionados</h2>
            <Link to="/catalogo" className="text-sm text-primary hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.slug} {...p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
