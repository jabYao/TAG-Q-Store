import api from '@/api/client'

export interface AddressData {
  id: number
  name: string
  phone: string
  address_line: string
  city: string
  department: string
  zip: string | null
  reference: string | null
  is_default: boolean
}

export interface AddressFormData {
  name: string
  phone: string
  address_line: string
  city: string
  department: string
  zip?: string
  reference?: string
  is_default?: boolean
}

export async function fetchAddresses(): Promise<AddressData[]> {
  const { data } = await api.get<{ data: AddressData[] }>('/direcciones')
  return data.data
}

export async function createAddress(input: AddressFormData): Promise<AddressData> {
  const { data } = await api.post<{ data: AddressData }>('/direcciones', input)
  return data.data
}

export async function updateAddress(id: number, input: Partial<AddressFormData>): Promise<AddressData> {
  const { data } = await api.put<{ data: AddressData }>(`/direcciones/${id}`, input)
  return data.data
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/direcciones/${id}`)
}
