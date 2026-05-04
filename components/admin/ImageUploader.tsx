'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  urls: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  label?: string
}

export function ImageUploader({ urls, onChange, maxFiles = 1, label = '上傳圖片' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFiles(files: File[]) {
    if (urls.length + files.length > maxFiles) {
      toast.error(`最多只能上傳 ${maxFiles} 張圖片`)
      return
    }

    setUploading(true)
    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} 不是圖片檔案`)
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} 超過 5MB 限制`)
        continue
      }

      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from('public-images')
        .upload(filename, file, { upsert: false })

      if (error) {
        toast.error(`上傳失敗：${error.message}`)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('public-images')
        .getPublicUrl(filename)

      newUrls.push(urlData.publicUrl)
    }

    onChange([...urls, ...newUrls])
    setUploading(false)
    if (newUrls.length > 0) toast.success('圖片上傳成功')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    uploadFiles(Array.from(e.dataTransfer.files))
  }

  function removeImage(idx: number) {
    const next = urls.filter((_, i) => i !== idx)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Existing images */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((url, idx) => (
            <div key={idx} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-border">
              <Image src={url} alt={`Image ${idx + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {urls.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            dragOver
              ? 'border-gold bg-gold/5'
              : 'border-border hover:border-gold/60 hover:bg-muted/30'
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 size={24} className="animate-spin text-gold" />
              <p className="text-sm">上傳中...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload size={24} className="text-gold/60" />
              <p className="text-sm font-medium text-inkblue">{label}</p>
              <p className="text-xs">拖曳圖片至此或點擊上傳 · 最大 5MB</p>
              {maxFiles > 1 && (
                <p className="text-xs text-muted-foreground/60">{urls.length}/{maxFiles} 張</p>
              )}
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) uploadFiles(Array.from(e.target.files))
          e.target.value = ''
        }}
      />
    </div>
  )
}
