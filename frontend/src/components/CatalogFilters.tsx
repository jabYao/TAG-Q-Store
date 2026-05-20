// ── Data ──

export const filterOptions = {
  categories: [
    { value: '', label: 'Todas', count: 48 },
    { value: 'dama', label: 'Dama', count: 12 },
    { value: 'caballero', label: 'Caballero', count: 28 },
    { value: 'branded', label: 'Branded', count: 8 },
  ],
  brands: [
    'Tommy Hilfiger', 'Casio', 'Titan', 'Guess',
    'Citizen', 'Michael Kors', 'Timex', 'Fossil',
  ],
  tipo: ['Analógico', 'Digital', 'Smartwatch'],
  genero: ['Masculino', 'Femenino', 'Unisex'],
  estilo: ['Casual', 'Deportivo', 'Elegante', 'Lujo'],
  movimiento: ['Cuarzo', 'Automático', 'Solar'],
  materialCorrea: ['Acero inoxidable', 'Cuero', 'Silicone', 'Tela/Nylon', 'Plástico', 'Cerámica'],
  colorCorrea: ['Negro', 'Marrón', 'Plateado', 'Dorado', 'Azul', 'Rojo', 'Verde', 'Blanco'],
  tamanoCaja: [
    { value: '36-39', label: '36–39 mm' },
    { value: '40-42', label: '40–42 mm' },
    { value: '43+', label: '43 mm o más' },
  ],
  resistencia: [
    { value: '3', label: '3 ATM (salpicaduras)' },
    { value: '5', label: '5 ATM (ducha/lluvia)' },
    { value: '10', label: '10 ATM (natación)' },
    { value: '20', label: '20 ATM (buceo)' },
  ],
  funciones: [
    'Cronógrafo', 'Fecha', 'GMT', 'Fase lunar',
    'Cronómetro', 'Alarma', 'Luz LED', 'Bluetooth',
  ],
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
  selectedCategory: string
  onCategoryChange: (cat: string) => void
  selectedBrands: string[]
  onBrandToggle: (brand: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  selectedTipo: string[]
  onTipoToggle: (val: string) => void
  selectedGenero: string
  onGeneroChange: (val: string) => void
  selectedEstilo: string[]
  onEstiloToggle: (val: string) => void
  selectedMovimiento: string[]
  onMovimientoToggle: (val: string) => void
  selectedMaterial: string[]
  onMaterialToggle: (val: string) => void
  selectedColor: string[]
  onColorToggle: (val: string) => void
  selectedTamano: string[]
  onTamanoToggle: (val: string) => void
  selectedResistencia: string[]
  onResistenciaToggle: (val: string) => void
  selectedFunciones: string[]
  onFuncionesToggle: (val: string) => void
  onClear: () => void
  onClose?: () => void
}

// ── Helpers ──

function CheckboxGroup({
  items,
  selected,
  onToggle,
}: {
  items: readonly string[]
  selected: string[]
  onToggle: (val: string) => void
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item}>
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-carbon transition-colors">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="accent-primary w-4 h-4 rounded border-gray-300"
            />
            {item}
          </label>
        </li>
      ))}
    </ul>
  )
}

function RadioGroup({
  items,
  selected,
  onChange,
}: {
  items: readonly string[]
  selected: string
  onChange: (val: string) => void
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item}>
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-carbon transition-colors">
            <input
              type="radio"
              name="genero-filter"
              checked={selected === item}
              onChange={() => onChange(item)}
              className="accent-primary"
            />
            {item}
          </label>
        </li>
      ))}
    </ul>
  )
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
  const activeCount =
    (props.selectedCategory ? 1 : 0) +
    props.selectedBrands.length +
    props.selectedTipo.length +
    (props.selectedGenero ? 1 : 0) +
    props.selectedEstilo.length +
    props.selectedMovimiento.length +
    props.selectedMaterial.length +
    props.selectedColor.length +
    props.selectedTamano.length +
    props.selectedResistencia.length +
    props.selectedFunciones.length

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="lg:sticky lg:top-6 space-y-5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
        {/* Header mobile */}
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button onClick={props.onClose} className="text-2xl text-gray-400">&times;</button>
        </div>

        {/* Active filter badge */}
        {activeCount > 0 && (
          <div className="text-xs text-gray-400">
            {activeCount} filtro{activeCount !== 1 ? 's' : ''} activo{activeCount !== 1 ? 's' : ''}
          </div>
        )}

        {/* Categories */}
        <FilterSection title="Categorías">
          <ul className="space-y-1">
            {filterOptions.categories.map((cat) => (
              <li key={cat.value}>
                <button
                  onClick={() => { props.onCategoryChange(cat.value); props.onClose?.() }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    props.selectedCategory === cat.value
                      ? 'bg-primary text-white font-medium'
                      : 'text-carbon hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                  <span className="float-right text-xs opacity-60">({cat.count})</span>
                </button>
              </li>
            ))}
          </ul>
        </FilterSection>

        {/* Price */}
        <FilterSection title="Precio">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={props.priceRange[0]}
                onChange={(e) => props.onPriceRangeChange([Number(e.target.value), props.priceRange[1]])}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Desde"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                value={props.priceRange[1]}
                onChange={(e) => props.onPriceRangeChange([props.priceRange[0], Number(e.target.value)])}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Hasta"
              />
            </div>
            <input
              type="range"
              min={0}
              max={1000000}
              step={10000}
              value={props.priceRange[1]}
              onChange={(e) => props.onPriceRangeChange([props.priceRange[0], Number(e.target.value)])}
              className="w-full accent-primary"
            />
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Marca">
          <CheckboxGroup items={filterOptions.brands} selected={props.selectedBrands} onToggle={props.onBrandToggle} />
        </FilterSection>

        {/* Tipo */}
        <FilterSection title="Tipo de reloj">
          <CheckboxGroup items={filterOptions.tipo} selected={props.selectedTipo} onToggle={props.onTipoToggle} />
        </FilterSection>

        {/* Género */}
        <FilterSection title="Género">
          <RadioGroup items={filterOptions.genero} selected={props.selectedGenero} onChange={props.onGeneroChange} />
        </FilterSection>

        {/* Estilo */}
        <FilterSection title="Estilo">
          <CheckboxGroup items={filterOptions.estilo} selected={props.selectedEstilo} onToggle={props.onEstiloToggle} />
        </FilterSection>

        {/* Movimiento */}
        <FilterSection title="Movimiento">
          <CheckboxGroup items={filterOptions.movimiento} selected={props.selectedMovimiento} onToggle={props.onMovimientoToggle} />
        </FilterSection>

        {/* Material correa */}
        <FilterSection title="Material de la correa">
          <CheckboxGroup items={filterOptions.materialCorrea} selected={props.selectedMaterial} onToggle={props.onMaterialToggle} />
        </FilterSection>

        {/* Color correa */}
        <FilterSection title="Color de correa">
          <CheckboxGroup items={filterOptions.colorCorrea} selected={props.selectedColor} onToggle={props.onColorToggle} />
        </FilterSection>

        {/* Tamaño caja */}
        <FilterSection title="Tamaño de la caja">
          <ul className="space-y-1">
            {filterOptions.tamanoCaja.map((opt) => (
              <li key={opt.value}>
                <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-carbon transition-colors">
                  <input
                    type="checkbox"
                    checked={props.selectedTamano.includes(opt.value)}
                    onChange={() => props.onTamanoToggle(opt.value)}
                    className="accent-primary w-4 h-4 rounded border-gray-300"
                  />
                  {opt.label}
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        {/* Resistencia */}
        <FilterSection title="Resistencia al agua">
          <ul className="space-y-1">
            {filterOptions.resistencia.map((opt) => (
              <li key={opt.value}>
                <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-carbon transition-colors">
                  <input
                    type="checkbox"
                    checked={props.selectedResistencia.includes(opt.value)}
                    onChange={() => props.onResistenciaToggle(opt.value)}
                    className="accent-primary w-4 h-4 rounded border-gray-300"
                  />
                  {opt.label}
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        {/* Funciones */}
        <FilterSection title="Funciones">
          <CheckboxGroup items={filterOptions.funciones} selected={props.selectedFunciones} onToggle={props.onFuncionesToggle} />
        </FilterSection>



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
