import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

/**
 * Redirects to /login if the user is not authenticated.
 * Shows nothing while auth state is being loaded.
 */
export default function PrivateRoute() {
  const { authenticated, loading } = useAuthStore()

  if (loading) {
    return null
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
