import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '@/api'
import { uploadBrandLogo } from '@/api/images'
import type { BrandFormData } from '@/api'
import { toast } from '@/stores/toastStore'

export default function BrandsTab() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<BrandFormData>({ name: '' })
  const [isCreating, setIsCreating] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const { data: brands } = useQuery({
    queryKey: ['brands', 'admin'],
    queryFn: () => fetchBrands(),
  })

  const createMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      setIsCreating(false)
      setEditForm({ name: '' })
      toast.success('Marca creada')
    },
    onError: () => toast.error('Error al crear marca'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BrandFormData }) => updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      setEditingId(null)
      setEditForm({ name: '' })
      toast.success('Marca actualizada')
    },
    onError: () => toast.error('Error al actualizar marca'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Marca eliminada')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Error al eliminar'),
  })

  const handleSave = (id?: number) => {
    if (!editForm.name.trim()) { toast.error('El nombre es obligatorio'); return }
    if (id) updateMutation.mutate({ id, data: editForm })
    else createMutation.mutate(editForm)
  }

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true)
    try {
      const result = await uploadBrandLogo(file)
      setEditForm(f => ({ ...f, logo_url: result.url }))
      if (editingId) {
        await updateBrand(editingId, { logo_url: result.url })
        queryClient.invalidateQueries({ queryKey: ['brands'] })
        toast.success('✅ Logo subido')
      }
    } catch (err: any) {
      toast.error('❌ Error al subir logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  return (
    <div>
      <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) await handleLogoUpload(file)
          e.target.value = ''
        }} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-carbon">Marcas</h2>
          <p className="text-sm text-gray-400">{brands?.length ?? 0} marcas</p>
        </div>
        {!isCreating && (
          <button onClick={() => { setIsCreating(true); setEditForm({ name: '' }) }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            + Nueva Marca
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isCreating && (
          <div className="bg-white p-5 rounded-xl border-2 border-primary shadow-sm flex flex-col gap-3">
            {/* Logo upload */}
            <div onClick={() => logoInputRef.current?.click()}
              className="w-20 h-20 mx-auto rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors overflow-hidden">
              {editForm.logo_url ? (
                <img src={editForm.logo_url} alt="" className="w-full h-full object-contain" />
              ) : uploadingLogo ? (
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-2xl text-gray-300">+</span>
              )}
            </div>
            <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre de la marca" autoFocus
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="text" value={editForm.slug ?? ''} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="Slug (opcional)"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <textarea value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción" rows={2}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="flex gap-2">
              <button onClick={() => handleSave()}
                className="flex-1 bg-primary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark">Guardar</button>
              <button onClick={() => setIsCreating(false)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
            </div>
          </div>
        )}

        {brands?.map((brand) => (
          editingId === brand.id ? (
            <div key={brand.id} className="bg-white p-5 rounded-xl border-2 border-primary shadow-sm flex flex-col gap-3">
              {/* Logo upload en edición */}
              <div onClick={() => logoInputRef.current?.click()}
                className="w-20 h-20 mx-auto rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors overflow-hidden">
                {editForm.logo_url ? (
                  <img src={editForm.logo_url} alt="" className="w-full h-full object-contain" />
                ) : uploadingLogo ? (
                  <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-2xl text-gray-300">+</span>
                )}
              </div>
              <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} autoFocus
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" value={editForm.slug ?? ''} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="Slug"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <textarea value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <div className="flex gap-2">
                <button onClick={() => handleSave(brand.id)}
                  className="flex-1 bg-primary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark">Actualizar</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={brand.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-gray-200 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0 overflow-hidden p-1"
                onClick={() => { setEditingId(brand.id); setEditForm({ name: brand.name, slug: brand.slug, description: brand.description ?? '', logo_url: brand.logo_url ?? undefined }) }}>
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-300 text-2xl">🏷️</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-carbon truncate">{brand.name}</h3>
                <p className="text-xs text-gray-400">{brand.products_count ?? 0} productos</p>
                <p className="text-[10px] text-gray-300 truncate">/{brand.slug}</p>
              </div>
              <div className="flex gap-2 text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(brand.id); setEditForm({ name: brand.name, slug: brand.slug, description: brand.description ?? '', logo_url: brand.logo_url ?? undefined }) }}
                  className="text-primary hover:underline">Editar</button>
                <button onClick={() => { if (window.confirm(`¿Eliminar "${brand.name}"?`)) deleteMutation.mutate(brand.id) }}
                  className="text-red-500 hover:underline">Eliminar</button>
              </div>
            </div>
          )
        ))}

        {!isCreating && editingId === null && (
          <button onClick={() => { setIsCreating(true); setEditForm({ name: '' }) }}
            className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex items-center justify-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors h-full min-h-[100px]">
            <span className="text-xl">+</span>
            <span className="text-sm font-medium">Nueva marca</span>
          </button>
        )}
      </div>
    </div>
  )
}
