import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CategoryCard from '../CategoryCard'

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>)

describe('CategoryCard', () => {
  const defaultProps = {
    name: 'Deportivos',
    slug: 'deportivos',
    emoji: '🏃',
  }

  it('renders category name', () => {
    renderWithRouter(<CategoryCard {...defaultProps} />)
    expect(screen.getByText('Deportivos')).toBeInTheDocument()
  })

  it('renders emoji', () => {
    renderWithRouter(<CategoryCard {...defaultProps} />)
    expect(screen.getByText('🏃')).toBeInTheDocument()
  })

  it('renders product count when provided', () => {
    renderWithRouter(<CategoryCard {...defaultProps} count={12} />)
    expect(screen.getByText('12 productos')).toBeInTheDocument()
  })

  it('does not render count when not provided', () => {
    renderWithRouter(<CategoryCard {...defaultProps} />)
    expect(screen.queryByText(/productos/)).not.toBeInTheDocument()
  })

  it('renders "Explorar →" link', () => {
    renderWithRouter(<CategoryCard {...defaultProps} />)
    expect(screen.getByText('Explorar →')).toBeInTheDocument()
  })

  it('links to category page', () => {
    renderWithRouter(<CategoryCard {...defaultProps} slug="deportivos" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/categoria/deportivos')
  })
})
