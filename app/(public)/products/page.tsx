import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/public/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '產品介紹',
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const categories = [...new Set(products?.map((p) => p.category).filter(Boolean))]

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
          <p className="text-xs tracking-[0.2em] text-gold font-mono mb-3">PRODUCTS</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-washi">
            產品介紹
          </h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-5" />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-1.5 border border-border rounded-full text-sm text-inkblue hover:border-gold hover:text-gold transition-colors cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-heading text-8xl text-inkblue/5 mb-6 select-none">品</p>
            <h2 className="font-heading text-xl text-inkblue/40">尚無產品</h2>
            <p className="text-muted-foreground text-sm mt-2">請至後台管理介面新增產品</p>
          </div>
        )}
      </section>
    </>
  )
}
