import { createClient } from '@/lib/supabase/server'
import { NewsCard } from '@/components/public/NewsCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '最新消息',
}

export default async function NewsPage() {
  const supabase = await createClient()
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      {/* Header */}
      <section className="bg-inkblue py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(201,164,94,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-gold font-mono mb-3">NEWS</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-washi">
            最新消息
          </h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-5" />
        </div>
      </section>

      {/* News list */}
      <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto">
        {news && news.length > 0 ? (
          <div>
            {news.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-heading text-8xl text-inkblue/5 mb-6 select-none">新</p>
            <h2 className="font-heading text-xl text-inkblue/40">尚無消息</h2>
            <p className="text-muted-foreground text-sm mt-2">請至後台管理介面新增文章</p>
          </div>
        )}
      </section>
    </>
  )
}
