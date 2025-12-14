#!/bin/bash
echo "🔑 Gemini API Key Setup"
echo ""
echo "1. Visit: https://aistudio.google.com/app/apikey"
echo "2. Click 'Create API Key'"
echo "3. Copy the key"
echo ""
read -p "Paste your API key here: " api_key
echo ""
echo "GEMINI_API_KEY=$api_key" >> .env.local
echo "✅ API key added to .env.local"
echo ""
echo "Now run: npx tsx scripts/generate_content.ts"
