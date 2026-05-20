import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Address {
  id: number
  label: string
  name: string
  street: string
  city: string
  region: string
  phone: string
  default: boolean
}

const initialAddresses: Address[] = [
  { id: 1, label: 'Casa', name: 'Juan Pérez', street: 'Calle 123 #45-67', city: 'Bogotá', region: 'Cundinamarca', phone: '+57 300 000 0000', default: true },
  { id: 2, label: 'Oficina', name: 'Juan Pérez', street: 'Cra 98 #76-54, Apto 302', city: 'Medellín', region: 'Antioquia', phone: '+57 310 000 0000', default: false },
]

export default function Addresses() {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ label: '', name: '', street: '', city: '', region: '', phone: '' })

  const openNew = () => {
    setEditingId(null)
    setForm({ label: '', name: '', street: '', city: '', region: '', phone: '' })
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    setEditingId(addr.id)
    setForm({ label: addr.label, name: addr.name, street: addr.street, city: addr.city, region: addr.region, phone: addr.phone })
    setShowForm(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)))
    } else {
      setAddresses((prev) => [...prev, { id: Date.now(), ...form, default: prev.length === 0 }])
    }
    setShowForm(false)
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSetDefault = (id: number) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, default: a.id === id })))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/perfil" className="hover:text-primary">Mi Cuenta</Link>
        <span className="mx-1">/</span>
        <span className="text-carbon">Direcciones</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="md:sticky md:top-6 space-y-1">
            <Link to="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              <span>👤</span> Perfil
            </Link>
            <Link to="/mis-pedidos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              <span>📦</span> Mis Pedidos
            </Link>
            <Link to="/direcciones" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-primary text-white transition-colors">
              <span>📍</span> Direcciones
            </Link>
            <hr className="my-3 border-gray-100" />
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-100 transition-colors w-full text-left">
              <span>🚪</span> Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-carbon">Mis Direcciones</h1>
            <button onClick={openNew} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
              + Agregar nueva
            </button>
          </div>

          {addresses.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <span className="text-4xl">📍</span>
              <p className="text-sm text-gray-400 mt-3 mb-4">No tenés direcciones guardadas</p>
              <button onClick={openNew} className="text-sm text-primary hover:underline">+ Agregá tu primera dirección</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 relative">
                  {addr.default && (
                    <span className="absolute top-3 right-3 text-[10px] bg-gold text-carbon px-1.5 py-0.5 rounded font-medium">
                      PREDETERMINADA
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-carbon mb-2">{addr.label}</h3>
                  <div className="text-sm text-gray-500 space-y-0.5 mb-4">
                    <p>{addr.name}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.region}</p>
                    <p>{addr.phone}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <button onClick={() => openEdit(addr)} className="text-primary hover:underline">Editar</button>
                    {!addr.default && (
                      <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:underline">Eliminar</button>
                    )}
                    {!addr.default && (
                      <button onClick={() => handleSetDefault(addr.id)} className="text-gray-400 hover:text-carbon">Establecer como principal</button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add card */}
              <button onClick={openNew} className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex items-center justify-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors h-full min-h-[160px]">
                <span className="text-xl">+</span>
                <span className="text-sm font-medium">Agregar nueva dirección</span>
              </button>
            </div>
          )}

          {/* Form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black/30" onClick={() => setShowForm(false)} />
              <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-carbon">
                    {editingId ? 'Editar dirección' : 'Agregar dirección'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-2xl text-gray-400">&times;</button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 block mb-1">Nombre de la dirección</label>
                      <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Ej: Casa, Oficina" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 block mb-1">Nombre y apellido</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 block mb-1">Dirección</label>
                      <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Calle, Carrera, #" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Ciudad</label>
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Departamento</label>
                      <input type="text" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 block mb-1">Teléfono</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
                      {editingId ? 'Guardar cambios' : 'Agregar dirección'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg text-sm text-gray-400 hover:text-carbon border border-gray-200 transition-colors">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
