import api from '@/api/client'

export interface TopBarMessage {
  icon: string
  text: string
}

export interface TopBarSettings {
  messages: TopBarMessage[]
  envio_minimo: number
}

export async function fetchTopBarSettings(): Promise<TopBarSettings> {
  const { data } = await api.get<TopBarSettings>('/settings/top-bar')
  return data
}
