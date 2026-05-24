import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: number
  product_id: number
  name: string
  slug?: string
  price: number
  quantity: number
  image_url: string
}

interface CartState {
  items: CartItem[]
  count: number
  total: number
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      count: 0,
      total: 0,
      setItems: (items) =>
        set({
          items,
          count: items.reduce((acc, i) => acc + i.quantity, 0),
          total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id)
          if (existing) {
            const updated = state.items.map((i) =>
              i.product_id === item.product_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            )
            return {
              items: updated,
              count: updated.reduce((acc, i) => acc + i.quantity, 0),
              total: updated.reduce((acc, i) => acc + i.price * i.quantity, 0),
            }
          }
          const updated = [...state.items, item]
          return {
            items: updated,
            count: updated.reduce((acc, i) => acc + i.quantity, 0),
            total: updated.reduce((acc, i) => acc + i.price * i.quantity, 0),
          }
        }),
      removeItem: (id) =>
        set((state) => {
          const updated = state.items.filter((i) => i.id !== id)
          return {
            items: updated,
            count: updated.reduce((acc, i) => acc + i.quantity, 0),
            total: updated.reduce((acc, i) => acc + i.price * i.quantity, 0),
          }
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const updated = state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
          return {
            items: updated,
            count: updated.reduce((acc, i) => acc + i.quantity, 0),
            total: updated.reduce((acc, i) => acc + i.price * i.quantity, 0),
          }
        }),
      clearCart: () => set({ items: [], count: 0, total: 0 }),
    }),
    {
      name: 'tagq-cart',
    },
  ),
)
