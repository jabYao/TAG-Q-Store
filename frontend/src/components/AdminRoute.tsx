import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import AuthLoading from '@/components/AuthLoading'

/**
 * Redirects to / if the user does not have admin or operador role.
 * Shows a spinner while auth state is being loaded.
 */
export default function AdminRoute() {
  const { user, authenticated, loading } = useAuthStore()

  if (loading) {
    return <AuthLoading />
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
