import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import CatalogFilters, { sortOptions } from '@/components/CatalogFilters'
import { ProductGridSkeleton } from '@/components/Skeleton'

// Mock data — will come from API later
const mockProducts = [
  { name: 'Tommy Hilfiger Chronograph', slug: 'tommy-chronograph', price: 250000, originalPrice: undefined, badge: { label: 'MÁS VENDIDO', variant: 'gold' as const }, category: 'dama', brand: 'Tommy Hilfiger' },
  { name: 'Casio G-Shock Digital', slug: 'casio-gshock', price: 180000, originalPrice: 220000, badge: { label: '-18%', variant: 'gold' as const }, category: 'caballero', brand: 'Casio' },
  { name: 'Titan Edge Automatic', slug: 'titan-edge', price: 320000, originalPrice: undefined, badge: undefined, category: 'caballero', brand: 'Titan' },
  { name: 'Guess Ultra Thin', slug: 'guess-ultra', price: 195000, originalPrice: undefined, badge: { label: 'NUEVO', variant: 'primary' as const }, category: 'dama', brand: 'Guess' },
  { name: 'Tommy Hilfiger Classic', slug: 'tommy-classic', price: 145000, originalPrice: undefined, badge: undefined, category: 'dama', brand: 'Tommy Hilfiger' },
  { name: 'Citizen Eco-Drive', slug: 'citizen-eco', price: 450000, originalPrice: undefined, badge: { label: 'PREMIUM', variant: 'primary' as const }, category: 'branded', brand: 'Citizen' },
  { name: 'Casio Vintage', slug: 'casio-vintage', price: 89000, originalPrice: 120000, badge: { label: '-26%', variant: 'gold' as const }, category: 'caballero', brand: 'Casio' },
  { name: 'Michael Kors Access', slug: 'mk-access', price: 380000, originalPrice: undefined, badge: undefined, category: 'dama', brand: 'Michael Kors' },
  { name: 'Timex Expedition', slug: 'timex-expedition', price: 130000, originalPrice: undefined, badge: undefined, category: 'caballero', brand: 'Timex' },
  { name: 'Fossil Gen 6', slug: 'fossil-gen6', price: 520000, originalPrice: 650000, badge: { label: '-20%', variant: 'gold' as const }, category: 'branded', brand: 'Fossil' },
  { name: 'Citizen Promaster', slug: 'citizen-promaster', price: 380000, originalPrice: undefined, badge: undefined, category: 'caballero', brand: 'Citizen' },
  { name: 'Guess Glam', slug: 'guess-glam', price: 165000, originalPrice: undefined, badge: undefined, category: 'dama', brand: 'Guess' },
  { name: 'Seiko 5 Sports', slug: 'seiko-5', price: 420000, originalPrice: undefined, badge: undefined, category: 'caballero', brand: 'Timex' },
  { name: 'Orient Bambino', slug: 'orient-bambino', price: 280000, originalPrice: undefined, badge: { label: 'MÁS VENDIDO', variant: 'gold' as const }, category: 'caballero', brand: 'Titan' },
  { name: 'Casio Edifice', slug: 'casio-edifice', price: 210000, originalPrice: 260000, badge: { label: '-19%', variant: 'gold' as const }, category: 'caballero', brand: 'Casio' },
  { name: 'Tommy Hilfiger Bold', slug: 'tommy-bold', price: 190000, originalPrice: undefined, badge: undefined, category: 'branded', brand: 'Tommy Hilfiger' },
  { name: 'Citizen Tsuyosa', slug: 'citizen-tsuyosa', price: 550000, originalPrice: undefined, badge: { label: 'NUEVO', variant: 'primary' as const }, category: 'dama', brand: 'Citizen' },
  { name: 'Timex Waterbury', slug: 'timex-waterbury', price: 115000, originalPrice: undefined, badge: undefined, category: 'caballero', brand: 'Timex' },
  { name: 'Fossil Minimalist', slug: 'fossil-minimalist', price: 240000, originalPrice: 300000, badge: { label: '-20%', variant: 'gold' as const }, category: 'dama', brand: 'Fossil' },
  { name: 'Titan Raga', slug: 'titan-raga', price: 160000, originalPrice: undefined, badge: undefined, category: 'dama', brand: 'Titan' },
  { name: 'Michael Kors Gen 6', slug: 'mk-gen6', price: 490000, originalPrice: undefined, badge: { label: 'SMARTWATCH', variant: 'primary' as const }, category: 'branded', brand: 'Michael Kors' },
  { name: 'Guess Connected', slug: 'guess-connected', price: 350000, originalPrice: undefined, badge: undefined, category: 'dama', brand: 'Guess' },
  { name: 'Casio Duro', slug: 'casio-duro', price: 75000, originalPrice: undefined, badge: undefined, category: 'caballero', brand: 'Casio' },
]

const ITEMS_PER_PAGE = 12

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || '')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [sortBy, setSortBy] = useState('recent')
  const [selectedTipo, setSelectedTipo] = useState<string[]>([])
  const [selectedGenero, setSelectedGenero] = useState('')
  const [selectedEstilo, setSelectedEstilo] = useState<string[]>([])
  const [selectedMovimiento, setSelectedMovimiento] = useState<string[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState<string[]>([])
  const [selectedTamano, setSelectedTamano] = useState<string[]>([])
  const [selectedResistencia, setSelectedResistencia] = useState<string[]>([])
  const [selectedFunciones, setSelectedFunciones] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const searchQuery = searchParams.get('q') || ''

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [selectedCategory, selectedBrands, priceRange, sortBy, searchQuery])

  // Filter products
  let filtered = mockProducts.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Sort
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      filtered = filtered.filter((p) => p.badge?.label === 'NUEVO').concat(filtered.filter((p) => p.badge?.label !== 'NUEVO'))
      break
    case 'best-sellers':
      filtered = filtered.filter((p) => p.badge?.label === 'MÁS VENDIDO').concat(filtered.filter((p) => p.badge?.label !== 'MÁS VENDIDO'))
      break
    default:
      break
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleClear = () => {
    setSelectedCategory('')
    setSelectedBrands([])
    setPriceRange([0, 1000000])
    setSortBy('recent')
    setSelectedTipo([])
    setSelectedGenero('')
    setSelectedEstilo([])
    setSelectedMovimiento([])
    setSelectedMaterial([])
    setSelectedColor([])
    setSelectedTamano([])
    setSelectedResistencia([])
    setSelectedFunciones([])
    setCurrentPage(1)
  }

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || ''

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-2">
        <nav className="text-xs text-gray-400">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-1">/</span>
          <span className="text-carbon">Catálogo</span>
          {searchQuery && (
            <>
              <span className="mx-1">/</span>
              <span className="text-carbon">Búsqueda: "{searchQuery}"</span>
            </>
          )}
        </nav>
      </div>

      {/* Header bar: results count + mobile filters toggle */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-carbon">
              {searchParams.get('categoria')
                ? searchParams.get('categoria')!.charAt(0).toUpperCase() + searchParams.get('categoria')!.slice(1)
                : 'Catálogo'}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              {currentSortLabel && ` · ${currentSortLabel}`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon hover:bg-gray-100 transition-colors"
          >
            🔄 Filtrar
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-12">
        <div className="flex gap-8">
          {/* Filters sidebar */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
              <div className="fixed inset-0 bg-black/30 lg:hidden" onClick={() => setShowFilters(false)} />
              <div className="fixed left-0 top-0 bottom-0 w-[300px] bg-white z-50 overflow-y-auto p-6 lg:relative lg:inset-auto lg:w-auto lg:bg-transparent lg:p-0 lg:z-auto lg:overflow-visible">
                <CatalogFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); setShowFilters(false) }}
                  selectedBrands={selectedBrands}
                  onBrandToggle={(b) => { setSelectedBrands((p) => p.includes(b) ? p.filter((x) => x !== b) : [...p, b]); setCurrentPage(1) }}
                  priceRange={priceRange}
                  onPriceRangeChange={(r) => { setPriceRange(r); setCurrentPage(1) }}
                  selectedTipo={selectedTipo}
                  onTipoToggle={(v) => { setSelectedTipo((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
                  selectedGenero={selectedGenero}
                  onGeneroChange={(v) => { setSelectedGenero(v === selectedGenero ? '' : v); setCurrentPage(1) }}
                  selectedEstilo={selectedEstilo}
                  onEstiloToggle={(v) => { setSelectedEstilo((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
                  selectedMovimiento={selectedMovimiento}
                  onMovimientoToggle={(v) => { setSelectedMovimiento((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
                  selectedMaterial={selectedMaterial}
                  onMaterialToggle={(v) => { setSelectedMaterial((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
                  selectedColor={selectedColor}
                  onColorToggle={(v) => { setSelectedColor((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
                  selectedTamano={selectedTamano}
                  onTamanoToggle={(v) => { setSelectedTamano((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
                  selectedResistencia={selectedResistencia}
                  onResistenciaToggle={(v) => { setSelectedResistencia((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
                  selectedFunciones={selectedFunciones}
                  onFuncionesToggle={(v) => { setSelectedFunciones((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
                  onClear={handleClear}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Desktop sidebar always visible */}
          <div className="hidden lg:block">
            <CatalogFilters
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1) }}
              selectedBrands={selectedBrands}
              onBrandToggle={(b) => { setSelectedBrands((p) => p.includes(b) ? p.filter((x) => x !== b) : [...p, b]); setCurrentPage(1) }}
              priceRange={priceRange}
              onPriceRangeChange={(r) => { setPriceRange(r); setCurrentPage(1) }}
              selectedTipo={selectedTipo}
              onTipoToggle={(v) => { setSelectedTipo((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
              selectedGenero={selectedGenero}
              onGeneroChange={(v) => { setSelectedGenero(v === selectedGenero ? '' : v); setCurrentPage(1) }}
              selectedEstilo={selectedEstilo}
              onEstiloToggle={(v) => { setSelectedEstilo((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
              selectedMovimiento={selectedMovimiento}
              onMovimientoToggle={(v) => { setSelectedMovimiento((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
              selectedMaterial={selectedMaterial}
              onMaterialToggle={(v) => { setSelectedMaterial((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
              selectedColor={selectedColor}
              onColorToggle={(v) => { setSelectedColor((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
              selectedTamano={selectedTamano}
              onTamanoToggle={(v) => { setSelectedTamano((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
              selectedResistencia={selectedResistencia}
              onResistenciaToggle={(v) => { setSelectedResistencia((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
              selectedFunciones={selectedFunciones}
              onFuncionesToggle={(v) => { setSelectedFunciones((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]); setCurrentPage(1) }}
              onClear={handleClear}
            />
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton count={ITEMS_PER_PAGE} />
            ) : paginated.length > 0 ? (
              <>
                {/* Sort bar */}
                <div className="flex items-center justify-end mb-4">
                  <label className="text-xs text-gray-400 mr-2">Ordenar por:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {paginated.map((product) => (
                    <ProductCard key={product.slug} {...product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm text-carbon hover:bg-gray-100 rounded-lg disabled:opacity-30"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-primary text-white'
                            : 'text-carbon hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm text-carbon hover:bg-gray-100 rounded-lg disabled:opacity-30"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <span className="text-4xl">🔍</span>
                <h3 className="text-lg font-semibold text-carbon mt-4">No encontramos productos</h3>
                <p className="text-sm text-gray-400 mt-1">Probá con otros filtros o términos de búsqueda.</p>
                <button onClick={handleClear} className="mt-4 text-sm text-primary hover:underline">
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
