const categories = [
  { id: 1, name: 'Dama', slug: 'dama', products: 12, image: '👩' },
  { id: 2, name: 'Caballero', slug: 'caballero', products: 28, image: '👔' },
  { id: 3, name: 'Branded', slug: 'branded', products: 8, image: '⭐' },
]

export default function AdminCategories() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Categorías</h1>
          <p className="text-sm text-gray-400">{categories.length} categorías</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
          + Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <span className="text-3xl">{cat.image}</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-carbon">{cat.name}</h3>
              <p className="text-xs text-gray-400">{cat.products} productos</p>
              <p className="text-[10px] text-gray-300">/{cat.slug}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button className="text-primary hover:underline">Editar</button>
              <button className="text-red-500 hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
        {/* Add new */}
        <button className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex items-center justify-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors h-full min-h-[100px]">
          <span className="text-xl">+</span>
          <span className="text-sm font-medium">Nueva categoría</span>
        </button>
      </div>
    </div>
  )
}
