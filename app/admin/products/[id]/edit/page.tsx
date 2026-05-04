'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import type { Product } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Product>>({})

  useEffect(() => {
    params.then(async ({ id }) => {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (!data) { toast.error('找不到產品'); router.push('/admin/products'); return }
      setForm(data)
      setLoading(false)
    })
  }, [params, router])

  async function handleSave() {
    if (!form.name?.trim()) { toast.error('請輸入產品名稱'); return }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({
        name: form.name,
        slug: form.slug,
        description: form.description,
        images: form.images,
        category: form.category || null,
        sort_order: form.sort_order,
        shopee_url: form.shopee_url || null,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', form.id as string)

    if (error) {
      toast.error('儲存失敗：' + error.message)
    } else {
      toast.success('已儲存')
      router.push('/admin/products')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-inkblue transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading text-2xl font-bold text-inkblue">編輯產品</h1>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>產品名稱</Label>
            <Input
              value={form.name ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>URL Slug</Label>
            <Input
              value={form.slug ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">前台網址：/products/{form.slug}</p>
          </div>

          <div className="space-y-2">
            <Label>分類</Label>
            <Input
              value={form.category ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              placeholder="如：軟體服務、硬體設備"
            />
          </div>

          <div className="space-y-2">
            <Label>排序</Label>
            <Input
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label>蝦皮商品連結</Label>
            <Input
              value={form.shopee_url ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, shopee_url: e.target.value }))}
              placeholder="https://shopee.tw/..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>產品圖片（最多 6 張）</Label>
          <ImageUploader
            urls={form.images ?? []}
            onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))}
            maxFiles={6}
            label="上傳產品圖片"
          />
        </div>

        <div className="space-y-2">
          <Label>產品描述</Label>
          <TiptapEditor
            content={form.description ?? ''}
            onChange={(html) => setForm((p) => ({ ...p, description: html }))}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => {
            setForm((p) => ({ ...p, is_active: !p.is_active }))
          }}
        >
          {form.is_active ? '標記為隱藏' : '標記為上架'}
        </Button>
        <Button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="bg-inkblue hover:bg-inkblue-light text-washi"
        >
          {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
          儲存
        </Button>
      </div>
    </div>
  )
}
