import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

type FieldErrors = {
  email?: string
  password?: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const getFieldError = (err: unknown): FieldErrors => {
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

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setFieldErrors(getFieldError(err))
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center text-carbon mb-8">Iniciar Sesión</h1>

      {(error || fieldErrors.email) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {fieldErrors.email || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-carbon mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              fieldErrors.email ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-carbon mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              fieldErrors.password ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <div className="text-right">
          <Link to="/recuperacion" className="text-xs text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>

        <p className="text-center text-sm text-gray-400">
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="text-primary hover:underline">
            Registrate aquí
          </Link>
        </p>
      </form>
    </div>
  )
}
