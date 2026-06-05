import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { forgotPassword, resetPassword } from '@/api/auth'

type Step = 'request' | 'sent' | 'reset'

export default function ForgotPassword() {
 const { token: tokenParam } = useParams()
 const [searchParams] = useSearchParams()
 const emailParam = searchParams.get('email') || ''

 const [step, setStep] = useState<Step>(tokenParam ? 'reset' : 'request')
 const [email, setEmail] = useState(emailParam)
 const [token] = useState(tokenParam || '')
 const [password, setPassword] = useState('')
 const [passwordConfirmation, setPasswordConfirmation] = useState('')
 const [showPassword, setShowPassword] = useState(false)
 const [error, setError] = useState('')
 const [success, setSuccess] = useState('')
 const [loading, setLoading] = useState(false)
 const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

 const handleRequest = async (e: React.FormEvent) => {
 e.preventDefault()
 setError('')
 setFieldErrors({})
 setSuccess('')

 if (!email.trim()) { setError('Ingresá tu correo electrónico'); return }

 setLoading(true)
 try {
 const res = await forgotPassword(email)
 setSuccess(res.message)
 setStep('sent')
 } catch (err: unknown) {
 const msg =
 (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
 'Error al enviar el link'
 const errors = (err as { response?: { data?: { errors?: Record<string, string[]> } } })
 ?.response?.data?.errors
 if (errors?.email) {
 setFieldErrors({ email: errors.email[0] })
 } else {
 setError(msg)
 }
 } finally {
 setLoading(false)
 }
 }

 const handleReset = async (e: React.FormEvent) => {
 e.preventDefault()
 setError('')
 setFieldErrors({})

 if (!email) { setError('Falta el correo electrónico'); return }
 if (!token) { setError('Token de recuperación inválido'); return }
 if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
 if (password !== passwordConfirmation) { setError('Las contraseñas no coinciden'); return }

 setLoading(true)
 try {
 const res = await resetPassword({ email, token, password, password_confirmation: passwordConfirmation })
 setSuccess(res.message)
 setTimeout(() => {
 window.location.href = '/login'
 }, 2000)
 } catch (err: unknown) {
 const msg =
 (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
 'Error al restablecer la contraseña'
 const errors = (err as { response?: { data?: { errors?: Record<string, string[]> } } })
 ?.response?.data?.errors
 if (errors) {
 setFieldErrors(Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0]])))
 } else {
 setError(msg)
 }
 } finally {
 setLoading(false)
 }
 }

 return (
 <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
 <div className="w-full max-w-[440px]">
 <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 md:p-10">
 {/* Logo */}
 <div className="text-center mb-8">
 <Link to="/" className="text-[28px] font-bold text-primary">
 TAG-Q
 </Link>
 </div>

 {/* Success message */}
 {success && (
 <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm mb-4">
 {success}
 </div>
 )}

 {/* Global error */}
 {error && (
 <div className="bg-red-50 text-red-600 px-4 py-2.5 text-sm mb-4 border border-red-100">
 {error}
 </div>
 )}

 {/* Step 1: Request */}
 {step === 'request' && !success && (
 <>
 <h1 className="text-xl font-semibold text-carbon text-center mb-2">
 Recuperar contraseña
 </h1>
 <p className="text-sm text-gray-400 text-center mb-6">
 Te enviaremos un link para restablecer tu contraseña
 </p>

 <form onSubmit={handleRequest} className="space-y-4" noValidate>
 <div>
 <label htmlFor="reset-email" className="block text-xs font-medium text-carbon mb-1.5">
 Correo electrónico
 </label>
 <input
 id="reset-email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="juan@email.com"
 autoComplete="email"
 className={`w-full px-4 py-2.5 bg-gray-50 border text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors ${
 fieldErrors.email ? 'border-red-400' : 'border-gray-200'
 }`}
 />
 {fieldErrors.email && (
 <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
 )}
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full bg-primary text-white py-3 font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
 >
 {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />}
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
 <div className="w-16 h-16 bg-green-50 flex items-center justify-center mx-auto mb-4">
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
 onClick={() => { setStep('request'); setLoading(false); setSuccess('') }}
 disabled={loading}
 className="text-sm text-primary hover:underline mb-2 block mx-auto"
 >
 ¿No lo recibiste? Enviar de nuevo
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
 {step === 'reset' && !success && (
 <>
 <h1 className="text-xl font-semibold text-carbon text-center mb-2">
 Nueva contraseña
 </h1>
 <p className="text-sm text-gray-400 text-center mb-6">
 Elegí una contraseña segura para tu cuenta
 </p>

 <form onSubmit={handleReset} className="space-y-4" noValidate>
 <div>
 <label htmlFor="new-password" className="block text-xs font-medium text-carbon mb-1.5">
 Nueva contraseña
 </label>
 <div className="relative">
 <input
 id="new-password"
 type={showPassword ? 'text' : 'password'}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="Mínimo 8 caracteres"
 autoComplete="new-password"
 className={`w-full px-4 py-2.5 bg-gray-50 border text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors pr-10 ${
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

 <div>
 <label htmlFor="confirm-password" className="block text-xs font-medium text-carbon mb-1.5">
 Confirmar contraseña
 </label>
 <input
 id="confirm-password"
 type="password"
 value={passwordConfirmation}
 onChange={(e) => setPasswordConfirmation(e.target.value)}
 placeholder="Repetí tu contraseña"
 autoComplete="new-password"
 className={`w-full px-4 py-2.5 bg-gray-50 border text-sm text-carbon placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors ${
 fieldErrors.password ? 'border-red-400' : 'border-gray-200'
 }`}
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full bg-primary text-white py-3 font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
 >
 {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />}
 {loading ? 'Guardando...' : 'GUARDAR CONTRASEÑA'}
 </button>
 </form>
 </>
 )}

 {/* Success after reset - redirecting */}
 {step === 'reset' && success && (
 <div className="text-center py-4">
 <div className="w-16 h-16 bg-green-50 flex items-center justify-center mx-auto mb-4">
 <span className="text-3xl">✅</span>
 </div>
 <p className="text-sm text-gray-500">Redirigiendo al login...</p>
 </div>
 )}
 </div>
 </div>
 </div>
 )
}
