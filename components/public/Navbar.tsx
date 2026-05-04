'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: '首頁' },
  { href: '/about', label: '關於我們' },
  { href: '/products', label: '產品介紹' },
  { href: '/news', label: '最新消息' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-washi/90 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-sm bg-inkblue flex items-center justify-center">
            <span className="text-gold font-heading text-sm font-bold">南</span>
          </span>
          <span className="font-heading font-bold text-inkblue text-lg tracking-wide group-hover:text-gold transition-colors">
            公司名稱
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'text-sm font-medium tracking-wide transition-colors relative py-1',
                  'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gold after:transition-all after:duration-300',
                  pathname === href
                    ? 'text-gold after:w-full'
                    : 'text-inkblue hover:text-gold after:w-0 hover:after:w-full'
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="開啟選單"
            className="md:hidden p-2 text-inkblue hover:text-gold transition-colors bg-transparent border-0"
          >
            <Menu size={22} />
          </SheetTrigger>
          <SheetContent side="right" className="bg-inkblue border-l-0 w-72 p-0">
            <div className="flex items-center justify-between px-6 h-16 border-b border-inkblue-light">
              <span className="font-heading text-washi font-bold text-lg">選單</span>
              <button onClick={() => setOpen(false)} className="text-washi/60 hover:text-gold transition-colors">
                <X size={20} />
              </button>
            </div>
            <ul className="flex flex-col py-6">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center px-6 py-4 text-base font-medium tracking-wide border-b border-inkblue-light/50 transition-colors',
                      pathname === href
                        ? 'text-gold bg-inkblue-light'
                        : 'text-washi hover:text-gold hover:bg-inkblue-light'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-6 pt-4">
              <div className="w-8 h-[2px] bg-gold mb-2" />
              <p className="text-washi/40 text-xs">台南在地科技公司</p>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
