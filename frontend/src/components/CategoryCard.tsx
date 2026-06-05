import { Link } from 'react-router-dom'

interface CategoryCardProps {
 name: string
 slug: string
 imageUrl?: string
 emoji: string
 count?: number
}

export default function CategoryCard({ name, slug, emoji, count, imageUrl }: CategoryCardProps) {
 return (
 <Link
 to={`/categoria/${slug}`}
 className="group relative bg-white overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
 >
 {/* Image */}
 <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
 {imageUrl ? (
 <img
 src={imageUrl}
 alt={name}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
 />
 ) : (
 <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
 {emoji}
 </span>
 )}
 </div>

 {/* Info */}
 <div className="p-4 text-center">
 <h3 className="text-lg font-semibold text-carbon mb-1">{name}</h3>
 {count !== undefined && (
 <p className="text-xs text-gray-400 mb-2">{count} productos</p>
 )}
 <span className="text-sm text-primary font-medium group-hover:underline">
 Explorar →
 </span>
 </div>
 </Link>
 )
}
