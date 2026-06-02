import api from '@/api/client'

export interface FilterValueData {
  id: number
  filter_group_id: number
  value: string
  slug: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface FilterGroupData {
  id: number
  name: string
  slug: string
  display_type: 'checkbox' | 'radio'
  is_active: boolean
  sort_order: number
  values: FilterValueData[]
  active_values?: FilterValueData[]
  created_at: string
  updated_at: string
}

export interface FilterGroupFormData {
  name: string
  slug?: string
  display_type: 'checkbox' | 'radio'
  is_active?: boolean
  sort_order?: number
}

export interface FilterValueFormData {
  filter_group_id: number
  value: string
  slug?: string
  is_active?: boolean
  sort_order?: number
}

/** Fetch filter options for frontend catalog */
export async function fetchFilterOptions(): Promise<FilterGroupData[]> {
  const { data } = await api.get<{ data: any[] }>('/opciones-filtro')
  // Map active_values → values (Laravel snake_case relationship)
  return data.data.map((g: any) => ({
    ...g,
    display_type: g.display_type as 'checkbox' | 'radio',
    values: g.active_values ?? g.values ?? [],
  }))
}

/** Admin: fetch all filter groups with values */
export async function fetchAdminFilters(): Promise<FilterGroupData[]> {
  const { data } = await api.get<{ data: FilterGroupData[] }>('/admin/filtros')
  return data.data
}

/** Admin: create filter group */
export async function createFilterGroup(input: FilterGroupFormData): Promise<FilterGroupData> {
  const res = await api.post<{ data: FilterGroupData }>('/admin/filtros/grupos', input)
  return res.data.data
}

/** Admin: update filter group */
export async function updateFilterGroup(id: number, input: Partial<FilterGroupFormData>): Promise<FilterGroupData> {
  const res = await api.put<{ data: FilterGroupData }>(`/admin/filtros/grupos/${id}`, input)
  return res.data.data
}

/** Admin: delete filter group */
export async function deleteFilterGroup(id: number): Promise<void> {
  await api.delete(`/admin/filtros/grupos/${id}`)
}

/** Admin: create filter value */
export async function createFilterValue(input: FilterValueFormData): Promise<FilterValueData> {
  const res = await api.post<{ data: FilterValueData }>('/admin/filtros/valores', input)
  return res.data.data
}

/** Admin: update filter value */
export async function updateFilterValue(id: number, input: Partial<FilterValueFormData>): Promise<FilterValueData> {
  const res = await api.put<{ data: FilterValueData }>(`/admin/filtros/valores/${id}`, input)
  return res.data.data
}

/** Admin: delete filter value */
export async function deleteFilterValue(id: number): Promise<void> {
  await api.delete(`/admin/filtros/valores/${id}`)
}
