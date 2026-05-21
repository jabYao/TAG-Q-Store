import api from '@/api/client'
import type { BrandData } from '@/api/products'

export async function fetchBrands(search?: string): Promise<BrandData[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  const { data } = await api.get<{ data: BrandData[] }>(`/marcas${params}`)
  return data.data
}

export interface BrandFormData {
  name: string
  slug?: string
  description?: string
  logo_url?: string
  is_active?: boolean
  sort_order?: number
}

export async function createBrand(data: BrandFormData): Promise<BrandData> {
  const res = await api.post<{ data: BrandData }>('/admin/marcas', data)
  return res.data.data
}

export async function updateBrand(id: number, data: Partial<BrandFormData>): Promise<BrandData> {
  const res = await api.put<{ data: BrandData }>(`/admin/marcas/${id}`, data)
  return res.data.data
}

export async function deleteBrand(id: number): Promise<void> {
  await api.delete(`/admin/marcas/${id}`)
}
