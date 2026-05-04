import { createClient } from '@/lib/supabase/server'
import { Mail, Phone, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '關於我們',
}

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: company } = await supabase.from('company_info').select('*').single()

  return (
    <>
      {/* Page Header */}
      <section className="bg-inkblue py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(201,164,94,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-gold font-mono mb-3">ABOUT US</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-washi">
            關於我們
          </h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-5" />
        </div>
      </section>

      {/* About content */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Decorative element */}
          <div className="hidden lg:flex flex-col items-center gap-4 col-span-1 pt-4">
            <div className="w-px flex-1 bg-gradient-to-b from-gold/60 to-transparent" />
            <span className="font-heading text-4xl text-inkblue/10 font-bold rotate-90 tracking-widest select-none">
              南
            </span>
          </div>

          {/* Main content */}
          <div className="col-span-4">
            <div
              className="prose prose-lg max-w-none prose-brand
                prose-headings:font-heading prose-headings:text-inkblue
                prose-a:text-indigo prose-a:no-underline hover:prose-a:text-gold
                prose-img:rounded-lg"
              dangerouslySetInnerHTML={{
                __html: company?.about_content ?? '<p>關於我們的介紹即將更新。</p>',
              }}
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-washi-dark py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[0.2em] text-gold font-mono mb-2">TEAM</p>
            <h2 className="font-heading text-3xl font-bold text-inkblue ink-divider inline-block">
              團隊成員
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              { name: '成員一', role: '共同創辦人', initial: '一' },
              { name: '成員二', role: '共同創辦人', initial: '二' },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-card rounded-lg p-6 border border-border text-center hover:border-gold transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-inkblue/5 border-2 border-border mx-auto mb-4 flex items-center justify-center">
                  <span className="font-heading text-2xl text-inkblue/30">{member.initial}</span>
                </div>
                <h3 className="font-heading font-semibold text-inkblue">{member.name}</h3>
                <p className="text-sm text-gold mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] text-gold font-mono mb-2">CONTACT</p>
          <h2 className="font-heading text-3xl font-bold text-inkblue ink-divider">
            聯絡我們
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Mail,
              label: '電子郵件',
              value: company?.email,
              href: company?.email ? `mailto:${company.email}` : undefined,
              placeholder: 'example@company.com',
            },
            {
              icon: Phone,
              label: '電話',
              value: company?.phone,
              href: company?.phone ? `tel:${company.phone}` : undefined,
              placeholder: '(06) 000-0000',
            },
            {
              icon: MapPin,
              label: '地址',
              value: company?.address,
              href: undefined,
              placeholder: '台南市...',
            },
          ].map(({ icon: Icon, label, value, href, placeholder }) => (
            <div key={label} className="flex flex-col items-start p-6 bg-card rounded-lg border border-border">
              <div className="w-10 h-10 rounded bg-gold/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-gold" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              {value ? (
                href ? (
                  <a href={href} className="font-medium text-inkblue hover:text-gold transition-colors text-sm">
                    {value}
                  </a>
                ) : (
                  <p className="font-medium text-inkblue text-sm">{value}</p>
                )
              ) : (
                <p className="text-muted-foreground/50 text-sm">{placeholder}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
