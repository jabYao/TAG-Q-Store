import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { toast } from '@/stores/toastStore'

interface ContactMessage {
 id: number
 name: string
 email: string
 phone: string | null
 subject: string | null
 message: string
 is_read: boolean
 created_at: string
}

export default function AdminContactMessages() {
 const queryClient = useQueryClient()

 const { data: messages } = useQuery({
 queryKey: ['contact-messages'],
 queryFn: async () => {
 const { data } = await api.get<{ data: ContactMessage[] }>('/admin/contacto')
 return data.data
 },
 })

 const markReadMut = useMutation({
 mutationFn: async (id: number) => {
 await api.put(`/admin/contacto/${id}/leer`)
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['contact-messages'] })
 },
 })

 const deleteMut = useMutation({
 mutationFn: async (id: number) => {
 await api.delete(`/admin/contacto/${id}`)
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['contact-messages'] })
 toast.success('Mensaje eliminado')
 },
 })

 const unread = messages?.filter(m => !m.is_read).length ?? 0

 return (
 <div className="p-6 max-w-4xl">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-carbon">Mensajes de contacto</h1>
 <p className="text-sm text-gray-400">{messages?.length ?? 0} mensajes{unread > 0 && ` · ${unread} sin leer`}</p>
 </div>
 </div>

 <div className="space-y-3">
 {messages?.length === 0 && (
 <div className="text-center py-12 text-sm text-gray-400">No hay mensajes todavía.</div>
 )}

 {messages?.map(msg => (
 <div
 key={msg.id}
 onClick={() => { if (!msg.is_read) markReadMut.mutate(msg.id) }}
 className={`bg-white p-5 border shadow-sm transition-colors cursor-pointer ${
 msg.is_read ? 'border-gray-100' : 'border-primary/30 bg-primary/[0.02]'
 }`}
 >
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 {!msg.is_read && (
 <span className="w-2 h-2 bg-primary shrink-0" />
 )}
 <h3 className={`text-sm font-semibold ${msg.is_read ? 'text-carbon' : 'text-primary'}`}>
 {msg.name}
 </h3>
 {msg.subject && (
 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 ">
 {msg.subject}
 </span>
 )}
 </div>
 <p className="text-xs text-gray-400 mb-2">
 {msg.email}{msg.phone ? ` · ${msg.phone}` : ''} · {new Date(msg.created_at).toLocaleString('es-CO')}
 </p>
 <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">{msg.message}</p>
 </div>
 <button
 onClick={(e) => { e.stopPropagation(); if (window.confirm('¿Eliminar mensaje?')) deleteMut.mutate(msg.id) }}
 className="text-gray-300 hover:text-red-500 transition-colors text-sm shrink-0"
 >
 ✕
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 )
}
