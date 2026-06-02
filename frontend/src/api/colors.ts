import api from '@/api/client'

export interface ColorData {
  id: number
  name: string
  slug: string
  hex: string
  sort_order: number
}

export interface ColorFormData {
  name: string
  slug?: string
  hex: string
  sort_order?: number
}

/** Public: fetch all colors */
export async function fetchColors(): Promise<ColorData[]> {
  const { data } = await api.get<{ data: ColorData[] }>('/colores')
  return data.data
}

/** Admin: fetch all colors */
export async function fetchAdminColors(): Promise<ColorData[]> {
  const { data } = await api.get<{ data: ColorData[] }>('/admin/colores')
  return data.data
}

/** Admin: create color */
export async function createColor(input: ColorFormData): Promise<ColorData> {
  const res = await api.post<{ data: ColorData }>('/admin/colores', input)
  return res.data.data
}

/** Admin: update color */
export async function updateColor(id: number, input: Partial<ColorFormData>): Promise<ColorData> {
  const res = await api.put<{ data: ColorData }>(`/admin/colores/${id}`, input)
  return res.data.data
}

/** Admin: delete color */
export async function deleteColor(id: number): Promise<void> {
  await api.delete(`/admin/colores/${id}`)
}
