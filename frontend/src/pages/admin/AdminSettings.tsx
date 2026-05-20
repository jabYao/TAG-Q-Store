import { useState } from 'react'

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-carbon mb-6">Configuración de Tienda</h1>

      {saved && <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-lg text-sm mb-4 border border-green-200">✅ Configuración guardada exitosamente</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">General</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nombre de tienda</label>
              <input type="text" defaultValue="TAG-Q | Relojería Premium" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email de contacto</label>
              <input type="email" defaultValue="contacto@tagq.co" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">WhatsApp</label>
              <input type="tel" defaultValue="+57 300 000 0000" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Envío</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Envío gratis desde ($)</label>
              <input type="number" defaultValue={400000} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Tarifa de envío estándar ($)</label>
              <input type="number" defaultValue={15000} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-carbon mb-4 uppercase tracking-wide">Pagos — Wompi</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Modo</label>
              <select defaultValue="sandbox" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="sandbox">Sandbox (pruebas)</option>
                <option value="production">Producción</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Public Key</label>
              <input type="text" defaultValue="pub_test_***" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Webhook Secret</label>
              <input type="password" defaultValue="whsec_***" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Habilitar contraentrega</label>
              <input type="checkbox" defaultChecked className="accent-primary" />
              <label className="text-xs text-gray-400">Recargo ($)</label>
              <input type="number" defaultValue={10000} className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">💾 GUARDAR CAMBIOS</button>
      </form>
    </div>
  )
}
