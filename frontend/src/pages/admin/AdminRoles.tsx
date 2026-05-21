import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { toast } from '@/stores/toastStore'

export default function AdminRoles() {
  const queryClient = useQueryClient()
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: async () => {
      const { data } = await api.get('/admin/roles')
      return data.data
    },
  })

  const updatePermsMutation = useMutation({
    mutationFn: async ({ role, permissions }: { role: string; permissions: string[] }) => {
      await api.put(`/admin/roles/${role}`, { permissions })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] })
      setEditingRole(null)
      toast.success('Permisos actualizados')
    },
  })

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ user, roles }: { user: number; roles: string[] }) => {
      await api.put(`/admin/roles/usuario/${user}`, { roles })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] })
      toast.success('Rol de usuario actualizado')
    },
  })

  if (isLoading) return <div className="p-6 text-sm text-gray-400">Cargando...</div>

  const roles = data?.roles ?? []
  const permissions = data?.permissions ?? []
  const users = data?.users ?? []

  const permissionGroups: Record<string, string[]> = {}
  permissions.forEach((p: string) => {
    const group = p.split('.')[0] || 'general'
    if (!permissionGroups[group]) permissionGroups[group] = []
    permissionGroups[group].push(p)
  })

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-carbon mb-6">Roles y Permisos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-carbon uppercase tracking-wide">Roles</h2>
          {roles.map((role: any) => (
            <div key={role.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-carbon capitalize">{role.name}</h3>
                <button onClick={() => {
                  setEditingRole(editingRole === role.name ? null : role.name)
                  setSelectedPerms([...role.permissions])
                }}
                  className="text-xs text-primary hover:underline">
                  {editingRole === role.name ? 'Cancelar' : 'Editar permisos'}
                </button>
              </div>

              {/* Current permissions */}
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((p: string) => (
                  <span key={p} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{p}</span>
                ))}
              </div>

              {/* Permission editor */}
              {editingRole === role.name && (
                <div className="mt-4 space-y-2">
                  {Object.entries(permissionGroups).map(([group, perms]) => (
                    <div key={group}>
                      <p className="text-[10px] text-gray-400 uppercase font-medium mb-1">{group}</p>
                      <div className="flex flex-wrap gap-1">
                        {perms.map((p: string) => (
                          <label key={p} className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            selectedPerms.includes(p) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}>
                            <input type="checkbox" checked={selectedPerms.includes(p)}
                              onChange={() => {
                                setSelectedPerms(prev =>
                                  prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                                )
                              }}
                              className="sr-only" />
                            {p.split('.').slice(1).join('.') || p}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => updatePermsMutation.mutate({ role: role.name, permissions: selectedPerms })}
                    className="mt-3 bg-primary text-white px-4 py-1.5 text-xs rounded-lg hover:bg-primary-dark transition-colors">
                    Guardar permisos
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Users */}
        <div>
          <h2 className="text-sm font-semibold text-carbon uppercase tracking-wide mb-4">Usuarios</h2>
          <div className="space-y-3">
            {users.map((user: any) => (
              <div key={user.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-carbon">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <div className="flex gap-1">
                    {['admin', 'operador', 'cliente'].map(roleName => {
                      const isAssigned = user.roles.includes(roleName)
                      return (
                        <button key={roleName}
                          onClick={() => {
                            const newRoles = isAssigned
                              ? user.roles.filter((r: string) => r !== roleName)
                              : [...user.roles, roleName]
                            updateUserRoleMutation.mutate({ user: user.id, roles: newRoles })
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                            isAssigned ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                          {roleName}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((r: string) => (
                    <span key={r} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded capitalize">{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
