import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Building2, Newspaper, Package, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const [{ count: newsCount }, { count: productCount }] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: '新聞文章', value: newsCount ?? 0, icon: Newspaper, href: '/admin/news', color: 'text-indigo' },
    { label: '產品項目', value: productCount ?? 0, icon: Package, href: '/admin/products', color: 'text-brick' },
  ]

  const quickLinks = [
    { label: '編輯公司介紹', href: '/admin/company', icon: Building2, desc: '更新 Hero 文案、關於我們內容' },
    { label: '新增新聞文章', href: '/admin/news/new', icon: Newspaper, desc: '發布最新消息或公告' },
    { label: '新增產品', href: '/admin/products/new', icon: Package, desc: '上架新產品並加入圖片' },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-inkblue">儀表板</h1>
        <p className="text-muted-foreground text-sm mt-1">歡迎回到後台管理系統</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl p-6 border border-border hover:border-gold transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-4xl font-heading font-bold text-inkblue mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-muted ${color}`}>
                <Icon size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gold font-medium group-hover:gap-2 gap-1 transition-all">
              管理 <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-heading font-semibold text-inkblue mb-4">快速操作</h2>
        <div className="space-y-2">
          {quickLinks.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-inkblue text-sm group-hover:text-gold transition-colors">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-gold transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
