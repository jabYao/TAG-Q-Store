import { create } from 'zustand'
import type { User } from '@/api/auth'
import { login as apiLogin, logout as apiLogout, fetchUser } from '@/api/auth'

interface AuthState {
  user: User | null
  authenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authenticated: false,
  loading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const res = await apiLogin(email, password)
      set({
        user: res.user,
        authenticated: true,
        loading: false,
      })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Error al iniciar sesión'
      set({ loading: false, error: message })
      throw err
    }
  },

  logout: async () => {
    set({ loading: true })
    await apiLogout()
    set({
      user: null,
      authenticated: false,
      loading: false,
      error: null,
    })
  },

  checkAuth: async () => {
    set({ loading: true })
    try {
      const user = await fetchUser()
      set({
        user,
        authenticated: true,
        loading: false,
      })
    } catch {
      set({
        user: null,
        authenticated: false,
        loading: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))
