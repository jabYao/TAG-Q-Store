import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProducts } from '@/api'

interface SearchOverlayProps {
 query: string
 visible: boolean
 onSelect: () => void
 onViewAll: () => void
}

export default function SearchOverlay({ query, visible, onSelect, onViewAll }: SearchOverlayProps) {
 const navigate = useNavigate()
 const [results, setResults] = useState<any[]>([])
 const [loading, setLoading] = useState(false)
 const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

 const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

 useEffect(() => {
 if (debounceRef.current) clearTimeout(debounceRef.current)

 const q = query.trim()
 if (!q || q.length < 2) {
 setResults([])
 setLoading(false)
 return
 }

 setLoading(true)
 debounceRef.current = setTimeout(async () => {
 try {
 const res = await fetchProducts({ search: q, per_page: 5 })
 setResults(res.data ?? [])
 } catch {
 setResults([])
 } finally {
 setLoading(false)
 }
 }, 300)

 return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
 }, [query])

 if (!visible || !query.trim()) return null

 return (
 <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-gray-200 shadow-xl overflow-hidden">
 {/* Loading */}
 {loading && (
 <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
 <span className="w-3 h-3 border-2 border-primary border-t-transparent animate-spin" />
 Buscando...
 </div>
 )}

 {/* Results */}
 {!loading && results.length > 0 && (
 <ul className="divide-y divide-gray-100 max-h-[360px] overflow-y-auto">
 {results.map((p: any) => (
 <li key={p.id}>
 <button
 onClick={() => {
 onSelect()
 navigate(`/producto/${p.slug}`)
 }}
 className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
 >
 {/* Thumbnail */}
 <div className="w-10 h-10 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
 {p.thumbnail || p.primary_image ? (
 <img src={p.thumbnail ?? p.primary_image} alt="" className="w-full h-full object-cover" />
 ) : (
 <span className="text-lg">⌚</span>
 )}
 </div>
 {/* Info */}
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-carbon truncate">{p.name}</p>
 <p className="text-xs text-gray-400">{p.sku}</p>
 </div>
 <p className="text-sm font-semibold text-carbon shrink-0">{formatPrice(p.price)}</p>
 </button>
 </li>
 ))}
 </ul>
 )}

 {/* Empty */}
 {!loading && query.trim().length >= 2 && results.length === 0 && (
 <div className="px-4 py-6 text-center text-sm text-gray-400">
 <p className="mb-1">No encontramos resultados para "{query}"</p>
 <p className="text-xs text-gray-300">Probá con otra palabra clave</p>
 </div>
 )}

 {/* Ver todos */}
 {!loading && results.length > 0 && (
 <button
 onClick={onViewAll}
 className="w-full px-4 py-2.5 text-xs font-semibold text-primary bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-100 text-center"
 >
 Ver todos los resultados →
 </button>
 )}

 {/* Esperando más caracteres */}
 {!loading && query.trim().length === 1 && (
 <div className="px-4 py-6 text-center text-sm text-gray-400">
 Escribí al menos 2 caracteres para buscar
 </div>
 )}
 </div>
 )
}
