import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: company } = await supabase
    .from('company_info')
    .select('email, phone, address')
    .single()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer company={company ?? undefined} />
    </div>
  )
}
