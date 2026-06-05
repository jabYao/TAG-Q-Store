import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'

export default function AdminLogs() {
 const [logType, setLogType] = useState<'telescope' | 'server'>('telescope')

 return (
 <div className="p-6">
 <div className="flex items-center justify-between mb-6">
 <h1 className="text-2xl font-bold text-carbon">Logs y Monitoreo</h1>
 <div className="flex gap-0 border border-gray-200 overflow-hidden">
 <button onClick={() => setLogType('telescope')}
 className={`px-3 py-1.5 text-xs font-medium transition-colors ${
 logType === 'telescope' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
 }`}>
 Telescope
 </button>
 <button onClick={() => setLogType('server')}
 className={`px-3 py-1.5 text-xs font-medium transition-colors ${
 logType === 'server' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
 }`}>
 Server Logs
 </button>
 </div>
 </div>

 {logType === 'telescope' ? (
 <div className="bg-white border border-gray-100 shadow-sm p-8 text-center">
 <span className="text-5xl">🔭</span>
 <h2 className="text-lg font-semibold text-carbon mt-4">Laravel Telescope</h2>
 <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
 Accedé a Telescope en <code className="text-primary bg-primary/5 px-1.5 py-0.5 text-xs">/telescope</code> para ver requests, queries, logs, exceptions y más en tiempo real.
 </p>
 <a href="/telescope" target="_blank"
 className="inline-block mt-6 bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors">
 Abrir Telescope →
 </a>
 </div>
 ) : (
 <ServerLogViewer />
 )}
 </div>
 )
}

function ServerLogViewer() {
 const [logFile, setLogFile] = useState('laravel')

 const { data: logs, isLoading } = useQuery({
 queryKey: ['logs', logFile],
 queryFn: async () => {
 const { data } = await api.get(`/admin/logs/${logFile}`)
 return data.data
 },
 enabled: false,
 retry: false,
 })

 return (
 <div>
 <div className="flex gap-2 mb-4">
 {['laravel', 'error', 'query'].map(file => (
 <button key={file} onClick={() => setLogFile(file)}
 className={`px-3 py-1.5 text-xs border transition-colors ${
 logFile === file ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
 }`}>
 {file}.log
 </button>
 ))}
 </div>

 <div className="bg-carbon text-green-400 p-4 font-mono text-xs leading-relaxed h-[600px] overflow-y-auto">
 <p className="text-green-600 mb-2">$ tail -n 100 storage/logs/{logFile}.log</p>
 {isLoading ? (
 <p className="text-gray-500">Cargando logs...</p>
 ) : logs ? (
 logs.split('\n').map((line: string, i: number) => (
 <div key={i} className={`${line.includes('.ERROR:') || line.includes('.CRITICAL:') ? 'text-red-400' : line.includes('.WARNING:') ? 'text-amber-400' : ''}`}>
 {line || ' '}
 </div>
 ))
 ) : (
 <>
 <p className="text-gray-500">[2026-05-21 00:00:00] local.INFO: Server started</p>
 <p className="text-gray-500">[2026-05-21 00:01:23] local.INFO: PaymentApproved</p>
 <p className="text-gray-500">[2026-05-21 00:01:23] local.INFO: Orden TAG-XXXXXXX pagada</p>
 <p className="text-amber-400">[2026-05-21 00:02:00] local.WARNING: Wompi webhook: Firma inválida</p>
 <p className="text-red-400">[2026-05-21 00:03:00] local.ERROR: Stock insuficiente para producto #5</p>
 </>
 )}
 </div>

 <p className="text-xs text-gray-400 mt-2">
 💡 Los logs de servidor completos están en <code className="text-primary">backend/storage/logs/</code>
 </p>
 </div>
 )
}
