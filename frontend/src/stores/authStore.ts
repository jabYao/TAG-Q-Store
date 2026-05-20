import { create } from 'zustand'

interface User {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: User | null
  authenticated: boolean
  loading: boolean
  setUser: (user: User | null) => void
  setAuthenticated: (value: boolean) => void
  setLoading: (value: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authenticated: false,
  loading: true,
  setUser: (user) => set({ user }),
  setAuthenticated: (authenticated) => set({ authenticated }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, authenticated: false }),
}))
