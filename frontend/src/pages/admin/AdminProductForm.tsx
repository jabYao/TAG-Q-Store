import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProduct, createProduct, updateProduct, fetchBrands, fetchCategories } from '@/api'
import type { ProductFormData, BrandData, CategoryData } from '@/api'
import { toast } from '@/stores/toastStore'

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const { data: product } = useQuery({
    queryKey: ['product', 'edit', id],
    queryFn: () => fetchProduct(id!),
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
  const [specsText, setSpecsText] = useState('{}')
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [gallery, setGallery] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

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
        specs: product.specs ?? {},
      })
      setSpecsText(JSON.stringify(product.specs ?? {}, null, 2))
      if (product.primary_image) {
        setMainImage(product.primary_image)
      }
      if (product.images?.length) {
        setGallery(product.images.filter(i => i.type === 'gallery').map(i => i.url))
      }
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const parsed = JSON.parse(specsText)
      setForm(f => ({ ...f, specs: parsed }))

      const payload = {
        ...form,
        specs: parsed,
      }

      if (isEditing) {
        await updateProduct(Number(id), payload)
        toast.success('Producto actualizado correctamente')
      } else {
        await createProduct(payload)
        toast.success('Producto creado correctamente')
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
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
              <div className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${mainImage ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>
                {mainImage ? (
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
              {gallery.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {gallery.map((img, i) => (
                    <div key={i} className="group relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-1 left-1 w-5 h-5 bg-primary/80 text-white rounded-full text-[10px] flex items-center justify-center font-bold">{i + 1}</span>
                      <button type="button" onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
                  <span className="text-3xl">🖼️</span>
                  <p className="text-xs mt-2">Las imágenes se gestionan desde la sección de imágenes</p>
                </div>
              )}
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

          {/* Attributes */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Atributos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Género</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Seleccionar</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Movimiento</label>
                <select value={form.movement} onChange={e => update('movement', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Seleccionar</option>
                  <option value="Cuarzo">Cuarzo</option>
                  <option value="Automático">Automático</option>
                  <option value="Eco-Drive">Eco-Drive</option>
                  <option value="Smartwatch">Smartwatch</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>
            </div>
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

          {/* Specs JSON */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Especificaciones técnicas (JSON)</h2>
            <p className="text-xs text-gray-400 mb-2">Ej: {"{ \"material_caja\": \"Acero\", \"resistencia_agua\": \"5 ATM\" }"}</p>
            <textarea
              value={specsText}
              onChange={e => setSpecsText(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
