import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { toast } from '@/stores/toastStore'

interface Setting {
  id: number
  key: string
  value: string
  type: string
}

export default function AdminSettings() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<Record<string, string>>({})

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Setting[] }>('/admin/configuracion')
      return data.data
    },
  })

  useEffect(() => {
    if (settings) {
      const initial: Record<string, string> = {}
      settings.forEach(s => { initial[s.key] = s.value })
      setForm(initial)
    }
  }, [settings])

  const saveMutation = useMutation({
    mutationFn: async (updates: Record<string, string>) => {
      await api.put('/admin/configuracion', updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Configuración guardada')
    },
    onError: () => toast.error('Error al guardar'),
  })

  const settingMeta: Record<string, { label: string; type: string; help?: string }> = {
    envio_gratis_minimo: { label: 'Envío gratis desde (COP)', type: 'number', help: 'Monto mínimo para envío gratis' },
    whatsapp_contacto: { label: 'WhatsApp de contacto', type: 'text', help: 'Número con código de país' },
    tienda_nombre: { label: 'Nombre de la tienda', type: 'text' },
    impuesto_porcentaje: { label: 'IVA / Impuesto (%)', type: 'number', help: 'Porcentaje de impuesto aplicado' },
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-carbon mb-6">Configuración de tienda</h1>

      <div className="space-y-4">
        {settings?.map(setting => {
          const meta = settingMeta[setting.key] ?? { label: setting.key, type: 'text' }
          return (
            <div key={setting.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <label className="text-sm font-semibold text-carbon block mb-1">{meta.label}</label>
              {meta.help && <p className="text-xs text-gray-400 mb-2">{meta.help}</p>}
              {meta.type === 'number' ? (
                <input type="number" value={form[setting.key] ?? ''}
                  onChange={e => setForm(f => ({ ...f, [setting.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              ) : (
                <input type="text" value={form[setting.key] ?? ''}
                  onChange={e => setForm(f => ({ ...f, [setting.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              )}
            </div>
          )
        })}
      </div>

      <button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}
        className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
        {saveMutation.isPending ? 'Guardando...' : 'Guardar configuración'}
      </button>
    </div>
  )
}
