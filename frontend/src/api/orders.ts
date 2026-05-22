import api from '@/api/client'

export interface OrderItemData {
  id: number
  product_id: number
  product_name: string
  product_sku: string | null
  unit_price: number
  quantity: number
  total: number
}

export interface OrderData {
  id: number
  order_number: string
  subtotal: number
  shipping_cost: number
  discount: number
  tax: number
  total: number
  status: string
  payment_method: string | null
  payment_status: string | null
  notes: string | null
  items: OrderItemData[]
  address?: any
  statuses?: any[]
  created_at: string
  whatsapp?: string
}

export async function fetchOrders(): Promise<OrderData[]> {
  const { data } = await api.get<{ data: OrderData[] }>('/ordenes')
  return data.data
}

export async function fetchOrder(id: number): Promise<OrderData> {
  const res = await api.get<{ data: OrderData; whatsapp?: string }>(`/ordenes/${id}`)
  const order = res.data.data
  order.whatsapp = res.data.whatsapp
  return order
}
