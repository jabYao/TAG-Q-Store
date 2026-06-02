import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUser, updateProfile, logout } from '@/api/auth'
import Breadcrumbs from '@/components/Breadcrumbs'
import { toast } from '@/stores/toastStore'

const menuItems = [
  { label: 'Perfil', href: '/perfil', icon: '👤', active: true },
  { label: 'Mis Pedidos', href: '/mis-pedidos', icon: '📦', active: false },
  { label: 'Direcciones', href: '/direcciones', icon: '📍', active: false },
]

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

export default function Profile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Sync form fields when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone ?? '')
    }
  }, [user])

  const updateMutation = useMutation({
    mutationFn: (input: { name: string; email: string; phone: string }) =>
      updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user)
      setEditing(false)
      toast.success('Perfil actualizado', 'Tus datos se guardaron correctamente.')
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'No se pudieron guardar los cambios.'
      toast.error('Error al actualizar', msg)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error('Completá los campos obligatorios')
      return
    }
    updateMutation.mutate({ name: name.trim(), email: email.trim(), phone: phone.trim() })
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="text-center py-20">
          <p className="text-gray-400">No se pudo cargar la información del perfil.</p>
          <Link to="/login" className="text-primary text-sm hover:underline mt-2 inline-block">
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Breadcrumb */}
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Mi Cuenta', href: '/perfil' },
        { label: 'Perfil' },
      ]} />

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
            <button
              onClick={async () => {
                await logout()
                queryClient.clear()
                navigate('/login')
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-100 transition-colors w-full text-left"
            >
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    disabled={updateMutation.isPending}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {updateMutation.isPending && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {updateMutation.isPending ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      setName(user.name)
                      setEmail(user.email)
                      setPhone(user.phone ?? '')
                    }}
                    disabled={updateMutation.isPending}
                    className="px-6 py-2.5 rounded-lg text-sm text-gray-400 hover:text-carbon border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-50"
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
                      <p className="font-semibold text-carbon">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Nombre</p>
                      <p className="text-carbon font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Email</p>
                      <p className="text-carbon font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Teléfono</p>
                      <p className="text-carbon font-medium">{user.phone ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Miembro desde</p>
                      <p className="text-carbon font-medium">
                        {new Date(user.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}
                      </p>
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
          <RecentOrders />
        </div>
      </div>
    </div>
  )
}

function RecentOrders() {
  // Static placeholder — will be replaced when orders page is implemented
  const placeholderOrders = [
    { id: 'TAG-2026-001234', date: '19/05/2026', total: 320000, status: 'Enviado', statusIcon: '📦' },
    { id: 'TAG-2026-001233', date: '15/05/2026', total: 185000, status: 'Entregado', statusIcon: '✅' },
  ]

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-carbon">Últimos pedidos</h2>
        <Link to="/mis-pedidos" className="text-sm text-primary hover:underline">
          Ver todos →
        </Link>
      </div>

      <div className="space-y-3">
        {placeholderOrders.map((order) => (
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
  )
}
