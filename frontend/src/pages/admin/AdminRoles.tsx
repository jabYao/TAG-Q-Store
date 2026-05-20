import { useState } from 'react'

const roles = ['Admin', 'Operador', 'Cliente']

const permissions = [
  { module: 'Dashboard', admin: true, operador: true, cliente: false },
  { module: 'Productos', admin: true, operador: true, cliente: false },
  { module: 'Categorías', admin: true, operador: true, cliente: false },
  { module: 'Imágenes', admin: true, operador: true, cliente: false },
  { module: 'Pedidos', admin: true, operador: true, cliente: false },
  { module: 'Clientes', admin: true, operador: false, cliente: false },
  { module: 'Roles', admin: true, operador: false, cliente: false },
  { module: 'Configuración', admin: true, operador: false, cliente: false },
  { module: 'Logs', admin: true, operador: false, cliente: false },
]

export default function AdminRoles() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-carbon">Roles y Permisos</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">+ Nuevo Rol</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-carbon mb-4">Roles</h2>
          {roles.map((r) => (
            <div key={r} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${r === 'Admin' ? 'bg-gold/20 text-gold' : r === 'Operador' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  {r === 'Admin' ? '👑' : r === 'Operador' ? '🛒' : '👤'}
                </span>
                <span className="text-sm font-medium text-carbon">{r}</span>
              </div>
              <button className="text-xs text-primary hover:underline">✏️</button>
            </div>
          ))}
        </div>

        {/* Permissions matrix */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5 overflow-x-auto">
          <h2 className="text-sm font-semibold text-carbon mb-4">Matriz de permisos</h2>
          <table className="w-full text-sm">
            <thead>
              <tr><th className="text-left py-2 text-xs text-gray-400">Módulo</th><th className="text-center py-2 text-xs text-gray-400">Admin</th><th className="text-center py-2 text-xs text-gray-400">Operador</th><th className="text-center py-2 text-xs text-gray-400">Cliente</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {permissions.map((p) => (
                <tr key={p.module}>
                  <td className="py-3 text-carbon font-medium">{p.module}</td>
                  <td className="py-3 text-center">{p.admin ? '✅' : '❌'}</td>
                  <td className="py-3 text-center">{p.operador ? '✅' : '❌'}</td>
                  <td className="py-3 text-center">{p.cliente ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-carbon">Nuevo Rol</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl text-gray-400">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Nombre del rol</label>
                <input type="text" placeholder="Ej: Soporte" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Descripción</label>
                <input type="text" placeholder="Ej: Atención al cliente" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex gap-3 pt-2">
                <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">Guardar</button>
                <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-lg text-sm text-gray-400 hover:text-carbon border border-gray-200 transition-colors">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
