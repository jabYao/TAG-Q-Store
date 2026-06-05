import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { uploadHeroImage } from '@/api/images'
import { toast } from '@/stores/toastStore'

interface HeroData {
 id: number
 title: string
 subtitle: string | null
 cta_text: string
 cta_link: string
 image_url: string | null
 is_active: boolean
 sort_order: number
}

export default function AdminHeroes() {
 const queryClient = useQueryClient()
 const fileInputRef = useRef<HTMLInputElement>(null)
 const [editingId, setEditingId] = useState<number | null>(null)
 const [uploadingFor, setUploadingFor] = useState<number | null>(null)
 const [uploadingHeroId, setUploadingHeroId] = useState<number | null>(null)

 const { data: heroes, isLoading } = useQuery({
 queryKey: ['heroes'],
 queryFn: async () => {
 const { data } = await api.get<{ data: HeroData[] }>('/admin/heroes')
 return data.data
 },
 })

 const [form, setForm] = useState({
 title: '',
 subtitle: '',
 cta_text: 'SHOP NOW →',
 cta_link: '/catalogo',
 is_active: true,
 })

 const createMutation = useMutation({
 mutationFn: async () => {
 const { data } = await api.post('/admin/heroes', form)
 return data.data
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['heroes'] })
 setForm({ title: '', subtitle: '', cta_text: 'SHOP NOW →', cta_link: '/catalogo', is_active: true })
 toast.success('Hero creado')
 },
 onError: () => toast.error('Error al crear hero'),
 })

 const updateMutation = useMutation({
 mutationFn: async (id: number) => {
 const { data } = await api.put(`/admin/heroes/${id}`, form)
 return data.data
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['heroes'] })
 setEditingId(null)
 toast.success('Hero actualizado')
 },
 onError: () => toast.error('Error al actualizar hero'),
 })

 const deleteMutation = useMutation({
 mutationFn: async (id: number) => {
 await api.delete(`/admin/heroes/${id}`)
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['heroes'] })
 toast.success('Hero eliminado')
 },
 onError: () => toast.error('Error al eliminar'),
 })

 const toggleMutation = useMutation({
 mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
 await api.put(`/admin/heroes/${id}`, { is_active })
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['heroes'] })
 },
 })

 const handleImageUpload = async (heroId: number, file: File) => {
 setUploadingHeroId(heroId)
 try {
 const result = await uploadHeroImage(file)
 await api.put(`/admin/heroes/${heroId}`, { image_url: result.url })

 queryClient.invalidateQueries({ queryKey: ['heroes'] })
 toast.success('✅ Imagen subida correctamente')
 } catch (err: any) {
 const msg = err?.response?.data?.message || err?.message || 'Error al subir la imagen'
 toast.error('❌ ' + msg)
 } finally {
 setUploadingHeroId(null)
 setUploadingFor(null)
 }
 }

 const startEdit = (hero: HeroData) => {
 setEditingId(hero.id)
 setForm({
 title: hero.title,
 subtitle: hero.subtitle ?? '',
 cta_text: hero.cta_text,
 cta_link: hero.cta_link,
 is_active: hero.is_active,
 })
 }

 return (
 <div className="p-6">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-carbon">Hero del Home</h1>
 <p className="text-sm text-gray-400">{heroes?.length ?? 0} heroes</p>
 </div>
 {!editingId && (
 <button onClick={() => { setEditingId(0); setForm({ title: '', subtitle: '', cta_text: 'SHOP NOW →', cta_link: '/catalogo', is_active: true }) }}
 className="bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-primary-dark transition-colors">
 + Nuevo Hero
 </button>
 )}
 </div>

 <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
 onChange={async (e) => {
 const file = e.target.files?.[0]
 if (file && uploadingFor) {
 await handleImageUpload(uploadingFor, file)
 }
 e.target.value = ''
 }} />

 {editingId !== null && (
 <div className="bg-white p-5 border-2 border-primary shadow-sm mb-6 max-w-2xl space-y-4">
 <h3 className="text-sm font-semibold text-carbon">{editingId === 0 ? 'Nuevo Hero' : 'Editar Hero'}</h3>
 <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
 placeholder="Título" className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
 placeholder="Subtítulo" className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 <div className="grid grid-cols-2 gap-4">
 <input type="text" value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))}
 placeholder="Texto del botón" className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 <input type="text" value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))}
 placeholder="Link del botón" className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
 </div>
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
 className=" border-gray-300 text-primary focus:ring-primary" />
 <span className="text-sm text-carbon">Activo</span>
 </label>
 <div className="flex gap-2">
 <button onClick={() => editingId === 0 ? createMutation.mutate() : updateMutation.mutate(editingId)}
 className="bg-primary text-white px-6 py-2 text-sm font-semibold hover:bg-primary-dark">
 {editingId === 0 ? 'Crear' : 'Actualizar'}
 </button>
 <button onClick={() => setEditingId(null)}
 className="px-6 py-2 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
 Cancelar
 </button>
 </div>
 </div>
 )}

 <div className="space-y-4">
 {heroes?.map((hero) => (
 <div key={hero.id} className="bg-white p-5 border border-gray-100 shadow-sm flex gap-6">
 <div className="w-48 h-32 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
 {hero.image_url ? (
 <img src={hero.image_url} alt="" className="w-full h-full object-cover" />
 ) : (
 <span className="text-gray-300 text-sm">Sin imagen</span>
 )}
 </div>
 <div className="flex-1">
 <h3 className="text-sm font-semibold text-carbon">{hero.title}</h3>
 {hero.subtitle && <p className="text-xs text-gray-400 mt-0.5">{hero.subtitle}</p>}
 <p className="text-[10px] text-gray-300 mt-1">{hero.cta_text} → {hero.cta_link}</p>
 <button onClick={() => toggleMutation.mutate({ id: hero.id, is_active: !hero.is_active })}
 className={`mt-2 text-[10px] px-2 py-0.5 font-medium ${
 hero.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
 }`}>
 {hero.is_active ? 'Activo' : 'Inactivo'}
 </button>
 </div>
 <div className="flex flex-col gap-2 shrink-0">
 <button
 onClick={() => { if (!uploadingHeroId) { setUploadingFor(hero.id); fileInputRef.current?.click() } }}
 disabled={uploadingHeroId === hero.id}
 className={`px-3 py-1.5 text-xs transition-all ${
 uploadingHeroId === hero.id
 ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
 : 'bg-primary text-white hover:bg-primary-dark'
 }`}>
 {uploadingHeroId === hero.id ? (
 <span className="flex items-center gap-1.5">
 <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent animate-spin" />
 Subiendo...
 </span>
 ) : (
 hero.image_url ? 'Cambiar img' : 'Subir img'
 )}
 </button>
 <button onClick={() => startEdit(hero)}
 className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50">
 Editar
 </button>
 <button onClick={() => { if (window.confirm('¿Eliminar hero?')) deleteMutation.mutate(hero.id) }}
 className="px-3 py-1.5 text-xs text-red-500 border border-red-200 hover:bg-red-50">
 Eliminar
 </button>
 </div>
 </div>
 ))}
 {(!heroes || heroes.length === 0) && !isLoading && (
 <div className="text-center py-12 text-sm text-gray-400">No hay heroes. Creá el primero.</div>
 )}
 </div>
 </div>
 )
}
