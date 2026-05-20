import api from '@/api/client'

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  roles: string[]
  created_at: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface AuthError {
  message: string
  errors?: Record<string, string[]>
}

/**
 * Get CSRF cookie before making stateful requests.
 * Required for Sanctum SPA authentication.
 */
export async function getCsrfCookie(): Promise<void> {
  await api.get('/sanctum/csrf-cookie')
}

/**
 * Log in with email and password.
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  await getCsrfCookie()
  const { data } = await api.post<LoginResponse>('/login', { email, password })
  return data
}

/**
 * Log out current user.
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/logout')
  } catch {
    // Ignore errors on logout — session may already be invalid
  }
}

/**
 * Fetch current authenticated user.
 */
export async function fetchUser(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/user')
  return data.user
}
