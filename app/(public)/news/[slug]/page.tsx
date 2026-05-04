import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('news').select('title, content').eq('slug', slug).single()
  if (!data) return {}
  return {
    title: data.title,
    description: data.content.replace(/<[^>]*>/g, '').slice(0, 160),
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!article) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors mb-10"
      >
        <ArrowLeft size={14} /> 返回消息列表
      </Link>

      {article.thumbnail_url && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8 bg-washi-dark">
          <Image
            src={article.thumbnail_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mb-8">
        <time className="text-sm font-mono text-gold">
          {format(new Date(article.published_at), 'yyyy 年 MM 月 dd 日', { locale: zhTW })}
        </time>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-inkblue mt-2 leading-snug">
          {article.title}
        </h1>
        <div className="w-10 h-0.5 bg-gold mt-4" />
      </div>

      <article
        className="prose prose-lg max-w-none prose-brand
          prose-headings:font-heading prose-headings:text-inkblue
          prose-a:text-indigo prose-a:no-underline hover:prose-a:text-gold
          prose-img:rounded-lg prose-blockquote:border-gold prose-blockquote:text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  )
}
