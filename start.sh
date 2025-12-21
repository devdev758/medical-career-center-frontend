#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding professions..."
npx tsx scripts/seed-professions.ts || echo "⚠️ Seed failed or already seeded"

echo "✅ Database ready!"
echo "🚀 Starting application..."
exec node server.js
