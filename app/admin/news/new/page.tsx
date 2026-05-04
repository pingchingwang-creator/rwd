'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import slugify from 'slugify'

export default function NewNewsPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    thumbnail_url: null as string | null,
    is_published: false,
  })

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugify(title, { lower: true, strict: true, locale: 'zh' }) || prev.slug,
    }))
  }

  async function handleSave(publish: boolean) {
    if (!form.title.trim()) { toast.error('請輸入標題'); return }
    if (!form.slug.trim()) { toast.error('請輸入 slug'); return }

    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('news').insert({
      title: form.title,
      slug: form.slug,
      content: form.content,
      thumbnail_url: form.thumbnail_url,
      is_published: publish,
      published_at: new Date().toISOString(),
    })

    if (error) {
      toast.error('儲存失敗：' + error.message)
      setSaving(false)
    } else {
      toast.success(publish ? '已發布' : '已儲存為草稿')
      router.push('/admin/news')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/news" className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-inkblue transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-inkblue">新增文章</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="space-y-2">
          <Label>標題 *</Label>
          <Input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="文章標題"
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label>URL Slug *</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="article-slug"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">前台網址：/news/{form.slug || 'slug'}</p>
        </div>

        <div className="space-y-2">
          <Label>縮圖</Label>
          <ImageUploader
            urls={form.thumbnail_url ? [form.thumbnail_url] : []}
            onChange={(urls) => setForm((p) => ({ ...p, thumbnail_url: urls[0] ?? null }))}
            maxFiles={1}
            label="上傳縮圖"
          />
        </div>

        <div className="space-y-2">
          <Label>內容 *</Label>
          <TiptapEditor
            content={form.content}
            onChange={(html) => setForm((p) => ({ ...p, content: html }))}
            placeholder="輸入文章內容..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => handleSave(false)}
        >
          {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
          儲存草稿
        </Button>
        <Button
          type="button"
          disabled={saving}
          onClick={() => handleSave(true)}
          className="bg-inkblue hover:bg-inkblue-light text-washi"
        >
          {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : <Send size={14} className="mr-2" />}
          發布
        </Button>
      </div>
    </div>
  )
}
