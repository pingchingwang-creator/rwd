'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('登入失敗：' + error.message)
      setLoading(false)
    } else {
      toast.success('登入成功')
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-inkblue flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,164,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,94,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-washi rounded-xl p-8 shadow-2xl border border-gold/20">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-inkblue flex items-center justify-center mx-auto mb-4">
              <span className="text-gold font-heading text-2xl font-bold">南</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-inkblue">後台管理系統</h1>
            <p className="text-muted-foreground text-sm mt-1">請輸入管理員帳號登入</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-inkblue font-medium">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-border focus:border-gold focus:ring-gold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-inkblue font-medium">密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-border focus:border-gold focus:ring-gold"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-inkblue hover:bg-inkblue-light text-washi font-semibold py-5"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> 登入中...</>
              ) : (
                <><Lock size={16} className="mr-2" /> 登入</>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-washi/30 text-xs mt-6">
          Company Admin Panel · 台南在地科技
        </p>
      </div>
    </div>
  )
}
