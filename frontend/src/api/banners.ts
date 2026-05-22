import api from '@/api/client'

export interface BannerData {
  title: string | null
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  image_url: string | null
  bg_color: string | null
}

export interface HeroData {
  title: string | null
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  image_url: string | null
}

export async function fetchBanners(): Promise<BannerData[]> {
  const { data } = await api.get<{ data: BannerData[] }>('/banners')
  return data.data
}

export async function fetchHeroes(): Promise<HeroData[]> {
  const { data } = await api.get<{ data: HeroData[] }>('/heroes')
  return data.data
}
