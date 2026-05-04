# 企業形象網站

日式清爽 × 台南古都 × 科技感，Next.js + Supabase 全端企業形象網站。

## 技術棧

- **Framework**: Next.js 16 (App Router, TypeScript)
- **樣式**: Tailwind CSS v4 + shadcn/ui (base-ui)
- **後端/DB**: Supabase (PostgreSQL + Auth + Storage)
- **編輯器**: Tiptap

## 快速開始

### 1. 環境變數

複製 `.env.local.example` 為 `.env.local` 並填入 Supabase 憑證：

```bash
cp .env.local.example .env.local
```

在 `.env.local` 填入：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 2. Supabase 設定

1. 到 [supabase.com](https://supabase.com) 建立新專案
2. 在 SQL Editor 執行 `supabase/migrations/001_init.sql`
3. 在 Storage 建立 `public-images` bucket（設為 Public）
4. 在 Authentication > Users 建立管理員帳號

### 3. 安裝 & 啟動

```bash
npm install
npm run dev
```

## 頁面路徑

### 前台

| 路徑 | 說明 |
|------|------|
| `/` | 首頁 (Hero + 精選產品 + 最新消息) |
| `/about` | 關於我們 |
| `/products` | 產品列表 |
| `/products/[slug]` | 產品詳情 |
| `/news` | 新聞列表 |
| `/news/[slug]` | 新聞詳情 |

### 後台（需登入）

| 路徑 | 說明 |
|------|------|
| `/admin/login` | 管理員登入 |
| `/admin/dashboard` | 儀表板 |
| `/admin/company` | 編輯公司介紹 |
| `/admin/news` | 新聞管理 |
| `/admin/products` | 產品管理 |

## 部署至 Vercel

1. Push 到 GitHub
2. 在 Vercel import 專案
3. 在 Environment Variables 填入 Supabase 憑證
4. Deploy

## 未來擴充

- **蝦皮商店**: 產品欄位已有 `shopee_url`，詳情頁已有跳轉按鈕
- **會員系統**: `members` table 已建立，Supabase Auth 已整合
- **多語言**: 可加入 `next-intl`
