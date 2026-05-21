import api from '@/api/client'

export interface ImageUploadResult {
  id?: number
  url: string
  public_id: string
  alt_text?: string | null
  is_primary?: boolean
  sort_order?: number
}

export async function uploadProductImage(
  productId: number,
  file: File,
  isPrimary = false,
  altText?: string,
): Promise<ImageUploadResult> {
  const formData = new FormData()
  formData.append('product_id', String(productId))
  formData.append('image', file)
  formData.append('is_primary', String(isPrimary))
  if (altText) formData.append('alt_text', altText)

  const { data } = await api.post<{ data: ImageUploadResult }>('/admin/imagenes/producto', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function deleteProductImage(id: number): Promise<void> {
  await api.delete(`/admin/imagenes/producto/${id}`)
}

export interface ReorderItem {
  id: number
  sort_order: number
}

export async function reorderImages(items: ReorderItem[]): Promise<void> {
  await api.put('/admin/imagenes/reordenar', { images: items })
}

export async function uploadBannerImage(file: File): Promise<ImageUploadResult> {
  const formData = new FormData()
  formData.append('image', file)

  const { data } = await api.post<{ data: ImageUploadResult }>('/admin/imagenes/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}
