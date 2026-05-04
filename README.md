# 晶采數位科技 — 企業形象網站

> 日式清爽 × 台南古都 × 科技感  
> 兩人公司也能有大品牌的力道

**線上網址**：https://company-site-sigma-one.vercel.app  
**後台登入**：https://company-site-sigma-one.vercel.app/admin/login

---

## 技術棧

| 層級 | 技術 |
|------|------|
| Framework | Next.js 16 (App Router, TypeScript) |
| 樣式 | Tailwind CSS v4 + shadcn/ui (base-ui) |
| 資料庫 | Supabase PostgreSQL |
| 認證 | Supabase Auth |
| 檔案儲存 | Supabase Storage |
| 富文字編輯 | Tiptap |
| 部署 | Vercel（GitHub push 自動部署） |

---

## 專案結構

```
company-site/
├── app/
│   ├── (public)/          # 前台頁面
│   │   ├── page.tsx       # 首頁
│   │   ├── about/         # 關於我們
│   │   ├── products/      # 產品列表 & 詳情
│   │   └── news/          # 新聞列表 & 詳情
│   ├── admin/             # 後台（需登入）
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── company/       # 編輯公司介紹
│   │   ├── news/          # 新聞 CRUD
│   │   └── products/      # 產品 CRUD
│   └── api/auth/callback/ # Supabase OAuth callback
├── components/
│   ├── public/            # 前台元件（Navbar、Footer、Card）
│   └── admin/             # 後台元件（Sidebar、TiptapEditor、ImageUploader）
├── lib/supabase/          # Supabase client（browser & server）
├── types/                 # TypeScript 型別定義
├── supabase/migrations/   # DB schema SQL
├── public/illustrations/  # SVG 預設圖示
├── push.sh                # 一鍵推版腳本
└── proxy.ts               # Route guard middleware
```

---

## 頁面路徑

### 前台

| 路徑 | 說明 |
|------|------|
| `/` | 首頁（Hero + 精選產品 + 最新消息） |
| `/about` | 關於我們、品牌故事、聯絡資訊 |
| `/products` | 產品 / 服務列表 |
| `/products/[slug]` | 產品詳情 |
| `/news` | 新聞 / 文章列表 |
| `/news/[slug]` | 新聞詳情 |

### 後台（需登入）

| 路徑 | 說明 |
|------|------|
| `/admin/login` | 管理員登入 |
| `/admin/dashboard` | 儀表板 |
| `/admin/company` | 編輯公司介紹、Hero 圖、Logo |
| `/admin/news` | 新聞列表 |
| `/admin/news/new` | 新增新聞 |
| `/admin/news/[id]/edit` | 編輯新聞 |
| `/admin/products` | 產品列表 |
| `/admin/products/new` | 新增產品 |
| `/admin/products/[id]/edit` | 編輯產品 |

---

## 本機開發

### 1. 環境變數

```bash
cp .env.local.example .env.local
```

填入 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://aysqnorayxogrgpejkan.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 安裝 & 啟動

```bash
npm install
npm run dev
```

或使用一鍵啟動腳本（含本機 Supabase）：

```bash
./start.sh
```

---

## 部署流程

### 日常更新（改完程式碼後）

```bash
./push.sh "修改說明"
```

push 到 GitHub main branch → Vercel 自動偵測 → 約 1–2 分鐘完成部署。

### 環境變數（Vercel）

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key |

---

## 資料庫 Schema

| 表格 | 說明 |
|------|------|
| `company_info` | 公司基本資訊（singleton，只有一筆） |
| `news` | 新聞文章（支援草稿 / 發布） |
| `products` | 產品 / 服務（支援上下架、排序） |
| `members` | 會員（預留，連結 Supabase Auth） |

Schema 定義：`supabase/migrations/20260503000000_init.sql`

---

## 後台帳號

> 首次部署後，由 Supabase Auth 管理員帳號建立。

| 項目 | 值 |
|------|-----|
| Email | `admin@company.com` |
| 密碼 | `Admin@2026!` |

**建議上線後立即更改密碼**：Supabase Dashboard → Authentication → Users

---

## 未來擴充

| 功能 | 現況 |
|------|------|
| 蝦皮商店連結 | `products.shopee_url` 欄位已建，詳情頁已有按鈕 |
| 會員系統 | `members` table 已建，Supabase Auth 已整合 |
| 多語言 | 可加入 `next-intl` |
| 電子報 | 可串 Resend / Mailchimp |
| 分析 | 可串 Google Analytics 或 Vercel Analytics |
