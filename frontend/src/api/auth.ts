import api from '@/api/client'
import axios from 'axios'

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
 *
 * Uses a separate axios instance without /api prefix because
 * Sanctum registers this route outside the api prefix.
 */
export async function getCsrfCookie(): Promise<void> {
  await axios.get('/sanctum/csrf-cookie', {
    baseURL: '',
    withCredentials: true,
  })
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
 * Register a new user.
 */
export async function register(data: {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
}): Promise<LoginResponse> {
  await getCsrfCookie()
  const res = await api.post<LoginResponse>('/register', data)
  return res.data
}

/**
 * Send password reset link.
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/forgot-password', { email })
  return data
}

/**
 * Reset password with token.
 */
export async function resetPassword(data: {
  email: string
  token: string
  password: string
  password_confirmation: string
}): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>('/reset-password', data)
  return res.data
}

/**
 * Fetch current authenticated user.
 */
export async function fetchUser(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/user')
  return data.user
}
