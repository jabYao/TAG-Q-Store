import type { ColorData } from '@/api/colors'

// ── Data ──

export interface FilterValueOption {
  id: number
  value: string
  slug: string
}

export interface FilterGroupOption {
  id: number
  name: string
  slug: string
  display_type: 'checkbox' | 'radio'
  values: FilterValueOption[]
}

export const sortOptions = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'best-sellers', label: 'Más vendidos' },
  { value: 'newest', label: 'Nuevos' },
]

// ── Props ──

interface CatalogFiltersProps {
  groups: FilterGroupOption[]
  colors: ColorData[]
  selectedIds: number[]
  selectedColorIds: number[]
  onToggle: (valueId: number, group: FilterGroupOption) => void
  onToggleColor: (colorId: number) => void
  onClear: () => void
  onClose?: () => void
  hasActiveFilters: boolean
}

// ── Collapsible section ──

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-carbon mb-2 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  )
}

// ── Component ──

export default function CatalogFilters(props: CatalogFiltersProps) {
  const activeCount = props.selectedIds.length + props.selectedColorIds.length

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="lg:sticky lg:top-6 space-y-5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
        {/* Header mobile */}
        {props.onClose && (
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <button onClick={props.onClose} className="text-2xl text-gray-400">&times;</button>
          </div>
        )}

        {/* Active filter badge */}
        {activeCount > 0 && (
          <div className="text-xs text-gray-400">
            {activeCount} filtro{activeCount !== 1 ? 's' : ''} activo{activeCount !== 1 ? 's' : ''}
          </div>
        )}

        {/* Color swatches */}
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {props.colors.map((color) => {
              const isSelected = props.selectedColorIds.includes(color.id)
              return (
                <button
                  key={color.id}
                  onClick={() => props.onToggleColor(color.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all border ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                  title={color.name}
                >
                  <span
                    className="w-4 h-4 rounded-full inline-block border border-gray-200 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </button>
              )
            })}
          </div>
        </FilterSection>

        {/* Dynamically render all filter groups from DB */}
        {props.groups.map((group) => (
          <FilterSection key={group.id} title={group.name}>
            <ul className="space-y-1">
              {group.values.map((val) => {
                const isSelected = props.selectedIds.includes(val.id)
                return (
                  <li key={val.id}>
                    <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
                      isSelected ? 'bg-primary/5 text-primary font-medium' : 'text-carbon hover:bg-gray-50'
                    }`}>
                      {group.display_type === 'radio' ? (
                        <input
                          type="radio"
                          name={`filter-${group.id}`}
                          checked={isSelected}
                          onChange={() => props.onToggle(val.id, group)}
                          className="accent-primary"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => props.onToggle(val.id, group)}
                          className="accent-primary w-4 h-4 rounded border-gray-300"
                        />
                      )}
                      {val.value}
                    </label>
                  </li>
                )
              })}
            </ul>
          </FilterSection>
        ))}

        {/* Clear */}
        <button
          onClick={props.onClear}
          className="w-full text-sm text-gray-400 hover:text-primary text-center transition-colors py-2"
        >
          Limpiar todos los filtros
        </button>
      </div>
    </aside>
  )
}
