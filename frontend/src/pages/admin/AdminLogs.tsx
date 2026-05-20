const logs = [
  { time: '19/05 14:32:15', level: 'ERROR', message: 'Pago Wompi falló: timeout de conexión', module: 'Pagos' },
  { time: '19/05 14:30:01', level: 'WARN', message: 'Intento de login fallido desde IP: 192.168.1.100', module: 'Auth' },
  { time: '19/05 14:28:44', level: 'INFO', message: 'Producto creado: TH-02 - Titan Edge', module: 'Productos' },
  { time: '19/05 14:25:00', level: 'OK', message: 'Webhook Wompi recibido: APPROVED - transacción wompi_abc123', module: 'Webhooks' },
  { time: '19/05 14:20:12', level: 'AUDIT', message: 'Admin login: admin@tagq.co desde IP: 10.0.0.1', module: 'Auth' },
  { time: '19/05 14:15:30', level: 'INFO', message: 'Pedido #TAG-241 creado por usuario 5', module: 'Pedidos' },
  { time: '19/05 14:10:00', level: 'WARN', message: 'Stock bajo: GU-03 (Guess Ultra Thin) - 0 unidades', module: 'Inventario' },
  { time: '19/05 14:05:22', level: 'OK', message: 'Email enviado: confirmación de pedido #TAG-240', module: 'Email' },
  { time: '19/05 14:00:00', level: 'INFO', message: 'Tarea programada: actualización de estados ejecutada', module: 'Sistema' },
  { time: '19/05 13:55:45', level: 'ERROR', message: 'Cloudinary upload falló: archivo excede tamaño máximo', module: 'Imágenes' },
]

const levelStyles: Record<string, string> = {
  ERROR: 'bg-red-50 text-red-600',
  WARN: 'bg-amber-50 text-amber-600',
  INFO: 'bg-blue-50 text-blue-600',
  OK: 'bg-green-50 text-green-600',
  AUDIT: 'bg-purple-50 text-purple-600',
}

export default function AdminLogs() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-carbon">Logs y Monitoreo</h1>
        <div className="flex items-center gap-2 text-xs text-green-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          EN VIVO
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['Todos', 'ERROR', 'WARN', 'INFO', 'OK', 'AUDIT'].map((f) => (
          <button key={f} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${f === 'Todos' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{f}</button>
        ))}
        <div className="flex-1" />
        <input type="text" placeholder="🔍 Buscar en logs..." className="w-48 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      {/* Logs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {logs.map((log, i) => (
            <div key={i} className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-4">
              <span className="text-[10px] text-gray-400 w-28 shrink-0 mt-0.5 font-mono">{log.time}</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 w-12 text-center ${levelStyles[log.level]}`}>{log.level}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-carbon">{log.message}</p>
                <span className="text-[10px] text-gray-400">{log.module}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>Mostrando 10 de 125 registros</span>
        <div className="flex gap-1">
          <button className="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
          <button className="px-2 py-1 rounded bg-primary text-white">1</button>
          <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
          <button className="px-2 py-1 rounded hover:bg-gray-100">...</button>
          <button className="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </div>
  )
}
