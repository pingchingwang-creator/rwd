import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types'

const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  '網站開發': '/illustrations/website.svg',
  '電商服務': '/illustrations/ecommerce.svg',
  '行銷服務': '/illustrations/marketing.svg',
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const cover = product.images?.[0]
  const illustration = product.category ? CATEGORY_ILLUSTRATIONS[product.category] : null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-card rounded-lg overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-lg"
    >
      <div className="aspect-[4/3] bg-washi-dark overflow-hidden relative">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : illustration ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={illustration}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-inkblue/20 text-5xl select-none">品</span>
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-inkblue/80 text-washi text-xs backdrop-blur-sm">
              {product.category}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-inkblue group-hover:text-gold transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description.replace(/<[^>]*>/g, '')}
        </p>
        <div className="mt-3 flex items-center text-xs text-gold font-medium">
          了解更多 →
        </div>
      </div>
    </Link>
  )
}
