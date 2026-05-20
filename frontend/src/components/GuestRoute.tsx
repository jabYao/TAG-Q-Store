import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import AuthLoading from '@/components/AuthLoading'

/**
 * Redirects to / if the user is already authenticated.
 * Used for login, register, and forgot-password pages.
 * Shows a spinner while auth state is being loaded.
 */
export default function GuestRoute() {
  const { authenticated, loading } = useAuthStore()

  if (loading) {
    return <AuthLoading />
  }

  if (authenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
