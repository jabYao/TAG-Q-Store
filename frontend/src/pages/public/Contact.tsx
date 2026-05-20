import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Completá los campos obligatorios')
      return
    }

    // TODO: connect to backend
    setSent(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-carbon">Contacto</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-carbon mb-2">Contacto</h1>
          <p className="text-sm text-gray-400 mb-8">Escribinos y te respondemos a la brevedad</p>

          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <span className="text-4xl">✅</span>
              <h2 className="text-lg font-semibold text-green-800 mt-4">Mensaje enviado</h2>
              <p className="text-sm text-green-600 mt-2">Te responderemos a la brevedad. Gracias por contactarnos.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm border border-red-100">{error}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1">Nombre completo *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors" placeholder="Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1">Correo electrónico *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors" placeholder="juan@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-carbon mb-1">Teléfono</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors" placeholder="+57 300 000 0000" />
              </div>

              <div>
                <label className="block text-xs font-medium text-carbon mb-1">Asunto</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
                  <option value="">Seleccioná un asunto</option>
                  <option value="consulta">Consulta general</option>
                  <option value="pedido">Consulta sobre mi pedido</option>
                  <option value="cambio">Cambio o devolución</option>
                  <option value="garantía">Garantía</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-carbon mb-1">Mensaje *</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors resize-none" placeholder="Escribí tu mensaje..." />
              </div>

              <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors">
                ENVIAR MENSAJE
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-carbon mb-4">Información de contacto</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📧</span>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <a href="mailto:contacto@tagq.co" className="text-primary hover:underline">contacto@tagq.co</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📞</span>
                  <div>
                    <p className="text-xs text-gray-400">WhatsApp</p>
                    <a href="https://wa.me/573000000000" className="text-primary hover:underline">+57 300 000 0000</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🕐</span>
                  <div>
                    <p className="text-xs text-gray-400">Horarios</p>
                    <p className="text-carbon">Lun - Vie: 9:00 - 18:00</p>
                    <p className="text-carbon">Sáb: 9:00 - 13:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="text-xs text-gray-400">Ubicación</p>
                    <p className="text-carbon">Bogotá, Colombia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-carbon mb-2">Seguinos</h3>
              <div className="flex gap-3 text-xl">
                <span className="cursor-pointer hover:scale-110 transition-transform">📸</span>
                <span className="cursor-pointer hover:scale-110 transition-transform">💙</span>
                <span className="cursor-pointer hover:scale-110 transition-transform">🎵</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
