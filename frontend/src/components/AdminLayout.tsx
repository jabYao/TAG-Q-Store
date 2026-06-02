import { Suspense } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { AdminPageSkeleton } from './PageSkeleton'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Productos', href: '/admin/productos', icon: '📦' },
  { label: 'Catálogo', href: '/admin/catalogo', icon: '🏷️' },
  { label: 'Hero', href: '/admin/heroes', icon: '🎯' },
  { label: 'Banners', href: '/admin/imagenes', icon: '🖼️' },
  { label: 'Pedidos', href: '/admin/pedidos', icon: '📋' },
  { label: 'Clientes', href: '/admin/clientes', icon: '👥' },
  { label: 'Roles y Permisos', href: '/admin/roles', icon: '🔐' },
  { label: 'Configuración', href: '/admin/configuracion', icon: '⚙️' },
  { label: 'Logs', href: '/admin/logs', icon: '📝' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-carbon text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-700">
          <Link to="/admin" className="text-xl font-bold text-gold tracking-tight">
            TAG-Q Admin
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <div className="text-sm">
              <p className="text-white text-xs font-medium">Admin</p>
              <p className="text-gray-500 text-[10px]">admin@tagq.co</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            ← Volver a tienda
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h2 className="text-sm text-gray-400">
            {navItems.find((i) => pathname === i.href || (i.href !== '/admin' && pathname.startsWith(i.href)))?.label || 'Admin'}
          </h2>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>🔔</span>
            <span>👤</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<AdminPageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
