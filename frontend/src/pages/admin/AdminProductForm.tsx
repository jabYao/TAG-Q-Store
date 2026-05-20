import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminProductForm() {
  const navigate = useNavigate()
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [gallery, setGallery] = useState<string[]>([])

  const handleMainImageUpload = () => setMainImage('🖼️')
  const handleGalleryAdd = () => setGallery((prev) => [...prev, '🖼️'])
  const handleGalleryRemove = (i: number) => setGallery((prev) => prev.filter((_, idx) => idx !== i))
  const handleGalleryReorder = (from: number, to: number) => {
    const copy = [...gallery];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setGallery(copy);
  }

  return (
    <div className="p-6 max-w-5xl">
      <button onClick={() => navigate('/admin/productos')} className="text-sm text-primary hover:underline inline-block mb-4">← Volver a productos</button>
      <h1 className="text-2xl font-bold text-carbon mb-6">Nuevo Producto</h1>

      <div className="space-y-6">
        {/* ── Imagen principal + Galería ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Imagen principal */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-3 uppercase tracking-wide">Imagen principal</h2>
            <div
              onClick={handleMainImageUpload}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${mainImage ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
            >
              {mainImage ? (
                <span className="text-6xl">{mainImage}</span>
              ) : (
                <>
                  <span className="text-3xl text-gray-300">📸</span>
                  <p className="text-xs text-gray-400 mt-2">Click para subir</p>
                  <p className="text-[10px] text-gray-300 mt-1">JPG, PNG, WebP · Máx 5MB</p>
                </>
              )}
            </div>
            {mainImage && (
              <button onClick={() => setMainImage(null)} className="mt-2 text-xs text-red-500 hover:underline">Eliminar imagen</button>
            )}
            <p className="text-[10px] text-gray-300 mt-2">Se muestra en catálogo y buscadores</p>
          </div>

          {/* Galería secundaria */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-carbon mb-3 uppercase tracking-wide">Galería de imágenes</h2>
            <p className="text-xs text-gray-400 mb-4">Imágenes secundarias que se muestran en el detalle del producto. Arrastrá para reordenar.</p>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {gallery.map((img, i) => (
                <div key={i} className="group relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary transition-all">
                  <span className="text-3xl">{img}</span>
                  {/* Order badge */}
                  <span className="absolute top-1 left-1 w-5 h-5 bg-primary/80 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleGalleryRemove(i) }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                  >
                    ✕
                  </button>
                  {/* Arrows for reorder */}
                  <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    {i > 0 && (
                      <button onClick={(e) => { e.stopPropagation(); handleGalleryReorder(i, i - 1) }} className="w-5 h-5 bg-black/50 text-white rounded text-xs hover:bg-black/70">←</button>
                    )}
                    {i < gallery.length - 1 && (
                      <button onClick={(e) => { e.stopPropagation(); handleGalleryReorder(i, i + 1) }} className="w-5 h-5 bg-black/50 text-white rounded text-xs hover:bg-black/70 ml-auto">→</button>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={handleGalleryAdd}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 hover:text-gray-400 transition-colors"
              >
                <span className="text-2xl">+</span>
                <span className="text-[10px] mt-0.5">Agregar</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Información básica ── */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-carbon uppercase tracking-wide">Información básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 block mb-1">Nombre del producto</label>
              <input type="text" placeholder="Tommy Hilfiger Chronograph" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 block mb-1">Descripción</label>
              <textarea rows={3} placeholder="Descripción del producto para la ficha..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Categoría</label>
              <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Dama</option>
                <option>Caballero</option>
                <option>Branded</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Precio ($)</label>
              <input type="number" placeholder="250000" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Precio original ($) — para mostrar descuento</label>
              <input type="number" placeholder="350000" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Stock</label>
              <input type="number" placeholder="15" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">SKU / Referencia</label>
              <input type="text" placeholder="TH-01" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Garantía</label>
              <input type="text" placeholder="2 años" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Origen</label>
              <input type="text" placeholder="Importado" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer"><input type="checkbox" className="accent-primary" /> En oferta</label>
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer"><input type="checkbox" className="accent-primary" /> Nuevo</label>
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer"><input type="checkbox" className="accent-primary" /> Más vendido</label>
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer"><input type="checkbox" className="accent-primary" /> Destacado</label>
          </div>
        </div>

        {/* ── Detalles del producto (tab Detalles) ── */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Detalles del producto</h2>
          <p className="text-xs text-gray-400 mb-4">Esta información se muestra en la pestaña "Detalles" de la ficha del producto.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Marca', placeholder: 'Tommy Hilfiger' },
              { label: 'Modelo / Referencia', placeholder: 'TH-CHR-001' },
              { label: 'Género / Unisex', placeholder: 'Masculino' },
              { label: 'Estilo', placeholder: 'Elegante' },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs text-gray-400 block mb-1">{field.label}</label>
                <input type="text" placeholder={field.placeholder} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Especificaciones Técnicas ── */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Especificaciones Técnicas</h2>
          <p className="text-xs text-gray-400 mb-4">Se muestra en la pestaña "Especificaciones Técnicas" de la ficha del producto.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {[
              { label: 'Tipo de reloj', placeholder: 'Analógico' },
              { label: 'Movimiento', placeholder: 'Cuarzo suizo' },
              { label: 'Material de la caja', placeholder: 'Acero inoxidable 316L' },
              { label: 'Tamaño de la caja (mm)', placeholder: '42' },
              { label: 'Grosor (mm)', placeholder: '11' },
              { label: 'Forma de la caja', placeholder: 'Redonda' },
              { label: 'Color de la caja', placeholder: 'Plateado' },
              { label: 'Cristal', placeholder: 'Mineral resistente a rayones' },
              { label: 'Tipo de esfera / Dial', placeholder: 'Analógico con cronógrafo' },
              { label: 'Color de esfera', placeholder: 'Azul' },
              { label: 'Correa / Brazalete', placeholder: 'Brazalete' },
              { label: 'Material de la correa', placeholder: 'Acero inoxidable' },
              { label: 'Color de correa', placeholder: 'Plateado' },
              { label: 'Tipo de cierre', placeholder: 'Desplegable con seguro' },
              { label: 'Resistencia al agua', placeholder: '5 ATM (50m)' },
              { label: 'Funciones', placeholder: 'Cronógrafo, Fecha, GMT' },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs text-gray-400 block mb-1">{field.label}</label>
                <input type="text" placeholder={field.placeholder} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Acciones ── */}
        <div className="flex gap-3 pt-2">
          <button className="bg-primary text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">💾 GUARDAR PRODUCTO</button>
          <button className="px-8 py-3 rounded-lg text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-colors">🗑️ Eliminar</button>
          <button onClick={() => navigate('/admin/productos')} className="px-8 py-3 rounded-lg text-sm text-gray-400 border border-gray-200 hover:border-gray-300 transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  )
}
