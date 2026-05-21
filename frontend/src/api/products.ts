import api from '@/api/client'

export interface ProductSpecs {
  [key: string]: string | undefined
}

export interface BrandData {
  id: number
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  sort_order: number
  products_count?: number
}

export interface CategoryData {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  parent?: CategoryData | null
  children?: CategoryData[]
  products_count?: number
}

export interface ProductImageData {
  id: number
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
  type: string
}

export interface ProductData {
  id: number
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  original_price: number | null
  discount_percent: number | null
  sku: string
  stock: number
  is_out_of_stock: boolean
  gender: string | null
  movement: string | null
  is_featured: boolean
  is_new: boolean
  specs: ProductSpecs | null
  brand: BrandData | null
  category: CategoryData | null
  primary_image: string | null
  images: ProductImageData[]
  published_at: string
  created_at: string
}

export interface ProductListResponse {
  data: ProductData[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ProductFilters {
  category?: string
  brand?: string
  gender?: string
  movement?: string
  min_price?: number
  max_price?: number
  search?: string
  featured?: boolean
  sort?: string
  page?: number
  per_page?: number
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value))
    }
  })
  const { data } = await api.get<ProductListResponse>(`/productos?${params.toString()}`)
  return data
}

export async function fetchProduct(slug: string): Promise<ProductData> {
  const { data } = await api.get<{ data: ProductData }>(`/productos/${slug}`)
  return data.data
}

export interface ProductFormData {
  brand_id?: number | null
  category_id?: number | null
  name: string
  slug?: string
  description?: string
  short_description?: string
  price: number
  original_price?: number | null
  sku: string
  stock?: number
  min_stock?: number
  gender?: string
  movement?: string
  is_active?: boolean
  is_featured?: boolean
  is_new?: boolean
  specs?: Record<string, string>
  meta_title?: string
  meta_description?: string
}

export async function createProduct(data: ProductFormData): Promise<ProductData> {
  const res = await api.post<{ data: ProductData }>('/admin/productos', data)
  return res.data.data
}

export async function updateProduct(id: number, data: Partial<ProductFormData>): Promise<ProductData> {
  const res = await api.put<{ data: ProductData }>(`/admin/productos/${id}`, data)
  return res.data.data
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/admin/productos/${id}`)
}
