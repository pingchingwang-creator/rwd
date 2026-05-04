import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [{ data: news }, { data: products }] = await Promise.all([
    supabase.from('news').select('slug, updated_at').eq('is_published', true),
    supabase.from('products').select('slug, updated_at').eq('is_active', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  const newsRoutes: MetadataRoute.Sitemap = (news ?? []).map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...newsRoutes, ...productRoutes]
}
