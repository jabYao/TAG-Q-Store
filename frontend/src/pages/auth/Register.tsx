import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

type FieldErrors = {
  name?: string
  email?: string
  phone?: string
  password?: string
}

export default function Register() {
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptOffers, setAcceptOffers] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const getFieldErrors = (err: unknown): FieldErrors => {
    const errors = (err as { response?: { data?: { errors?: Record<string, string[]> } } })
      ?.response?.data?.errors
    if (!errors) return {}
    return Object.fromEntries(
      Object.entries(errors).map(([key, msgs]) => [key, msgs[0]]),
    ) as FieldErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setFieldErrors({})

    if (!acceptTerms) {
      setFieldErrors({ name: 'Debés aceptar los Términos y Condiciones' })
      return
    }

    try {
      await register({
        name,
        email,
        phone,
        password,
        password_confirmation: passwordConfirmation,
      })
      navigate('/')
    } catch (err) {
      setFieldErrors(getFieldErrors(err))
    }
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
            <h1 className="text-xl font-semibold text-carbon mt-4">Crear tu cuenta</h1>
            <p className="text-sm text-gray-400 mt-1">Completá tus datos para registrarte</p>
          </div>

          {(error || fieldErrors.name) && (
            <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm mb-4 border border-red-100">
              {fieldErrors.name || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-carbon mb-1.5">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                autoComplete="name"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors ${
                  fieldErrors.name ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-carbon mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com"
                autoComplete="email"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors ${
                  fieldErrors.email ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-carbon mb-1.5">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 000 0000"
                autoComplete="tel"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors ${
                  fieldErrors.phone ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-carbon mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors pr-10 ${
                    fieldErrors.password ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-carbon transition-colors text-sm"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-xs font-medium text-carbon mb-1.5">
                Confirmar contraseña
              </label>
              <input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Repetí tu contraseña"
                autoComplete="new-password"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors ${
                  fieldErrors.password ? 'border-red-400' : 'border-gray-200'
                }`}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 accent-primary w-4 h-4 rounded border-gray-300"
                />
                <span className="text-xs text-gray-500">
                  Acepto los{' '}
                  <a href="/politicas" className="text-primary hover:underline">
                    Términos y Condiciones
                  </a>{' '}
                  y la Política de Privacidad
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptOffers}
                  onChange={(e) => setAcceptOffers(e.target.checked)}
                  className="mt-0.5 accent-primary w-4 h-4 rounded border-gray-300"
                />
                <span className="text-xs text-gray-500">
                  Quiero recibir ofertas y novedades
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Creando cuenta...' : 'CREAR CUENTA'}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-400 pt-2">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
