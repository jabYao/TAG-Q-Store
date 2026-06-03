import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminProducts, deleteProduct, updateProduct } from '@/api'
import { toast } from '@/stores/toastStore'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', search, categoryFilter, page],
    queryFn: () => fetchAdminProducts({
      search: search || undefined,
      category: categoryFilter || undefined,
      per_page: 20,
      page,
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Producto eliminado correctamente')
    },
    onError: () => {
      toast.error('Error al eliminar el producto')
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      updateProduct(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
  })

  const products = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Productos</h1>
          <p className="text-sm text-gray-400">
            {isLoading ? 'Cargando...' : `${meta?.total ?? 0} productos`}
          </p>
        </div>
        <Link to="/admin/productos/nuevo" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors inline-block">
          + Nuevo Producto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Categoría: Todas</option>
          <option value="dama">Dama</option>
          <option value="caballero">Caballero</option>
          <option value="ofertas">Ofertas</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Producto</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Categoría</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-gray-400">Cargando productos...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-gray-400">No hay productos</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {p.primary_image ? (
                          <img src={p.primary_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">⌚</span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-carbon">{p.name}</span>
                        {p.brand && <p className="text-[10px] text-gray-300">{p.brand.name}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {p.category?.name ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-carbon">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${
                      p.stock <= 0 ? 'text-red-500' : p.stock <= p.min_stock ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActiveMutation.mutate({ id: p.id, is_active: !p.is_active })}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.is_active
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {p.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/productos/${p.id}/editar`}
                        className="text-xs text-primary hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar "${p.name}"?`)) {
                            deleteMutation.mutate(p.id)
                          }
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-400">
            Página {meta.current_page} de {meta.last_page}
          </span>
          <button
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
            disabled={page >= meta.last_page}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
