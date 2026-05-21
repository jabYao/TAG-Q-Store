import api from '@/api/client'
import type { CategoryData } from '@/api/products'

export interface CategoryFilters {
  parents_only?: boolean
}

export async function fetchCategories(filters: CategoryFilters = {}): Promise<CategoryData[]> {
  const params = new URLSearchParams()
  if (filters.parents_only) params.set('parents_only', '1')
  const { data } = await api.get<{ data: CategoryData[] }>(`/categorias?${params.toString()}`)
  return data.data
}

export async function fetchCategory(slug: string): Promise<CategoryData> {
  const { data } = await api.get<{ data: CategoryData }>(`/categorias/${slug}`)
  return data.data
}

export interface CategoryFormData {
  name: string
  slug?: string
  description?: string
  image_url?: string
  parent_id?: number | null
  is_active?: boolean
  sort_order?: number
}

export async function createCategory(data: CategoryFormData): Promise<CategoryData> {
  const res = await api.post<{ data: CategoryData }>('/admin/categorias', data)
  return res.data.data
}

export async function updateCategory(id: number, data: Partial<CategoryFormData>): Promise<CategoryData> {
  const res = await api.put<{ data: CategoryData }>(`/admin/categorias/${id}`, data)
  return res.data.data
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/admin/categorias/${id}`)
}
