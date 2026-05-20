import { useState } from 'react'

interface Banner {
  id: number
  name: string
  image: string | null
  active: boolean
  position: string
}

export default function AdminImages() {
  const [view, setView] = useState<'banners' | 'gallery'>('banners')
  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, name: 'Hero Principal (Home)', image: '🖼️', active: true, position: 'hero' },
    { id: 2, name: 'Banner Secundario (Home)', image: null, active: false, position: 'secondary' },
    { id: 3, name: 'Banner Colecciones', image: null, active: false, position: 'collections' },
  ])
  const [gallery, setGallery] = useState<string[]>(Array(8).fill('🖼️'))
  const [dragging, setDragging] = useState(false)

  const handleBannerUpload = (id: number) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, image: '🖼️', active: true } : b))
  }

  const handleBannerRemove = (id: number) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, image: null, active: false } : b))
  }

  const handleGalleryAdd = () => {
    setGallery((prev) => [...prev, '🖼️'])
  }

  const handleGalleryRemove = (i: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-carbon">Imágenes y Banners</h1>
        {view === 'gallery' && (
          <button onClick={handleGalleryAdd} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            + Subir imágenes
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-6">
        <button
          onClick={() => setView('banners')}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${view === 'banners' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-carbon'}`}
        >
          Banners
        </button>
        <button
          onClick={() => setView('gallery')}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${view === 'gallery' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-carbon'}`}
        >
          Galería
        </button>
      </div>

      {/* Banners */}
      {view === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400">💡 Los banners se muestran en el Home según su posición.</span>
          </div>

          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image preview */}
                <div
                  onClick={() => !banner.image && handleBannerUpload(banner.id)}
                  className={`w-full md:w-56 h-32 md:h-40 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                    banner.image
                      ? 'bg-gray-100'
                      : 'bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 m-3 rounded-xl'
                  }`}
                >
                  {banner.image ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span className="text-5xl">{banner.image}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl text-gray-300">📸</span>
                      <p className="text-xs text-gray-400 mt-1">Click para subir</p>
                      <p className="text-[10px] text-gray-300">1920x520px · WebP</p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-carbon">{banner.name}</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Posición: {banner.position}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${banner.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {banner.active ? 'Activo' : 'Sin imagen'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    {banner.image ? (
                      <>
                        <button onClick={() => handleBannerUpload(banner.id)} className="text-xs text-primary hover:underline">Reemplazar</button>
                        <button onClick={() => handleBannerRemove(banner.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
                      </>
                    ) : (
                      <button onClick={() => handleBannerUpload(banner.id)} className="text-xs text-primary hover:underline">Subir imagen</button>
                    )}
                    <label className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto cursor-pointer">
                      <input type="checkbox" checked={banner.active} onChange={() => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, active: !b.active } : b))} className="accent-primary w-3 h-3" />
                      Mostrar en home
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add new banner */}
          <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors flex items-center justify-center gap-2">
            <span>+</span> Agregar nuevo banner
          </button>
        </div>
      )}

      {/* Gallery */}
      {view === 'gallery' && (
        <>
          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleGalleryAdd() }}
            className={`border-2 border-dashed rounded-xl py-8 flex flex-col items-center justify-center mb-6 transition-colors cursor-pointer ${dragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
          >
            <span className="text-3xl text-gray-300 mb-2">📸</span>
            <p className="text-sm text-gray-400 font-medium">Arrastrá imágenes aquí</p>
            <p className="text-xs text-gray-300 mt-1">o hace click para seleccionar archivos</p>
            <p className="text-[10px] text-gray-300 mt-2">JPG, PNG, WebP · Máx 5MB cada una</p>
          </div>

          {/* Grid */}
          {gallery.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl">🖼️</span>
              <p className="text-sm text-gray-400 mt-3">No hay imágenes en la galería</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {gallery.map((img, i) => (
                <div key={i} className="group relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <span className="text-4xl">{img}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <button onClick={() => handleGalleryRemove(i)} className="w-7 h-7 bg-red-500 text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110">✕</button>
                  </div>
                  <span className="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Eliminar
                  </span>
                </div>
              ))}
              <button onClick={handleGalleryAdd} className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 hover:text-gray-400 transition-colors">
                <span className="text-2xl">+</span>
                <span className="text-[10px] mt-1">Agregar</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
