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
import { ArrowLeft, Save, Send, EyeOff, Loader2 } from 'lucide-react'
import type { News } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default function EditNewsPage({ params }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<News>>({})

  useEffect(() => {
    params.then(async ({ id }) => {
      const supabase = createClient()
      const { data } = await supabase.from('news').select('*').eq('id', id).single()
      if (!data) { toast.error('找不到文章'); router.push('/admin/news'); return }
      setForm(data)
      setLoading(false)
    })
  }, [params, router])

  async function handleSave(publish?: boolean) {
    if (!form.title?.trim()) { toast.error('請輸入標題'); return }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('news')
      .update({
        title: form.title,
        slug: form.slug,
        content: form.content,
        thumbnail_url: form.thumbnail_url,
        is_published: publish ?? form.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', form.id as string)

    if (error) {
      toast.error('儲存失敗：' + error.message)
    } else {
      toast.success('已儲存')
      router.push('/admin/news')
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
        <Link href="/admin/news" className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-inkblue transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading text-2xl font-bold text-inkblue">編輯文章</h1>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="space-y-2">
          <Label>標題</Label>
          <Input
            value={form.title ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="文章標題"
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
          <p className="text-xs text-muted-foreground">前台網址：/news/{form.slug}</p>
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
          <Label>內容</Label>
          <TiptapEditor
            content={form.content ?? ''}
            onChange={(html) => setForm((p) => ({ ...p, content: html }))}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {form.is_published && (
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => handleSave(false)}
          >
            <EyeOff size={14} className="mr-2" />取消發布
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => handleSave()}
        >
          {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
          儲存
        </Button>
        {!form.is_published && (
          <Button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="bg-inkblue hover:bg-inkblue-light text-washi"
          >
            {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : <Send size={14} className="mr-2" />}
            發布
          </Button>
        )}
      </div>
    </div>
  )
}
