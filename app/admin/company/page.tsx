'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'
import type { CompanyInfo } from '@/types'

export default function AdminCompanyPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<CompanyInfo>>({
    hero_title: '',
    hero_subtitle: '',
    about_content: '',
    hero_image_url: null,
    logo_url: null,
    meta_description: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('company_info')
      .select('*')
      .single()
      .then(({ data }) => {
        if (data) setForm(data)
        setLoading(false)
      })
  }, [])

  function set(key: keyof CompanyInfo, value: string | null) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('company_info')
      .update({ ...form, updated_at: new Date().toISOString() })
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) {
      toast.error('儲存失敗：' + error.message)
    } else {
      toast.success('公司介紹已更新')
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
    <form onSubmit={handleSave} className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-inkblue">公司介紹</h1>
          <p className="text-sm text-muted-foreground mt-1">管理首頁 Hero 區塊與關於我們內容</p>
        </div>
        <Button type="submit" disabled={saving} className="bg-inkblue hover:bg-inkblue-light text-washi">
          {saving ? <Loader2 size={15} className="animate-spin mr-2" /> : <Save size={15} className="mr-2" />}
          儲存
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <h2 className="font-heading font-semibold text-inkblue border-b border-border pb-3">Hero 區塊</h2>

        <div className="space-y-2">
          <Label>主標題</Label>
          <Input
            value={form.hero_title ?? ''}
            onChange={(e) => set('hero_title', e.target.value)}
            placeholder="公司名稱或標語"
          />
        </div>

        <div className="space-y-2">
          <Label>副標題</Label>
          <Input
            value={form.hero_subtitle ?? ''}
            onChange={(e) => set('hero_subtitle', e.target.value)}
            placeholder="一句話介紹公司"
          />
        </div>

        <div className="space-y-2">
          <Label>Hero 背景圖片</Label>
          <ImageUploader
            urls={form.hero_image_url ? [form.hero_image_url] : []}
            onChange={(urls) => set('hero_image_url', urls[0] ?? null)}
            maxFiles={1}
            label="上傳 Hero 背景圖"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <h2 className="font-heading font-semibold text-inkblue border-b border-border pb-3">關於我們</h2>

        <div className="space-y-2">
          <Label>內容（富文字編輯器）</Label>
          <TiptapEditor
            content={form.about_content ?? ''}
            onChange={(html) => set('about_content', html)}
            placeholder="輸入關於我們的內容..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <h2 className="font-heading font-semibold text-inkblue border-b border-border pb-3">聯絡資訊</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>電子郵件</Label>
            <Input
              type="email"
              value={form.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>電話</Label>
            <Input
              value={form.phone ?? ''}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="(06) 000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>地址</Label>
          <Input
            value={form.address ?? ''}
            onChange={(e) => set('address', e.target.value)}
            placeholder="台南市..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <h2 className="font-heading font-semibold text-inkblue border-b border-border pb-3">SEO</h2>

        <div className="space-y-2">
          <Label>Meta 描述</Label>
          <Textarea
            value={form.meta_description ?? ''}
            onChange={(e) => set('meta_description', e.target.value)}
            placeholder="網站搜尋引擎描述（建議 120-160 字）"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="bg-inkblue hover:bg-inkblue-light text-washi px-8">
          {saving ? <Loader2 size={15} className="animate-spin mr-2" /> : <Save size={15} className="mr-2" />}
          儲存所有變更
        </Button>
      </div>
    </form>
  )
}
