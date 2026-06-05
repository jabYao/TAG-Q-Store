import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/api'
import type { CategoryFormData } from '@/api'
import { toast } from '@/stores/toastStore'

export default function CategoriesTab() {
 const queryClient = useQueryClient()
 const [editingId, setEditingId] = useState<number | null>(null)
 const [editForm, setEditForm] = useState<CategoryFormData>({ name: '' })
 const [isCreating, setIsCreating] = useState(false)

 const { data: categories } = useQuery({
 queryKey: ['categories', 'admin'],
 queryFn: () => fetchCategories(),
 })

 const createMutation = useMutation({
 mutationFn: createCategory,
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['categories'] })
 setIsCreating(false)
 setEditForm({ name: '' })
 toast.success('Categoría creada')
 },
 onError: () => toast.error('Error al crear categoría'),
 })

 const updateMutation = useMutation({
 mutationFn: ({ id, data }: { id: number; data: CategoryFormData }) => updateCategory(id, data),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['categories'] })
 setEditingId(null)
 setEditForm({ name: '' })
 toast.success('Categoría actualizada')
 },
 onError: () => toast.error('Error al actualizar categoría'),
 })

 const deleteMutation = useMutation({
 mutationFn: deleteCategory,
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['categories'] })
 toast.success('Categoría eliminada')
 },
 onError: (err: any) => toast.error(err?.response?.data?.message || 'Error al eliminar'),
 })

 const handleSave = (id?: number) => {
 if (!editForm.name.trim()) { toast.error('El nombre es obligatorio'); return }
 if (id) updateMutation.mutate({ id, data: editForm })
 else createMutation.mutate(editForm)
 }

 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="text-xl font-bold text-carbon">Categorías</h2>
 <p className="text-sm text-gray-400">{categories?.length ?? 0} categorías</p>
 </div>
 {!isCreating && (
 <button onClick={() => { setIsCreating(true); setEditForm({ name: '' }) }}
 className="bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-primary-dark transition-colors">
 + Nueva Categoría
 </button>
 )}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {isCreating && (
 <div className="bg-white p-5 border-2 border-primary shadow-sm flex flex-col gap-3">
 <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
 placeholder="Nombre de la categoría" autoFocus
 className="px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 <textarea value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
 placeholder="Descripción (opcional)" rows={2}
 className="px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 <div className="flex gap-2">
 <button onClick={() => handleSave()}
 className="flex-1 bg-primary text-white px-3 py-2 text-sm font-semibold hover:bg-primary-dark">Guardar</button>
 <button onClick={() => setIsCreating(false)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
 </div>
 </div>
 )}

 {categories?.map((cat) => (
 editingId === cat.id ? (
 <div key={cat.id} className="bg-white p-5 border-2 border-primary shadow-sm flex flex-col gap-3">
 <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} autoFocus
 className="px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 <textarea value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2}
 className="px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 <div className="flex gap-2">
 <button onClick={() => handleSave(cat.id)}
 className="flex-1 bg-primary text-white px-3 py-2 text-sm font-semibold hover:bg-primary-dark">Actualizar</button>
 <button onClick={() => setEditingId(null)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
 </div>
 </div>
 ) : (
 <div key={cat.id} className="bg-white p-5 border border-gray-100 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-xl shrink-0">
 📁
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-sm font-semibold text-carbon truncate">{cat.name}</h3>
 <p className="text-xs text-gray-400">{cat.products_count ?? 0} productos</p>
 <p className="text-[10px] text-gray-300 truncate">/{cat.slug}</p>
 </div>
 <div className="flex gap-2 text-xs shrink-0">
 <button onClick={() => { setEditingId(cat.id); setEditForm({ name: cat.name, description: cat.description ?? '' }) }}
 className="text-primary hover:underline">Editar</button>
 <button onClick={() => { if (window.confirm(`¿Eliminar "${cat.name}"?`)) deleteMutation.mutate(cat.id) }}
 className="text-red-500 hover:underline">Eliminar</button>
 </div>
 </div>
 )
 ))}

 {!isCreating && (
 <button onClick={() => { setIsCreating(true); setEditForm({ name: '' }) }}
 className="border-2 border-dashed border-gray-200 p-5 flex items-center justify-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors h-full min-h-[100px]">
 <span className="text-xl">+</span>
 <span className="text-sm font-medium">Nueva categoría</span>
 </button>
 )}
 </div>
 </div>
 )
}
