'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Menu,
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

export function AdminMobileHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('已登出')
    router.push('/admin/login')
    router.refresh()
  }

  const currentPage = navItems.find(
    (item) => pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
  )

  return (
    <header className="lg:hidden h-14 bg-sidebar text-sidebar-foreground flex items-center px-4 border-b border-sidebar-border shrink-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground bg-transparent border-0">
          <Menu size={20} />
        </SheetTrigger>
        <SheetContent side="left" className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border w-64 p-0">
          <div className="h-14 flex items-center px-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-sm bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-heading text-sm font-bold">南</span>
              </span>
              <p className="text-sm font-heading font-bold">後台管理</p>
            </div>
          </div>
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
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
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <Link
              href="/"
              target="_blank"
              onClick={() => setOpen(false)}
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
        </SheetContent>
      </Sheet>
      <span className="ml-3 text-sm font-medium text-sidebar-foreground/80">
        {currentPage?.label ?? '後台管理'}
      </span>
    </header>
  )
}
