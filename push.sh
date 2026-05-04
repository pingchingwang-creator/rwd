#!/bin/zsh
# Usage: ./push.sh "commit message"
# If no message, uses timestamp

MSG="${1:-"chore: update $(date '+%Y-%m-%d %H:%M')"}"

echo "📦 Staging all changes..."
git add -A

echo "✏️  Committing: $MSG"
git commit -m "$MSG" || { echo "Nothing to commit."; exit 0; }

echo "🚀 Pushing to GitHub (Vercel auto-deploy will trigger)..."
git push origin main

echo "✅ Done! Check deployment: https://vercel.com/pingchingwang-creators-projects/company-site"
