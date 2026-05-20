import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCartStore } from '@/stores/cartStore'
import { toast } from '@/stores/toastStore'

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-primary text-white text-xs text-center py-1.5 px-4 flex items-center justify-center gap-4">
        <span>🚚 ENVÍO GRATIS EN PEDIDOS SOBRE $400.000</span>
        <span className="hidden md:inline">💳 PAGO SEGURO</span>
        <span className="hidden md:inline">📞 24/7 SOPORTE</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Row 1: Search + Logo + Icons */}
          <div className="flex items-center justify-between h-[72px]">
            {/* Mobile menu toggle */}
            <button className="md:hidden text-carbon p-2" aria-label="Menú">
              ☰
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
              <Link to="/login" className="text-gray-400 hover:text-primary transition-colors text-xl" aria-label="Mi cuenta">
                👤
              </Link>
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

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-2">TAG-Q</h3>
              <p className="text-gold text-xs mb-4">Relojería premium colombiana</p>
              <p className="text-gray-400 text-xs">© 2026 TAG-Q. Todos los derechos reservados.</p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-sm font-semibold mb-3">COMPRÁ</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/catalogo" className="hover:text-gold transition-colors">Catálogo</Link></li>
                <li><Link to="/categoria/dama" className="hover:text-gold transition-colors">Dama</Link></li>
                <li><Link to="/categoria/caballero" className="hover:text-gold transition-colors">Caballero</Link></li>
                <li><Link to="/categoria/branded" className="hover:text-gold transition-colors">Branded</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-sm font-semibold mb-3">AYUDA</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
                <li><Link to="/politicas" className="hover:text-gold transition-colors">Políticas de envío</Link></li>
                <li><Link to="/contacto" className="hover:text-gold transition-colors">Contacto</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-semibold mb-3">NEWSLETTER</h4>
              <p className="text-xs text-gray-400 mb-3">
                Suscribite para recibir novedades y ofertas exclusivas.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success('¡Gracias por suscribirte!', 'Vas a recibir nuestras novedades y ofertas.')
                }}
                className="flex flex-col gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-gold text-carbon px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#e0c456] transition-colors"
                >
                  SUSCRIBIRME
                </button>
              </form>
              <div className="flex gap-3 text-lg mt-4">
                <span className="cursor-pointer hover:text-gold transition-colors">📸</span>
                <span className="cursor-pointer hover:text-gold transition-colors">💙</span>
                <span className="cursor-pointer hover:text-gold transition-colors">🎵</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
