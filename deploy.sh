#!/bin/bash
# Deploy 55-profession system to production

set -e # Exit on error

echo "📦 Staging all changes..."
git add -A

echo "📝 Committing changes..."
GIT_EDITOR=true git commit -m "feat: Implement 55-profession system with BLS keyword mapping

- Add Profession model to schema with tier/rank/BLS keywords
- Seed 55 approved professions to database  
- Create profession-utils for validation and BLS mapping
- Update hub page with profession validation and BLS queries
- Update salary page with BLS keyword mapping for all levels
- All 55 professions now accessible with generic content
- RN functionality fully preserved"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Check Dokploy dashboard for auto-deployment"
echo "2. Once deployed, run on production:"
echo "   - npx prisma db push"
echo "   - npx tsx scripts/seed-professions.ts"
