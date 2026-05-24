import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../ProductCard'

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>)

describe('ProductCard', () => {
  const defaultProps = {
    productId: 1,
    name: 'Reloj Clásico',
    slug: 'reloj-clasico',
    price: 150000,
  }

  it('renders product name', () => {
    renderWithRouter(<ProductCard {...defaultProps} />)
    expect(screen.getByText('Reloj Clásico')).toBeInTheDocument()
  })

  it('renders formatted price', () => {
    renderWithRouter(<ProductCard {...defaultProps} price={150000} />)
    expect(screen.getByText('$150.000')).toBeInTheDocument()
  })

  it('renders original price with line-through when provided', () => {
    renderWithRouter(<ProductCard {...defaultProps} originalPrice={200000} />)
    expect(screen.getByText('$200.000')).toBeInTheDocument()
  })

  it('does not show original price when not provided', () => {
    renderWithRouter(<ProductCard {...defaultProps} />)
    expect(screen.queryByText('$200.000')).not.toBeInTheDocument()
  })

  it('renders badge with gold variant', () => {
    renderWithRouter(
      <ProductCard {...defaultProps} badge={{ label: 'Oferta', variant: 'gold' }} />,
    )
    expect(screen.getByText('Oferta')).toBeInTheDocument()
  })

  it('renders badge with primary variant', () => {
    renderWithRouter(
      <ProductCard {...defaultProps} badge={{ label: 'Nuevo', variant: 'primary' }} />,
    )
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
  })

  it('renders reference when provided', () => {
    renderWithRouter(<ProductCard {...defaultProps} reference="TAG-001" />)
    expect(screen.getByText('Ref: TAG-001')).toBeInTheDocument()
  })

  it('does not show reference when not provided', () => {
    renderWithRouter(<ProductCard {...defaultProps} />)
    expect(screen.queryByText(/Ref:/)).not.toBeInTheDocument()
  })

  it('renders buy button', () => {
    renderWithRouter(<ProductCard {...defaultProps} />)
    expect(screen.getByLabelText('Comprar')).toBeInTheDocument()
  })

  it('links to product detail', () => {
    renderWithRouter(<ProductCard {...defaultProps} slug="reloj-clasico" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/producto/reloj-clasico')
  })
})
