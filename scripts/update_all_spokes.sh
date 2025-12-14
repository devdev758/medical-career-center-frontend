#!/bin/bash

# Update all 6 remaining spoke pages with conditional rendering

PAGES=(
  "certification-page:certificationContent:Certification & Licensing"
  "skills-page:skillsContent:Essential Skills"
  "specializations-page:specializationsContent:Specializations"
  "career-path-page:careerPathContent:Career Path"
  "work-life-balance-page:workLifeBalanceContent:Work-Life Balance"
  "resume-page:resumeContent:Resume Guide"
)

for page_info in "${PAGES[@]}"; do
  IFS=':' read -r page_dir field_name page_title <<< "$page_info"
  page_file="src/app/(profession-spokes)/$page_dir/page.tsx"
  
  echo "Updating $page_file..."
  
  # 1. Add MarkdownContent import if not present
  if ! grep -q "MarkdownContent" "$page_file"; then
    sed -i '' '/import { CrossPageLinks/a\
import { MarkdownContent } from '"'"'@/components/content/MarkdownContent'"'"';
' "$page_file"
  fi
  
  # 2. Add database fetch after careerTitle
  if ! grep -q "$field_name" "$page_file"; then
    sed -i '' '/const careerTitle = formatCareerTitle(profession);/a\
\
    // Fetch career guide data for AI-generated content\
    const careerGuide = await prisma.careerGuide.findUnique({\
        where: { professionSlug: profession },\
        select: { '"$field_name"': true }\
    });
' "$page_file"
  fi
  
  echo "  ✅ Updated $page_dir"
done

echo ""
echo "All spoke pages updated with database fetching!"
