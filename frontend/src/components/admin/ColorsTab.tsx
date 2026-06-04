import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminColors, createColor, updateColor, deleteColor } from '@/api/colors'
import type { ColorFormData } from '@/api/colors'
import { toast } from '@/stores/toastStore'

export default function ColorsTab() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ColorFormData>({ name: '', hex: '#000000' })
  const [isCreating, setIsCreating] = useState(false)

  const { data: colors } = useQuery({
    queryKey: ['admin-colors'],
    queryFn: fetchAdminColors,
  })

  const createMut = useMutation({
    mutationFn: createColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colors'] })
      setIsCreating(false)
      setForm({ name: '', hex: '#000000' })
      toast.success('Color creado')
    },
    onError: () => toast.error('Error al crear color'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ColorFormData }) => updateColor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colors'] })
      setEditingId(null)
      toast.success('Color actualizado')
    },
    onError: () => toast.error('Error al actualizar color'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colors'] })
      toast.success('Color eliminado')
    },
    onError: () => toast.error('Error al eliminar color'),
  })

  const handleSave = (id?: number) => {
    if (!form.name.trim() || !form.hex.trim()) {
      toast.error('Nombre y código hex son obligatorios')
      return
    }
    if (id) updateMut.mutate({ id, data: form })
    else createMut.mutate(form)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-carbon">Colores</h2>
          <p className="text-sm text-gray-400">{colors?.length ?? 0} colores</p>
        </div>
        {!isCreating && (
          <button onClick={() => { setIsCreating(true); setForm({ name: '', hex: '#000000' }) }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            + Nuevo color
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {isCreating && (
          <div className="bg-white p-4 rounded-xl border-2 border-primary shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.hex}
                onChange={e => setForm(f => ({ ...f, hex: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input type="text" value={form.hex} onChange={e => setForm(f => ({ ...f, hex: e.target.value }))}
                placeholder="#FF0000" className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono" />
            </div>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre del color" autoFocus
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="flex gap-2">
              <button onClick={() => handleSave()}
                className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark">Guardar</button>
              <button onClick={() => setIsCreating(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancelar</button>
            </div>
          </div>
        )}

        {colors?.map((color) => (
          editingId === color.id ? (
            <div key={color.id} className="bg-white p-4 rounded-xl border-2 border-primary shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input type="color" value={form.hex}
                  onChange={e => setForm(f => ({ ...f, hex: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                <input type="text" value={form.hex} onChange={e => setForm(f => ({ ...f, hex: e.target.value }))}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono" />
              </div>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <div className="flex gap-2">
                <button onClick={() => handleSave(color.id)}
                  className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark">Actualizar</button>
                <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={color.id}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors group">
              <div className="flex flex-col items-center text-center gap-2">
                <span className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color.hex }} />
                <div>
                  <p className="text-sm font-medium text-carbon">{color.name}</p>
                  <p className="text-[10px] text-gray-300 font-mono">{color.hex}</p>
                </div>
                <div className="flex gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(color.id); setForm({ name: color.name, hex: color.hex }) }}
                    className="text-primary hover:underline">Editar</button>
                  <button onClick={() => { if (window.confirm(`¿Eliminar "${color.name}"?`)) deleteMut.mutate(color.id) }}
                    className="text-red-500 hover:underline">Eliminar</button>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
