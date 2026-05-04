'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import type { News } from '@/types'

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNews = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
    setNews(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchNews() }, [fetchNews])

  async function togglePublish(article: News) {
    const supabase = createClient()
    const { error } = await supabase
      .from('news')
      .update({ is_published: !article.is_published, updated_at: new Date().toISOString() })
      .eq('id', article.id)
    if (error) {
      toast.error('操作失敗')
    } else {
      toast.success(article.is_published ? '已取消發布' : '已發布')
      fetchNews()
    }
  }

  async function deleteArticle(id: string, title: string) {
    if (!confirm(`確定要刪除「${title}」？此操作無法復原。`)) return
    const supabase = createClient()
    const { error } = await supabase.from('news').delete().eq('id', id)
    if (error) {
      toast.error('刪除失敗：' + error.message)
    } else {
      toast.success('已刪除')
      fetchNews()
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-inkblue">新聞管理</h1>
          <p className="text-sm text-muted-foreground mt-1">共 {news.length} 篇文章</p>
        </div>
        <Link href="/admin/news/new" className={buttonVariants({ className: 'bg-inkblue hover:bg-inkblue-light text-washi' })}>
          <Plus size={16} className="mr-2" />新增文章
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-gold" size={28} />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-border">
          <p className="font-heading text-6xl text-inkblue/10 mb-4">新</p>
          <p className="text-muted-foreground">尚無文章</p>
          <Link href="/admin/news/new" className={buttonVariants({ className: 'mt-4 bg-inkblue text-washi' })}>
            新增第一篇文章
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {news.map((article, idx) => (
            <div
              key={article.id}
              className={`flex items-center gap-4 px-5 py-4 ${idx < news.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-inkblue truncate">{article.title}</h3>
                  <Badge
                    variant={article.is_published ? 'default' : 'secondary'}
                    className={article.is_published ? 'bg-green-100 text-green-800 border-0' : ''}
                  >
                    {article.is_published ? '已發布' : '草稿'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(article.created_at), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
                  {' · '}
                  slug: {article.slug}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublish(article)}
                  title={article.is_published ? '取消發布' : '發布'}
                  className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-inkblue transition-colors"
                >
                  {article.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <Link
                  href={`/admin/news/${article.id}/edit`}
                  className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-inkblue transition-colors"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => deleteArticle(article.id, article.title)}
                  className="p-2 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
