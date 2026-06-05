import { Suspense, useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { AdminPageSkeleton } from './PageSkeleton'
import { useAuthStore } from '@/stores/authStore'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'

const navItems = [
 { label: 'Dashboard', href: '/admin', icon: '📊' },
 { label: 'Productos', href: '/admin/productos', icon: '📦' },
 { label: 'Catálogo', href: '/admin/catalogo', icon: '🏷️' },
 { label: 'Hero', href: '/admin/heroes', icon: '🎯' },
 { label: 'Banners', href: '/admin/imagenes', icon: '🖼️' },
 { label: 'Pedidos', href: '/admin/pedidos', icon: '📋' },
 { label: 'Clientes', href: '/admin/clientes', icon: '👥' },
 { label: 'Mensajes', href: '/admin/mensajes', icon: '✉️' },
 { label: 'Roles y Permisos', href: '/admin/roles', icon: '🔐' },
 { label: 'Configuración', href: '/admin/configuracion', icon: '⚙️' },
 { label: 'Logs', href: '/admin/logs', icon: '📝' },
]

export default function AdminLayout() {
 const navigate = useNavigate()
 const { pathname } = useLocation()
 const { user, logout } = useAuthStore()
 const [showUserMenu, setShowUserMenu] = useState(false)
 const [showNotifications, setShowNotifications] = useState(false)

 const { data: unreadMessages } = useQuery({
 queryKey: ['notifications-preview'],
 queryFn: async () => {
 const { data } = await api.get<{ data: any[] }>('/admin/contacto')
 return data.data.filter((m: any) => !m.is_read).slice(0, 5)
 },
 refetchInterval: 30_000,
 })

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
 className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
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
 <div className="w-7 h-7 bg-primary flex items-center justify-center text-xs font-bold text-white">
 A
 </div>
 <div className="text-sm">
 <p className="text-white text-xs font-medium">Admin</p>
 <p className="text-gray-500 text-[10px]">admin@tagq.co</p>
 </div>
 </div>
 <button
 onClick={() => navigate('/')}
 className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-white hover:bg-gray-700/50 transition-colors"
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
 {/* Notifications */}
 <div className="relative">
 <button
 onClick={() => setShowNotifications(!showNotifications)}
 className="relative p-1 hover:text-carbon transition-colors"
 aria-label="Notificaciones"
 >
 🔔
 {unreadMessages && unreadMessages.length > 0 && (
 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
 {unreadMessages.length > 9 ? '9+' : unreadMessages.length}
 </span>
 )}
 </button>
 {showNotifications && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
 <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
 <div className="p-3 border-b border-gray-100">
 <p className="text-xs font-semibold text-carbon">Notificaciones</p>
 </div>
 <div className="max-h-64 overflow-y-auto">
 {unreadMessages && unreadMessages.length > 0 ? (
 unreadMessages.map((msg: any) => (
 <Link
 key={msg.id}
 to="/admin/mensajes"
 onClick={() => setShowNotifications(false)}
 className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
 >
 <p className="text-xs font-medium text-carbon truncate">{msg.name}</p>
 <p className="text-[11px] text-gray-400 truncate">{msg.subject || 'Mensaje de contacto'}</p>
 </Link>
 ))
 ) : (
 <div className="p-6 text-center text-xs text-gray-400">
 No hay notificaciones nuevas
 </div>
 )}
 </div>
 <Link
 to="/admin/mensajes"
 onClick={() => setShowNotifications(false)}
 className="block p-3 text-center text-xs text-primary font-medium hover:bg-gray-50 border-t border-gray-100"
 >
 Ver todos los mensajes
 </Link>
 </div>
 </>
 )}
 </div>

 {/* User menu */}
 <div className="relative">
 <button
 onClick={() => setShowUserMenu(!showUserMenu)}
 className="flex items-center gap-1.5 p-1 hover:text-carbon transition-colors"
 aria-label="Usuario"
 >
 👤
 </button>
 {showUserMenu && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
 <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
 <div className="px-4 py-3 border-b border-gray-100">
 <p className="text-xs font-medium text-carbon truncate">{user?.name || 'Admin'}</p>
 <p className="text-[10px] text-gray-400 truncate">{user?.email || ''}</p>
 </div>
 <Link
 to="/perfil"
 onClick={() => setShowUserMenu(false)}
 className="block px-4 py-2.5 text-xs text-carbon hover:bg-gray-50"
 >
 Mi Perfil
 </Link>
 <button
 onClick={async () => {
 setShowUserMenu(false)
 await logout()
 navigate('/login')
 }}
 className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-gray-50"
 >
 Cerrar Sesión
 </button>
 </div>
 </>
 )}
 </div>
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
