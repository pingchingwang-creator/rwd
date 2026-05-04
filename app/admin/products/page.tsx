'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  async function toggleActive(product: Product) {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active, updated_at: new Date().toISOString() })
      .eq('id', product.id)
    if (error) {
      toast.error('操作失敗')
    } else {
      toast.success(product.is_active ? '已隱藏' : '已上架')
      fetchProducts()
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`確定要刪除「${name}」？此操作無法復原。`)) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      toast.error('刪除失敗：' + error.message)
    } else {
      toast.success('已刪除')
      fetchProducts()
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-inkblue">產品管理</h1>
          <p className="text-sm text-muted-foreground mt-1">共 {products.length} 項產品</p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants({ className: 'bg-inkblue hover:bg-inkblue-light text-washi' })}>
          <Plus size={16} className="mr-2" />新增產品
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-gold" size={28} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-border">
          <p className="font-heading text-6xl text-inkblue/10 mb-4">品</p>
          <p className="text-muted-foreground">尚無產品</p>
          <Link href="/admin/products/new" className={buttonVariants({ className: 'mt-4 bg-inkblue text-washi' })}>
            新增第一個產品
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 px-5 py-4 ${idx < products.length - 1 ? 'border-b border-border' : ''}`}
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-md overflow-hidden bg-washi-dark shrink-0">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} width={56} height={56} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-xl text-inkblue/20">品</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-inkblue truncate">{product.name}</h3>
                  {product.category && (
                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  )}
                  <Badge
                    variant={product.is_active ? 'default' : 'secondary'}
                    className={product.is_active ? 'bg-green-100 text-green-800 border-0' : ''}
                  >
                    {product.is_active ? '上架中' : '已隱藏'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  slug: {product.slug}
                  {product.shopee_url && ' · 含蝦皮連結'}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(product)}
                  title={product.is_active ? '隱藏' : '上架'}
                  className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-inkblue transition-colors"
                >
                  {product.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-inkblue transition-colors"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => deleteProduct(product.id, product.name)}
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
