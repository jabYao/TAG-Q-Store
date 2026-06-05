import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroBanner from '../HeroBanner'

describe('HeroBanner', () => {
 const defaultProps = {
 title: 'TAG-Q',
 subtitle: 'Tu reloj ideal',
 cta: 'SHOP NOW',
 ctaLink: '/catalogo',
 }

 it('renders title', () => {
 render(<HeroBanner {...defaultProps} />)
 expect(screen.getByText('TAG-Q')).toBeInTheDocument()
 })

 it('renders subtitle', () => {
 render(<HeroBanner {...defaultProps} />)
 expect(screen.getByText('Tu reloj ideal')).toBeInTheDocument()
 })

 it('renders CTA button with link', () => {
 render(<HeroBanner {...defaultProps} />)
 const cta = screen.getByText('SHOP NOW')
 expect(cta).toBeInTheDocument()
 expect(cta.closest('a')).toHaveAttribute('href', '/catalogo')
 })
})
