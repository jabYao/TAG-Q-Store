import api from '@/api/client'

export interface CheckoutItem {
  id: number
  product_id: number
  name: string
  slug: string
  price: number
  quantity: number
  image_url: string | null
  total: number
}

export interface CheckoutSummary {
  items: CheckoutItem[]
  subtotal: number
  shipping_cost: number
  shipping_free_minimum: number
  shipping_is_free: boolean
  discount: number
  tax: number
  total: number
}

export async function fetchCheckoutSummary(): Promise<CheckoutSummary> {
  const { data } = await api.get<{ data: CheckoutSummary }>('/checkout/resumen')
  return data.data
}

export interface PlaceOrderInputItem {
  product_id: number
  quantity: number
  price: number
}

export interface PlaceOrderInput {
  address_id: number
  payment_method: 'wompi' | 'contraentrega'
  notes?: string
  items?: PlaceOrderInputItem[]
}

export interface WidgetParams {
  publicKey: string
  currency: string
  amountInCents: number
  reference: string
  signature: { integrity: string }
}

export interface OrderResult {
  order: {
    id: number
    order_number: string
    total: number
    status: string
    payment_method: string
  }
  payment_url: string | null
  whatsapp?: string
  widget?: WidgetParams | null
}

export async function placeOrder(input: PlaceOrderInput): Promise<OrderResult> {
  const { data } = await api.post<{ data: OrderResult }>('/checkout/orden', input)
  return data.data
}
