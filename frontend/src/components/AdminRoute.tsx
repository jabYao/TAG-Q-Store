import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

/**
 * Redirects to / if the user does not have admin or operador role.
 * Shows nothing while auth state is being loaded.
 */
export default function AdminRoute() {
  const { user, authenticated, loading } = useAuthStore()

  if (loading) {
    return null
  }

  if (!authenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const allowed = user.roles.some((r) => r === 'admin' || r === 'operador')
  if (!allowed) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
