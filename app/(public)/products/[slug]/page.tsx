import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'

const ILLUSTRATION_MAP: Record<string, string> = {
  '網站開發': '/illustrations/website.svg',
  '電商服務': '/illustrations/ecommerce.svg',
  '行銷服務': '/illustrations/marketing.svg',
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name, description').eq('slug', slug).single()
  if (!data) return {}
  return {
    title: data.name,
    description: data.description.replace(/<[^>]*>/g, '').slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const hasImages = product.images?.length > 0
  const illustration = product.category ? ILLUSTRATION_MAP[product.category] : null
  const coverSrc = hasImages ? product.images[0] : (illustration ?? null)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors mb-10"
      >
        <ArrowLeft size={14} /> 返回產品列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image gallery */}
        <div className="space-y-3">
          {coverSrc ? (
            <>
              <div className="aspect-square rounded-lg overflow-hidden bg-washi-dark relative">
                {hasImages ? (
                  <Image
                    src={coverSrc}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverSrc}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {hasImages && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img: string, i: number) => (
                    <div key={i} className="aspect-square rounded overflow-hidden bg-washi-dark relative">
                      <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square rounded-lg bg-washi-dark flex items-center justify-center">
              <span className="font-heading text-9xl text-inkblue/10 select-none">品</span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="sticky top-24">
          {product.category && (
            <Badge className="mb-4 bg-inkblue/10 text-inkblue border-0">{product.category}</Badge>
          )}
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-inkblue mb-2">
            {product.name}
          </h1>
          <div className="w-10 h-0.5 bg-gold mb-6" />

          <div
            className="prose prose-sm max-w-none prose-brand
              prose-headings:font-heading prose-headings:text-inkblue
              prose-a:text-indigo"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {product.shopee_url && (
            <a
              href={product.shopee_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#EE4D2D] text-white font-semibold rounded hover:bg-[#D44526] transition-colors"
            >
              <ShoppingBag size={18} />
              前往蝦皮購買
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
