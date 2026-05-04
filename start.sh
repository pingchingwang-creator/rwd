#!/bin/zsh
# 南島科技網站 — 一鍵本機啟動腳本

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  南島科技 — 本機環境啟動"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Start Docker Desktop
echo "${YELLOW}[1/4]${NC} 啟動 Docker Desktop..."
open -a Docker

echo "  等待 Docker 就緒（最多 60 秒）..."
for i in {1..20}; do
  if docker ps &>/dev/null 2>&1; then
    echo "  ${GREEN}✓ Docker 已就緒${NC}"
    break
  fi
  if [ $i -eq 20 ]; then
    echo "  ${RED}✗ Docker 啟動逾時，請手動開啟 Docker Desktop 後重試${NC}"
    exit 1
  fi
  sleep 3
  printf "  .%s" "$i"
done
echo ""

# Step 2: Start Supabase
echo ""
echo "${YELLOW}[2/4]${NC} 啟動 Supabase 本地資料庫..."
cd "$PROJECT_DIR"

SUPA_STATUS=$(supabase status 2>&1)
if echo "$SUPA_STATUS" | grep -q "running"; then
  echo "  ${GREEN}✓ Supabase 已在執行中${NC}"
else
  echo "  正在啟動 Supabase（首次需要一點時間）..."
  supabase start 2>&1 | tail -5
  echo "  ${GREEN}✓ Supabase 啟動完成${NC}"
fi

# Step 3: Kill old dev server if any
echo ""
echo "${YELLOW}[3/4]${NC} 清理舊的 dev server..."
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "  已清除 port 3000" || echo "  port 3000 空閒中"

# Step 4: Start Next.js dev server
echo ""
echo "${YELLOW}[4/4]${NC} 啟動網站..."
cd "$PROJECT_DIR"
npm run dev &
DEV_PID=$!

sleep 4
if kill -0 $DEV_PID 2>/dev/null; then
  echo "  ${GREEN}✓ 網站已啟動！${NC}"
else
  echo "  ${RED}✗ 啟動失敗，請檢查錯誤訊息${NC}"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ${GREEN}✓ 全部就緒！${NC}"
echo ""
echo "  前台網站   → http://localhost:3000"
echo "  後台管理   → http://localhost:3000/admin/login"
echo "  Supabase  → http://127.0.0.1:54323"
echo ""
echo "  後台帳號：admin@company.com"
echo "  後台密碼：Admin@1234"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "（按 Ctrl+C 停止網站）"

wait $DEV_PID
