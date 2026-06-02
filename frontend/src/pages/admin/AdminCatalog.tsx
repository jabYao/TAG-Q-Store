import { useState } from 'react'
import ColorsTab from '@/components/admin/ColorsTab'
import FiltersTab from '@/components/admin/FiltersTab'
import BrandsTab from '@/components/admin/BrandsTab'
import CategoriesTab from '@/components/admin/CategoriesTab'

const tabs = [
  { key: 'colores', label: 'Colores', icon: '🎨' },
  { key: 'filtros', label: 'Filtros', icon: '🔍' },
  { key: 'marcas', label: 'Marcas', icon: '🏷️' },
  { key: 'categorias', label: 'Categorías', icon: '📁' },
]

export default function AdminCatalog() {
  const [activeTab, setActiveTab] = useState('colores')

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'colores' && <ColorsTab />}
      {activeTab === 'filtros' && <FiltersTab />}
      {activeTab === 'marcas' && <BrandsTab />}
      {activeTab === 'categorias' && <CategoriesTab />}
    </div>
  )
}
