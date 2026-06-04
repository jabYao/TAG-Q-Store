import { useState, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, fetchFilterOptions, fetchColors } from '@/api'
import { fetchBrands } from '@/api/brands'
import ProductCard from '@/components/ProductCard'
import CatalogFilters, { sortOptions, type FilterGroupOption } from '@/components/CatalogFilters'
import Breadcrumbs from '@/components/Breadcrumbs'
import SEO from '@/components/SEO'
import { ProductGridSkeleton } from '@/components/Skeleton'

const ITEMS_PER_PAGE = 12

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const { slug } = useParams<{ slug?: string }>()
  const categoriaParam = searchParams.get('categoria') || ''
  const marcaParam = searchParams.get('marca') || ''
  const [selectedCategory, setSelectedCategory] = useState(slug || categoriaParam || '')
  const searchQuery = searchParams.get('busqueda') || ''
  const [selectedBrand, setSelectedBrand] = useState<string>(marcaParam || '')
  const [onSale, setOnSale] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [sortBy, setSortBy] = useState('recent')
  const [selectedFilterIds, setSelectedFilterIds] = useState<number[]>([])
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Sync selectedCategory and selectedBrand from URL params whenever they change
  useEffect(() => {
    const categoryFromUrl = slug || categoriaParam || ''
    setSelectedCategory(categoryFromUrl)
    setSelectedBrand(marcaParam || '')
    setCurrentPage(1)
  }, [slug, categoriaParam, marcaParam])

  // Detect mobile for filter behavior
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Fetch filter groups & colors from the API
  const { data: filterGroups } = useQuery({
    queryKey: ['filter-options'],
    queryFn: fetchFilterOptions,
    staleTime: 300_000,
  })

  const { data: allColors } = useQuery({
    queryKey: ['colors'],
    queryFn: fetchColors,
    staleTime: 300_000,
  })

  const { data: brands } = useQuery({
    queryKey: ['brands', 'catalog'],
    queryFn: () => fetchBrands(),
    staleTime: 300_000,
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', 'catalog', searchQuery, selectedCategory, selectedBrand, onSale, priceRange, sortBy, selectedFilterIds, selectedColorIds, currentPage],
    queryFn: () => fetchProducts({
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      on_sale: onSale || undefined,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 1000000 ? priceRange[1] : undefined,
      sort: sortBy,
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
      filter_values: selectedFilterIds.length > 0 ? selectedFilterIds.join(',') : undefined,
      colors: selectedColorIds.length > 0 ? selectedColorIds.join(',') : undefined,
    }),
    placeholderData: (prev) => prev,
  })

  const products = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta?.last_page ?? 1

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedBrand('')
    setOnSale(false)
    setPriceRange([0, 1000000])
    setSelectedFilterIds([])
    setSelectedColorIds([])
    setCurrentPage(1)
  }

  const hasActiveFilters = selectedCategory || selectedFilterIds.length > 0 ||
    selectedColorIds.length > 0 || !!selectedBrand || onSale || priceRange[0] > 0 || priceRange[1] < 1000000

  const categoryName = selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Catálogo'

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: selectedCategory || 'Catálogo' },
  ]

  // Toggle a filter value by ID. For radio groups, replace the selection.
  const handleToggleFilter = (valueId: number, group: FilterGroupOption) => {
    setCurrentPage(1)
    setSelectedFilterIds(prev => {
      if (group.display_type === 'radio') {
        const groupIds = group.values.map(v => v.id)
        return [...prev.filter(id => !groupIds.includes(id)), valueId]
      } else {
        return prev.includes(valueId)
          ? prev.filter(id => id !== valueId)
          : [...prev, valueId]
      }
    })
  }

  const handleToggleColor = (colorId: number) => {
    setCurrentPage(1)
    setSelectedColorIds(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    )
  }

  return (
    <>
      <SEO
        title={categoryName}
        description={`Explorá nuestro catálogo de relojes${selectedCategory ? ` en ${selectedCategory}` : ''}. Encontrá el estilo perfecto con envío gratis desde $400.000 COP.`}
        url={slug ? `/categoria/${slug}` : selectedCategory ? `/catalogo?categoria=${selectedCategory}` : '/catalogo'}
      />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-carbon">
              {slug
                ? `Categoría: ${selectedCategory}`
                : searchQuery
                  ? `Búsqueda: "${searchQuery}"`
                  : 'Catálogo'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {isLoading ? 'Cargando...' : `${meta?.total ?? 0} productos`}
            </p>
          </div>

          {/* Sort + Filter toggle (mobile only) */}
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
            {/* Mobile-only filter button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all lg:hidden ${
                hasActiveFilters
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              Filtros {hasActiveFilters && `(${selectedFilterIds.length})`}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters — always visible on desktop, overlay on mobile */}
          <div className={`
            ${isMobile ? (showMobileFilters ? 'fixed inset-0 z-50 bg-black/40 flex' : 'hidden') : 'block w-[280px]'}
          `}>
            {/* Mobile backdrop click to close */}
            {isMobile && (
              <div className="flex-1" onClick={() => setShowMobileFilters(false)} />
            )}
            <div className={`
              ${isMobile
                ? 'w-[300px] max-w-[85vw] bg-white p-6 overflow-y-auto h-full shadow-xl'
                : 'w-[280px] shrink-0'
              }
            `}>
              {filterGroups && (
                <CatalogFilters
                  groups={filterGroups}
                  colors={allColors ?? []}
                  brands={brands ?? []}
                  selectedIds={selectedFilterIds}
                  selectedColorIds={selectedColorIds}
                  selectedBrand={selectedBrand}
                  onSale={onSale}
                  onToggle={handleToggleFilter}
                  onToggleColor={handleToggleColor}
                  onToggleBrand={(slug) => { setCurrentPage(1); setSelectedBrand(prev => prev === slug ? '' : slug) }}
                  onToggleOnSale={() => { setCurrentPage(1); setOnSale(prev => !prev) }}
                  onClear={clearFilters}
                  hasActiveFilters={!!hasActiveFilters}
                  onClose={() => setShowMobileFilters(false)}
                />
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
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
                      productId={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      originalPrice={product.original_price ?? undefined}
                      imageUrl={product.thumbnail ?? product.primary_image ?? undefined}
                      reference={product.sku}
                      isOutOfStock={product.is_out_of_stock}
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
