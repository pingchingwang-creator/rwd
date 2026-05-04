import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import type { CompanyInfo } from '@/types'

interface FooterProps {
  company?: Pick<CompanyInfo, 'email' | 'phone' | 'address'>
}

export function Footer({ company }: FooterProps) {
  return (
    <footer className="bg-inkblue text-washi/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-sm bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-heading text-sm font-bold">南</span>
              </span>
              <span className="font-heading font-bold text-washi text-lg">公司名稱</span>
            </div>
            <p className="text-sm text-washi/60 leading-relaxed">
              台南在地科技公司<br />
              以創新技術，傳承古都精神
            </p>
            <div className="w-8 h-[2px] bg-gold mt-4" />
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading text-washi font-semibold mb-4 text-sm tracking-widest uppercase">
              網站導覽
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: '首頁' },
                { href: '/about', label: '關於我們' },
                { href: '/products', label: '產品介紹' },
                { href: '/news', label: '最新消息' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-washi/60 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-washi font-semibold mb-4 text-sm tracking-widest uppercase">
              聯絡我們
            </h3>
            <ul className="space-y-3">
              {company?.email && (
                <li className="flex items-center gap-2 text-sm text-washi/60">
                  <Mail size={14} className="text-gold shrink-0" />
                  <a href={`mailto:${company.email}`} className="hover:text-gold transition-colors">
                    {company.email}
                  </a>
                </li>
              )}
              {company?.phone && (
                <li className="flex items-center gap-2 text-sm text-washi/60">
                  <Phone size={14} className="text-gold shrink-0" />
                  <a href={`tel:${company.phone}`} className="hover:text-gold transition-colors">
                    {company.phone}
                  </a>
                </li>
              )}
              {company?.address && (
                <li className="flex items-start gap-2 text-sm text-washi/60">
                  <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                  <span>{company.address}</span>
                </li>
              )}
              {!company?.email && !company?.phone && !company?.address && (
                <li className="text-sm text-washi/40">
                  請在後台設定聯絡資訊
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-washi/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-washi/40">
            © {new Date().getFullYear()} 公司名稱. All rights reserved.
          </p>
          <p className="text-xs text-washi/30">
            台南古都 × 現代科技
          </p>
        </div>
      </div>
    </footer>
  )
}
