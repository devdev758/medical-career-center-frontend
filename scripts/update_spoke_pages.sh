#!/bin/bash

# This script adds AI content rendering to all spoke pages

PAGES=(
  "certification-page:certificationContent"
  "skills-page:skillsContent"
  "specializations-page:specializationsContent"
  "career-path-page:careerPathContent"
  "work-life-balance-page:workLifeBalanceContent"
  "resume-page:resumeContent"
)

echo "Updating spoke pages to render AI content..."

for page_info in "${PAGES[@]}"; do
  IFS=':' read -r page_dir field_name <<< "$page_info"
  page_file="src/app/(profession-spokes)/$page_dir/page.tsx"
  
  echo "Processing $page_file..."
  
  # Check if file exists
  if [ ! -f "$page_file" ]; then
    echo "  ❌ File not found: $page_file"
    continue
  fi
  
  # Check if already updated
  if grep -q "$field_name" "$page_file"; then
    echo "  ✅ Already updated"
    continue
  fi
  
  echo "  📝 Needs update for field: $field_name"
done

echo ""
echo "Manual updates required - spoke pages need conditional rendering logic added"
