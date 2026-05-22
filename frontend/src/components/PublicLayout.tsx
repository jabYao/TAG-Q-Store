import { Suspense, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { PageSkeleton } from '@/components/PageSkeleton'
import Footer from '@/components/Footer'
import { fetchTopBarSettings } from '@/api'
import type { TopBarMessage } from '@/api/settings'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/catalogo' },
  { label: 'Categorías', href: '/categorias' },
  { label: 'Dama', href: '/categoria/dama' },
  { label: 'Caballero', href: '/categoria/caballero' },
  { label: 'Branded', href: '/categoria/branded' },

]

export default function PublicLayout() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const cartCount = useCartStore((s) => s.count)
  const { user, authenticated, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [topBarMessages, setTopBarMessages] = useState<TopBarMessage[]>([
    { icon: '🚚', text: 'ENVÍO GRATIS EN PEDIDOS SOBRE $400.000' },
    { icon: '💳', text: 'PAGO SEGURO' },
    { icon: '📞', text: '24/7 SOPORTE' },
  ])
  const [currentMessage, setCurrentMessage] = useState(0)

  // Fetch top bar settings
  useEffect(() => {
    fetchTopBarSettings()
      .then((settings) => {
        if (settings.messages?.length > 0) {
          setTopBarMessages(settings.messages)
        }
      })
      .catch(() => {
        // Keep defaults
      })
  }, [])

  // Cycle messages every 4 seconds
  useEffect(() => {
    if (topBarMessages.length <= 1) return
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % topBarMessages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [topBarMessages.length])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar — carrusel de mensajes */}
      <div className="bg-primary text-white text-xs text-center py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative h-5">
          {topBarMessages.map((msg, i) => (
            <span
              key={i}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                i === currentMessage
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2'
              }`}
            >
              {msg.icon} {msg.text}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Row 1: Search + Logo + Icons */}
          <div className="flex items-center justify-between h-[72px]">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-carbon p-2 hover:text-primary transition-colors"
              aria-label="Menú"
            >
              {showMobileMenu ? '✕' : '☰'}
            </button>

            {/* Search (desktop) */}
            <div className="hidden md:flex items-center gap-2 w-full max-w-xs">
              <form onSubmit={handleSearch} className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscá tu reloj ideal..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                />
              </form>
            </div>

            {/* Logo */}
            <Link to="/" className="text-[28px] font-bold text-primary tracking-tight">
              TAG-Q
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-4">
              {authenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1.5"
                    aria-label="Mi cuenta"
                  >
                    <span className="text-xl">👤</span>
                    <span className="hidden md:inline text-xs font-medium text-carbon max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to="/perfil"
                        className="block px-4 py-2 text-sm text-carbon hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        to="/mis-pedidos"
                        className="block px-4 py-2 text-sm text-carbon hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mis Pedidos
                      </Link>
                      {user.roles.includes('admin') && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-primary hover:bg-gray-50 font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Panel Admin
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={async () => {
                          setShowUserMenu(false)
                          await logout()
                          navigate('/')
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-gray-400 hover:text-primary transition-colors text-xl" aria-label="Iniciar sesión">
                  👤
                </Link>
              )}
              <Link to="/carrito" className="text-primary hover:text-primary-dark transition-colors text-xl relative" aria-label="Carrito">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-carbon text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: Navigation (desktop) */}
        <nav className="hidden md:block border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <ul className="flex items-center gap-1 h-12">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="px-3 py-2 text-sm text-carbon hover:text-primary transition-colors rounded-md hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 md:hidden shadow-2xl animate-slide-in">
            <div className="flex flex-col h-full">
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 h-[72px] border-b border-gray-200">
                <Link
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="text-[28px] font-bold text-primary tracking-tight"
                >
                  TAG-Q
                </Link>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-carbon p-2 hover:text-primary transition-colors"
                  aria-label="Cerrar menú"
                >
                  ✕
                </button>
              </div>

              {/* Drawer search */}
              <div className="px-4 pt-4 pb-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (searchQuery.trim()) {
                      navigate(`/busqueda?q=${encodeURIComponent(searchQuery.trim())}`)
                      setShowMobileMenu(false)
                    }
                  }}
                  className="relative"
                >
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscá tu reloj ideal..."
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                  />
                </form>
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto px-4 py-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2 px-3">
                  Navegación
                </p>
                <ul className="space-y-0.5">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        onClick={() => setShowMobileMenu(false)}
                        className="block px-3 py-2.5 text-sm text-carbon hover:text-primary hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {authenticated && user?.roles.includes('admin') && (
                  <>
                    <hr className="my-4 border-gray-100" />
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2 px-3">
                      Admin
                    </p>
                    <Link
                      to="/admin"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-primary hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    >
                      📊 Panel Admin
                    </Link>
                  </>
                )}
              </nav>

              {/* Drawer footer */}
              <div className="border-t border-gray-200 px-4 py-4">
                {authenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span className="text-lg">👤</span>
                      <span className="text-sm font-medium text-carbon truncate">{user.name}</span>
                    </div>
                    <Link
                      to="/perfil"
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-3 py-2 text-sm text-carbon hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/mis-pedidos"
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-3 py-2 text-sm text-carbon hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={async () => {
                        setShowMobileMenu(false)
                        await logout()
                        navigate('/')
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="block w-full text-center bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/registro"
                      onClick={() => setShowMobileMenu(false)}
                      className="block w-full text-center border border-primary text-primary px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
