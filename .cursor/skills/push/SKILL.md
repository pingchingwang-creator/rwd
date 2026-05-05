---
name: push
description: Stage、commit 並 push 程式碼到 GitHub，觸發 Vercel 自動部署。當使用者說 /push、要推版、要部署、push 程式碼時使用。
---

# Push & Deploy

## 步驟

1. 執行 `git status` 確認有變更
2. 若有變更，執行：
   ```bash
   cd /Users/edward/Documents/Claude/Projects/company-site
   ./push.sh "<commit message>"
   ```
3. commit message 規則：
   - 有具體說明 → 用使用者說的內容
   - 沒說明 → 根據 `git diff --cached` 自動產生，格式 `<type>: <說明>`
   - type 選項：`feat` / `fix` / `docs` / `style` / `refactor` / `chore`

4. push 完告知：
   - Vercel 部署進度：https://vercel.com/pingchingwang-creators-projects/company-site
   - 線上網址：https://company-site-sigma-one.vercel.app

## 注意

- 若 `./push.sh` 回報 "Nothing to commit" → 告知使用者沒有變更
- 永遠 push 到 `main` branch
