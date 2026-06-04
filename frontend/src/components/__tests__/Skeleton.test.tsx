import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Skeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  DetailSkeleton,
  CartSkeleton,
  OrderListSkeleton,
  CategoryCardSkeleton,
  HomeSectionSkeleton,
} from '../Skeleton'

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('animate-shimmer')
    expect(div.className).toContain('rounded-lg')
    expect(div).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('custom-class')
  })
})

describe('ProductCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProductCardSkeleton />)
    expect(container.firstChild).toBeTruthy()
  })
})

describe('ProductGridSkeleton', () => {
  it('renders default 8 items', () => {
    const { container } = render(<ProductGridSkeleton />)
    const grid = container.firstChild as HTMLElement
    expect(grid.className).toContain('grid')
    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders custom count', () => {
    const { container } = render(<ProductGridSkeleton count={4} />)
    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('DetailSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<DetailSkeleton />)
    expect(container.firstChild).toBeTruthy()
  })
})

describe('CartSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<CartSkeleton />)
    expect(container.firstChild).toBeTruthy()
  })
})

describe('OrderListSkeleton', () => {
  it('renders default 5 items', () => {
    const { container } = render(<OrderListSkeleton />)
    expect(container.firstChild).toBeTruthy()
  })
})

describe('CategoryCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<CategoryCardSkeleton />)
    expect(container.firstChild).toBeTruthy()
  })
})

describe('HomeSectionSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<HomeSectionSkeleton />)
    expect(container.firstChild).toBeTruthy()
  })
})
