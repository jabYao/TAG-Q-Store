import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminFilters,
  createFilterGroup,
  updateFilterGroup,
  deleteFilterGroup,
  createFilterValue,
  updateFilterValue,
  deleteFilterValue,
} from '@/api/filterOptions'
import type { FilterGroupFormData } from '@/api/filterOptions'
import { toast } from '@/stores/toastStore'

type GroupForm = FilterGroupFormData & { id?: number }

export default function FiltersTab() {
  const queryClient = useQueryClient()
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [groupForm, setGroupForm] = useState<GroupForm>({ name: '', display_type: 'checkbox' })
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null)
  const [addingValueTo, setAddingValueTo] = useState<number | null>(null)
  const [newValue, setNewValue] = useState('')
  const [editingValueId, setEditingValueId] = useState<number | null>(null)
  const [editValueText, setEditValueText] = useState('')

  const { data: groups, isLoading } = useQuery({
    queryKey: ['admin-filters'],
    queryFn: fetchAdminFilters,
  })

  const createGroupMut = useMutation({
    mutationFn: createFilterGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-filters'] })
      setCreatingGroup(false)
      setGroupForm({ name: '', display_type: 'checkbox' })
      toast.success('Grupo de filtro creado')
    },
    onError: () => toast.error('Error al crear grupo'),
  })

  const updateGroupMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FilterGroupFormData> }) =>
      updateFilterGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-filters'] })
      setEditingGroupId(null)
      toast.success('Grupo actualizado')
    },
    onError: () => toast.error('Error al actualizar grupo'),
  })

  const deleteGroupMut = useMutation({
    mutationFn: deleteFilterGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-filters'] })
      toast.success('Grupo eliminado')
    },
    onError: () => toast.error('Error al eliminar grupo'),
  })

  const createValueMut = useMutation({
    mutationFn: createFilterValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-filters'] })
      setAddingValueTo(null)
      setNewValue('')
      toast.success('Valor agregado')
    },
    onError: () => toast.error('Error al agregar valor'),
  })

  const updateValueMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { value: string } }) =>
      updateFilterValue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-filters'] })
      setEditingValueId(null)
      setEditValueText('')
      toast.success('Valor actualizado')
    },
    onError: () => toast.error('Error al actualizar valor'),
  })

  const deleteValueMut = useMutation({
    mutationFn: deleteFilterValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-filters'] })
      toast.success('Valor eliminado')
    },
    onError: () => toast.error('Error al eliminar valor'),
  })

  const groupCount = groups?.length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-carbon">Filtros de catálogo</h2>
          <p className="text-sm text-gray-400">{groupCount} grupos de filtro</p>
        </div>
        {!creatingGroup && (
          <button
            onClick={() => setCreatingGroup(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            + Nuevo grupo
          </button>
        )}
      </div>

      {/* New group form */}
      {creatingGroup && (
        <div className="bg-white p-5 rounded-xl border-2 border-primary shadow-sm mb-4 flex flex-col gap-3">
          <input
            type="text"
            value={groupForm.name}
            onChange={(e) => setGroupForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nombre del grupo (ej: Material de la correa)"
            autoFocus
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-carbon">
              <input
                type="radio"
                name="display_type"
                checked={groupForm.display_type === 'checkbox'}
                onChange={() => setGroupForm((f) => ({ ...f, display_type: 'checkbox' }))}
                className="accent-primary"
              />
              Checkbox (varios valores)
            </label>
            <label className="flex items-center gap-2 text-sm text-carbon">
              <input
                type="radio"
                name="display_type"
                checked={groupForm.display_type === 'radio'}
                onChange={() => setGroupForm((f) => ({ ...f, display_type: 'radio' }))}
                className="accent-primary"
              />
              Radio (un solo valor)
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!groupForm.name.trim()) {
                  toast.error('El nombre es obligatorio')
                  return
                }
                createGroupMut.mutate(groupForm)
              }}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark"
            >
              Guardar grupo
            </button>
            <button
              onClick={() => { setCreatingGroup(false); setGroupForm({ name: '', display_type: 'checkbox' }) }}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Group list */}
      <div className="space-y-4">
        {groups?.map((group) => (
          <div key={group.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Group header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-50">
              {editingGroupId === group.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={groupForm.name}
                    onChange={(e) => setGroupForm((f) => ({ ...f, name: e.target.value }))}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1 max-w-xs"
                    autoFocus
                  />
                  <select
                    value={groupForm.display_type}
                    onChange={(e) => setGroupForm((f) => ({ ...f, display_type: e.target.value as 'checkbox' | 'radio' }))}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option>
                  </select>
                  <button
                    onClick={() => updateGroupMut.mutate({ id: group.id, data: { name: groupForm.name, display_type: groupForm.display_type } })}
                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark"
                  >
                    Guardar
                  </button>
                  <button onClick={() => setEditingGroupId(null)} className="text-xs text-gray-400 hover:text-gray-600">
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingGroupId(group.id)
                        setGroupForm({ name: group.name, display_type: group.display_type })
                      }}
                      className="text-xs text-gray-400 hover:text-primary"
                      title="Editar grupo"
                    >
                      ✏️
                    </button>
                    <h3 className="text-sm font-semibold text-carbon">{group.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      group.display_type === 'radio' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {group.display_type === 'radio' ? 'Radio' : 'Checkbox'}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{group.values?.length ?? 0} valores</span>
                <button
                  onClick={() => { if (window.confirm(`¿Eliminar el grupo "${group.name}" y todos sus valores?`)) deleteGroupMut.mutate(group.id) }}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Values */}
            <div className="px-5 py-3">
              <div className="flex flex-wrap gap-2">
                {group.values?.map((val) => (
                  <div key={val.id} className="flex items-center gap-1 bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                    {editingValueId === val.id ? (
                      <>
                        <input
                          type="text"
                          value={editValueText}
                          onChange={(e) => setEditValueText(e.target.value)}
                          className="w-28 px-2 py-0.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && editValueText.trim()) {
                              updateValueMut.mutate({ id: val.id, data: { value: editValueText.trim() } })
                            }
                            if (e.key === 'Escape') {
                              setEditingValueId(null)
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (editValueText.trim()) {
                              updateValueMut.mutate({ id: val.id, data: { value: editValueText.trim() } })
                            }
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          ok
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{val.value}</span>
                        <button
                          onClick={() => { setEditingValueId(val.id); setEditValueText(val.value) }}
                          className="text-[10px] text-gray-300 hover:text-primary ml-1"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar "${val.value}"?`)) deleteValueMut.mutate(val.id)
                          }}
                          className="text-[10px] text-gray-300 hover:text-red-500 ml-0.5"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                ))}

                {/* Add value */}
                {addingValueTo === group.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Nuevo valor"
                      className="w-32 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newValue.trim()) {
                          createValueMut.mutate({ filter_group_id: group.id, value: newValue.trim() })
                        }
                        if (e.key === 'Escape') {
                          setAddingValueTo(null)
                          setNewValue('')
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newValue.trim()) {
                          createValueMut.mutate({ filter_group_id: group.id, value: newValue.trim() })
                        }
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      ok
                    </button>
                    <button
                      onClick={() => { setAddingValueTo(null); setNewValue('') }}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAddingValueTo(group.id); setNewValue('') }}
                    className="text-xs text-primary hover:underline px-2 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    + Agregar valor
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  )
}
