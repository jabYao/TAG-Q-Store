import { useState } from 'react'
import { Link } from 'react-router-dom'

const menuItems = [
  { label: 'Perfil', href: '/perfil', icon: '👤', active: true },
  { label: 'Mis Pedidos', href: '/mis-pedidos', icon: '📦', active: false },
  { label: 'Direcciones', href: '/direcciones', icon: '📍', active: false },
]

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('Juan Pérez')
  const [email, setEmail] = useState('juan@email.com')
  const [phone, setPhone] = useState('+57 300 000 0000')

  const recentOrders = [
    { id: 'TAG-2026-001234', date: '19/05/2026', total: 320000, status: 'Enviado', statusIcon: '📦' },
    { id: 'TAG-2026-001233', date: '15/05/2026', total: 185000, status: 'Entregado', statusIcon: '✅' },
  ]

  const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/perfil" className="hover:text-primary">Mi Cuenta</Link>
        <span className="mx-1">/</span>
        <span className="text-carbon">Perfil</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="md:sticky md:top-6 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <hr className="my-3 border-gray-100" />
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-100 transition-colors w-full text-left">
              <span>🚪</span> Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Profile info */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-carbon mb-4">Mi Perfil</h2>

            {editing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setEditing(false)
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-2.5 rounded-lg text-sm text-gray-400 hover:text-carbon border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-carbon">{name}</p>
                      <p className="text-sm text-gray-400">{email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Nombre</p>
                      <p className="text-carbon font-medium">{name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Email</p>
                      <p className="text-carbon font-medium">{email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Teléfono</p>
                      <p className="text-carbon font-medium">{phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Miembro desde</p>
                      <p className="text-carbon font-medium">Enero 2026</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    ✏️ Editar información
                  </button>
                  <button className="px-5 py-2.5 rounded-lg text-sm text-gray-500 border border-gray-200 hover:border-gray-300 transition-colors">
                    🔑 Cambiar contraseña
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Recent orders */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-carbon">Últimos pedidos</h2>
              <Link to="/mis-pedidos" className="text-sm text-primary hover:underline">
                Ver todos →
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/mis-pedidos/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{order.statusIcon}</span>
                    <div>
                      <p className="text-sm font-medium text-carbon">{order.id}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                    <p className="text-xs text-gray-400">{order.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
