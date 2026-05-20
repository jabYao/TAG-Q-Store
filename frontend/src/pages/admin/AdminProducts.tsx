import { Link } from 'react-router-dom'

const formatPrice = (amount: number) => `$${amount.toLocaleString('es-CO')}`

const products = [
  { id: 1, name: 'Tommy Hilfiger Chronograph', sku: 'TH-01', category: 'Dama', price: 250000, stock: 15, image: '⌚' },
  { id: 2, name: 'Titan Edge Automatic', sku: 'TE-02', category: 'Caballero', price: 320000, stock: 3, image: '⌚' },
  { id: 3, name: 'Guess Ultra Thin', sku: 'GU-03', category: 'Dama', price: 195000, stock: 0, image: '⌚' },
  { id: 4, name: 'Casio G-Shock Digital', sku: 'CG-04', category: 'Caballero', price: 180000, stock: 42, image: '⌚' },
  { id: 5, name: 'Citizen Eco-Drive', sku: 'CE-05', category: 'Branded', price: 450000, stock: 8, image: '⌚' },
]

export default function AdminProducts() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Productos</h1>
          <p className="text-sm text-gray-400">{products.length} productos</p>
        </div>
        <Link to="/admin/productos/nuevo" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors inline-block">
          + Nuevo Producto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="🔍 Buscar productos..." className="max-w-xs px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-400">
          <option>Categoría: Todas</option>
          <option>Dama</option>
          <option>Caballero</option>
          <option>Branded</option>
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
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.image}</span>
                    <span className="font-medium text-carbon">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{p.category}</span></td>
                <td className="px-4 py-3 text-right font-medium text-carbon">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${p.stock === 0 ? 'bg-red-50 text-red-600' : p.stock < 10 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {p.stock === 0 ? 'Sin stock' : p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-primary hover:underline text-xs">Editar</button>
                  <button className="text-red-500 hover:underline text-xs ml-3">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
