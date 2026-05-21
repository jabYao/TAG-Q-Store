import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useToastStore, toast } from '../toastStore'

describe('toastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
    vi.useFakeTimers()
  })

  it('starts with empty toasts', () => {
    const state = useToastStore.getState()
    expect(state.toasts).toEqual([])
  })

  it('adds a toast and returns an id', () => {
    const id = useToastStore.getState().addToast({ type: 'success', title: 'Hecho' })
    expect(id).toBeTruthy()
    expect(useToastStore.getState().toasts).toHaveLength(1)
    expect(useToastStore.getState().toasts[0].title).toBe('Hecho')
    expect(useToastStore.getState().toasts[0].type).toBe('success')
  })

  it('removes a toast by id', () => {
    const id = useToastStore.getState().addToast({ type: 'info', title: 'Info' })
    expect(useToastStore.getState().toasts).toHaveLength(1)
    useToastStore.getState().removeToast(id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('auto-removes toast after duration', () => {
    useToastStore.getState().addToast({ type: 'warning', title: 'Cuidado', duration: 3000 })
    expect(useToastStore.getState().toasts).toHaveLength(1)
    vi.advanceTimersByTime(3000)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('does not auto-remove if duration is 0', () => {
    useToastStore.getState().addToast({ type: 'error', title: 'Error', duration: 0 })
    vi.advanceTimersByTime(99999)
    expect(useToastStore.getState().toasts).toHaveLength(1)
  })

  it('clears all toasts', () => {
    useToastStore.getState().addToast({ type: 'info', title: 'Uno' })
    useToastStore.getState().addToast({ type: 'info', title: 'Dos' })
    useToastStore.getState().clearToasts()
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('keeps multiple toasts', () => {
    useToastStore.getState().addToast({ type: 'success', title: 'A' })
    useToastStore.getState().addToast({ type: 'error', title: 'B' })
    useToastStore.getState().addToast({ type: 'info', title: 'C' })
    expect(useToastStore.getState().toasts).toHaveLength(3)
  })
})

describe('toast helper', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('adds success toast', () => {
    toast.success('Genial')
    expect(useToastStore.getState().toasts[0].type).toBe('success')
  })

  it('adds error toast with message', () => {
    toast.error('Falló', 'Algo salió mal')
    const t = useToastStore.getState().toasts[0]
    expect(t.type).toBe('error')
    expect(t.message).toBe('Algo salió mal')
  })

  it('adds info toast', () => {
    toast.info('Dato curioso')
    expect(useToastStore.getState().toasts[0].type).toBe('info')
  })

  it('adds warning toast', () => {
    toast.warning('Precaución')
    expect(useToastStore.getState().toasts[0].type).toBe('warning')
  })
})
