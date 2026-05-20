import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

/**
 * Redirects to / if the user is already authenticated.
 * Used for login, register, and forgot-password pages.
 * Shows nothing while auth state is being loaded.
 */
export default function GuestRoute() {
  const { authenticated, loading } = useAuthStore()

  if (loading) {
    return null
  }

  if (authenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
