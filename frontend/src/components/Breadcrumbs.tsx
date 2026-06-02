import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-xs text-gray-400 mb-6">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i}>
            {i > 0 && <span className="mx-1.5">/</span>}
            {item.href && !isLast ? (
              <Link to={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-carbon font-medium' : ''}>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
