import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'

export default function AdminClients() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'clients', search, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      params.set('page', String(page))
      const { data } = await api.get(`/admin/clientes?${params}`)
      return data
    },
  })

  const clients = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Clientes</h1>
          <p className="text-sm text-gray-400">{meta?.total ?? 0} clientes</p>
        </div>
      </div>

      <input type="text" placeholder="🔍 Buscar por nombre o email..." value={search}
        onChange={e => { setSearch(e.target.value); setPage(1) }}
        className="max-w-xs px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4" />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Teléfono</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Pedidos</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-carbon">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                <td className="px-4 py-3 text-gray-500">{c.phone ?? '—'}</td>
                <td className="px-4 py-3 text-center"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{c.orders_count}</span></td>
                <td className="px-4 py-3 text-right text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('es-CO')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40">←</button>
          <span className="text-xs text-gray-400">{meta.current_page}/{meta.last_page}</span>
          <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40">→</button>
        </div>
      )}
    </div>
  )
}
