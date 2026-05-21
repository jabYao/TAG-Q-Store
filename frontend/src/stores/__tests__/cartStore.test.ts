import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../cartStore'

const sampleItem = {
  id: 1,
  product_id: 101,
  name: 'Reloj TAG Heuer',
  price: 2500000,
  quantity: 1,
  image_url: '/img1.jpg',
}

const sampleItem2 = {
  id: 2,
  product_id: 102,
  name: 'Reloj Rolex',
  price: 5000000,
  quantity: 2,
  image_url: '/img2.jpg',
}

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], count: 0, total: 0 })
  })

  it('starts empty', () => {
    const { items, count, total } = useCartStore.getState()
    expect(items).toEqual([])
    expect(count).toBe(0)
    expect(total).toBe(0)
  })

  it('adds an item and updates count and total', () => {
    useCartStore.getState().addItem(sampleItem)
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.count).toBe(1)
    expect(state.total).toBe(2500000)
  })

  it('adds multiple items and sums correctly', () => {
    useCartStore.getState().addItem(sampleItem)
    useCartStore.getState().addItem(sampleItem2)
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(2)
    expect(state.count).toBe(3) // 1 + 2
    expect(state.total).toBe(2500000 + 5000000 * 2)
  })

  it('increments quantity if same product_id is added again', () => {
    useCartStore.getState().addItem(sampleItem)
    useCartStore.getState().addItem({ ...sampleItem, id: 3 })
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(2)
    expect(state.count).toBe(2)
    expect(state.total).toBe(5000000)
  })

  it('removes an item by id', () => {
    useCartStore.getState().addItem(sampleItem)
    useCartStore.getState().addItem(sampleItem2)
    useCartStore.getState().removeItem(1)
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].id).toBe(2)
  })

  it('updates quantity and recalculates', () => {
    useCartStore.getState().addItem(sampleItem)
    useCartStore.getState().updateQuantity(1, 5)
    const state = useCartStore.getState()
    expect(state.items[0].quantity).toBe(5)
    expect(state.count).toBe(5)
    expect(state.total).toBe(2500000 * 5)
  })

  it('clears cart', () => {
    useCartStore.getState().addItem(sampleItem)
    useCartStore.getState().addItem(sampleItem2)
    useCartStore.getState().clearCart()
    const state = useCartStore.getState()
    expect(state.items).toEqual([])
    expect(state.count).toBe(0)
    expect(state.total).toBe(0)
  })

  it('handles setItems replacing entire cart', () => {
    useCartStore.getState().setItems([sampleItem, sampleItem2])
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(2)
    expect(state.count).toBe(3)
    expect(state.total).toBe(2500000 + 5000000 * 2)
  })
})
