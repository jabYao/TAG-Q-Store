import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type Step = 'request' | 'sent' | 'reset'

export default function ForgotPassword() {
  const { token } = useParams()
  const [step, setStep] = useState<Step>(token ? 'reset' : 'request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Ingresá tu correo electrónico'); return }

    setLoading(true)
    // TODO: connect to backend
    setTimeout(() => {
      setLoading(false)
      setStep('sent')
    }, 1000)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    if (password !== passwordConfirmation) { setError('Las contraseñas no coinciden'); return }

    setLoading(true)
    // TODO: connect to backend
    setTimeout(() => {
      setLoading(false)
      window.location.href = '/login'
    }, 1000)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="text-[28px] font-bold text-primary">
              TAG-Q
            </Link>
          </div>

          {/* Step 1: Request */}
          {step === 'request' && (
            <>
              <h1 className="text-xl font-semibold text-carbon text-center mb-2">
                Recuperar contraseña
              </h1>
              <p className="text-sm text-gray-400 text-center mb-6">
                Te enviaremos un link para restablecer tu contraseña
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm mb-4 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1.5">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@email.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {loading ? 'Enviando...' : 'ENVIAR LINK'}
                </button>

                <p className="text-center text-sm text-gray-400 pt-1">
                  <Link to="/login" className="text-primary hover:underline">
                    ← Volver a iniciar sesión
                  </Link>
                </p>
              </form>
            </>
          )}

          {/* Step 2: Sent */}
          {step === 'sent' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>

              <h1 className="text-xl font-semibold text-carbon mb-2">Revisá tu correo</h1>
              <p className="text-sm text-gray-500 mb-1">
                Te enviamos un link de recuperación a
              </p>
              <p className="text-sm font-medium text-carbon mb-4">{email}</p>
              <p className="text-xs text-gray-400 mb-6">
                El link expira en 60 minutos. Si no lo encontrás, revisá tu carpeta de spam.
              </p>

              <button
                onClick={() => { setStep('request'); setLoading(false) }}
                disabled={loading}
                className="text-sm text-primary hover:underline mb-2 block"
              >
                ¿No lo recibiste? Reenviar link
              </button>

              <Link
                to="/login"
                className="inline-block mt-4 text-sm text-gray-400 hover:text-primary transition-colors"
              >
                ← Volver a iniciar sesión
              </Link>
            </div>
          )}

          {/* Step 3: Reset (from email link) */}
          {step === 'reset' && (
            <>
              <h1 className="text-xl font-semibold text-carbon text-center mb-2">
                Nueva contraseña
              </h1>
              <p className="text-sm text-gray-400 text-center mb-6">
                Elegí una contraseña segura para tu cuenta
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm mb-4 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-carbon mb-1.5">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-carbon transition-colors text-sm"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-carbon mb-1.5">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Repetí tu contraseña"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {loading ? 'Guardando...' : 'GUARDAR CONTRASEÑA'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
