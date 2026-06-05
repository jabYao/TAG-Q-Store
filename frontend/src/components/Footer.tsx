import { Link } from 'react-router-dom'
import { toast } from '@/stores/toastStore'
import { useState } from 'react'

export default function Footer() {
 const [email, setEmail] = useState('')

 return (
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
 <li><Link to="/categoria/ofertas" className="hover:text-gold transition-colors">Ofertas</Link></li>
 </ul>
 </div>

 {/* Help */}
 <div>
 <h4 className="text-sm font-semibold mb-3">AYUDA</h4>
 <ul className="space-y-2 text-xs text-gray-400">
 <li><Link to="/politicas" className="hover:text-gold transition-colors">Políticas de envío</Link></li>
 <li><Link to="/contacto" className="hover:text-gold transition-colors">Contacto</Link></li>
 <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
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
 setEmail('')
 }}
 className="flex flex-col gap-2"
 >
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 placeholder="tu@email.com"
 className="w-full px-3 py-2 bg-white/10 border border-white/20 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
 />
 <button
 type="submit"
 className="w-full bg-gold text-carbon px-3 py-2 text-xs font-semibold hover:bg-gold-light transition-colors"
 >
 SUSCRIBIRME
 </button>
 </form>
 <div className="flex gap-3 text-lg mt-4">
 <a href="#" className="cursor-pointer hover:text-gold transition-colors" aria-label="Instagram">📸</a>
 <a href="#" className="cursor-pointer hover:text-gold transition-colors" aria-label="Facebook">💙</a>
 <a href="#" className="cursor-pointer hover:text-gold transition-colors" aria-label="TikTok">🎵</a>
 </div>
 </div>
 </div>
 </div>
 </footer>
 )
}
