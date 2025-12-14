#!/bin/bash

# Simple script to add conditional rendering to interview page
# Based on working career guide page structure

FILE="src/app/(profession-spokes)/interview-page/page.tsx"

# 1. Add MarkdownContent import
sed -i '' '/import { CrossPageLinks/a\
import { MarkdownContent } from '"'"'@/components/content/MarkdownContent'"'"';
' "$FILE"

# 2. Add database fetch after careerTitle
sed -i '' '/const careerTitle = formatCareerTitle(profession);/a\
\
    // Fetch career guide data for AI-generated content\
    const careerGuide = await prisma.careerGuide.findUnique({\
        where: { professionSlug: profession },\
        select: { interviewContent: true }\
    });
' "$FILE"

# 3. Add conditional rendering before first Card
sed -i '' '/<SpokeNavigation profession={profession} currentSpoke="interview" \/>/a\
\
            {/* Render AI-generated content if available, otherwise show placeholder content */}\
            {careerGuide?.interviewContent ? (\
                <MarkdownContent content={careerGuide.interviewContent} />\
            ) : (\
                <>
' "$FILE"

echo "Interview page updated with conditional rendering"
