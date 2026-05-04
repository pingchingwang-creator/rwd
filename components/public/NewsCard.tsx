import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import type { News } from '@/types'

interface NewsCardProps {
  article: News
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex gap-4 py-5 border-b border-border last:border-0 hover:bg-washi-dark/30 -mx-4 px-4 rounded transition-colors"
    >
      {article.thumbnail_url && (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded overflow-hidden bg-washi-dark">
          <Image
            src={article.thumbnail_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="96px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <time className="text-xs text-gold font-mono">
          {format(new Date(article.published_at), 'yyyy.MM.dd', { locale: zhTW })}
        </time>
        <h3 className="font-heading font-semibold text-inkblue mt-1 group-hover:text-gold transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {article.content.replace(/<[^>]*>/g, '')}
        </p>
      </div>
    </Link>
  )
}
