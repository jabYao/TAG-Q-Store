import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/api'
import ProductCard from '@/components/ProductCard'
import CatalogFilters, { sortOptions } from '@/components/CatalogFilters'
import SEO from '@/components/SEO'
import { ProductGridSkeleton } from '@/components/Skeleton'

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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', 'catalog', selectedCategory, selectedBrands, priceRange, sortBy, selectedGenero, selectedMovimiento, currentPage],
    queryFn: () => fetchProducts({
      category: selectedCategory || undefined,
      gender: selectedGenero || undefined,
      movement: selectedMovimiento[0] || undefined,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 1000000 ? priceRange[1] : undefined,
      sort: sortBy,
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
    }),
    placeholderData: (prev) => prev,
  })

  const products = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta?.last_page ?? 1

  const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedBrands([])
    setPriceRange([0, 1000000])
    setSelectedGenero('')
    setSelectedMovimiento([])
    setCurrentPage(1)
  }

  const hasActiveFilters = selectedCategory || selectedGenero || selectedMovimiento.length > 0 ||
    selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000000

  const categoryName = selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Catálogo'

  return (
    <>
      <SEO
        title={categoryName}
        description={`Explorá nuestro catálogo de relojes${selectedCategory ? ` en ${selectedCategory}` : ''}. Encontrá el estilo perfecto con envío gratis desde $400.000 COP.`}
        url={`/catalogo${selectedCategory ? `?categoria=${selectedCategory}` : ''}`}
      />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-carbon">
            {searchParams.get('categoria')
              ? `Categoría: ${searchParams.get('categoria')}`
              : searchParams.get('busqueda')
                ? `Búsqueda: "${searchParams.get('busqueda')}"`
                : 'Catálogo'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isLoading ? 'Cargando...' : `${meta?.total ?? 0} productos`}
          </p>
        </div>

        {/* Sort + Filter toggle */}
        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            Filtros {hasActiveFilters && `(${hasActiveFilters ? '1' : ''})`}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <CatalogFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={(v) => { setSelectedCategory(v); setCurrentPage(1) }}
            selectedBrands={selectedBrands}
            setSelectedBrands={(v) => { setSelectedBrands(v); setCurrentPage(1) }}
            priceRange={priceRange}
            setPriceRange={(v) => { setPriceRange(v); setCurrentPage(1) }}
            sortBy={sortBy}
            setSortBy={(v) => { setSortBy(v); setCurrentPage(1) }}
            selectedTipo={selectedTipo}
            setSelectedTipo={setSelectedTipo}
            selectedGenero={selectedGenero}
            setSelectedGenero={(v) => { setSelectedGenero(v); setCurrentPage(1) }}
            selectedEstilo={selectedEstilo}
            setSelectedEstilo={setSelectedEstilo}
            selectedMovimiento={selectedMovimiento}
            setSelectedMovimiento={(v) => { setSelectedMovimiento(v); setCurrentPage(1) }}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedTamano={selectedTamano}
            setSelectedTamano={setSelectedTamano}
            selectedResistencia={selectedResistencia}
            setSelectedResistencia={setSelectedResistencia}
            selectedFunciones={selectedFunciones}
            setSelectedFunciones={setSelectedFunciones}
            clearFilters={clearFilters}
            hasActiveFilters={!!hasActiveFilters}
          />
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={ITEMS_PER_PAGE} />
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🔍</span>
              <h3 className="text-lg font-semibold text-carbon mt-4">No encontramos productos</h3>
              <p className="text-sm text-gray-400 mt-1">Probá con otros filtros o términos de búsqueda</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">Limpiar filtros</button>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 ${isFetching ? 'opacity-70 transition-opacity' : ''}`}>
                {products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    originalPrice={product.original_price ?? undefined}
                    imageUrl={product.thumbnail ?? product.primary_image ?? undefined}
                    badge={
                      product.discount_percent && product.discount_percent >= 10
                        ? { label: `-${product.discount_percent}%`, variant: 'gold' as const }
                        : product.is_new
                          ? { label: 'NUEVO', variant: 'primary' as const }
                          : undefined
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ← Anterior
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    let pageNum: number
                    if (totalPages <= 7) {
                      pageNum = i + 1
                    } else if (currentPage <= 4) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i
                    } else {
                      pageNum = currentPage - 3 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 text-sm rounded-lg border transition-all ${
                          pageNum === currentPage
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
