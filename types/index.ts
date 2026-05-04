export interface CompanyInfo {
  id: string
  hero_title: string
  hero_subtitle: string
  about_content: string
  hero_image_url: string | null
  logo_url: string | null
  meta_description: string | null
  email: string | null
  phone: string | null
  address: string | null
  updated_at: string
}

export interface News {
  id: string
  title: string
  slug: string
  content: string
  thumbnail_url: string | null
  published_at: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  images: string[]
  category: string | null
  is_active: boolean
  sort_order: number
  shopee_url: string | null
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  user_id: string
  display_name: string | null
  shopee_id: string | null
  created_at: string
}
