import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAddresses, createAddress, updateAddress, deleteAddress } from '@/api'
import type { AddressFormData } from '@/api'
import Breadcrumbs from '@/components/Breadcrumbs'
import { toast } from '@/stores/toastStore'

export default function Addresses() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<AddressFormData>({
    name: '',
    phone: '',
    address_line: '',
    city: '',
    department: '',
    zip: '',
    reference: '',
    is_default: false,
  })

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
  })

  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setIsCreating(false); resetForm()
      toast.success('Dirección creada')
    },
    onError: () => toast.error('Error al crear dirección'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressFormData }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setEditingId(null); resetForm()
      toast.success('Dirección actualizada')
    },
    onError: () => toast.error('Error al actualizar'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Dirección eliminada')
    },
    onError: () => toast.error('Error al eliminar'),
  })

  const resetForm = () => setForm({ name: '', phone: '', address_line: '', barrio: '', city: '', department: '', zip: '', reference: '', is_default: false })

  const handleSave = (id?: number) => {
    if (!form.name.trim() || !form.address_line.trim() || !form.city.trim() || !form.department.trim()) {
      toast.error('Completá los campos obligatorios'); return
    }
    if (id) updateMutation.mutate({ id, data: form })
    else createMutation.mutate(form)
  }

  const startEdit = (addr: any) => {
    setEditingId(addr.id)
    setForm({
      name: addr.name, phone: addr.phone, address_line: addr.address_line,
      barrio: addr.barrio ?? '',
      city: addr.city, department: addr.department, zip: addr.zip ?? '',
      reference: addr.reference ?? '', is_default: addr.is_default,
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Mi Cuenta', href: '/perfil' },
        { label: 'Direcciones' },
      ]} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-carbon">Mis Direcciones</h1>
        {!isCreating && (
          <button onClick={() => { setIsCreating(true); resetForm() }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark">
            + Nueva Dirección
          </button>
        )}
      </div>

      {/* Form */}
      {(isCreating || editingId !== null) && (
        <div className="bg-white p-6 rounded-xl border-2 border-primary shadow-sm mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-carbon">{editingId ? 'Editar dirección' : 'Nueva dirección'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nombre completo *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Teléfono *</label>
              <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 block mb-1">Dirección *</label>
              <input type="text" value={form.address_line} onChange={e => setForm(f => ({ ...f, address_line: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 block mb-1">Barrio / Vecindario</label>
              <input type="text" value={form.barrio ?? ''} onChange={e => setForm(f => ({ ...f, barrio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej: El Poblado, Chapinero, etc." />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Ciudad *</label>
              <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Departamento *</label>
              <input type="text" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Código postal</label>
              <input type="text" value={form.zip ?? ''} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Punto de referencia</label>
              <input type="text" value={form.reference ?? ''} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej: Cerca al parque" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_default ?? false}
              onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-carbon">Dirección predeterminada</span>
          </label>
          <div className="flex gap-2">
            <button onClick={() => handleSave(editingId ?? undefined)}
              className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark">
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
            <button onClick={() => { setEditingId(null); setIsCreating(false); resetForm() }}
              className="px-6 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
          </div>
        </div>
      )}

      {/* Address list */}
      <div className="space-y-3">
        {addresses?.map((addr) => (
          <div key={addr.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg">📍</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-carbon">{addr.name}</h3>
                {addr.is_default && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Predeterminada</span>}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{addr.address_line}</p>
              {addr.barrio && <p className="text-xs text-gray-400">Barrio: {addr.barrio}</p>}
              <p className="text-xs text-gray-500">{addr.city}, {addr.department}</p>
              <p className="text-xs text-gray-400 mt-0.5">📞 {addr.phone}</p>
              {addr.reference && <p className="text-[10px] text-gray-300 mt-0.5">📍 {addr.reference}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(addr)}
                className="text-xs text-primary hover:underline">Editar</button>
              <button onClick={() => { if (window.confirm('¿Eliminar dirección?')) deleteMutation.mutate(addr.id) }}
                className="text-xs text-red-500 hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
        {(!addresses || addresses.length === 0) && !isCreating && (
          <div className="text-center py-12">
            <span className="text-4xl">📍</span>
            <p className="text-sm text-gray-400 mt-3">No tenés direcciones guardadas</p>
          </div>
        )}
      </div>
    </div>
  )
}
