import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { uploadProductImage, deleteProductImage } from '@/api/images'
import { fetchProductForEdit, createProduct, updateProduct, fetchBrands, fetchCategories, fetchAdminFilters, fetchAdminColors } from '@/api'
import type { ProductFormData } from '@/api'
import { toast } from '@/stores/toastStore'

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const { data: product } = useQuery({
    queryKey: ['product', 'edit', id],
    queryFn: () => fetchProductForEdit(Number(id!)),
    enabled: isEditing,
  })

  const { data: brands } = useQuery({
    queryKey: ['brands', 'all'],
    queryFn: () => fetchBrands(),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => fetchCategories(),
  })

  const { data: filterGroups } = useQuery({
    queryKey: ['admin-filters'],
    queryFn: fetchAdminFilters,
  })

  const { data: allColors } = useQuery({
    queryKey: ['admin-colors'],
    queryFn: fetchAdminColors,
  })

  const [form, setForm] = useState<ProductFormData>({
    name: '',
    sku: '',
    price: 0,
    brand_id: null,
    category_id: null,
    description: '',
    short_description: '',
    original_price: null,
    stock: 0,
    min_stock: 5,
    gender: '',
    movement: '',
    is_active: true,
    is_featured: false,
    is_new: false,
    specs: {},
  })
  const [filterValueIds, setFilterValueIds] = useState<number[]>([])
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([])

  // Specs that are NOT in the mandatory filter list (fill free-form)
  const defaultSpecFields = [
    'estilo', 'material_caja', 'correa_material',
    'tamano_caja', 'resistencia_agua', 'forma_caja',
    'grosor', 'origen', 'cristal', 'garantia',
    'tipo_cierre', 'tipo_esfera', 'modelo_referencia',
    'color_correa', 'color_bisel', 'color_esfera', 'color_caja',
  ]

  const [specEntries, setSpecEntries] = useState<{ key: string; value: string }[]>([])

  const specsToEntries = (specs: Record<string, any> | null): { key: string; value: string }[] =>
    specs ? Object.entries(specs).map(([key, value]) => ({ key, value: String(value) })) : []

  const entriesToSpecs = (entries: { key: string; value: string }[]): Record<string, string> => {
    const obj: Record<string, string> = {}
    entries.forEach(e => { if (e.key.trim()) obj[e.key.trim()] = e.value })
    return obj
  }

  const addSpec = () => setSpecEntries(prev => [...prev, { key: '', value: '' }])
  const removeSpec = (i: number) => setSpecEntries(prev => prev.filter((_, idx) => idx !== i))
  const loadDefaultSpecs = () => setSpecEntries(defaultSpecFields.map(k => ({ key: k, value: '' })))
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [gallery, setGallery] = useState<{ id: number | null; url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [uploadingMainImage, setUploadingMainImage] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [saving, _setSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        price: product.price,
        brand_id: product.brand?.id ?? null,
        category_id: product.category?.id ?? null,
        description: product.description ?? '',
        short_description: product.short_description ?? '',
        original_price: product.original_price,
        stock: product.stock,
        min_stock: product.min_stock ?? 5,
        gender: product.gender ?? '',
        movement: product.movement ?? '',
        is_active: product.is_active,
        is_featured: product.is_featured,
        is_new: product.is_new,
        specs: (product.specs ?? {}) as Record<string, string>,
      })
      // Set filter value IDs from loaded product
      if (product.filter_values?.length) {
        setFilterValueIds(product.filter_values.map((fv: any) => fv.id))
      }
      // Set color IDs from loaded product
      if (product.colors?.length) {
        setSelectedColorIds(product.colors.map((c: any) => c.id))
      }
      setSpecEntries(specsToEntries(product.specs))
      if (product.primary_image) {
        setMainImage(product.primary_image)
      }
      if (product.images?.length) {
        const seen = new Set<string>()
        const items = product.images
          .filter(i => i.type === 'gallery')
          .filter(i => { const dup = seen.has(i.url); seen.add(i.url); return !dup })
          .map(i => ({ id: i.id, url: i.url }))
        setGallery(items)
      }
    }
  }, [product])

  const toggleFilterValue = (valueId: number) => {
    setFilterValueIds(prev =>
      prev.includes(valueId)
        ? prev.filter(id => id !== valueId)
        : [...prev, valueId]
    )
  }

  const toggleColor = (colorId: number) => {
    setSelectedColorIds(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const specs = entriesToSpecs(specEntries)
      setForm(f => ({ ...f, specs }))

      const payload: Partial<ProductFormData> & Record<string, any> = {
        ...form,
        specs,
        filter_value_ids: filterValueIds,
        color_ids: selectedColorIds,
      }
      if (mainImage) {
        payload.primary_image = mainImage
      }
      // Al crear: enviar URLs de galería acumuladas
      // Al editar: las imágenes ya se guardaron en BD al subirse (con product_id)
      if (!isEditing && gallery.length > 0) {
        payload.gallery = gallery.map(img => img.url)
      }

      if (isEditing) {
        await updateProduct(Number(id), payload as ProductFormData)
        toast.success('Producto actualizado correctamente')
      } else {
        await createProduct(payload as ProductFormData)
        toast.success('Producto creado correctamente')
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['product', 'edit', id] })
      navigate('/admin/productos')
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error('Error en el formato JSON de especificaciones')
      } else {
        toast.error(err?.response?.data?.message || 'Error al guardar el producto')
      }
    }
  }

  const update = (field: keyof ProductFormData, value: any) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  return (
    <div className="p-6 max-w-5xl">
      <button onClick={() => navigate('/admin/productos')} className="text-sm text-primary hover:underline inline-block mb-4">
        ← Volver a productos
      </button>
      <h1 className="text-2xl font-bold text-carbon mb-6">
        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Image section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-carbon mb-3 uppercase tracking-wide">Imagen principal</h2>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploadingMainImage(true)
                  try {
                    const result = await uploadProductImage(file, {
                      productId: isEditing ? Number(id) : undefined,
                    })
                    setMainImage(result.url)
                    toast.success('✅ Imagen subida')
                  } catch (err: any) {
                    const msg = err?.response?.data?.message || err?.message || 'Error al subir imagen'
                    toast.error('❌ ' + msg)
                  } finally {
                    setUploadingMainImage(false)
                    e.target.value = ''
                  }
                }} />
              <div onClick={() => !uploadingMainImage && fileInputRef.current?.click()}
                className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  uploadingMainImage ? 'opacity-60 cursor-wait' : 'hover:border-gray-300'
                } ${mainImage ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50'}`}>
                {uploadingMainImage ? (
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-400 mt-2">Subiendo...</p>
                  </div>
                ) : mainImage ? (
                  <img src={mainImage} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <span className="text-3xl text-gray-300">📸</span>
                    <p className="text-xs text-gray-400 mt-2">Click para subir</p>
                    <p className="text-[10px] text-gray-300 mt-1">JPG, PNG, WebP · Máx 5MB</p>
                  </>
                )}
              </div>
              {mainImage && (
                <button type="button" onClick={() => setMainImage(null)} className="mt-2 text-xs text-red-500 hover:underline">
                  Eliminar imagen
                </button>
              )}
              <p className="text-[10px] text-gray-300 mt-2">Se muestra en catálogo y buscadores</p>
            </div>

            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-carbon mb-3 uppercase tracking-wide">Galería de imágenes</h2>
              <p className="text-xs text-gray-400 mb-4">Imágenes secundarias que se muestran en el detalle del producto.</p>

              <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || [])
                  if (!files.length) return
                  setUploadingGallery(true)
                  try {
                    const urls: { id: number | null; url: string }[] = []
                    for (const file of files) {
                      const result = await uploadProductImage(file, {
                        productId: isEditing ? Number(id) : undefined,
                      })
                      urls.push({ id: result.id ?? null, url: result.url })
                    }
                    setGallery(prev => [...prev, ...urls])
                    toast.success(`✅ ${files.length} imagen(es) subida(s)`)
                  } catch (err: any) {
                    const msg = err?.response?.data?.message || err?.message || 'Error al subir imágenes'
                    toast.error('❌ ' + msg)
                  } finally {
                    setUploadingGallery(false)
                    e.target.value = ''
                  }
                }} />

              {gallery.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {gallery.map((img, i) => (
                    <div key={img.id ?? `new-${i}`} className="group relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-1 left-1 w-5 h-5 bg-primary/80 text-white rounded-full text-[10px] flex items-center justify-center font-bold">{i + 1}</span>
                      <button type="button" onClick={async () => {
                        if (img.id) {
                          try {
                            await deleteProductImage(img.id)
                          } catch { /* ignora error silenciosamente */ }
                        }
                        setGallery(prev => prev.filter((_, idx) => idx !== i))
                      }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
                  <span className="text-3xl">🖼️</span>
                  <p className="text-xs mt-2">Hacé click en "Subir imágenes" para agregar fotos del producto.</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button type="button" onClick={() => galleryInputRef.current?.click()}
                  disabled={uploadingGallery}
                  className="text-xs px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {uploadingGallery ? 'Subiendo...' : '+ Subir imágenes'}
                </button>
                {gallery.length > 0 && (
                  <span className="text-xs text-gray-400">{gallery.length} imagen(es)</span>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Información básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nombre *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">SKU *</label>
                <input type="text" value={form.sku} onChange={e => update('sku', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Marca</label>
                <select value={form.brand_id ?? ''} onChange={e => update('brand_id', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Sin marca</option>
                  {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Categoría</label>
                <select value={form.category_id ?? ''} onChange={e => update('category_id', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Sin categoría</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Precio y stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Precio (COP) *</label>
                <input type="number" value={form.price} onChange={e => update('price', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" required min={0} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Precio original</label>
                <input type="number" value={form.original_price ?? ''} onChange={e => update('original_price', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" min={0} placeholder="Para mostrar descuento" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Stock</label>
                <input type="number" value={form.stock} onChange={e => update('stock', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" min={0} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Stock mínimo</label>
                <input type="number" value={form.min_stock} onChange={e => update('min_stock', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" min={0} />
              </div>
            </div>
          </div>

          {/* Filter values from DB (replaces hardcoded gender/movement selects) */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Filtros de catálogo</h2>
            <p className="text-xs text-gray-400 mb-4">Seleccioná los valores que aplican a este producto. Los clientes podrán filtrar por estas opciones en la tienda.</p>

            {filterGroups && filterGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterGroups.map((group) => (
                  <div key={group.id}>
                    <h3 className="text-xs font-semibold text-carbon mb-2">{group.name}</h3>
                    <div className="space-y-1">
                      {group.values.map((val) => (
                        <label key={val.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-carbon transition-colors">
                          {group.display_type === 'radio' ? (
                            <input
                              type="radio"
                              name={`filter-group-${group.id}`}
                              checked={filterValueIds.includes(val.id)}
                              onChange={() => setFilterValueIds(prev => {
                                // Radio: uncheck all other values in this group
                                const otherIds = group.values.map(v => v.id)
                                return [...prev.filter(id => !otherIds.includes(id)), val.id]
                              })}
                              className="accent-primary"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={filterValueIds.includes(val.id)}
                              onChange={() => toggleFilterValue(val.id)}
                              className="accent-primary w-4 h-4 rounded border-gray-300"
                            />
                          )}
                          {val.value}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No hay filtros configurados. <a href="/admin/catalogo" className="text-primary hover:underline">Crear filtros</a></p>
            )}
          </div>

          {/* Colors */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Colores</h2>
            <p className="text-xs text-gray-400 mb-4">Seleccioná los colores que aplican a este producto (caja, esfera, correa). Aparecerán como swatches en el catálogo.</p>
            {allColors && allColors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => {
                  const isSelected = selectedColorIds.includes(color.id)
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => toggleColor(color.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full inline-block border border-gray-200 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No hay colores configurados. <a href="/admin/catalogo" className="text-primary hover:underline">Gestionar colores</a></p>
            )}
          </div>

          {/* Flags */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Estado</h2>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => update('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-carbon">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => update('is_featured', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-carbon">Destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_new} onChange={e => update('is_new', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-carbon">Nuevo</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Descripción</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Descripción corta</label>
                <input type="text" value={form.short_description} onChange={e => update('short_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" maxLength={500} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Descripción completa</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>

          {/* Specs (non-filterable technical details) */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-carbon uppercase tracking-wide">Especificaciones técnicas</h2>
              <button type="button" onClick={loadDefaultSpecs}
                className="text-xs text-primary hover:underline">
                Cargar valores por defecto
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Detalles técnicos que se muestran en la ficha del producto (no son filtrables).</p>

            <div className="space-y-2">
              {specEntries.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={entry.key}
                    onChange={e => {
                      const updated = [...specEntries]
                      updated[i] = { ...updated[i], key: e.target.value }
                      setSpecEntries(updated)
                    }}
                    placeholder="Clave"
                    className="w-2/5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                  <input type="text" value={entry.value}
                    onChange={e => {
                      const updated = [...specEntries]
                      updated[i] = { ...updated[i], value: e.target.value }
                      setSpecEntries(updated)
                    }}
                    placeholder="Valor"
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                  <button type="button" onClick={() => removeSpec(i)}
                    className="text-gray-300 hover:text-red-500 transition-colors text-sm px-1">✕</button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addSpec}
              className="mt-3 text-xs text-primary hover:text-primary-dark transition-colors">
              + Agregar campo
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/admin/productos')}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
              {saving ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
