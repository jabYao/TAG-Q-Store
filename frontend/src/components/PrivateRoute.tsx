import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import AuthLoading from '@/components/AuthLoading'

/**
 * Redirects to /login if the user is not authenticated.
 * Shows a spinner while auth state is being loaded.
 */
export default function PrivateRoute() {
  const { authenticated, loading } = useAuthStore()

  if (loading) {
    return <AuthLoading />
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
