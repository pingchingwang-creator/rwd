import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/public/ProductCard'
import { NewsCard } from '@/components/public/NewsCard'
import { ArrowRight, ChevronDown } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: company }, { data: products }, { data: news }] = await Promise.all([
    supabase.from('company_info').select('*').single(),
    supabase.from('products').select('*').eq('is_active', true).order('sort_order').limit(3),
    supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(3),
  ])

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-inkblue">
        {/* Background image */}
        {company?.hero_image_url ? (
          <Image
            src={company.hero_image_url}
            alt="Hero"
            fill
            priority
            className="object-cover opacity-30"
          />
        ) : (
          /* Decorative gradient fallback */
          <div className="absolute inset-0 bg-gradient-to-br from-inkblue via-inkblue-light to-[#0D1B2A]" />
        )}

        {/* Japanese ink wash overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-inkblue/20 to-inkblue/60" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(201,164,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,94,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 text-gold text-xs tracking-[0.2em] mb-8">
            <span className="w-1 h-1 rounded-full bg-gold" />
            台南在地科技
            <span className="w-1 h-1 rounded-full bg-gold" />
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-washi leading-tight mb-6">
            {company?.hero_title ?? '公司名稱'}
          </h1>
          <p className="text-washi/70 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            {company?.hero_subtitle ?? '台南在地科技公司，結合古都底蘊與現代創新'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3 bg-gold text-inkblue font-semibold rounded hover:bg-gold-light transition-colors"
            >
              探索產品 <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-7 py-3 border border-washi/40 text-washi hover:border-gold hover:text-gold rounded transition-colors"
            >
              關於我們
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-washi/40 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] text-gold font-mono mb-2">PRODUCTS</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-inkblue ink-divider">
              精選產品
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-gold hover:text-gold-dark transition-colors font-medium"
          >
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-heading text-4xl text-inkblue/10 mb-4">品</p>
            <p>尚無產品，請至後台新增</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="text-sm text-gold font-medium">
            查看全部產品 →
          </Link>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Latest News ───────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] text-gold font-mono mb-2">NEWS</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-inkblue ink-divider">
              最新消息
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-gold hover:text-gold-dark transition-colors font-medium"
          >
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>

        {news && news.length > 0 ? (
          <div className="max-w-2xl">
            {news.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-heading text-4xl text-inkblue/10 mb-4">新</p>
            <p>尚無消息，請至後台新增</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/news" className="text-sm text-gold font-medium">
            查看全部消息 →
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-inkblue py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-gold font-mono mb-4">CONTACT</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-washi mb-6">
            有任何問題或合作洽詢？
          </h2>
          <p className="text-washi/60 mb-8">
            歡迎與我們聯繫，我們將盡快回覆您的來信
          </p>
          <Link
            href="/about#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-inkblue font-semibold rounded hover:bg-gold-light transition-colors"
          >
            聯絡我們 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
