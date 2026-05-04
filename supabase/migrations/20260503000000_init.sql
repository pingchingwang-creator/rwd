-- ============================================================
-- Company Image Website - Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- company_info (singleton row)
CREATE TABLE IF NOT EXISTS company_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT '公司名稱',
  hero_subtitle TEXT NOT NULL DEFAULT '我們的使命與願景',
  about_content TEXT NOT NULL DEFAULT '<p>關於我們...</p>',
  hero_image_url TEXT,
  logo_url TEXT,
  meta_description TEXT DEFAULT '企業形象網站',
  email TEXT,
  phone TEXT,
  address TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert the single default row
INSERT INTO company_info (hero_title, hero_subtitle, about_content)
VALUES ('公司名稱', '台南在地科技公司', '<p>我們是一間位於台南的科技新創，致力於打造創新產品。</p>')
ON CONFLICT DO NOTHING;

-- news articles
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  shopee_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- members (reserved for future use)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  shopee_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Public: read company_info (always)
CREATE POLICY "public_read_company_info"
  ON company_info FOR SELECT USING (true);

-- Public: read published news only
CREATE POLICY "public_read_published_news"
  ON news FOR SELECT TO anon USING (is_published = true);

-- Public: read active products only
CREATE POLICY "public_read_active_products"
  ON products FOR SELECT TO anon USING (is_active = true);

-- Authenticated: full access to all tables
CREATE POLICY "auth_all_company_info"
  ON company_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_news"
  ON news FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_products"
  ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_own_member"
  ON members FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Storage Buckets
-- Run separately or in Supabase Dashboard > Storage
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('public-images', 'public-images', true)
-- ON CONFLICT DO NOTHING;
