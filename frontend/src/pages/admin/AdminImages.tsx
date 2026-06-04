import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { uploadBannerImage } from '@/api/images'
import { toast } from '@/stores/toastStore'

interface BannerData {
  id: number
  title: string | null
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  image_url: string | null
  type: string
  is_active: boolean
  sort_order: number
  bg_color: string | null
}

export default function AdminImages() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [view, setView] = useState<'banners' | 'gallery'>('banners')
  const [uploadingBannerId, setUploadingBannerId] = useState<number | null>(null)

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data } = await api.get<{ data: BannerData[] }>('/admin/banners')
      return data.data
    },
  })

  const { data: _galleryImages } = useQuery({
    queryKey: ['product-images', 'gallery'],
    queryFn: async () => {
      const { data } = await api.get('/admin/imagenes')
      return data.data ?? []
    },
    enabled: false,
  })

  const [_uploadError, _setUploadError] = useState<string | null>(null)

  const uploadMutation = useMutation({
    mutationFn: async ({ bannerId, file }: { bannerId: number; file: File }) => {
      setUploadError(null)
      const result = await uploadBannerImage(file)
      await api.put(`/admin/banners/${bannerId}`, { image_url: result.url, is_active: true })
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success('✅ Imagen de banner subida correctamente')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Error al subir la imagen'
      setUploadError(msg)
      toast.error('❌ ' + msg)
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (bannerId: number) => {
      await api.put(`/admin/banners/${bannerId}`, { image_url: null, is_active: false })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
  })

  const createBannerMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/admin/banners', {
        title: 'Nuevo banner',
        cta_text: 'VER MÁS →',
        cta_link: '/catalogo',
        type: 'promo',
        is_active: false,
      })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner creado')
    },
  })

  const deleteBannerMutation = useMutation({
    mutationFn: async (bannerId: number) => {
      await api.delete(`/admin/banners/${bannerId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner eliminado')
    },
  })

  const [editTitle, setEditTitle] = useState<Record<number, string>>({})

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadingBannerId) return
    uploadMutation.mutate({ bannerId: uploadingBannerId, file })
    setUploadingBannerId(null)
    e.target.value = ''
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    toast.success(`${files.length} archivo(s) seleccionado(s). Usá la sección de productos para asignarlos.`)
    e.target.value = ''
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-carbon">Imágenes y Banners</h1>
        {view === 'banners' && (
          <button onClick={() => createBannerMutation.mutate()}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            + Nuevo Banner
          </button>
        )}
        {view === 'gallery' && (
          <button onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            + Subir imágenes
          </button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={view === 'banners' ? handleFileSelect : handleGalleryUpload} />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-6">
        <button onClick={() => setView('banners')}
          className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] ${
            view === 'banners' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}>Banners</button>
        <button onClick={() => setView('gallery')}
          className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] ${
            view === 'gallery' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}>Galería de imágenes</button>
      </div>

      {view === 'banners' ? (
        <div className="space-y-4">
          {banners?.map((banner) => (
            <div key={banner.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-48 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0"
                style={banner.bg_color ? { backgroundColor: banner.bg_color } : undefined}>
                {banner.image_url ? (
                  <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-300 text-sm">Sin imagen</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input type="text" value={editTitle[banner.id] ?? banner.title ?? ''}
                  onChange={e => setEditTitle(t => ({ ...t, [banner.id]: e.target.value }))}
                  onBlur={async () => {
                    const title = editTitle[banner.id]
                    if (title !== undefined && title !== banner.title) {
                      await api.put(`/admin/banners/${banner.id}`, { title })
                      queryClient.invalidateQueries({ queryKey: ['banners'] })
                    }
                  }}
                  className="text-sm font-semibold text-carbon bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary focus:outline-none w-full" />
                <p className="text-xs text-gray-400 mt-0.5">Tipo: {banner.type}</p>
                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  banner.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>{banner.is_active ? 'Activo' : 'Inactivo'}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { if (!uploadMutation.isPending) { setUploadingBannerId(banner.id); fileInputRef.current?.click() } }}
                  disabled={uploadMutation.isPending}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    uploadMutation.isPending
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}>
                  {uploadMutation.isPending ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Subiendo...
                    </span>
                  ) : (
                    banner.image_url ? 'Cambiar' : 'Subir imagen'
                  )}
                </button>
                {banner.image_url && (
                  <button onClick={() => removeMutation.mutate(banner.id)}
                    className="px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    Quitar
                  </button>
                )}
                <button onClick={() => { if (window.confirm('¿Eliminar banner?')) deleteBannerMutation.mutate(banner.id) }}
                  className="px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {(!banners || banners.length === 0) && (
            <div className="text-center py-12 text-sm text-gray-400">No hay banners. Creá el primero.</div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-5xl">🖼️</span>
          <h3 className="text-lg font-semibold text-carbon mt-4">Gestión de imágenes de producto</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
            Las imágenes de producto se gestionan desde el formulario de cada producto en la sección Productos.
          </p>
          <a href="/admin/productos" className="mt-4 inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            Ir a Productos
          </a>
        </div>
      )}
    </div>
  )
}
