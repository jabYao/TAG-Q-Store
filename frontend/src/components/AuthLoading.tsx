/**
 * Full-page loading spinner shown while auth state is being determined.
 */
export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Cargando...</p>
      </div>
    </div>
  )
}
