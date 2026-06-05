import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ToastContainer from '../Toast'
import { useToastStore } from '@/stores/toastStore'

describe('ToastContainer', () => {
 beforeEach(() => {
 useToastStore.setState({ toasts: [] })
 })

 it('renders nothing when there are no toasts', () => {
 const { container } = render(<ToastContainer />)
 expect(container.firstChild).toBeNull()
 })

 it('renders toasts from store', () => {
 useToastStore.getState().addToast({ type: 'success', title: 'Operación exitosa' })
 render(<ToastContainer />)
 expect(screen.getByText('Operación exitosa')).toBeInTheDocument()
 })

 it('renders multiple toasts', () => {
 useToastStore.getState().addToast({ type: 'success', title: 'Primero' })
 useToastStore.getState().addToast({ type: 'error', title: 'Segundo' })
 render(<ToastContainer />)
 expect(screen.getByText('Primero')).toBeInTheDocument()
 expect(screen.getByText('Segundo')).toBeInTheDocument()
 })

 it('shows message when provided', () => {
 useToastStore.getState().addToast({ type: 'info', title: 'Info', message: 'Detalle del mensaje' })
 render(<ToastContainer />)
 expect(screen.getByText('Detalle del mensaje')).toBeInTheDocument()
 })

 it('removes toast when close button is clicked', () => {
 useToastStore.getState().addToast({ type: 'warning', title: 'Cerrar' })
 render(<ToastContainer />)
 const closeBtn = screen.getByText('✕')
 fireEvent.click(closeBtn)
 expect(useToastStore.getState().toasts).toHaveLength(0)
 })
})
