'use client'

import { useState } from 'react'
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
import slugify from 'slugify'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    images: [] as string[],
    category: '',
    sort_order: 0,
    shopee_url: '',
    is_active: true,
  })

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugify(name, { lower: true, strict: true, locale: 'zh' }) || prev.slug,
    }))
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error('請輸入產品名稱'); return }
    if (!form.slug.trim()) { toast.error('請輸入 slug'); return }

    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').insert({
      name: form.name,
      slug: form.slug,
      description: form.description,
      images: form.images,
      category: form.category || null,
      sort_order: form.sort_order,
      shopee_url: form.shopee_url || null,
      is_active: form.is_active,
    })

    if (error) {
      toast.error('儲存失敗：' + error.message)
      setSaving(false)
    } else {
      toast.success('產品已建立')
      router.push('/admin/products')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-inkblue transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading text-2xl font-bold text-inkblue">新增產品</h1>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>產品名稱 *</Label>
            <Input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="產品名稱"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>URL Slug *</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="product-slug"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">前台網址：/products/{form.slug || 'slug'}</p>
          </div>

          <div className="space-y-2">
            <Label>分類</Label>
            <Input
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              placeholder="如：軟體服務、硬體設備"
            />
          </div>

          <div className="space-y-2">
            <Label>排序（數字小排前面）</Label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label>蝦皮商品連結</Label>
            <Input
              value={form.shopee_url}
              onChange={(e) => setForm((p) => ({ ...p, shopee_url: e.target.value }))}
              placeholder="https://shopee.tw/..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>產品圖片（最多 6 張）</Label>
          <ImageUploader
            urls={form.images}
            onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))}
            maxFiles={6}
            label="上傳產品圖片"
          />
        </div>

        <div className="space-y-2">
          <Label>產品描述</Label>
          <TiptapEditor
            content={form.description}
            onChange={(html) => setForm((p) => ({ ...p, description: html }))}
            placeholder="輸入產品描述..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="bg-inkblue hover:bg-inkblue-light text-washi"
        >
          {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
          儲存產品
        </Button>
      </div>
    </div>
  )
}
