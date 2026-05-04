'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  Package,
  LogOut,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: '儀表板', icon: LayoutDashboard },
  { href: '/admin/company', label: '公司介紹', icon: Building2 },
  { href: '/admin/news', label: '新聞管理', icon: Newspaper },
  { href: '/admin/products', label: '產品管理', icon: Package },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('已登出')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0 min-h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-sm bg-gold/20 flex items-center justify-center">
            <span className="text-gold font-heading text-sm font-bold">南</span>
          </span>
          <div>
            <p className="text-sm font-heading font-bold text-sidebar-foreground">後台管理</p>
            <p className="text-[10px] text-sidebar-foreground/40 leading-none">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <ExternalLink size={15} />
          前台預覽
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground/50 hover:text-red-400 hover:bg-red-950/30 transition-colors"
        >
          <LogOut size={15} />
          登出
        </button>
      </div>
    </aside>
  )
}
