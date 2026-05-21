import api from '@/api/client'

export interface CartItemData {
  id: number
  product_id: number
  name: string
  slug: string
  price: number
  quantity: number
  image_url: string | null
  stock: number
}

export interface CartResponse {
  id: number
  items: CartItemData[]
  count: number
  subtotal: number
}

export async function fetchCart(): Promise<{ data: CartResponse }> {
  const { data } = await api.get('/carrito')
  return data
}

export async function addToCart(productId: number, quantity: number = 1): Promise<any> {
  const { data } = await api.post('/carrito', { product_id: productId, quantity })
  return data
}

export async function updateCartItem(itemId: number, quantity: number): Promise<any> {
  const { data } = await api.put(`/carrito/${itemId}`, { quantity })
  return data
}

export async function removeFromCart(itemId: number): Promise<any> {
  const { data } = await api.delete(`/carrito/${itemId}`)
  return data
}

export async function clearCart(): Promise<void> {
  await api.delete('/carrito')
}
