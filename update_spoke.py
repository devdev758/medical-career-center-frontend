#!/usr/bin/env python3
import sys
import re

def update_spoke_page(filepath, field_name):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Add MarkdownContent import if not present
    if 'MarkdownContent' not in content:
        content = content.replace(
            "import { CrossPageLinks } from '@/components/profession/CrossPageLinks';",
            "import { CrossPageLinks } from '@/components/profession/CrossPageLinks';\nimport { MarkdownContent } from '@/components/content/MarkdownContent';"
        )
    
    # 2. Add database fetch after careerTitle
    if field_name not in content:
        content = content.replace(
            "const careerTitle = formatCareerTitle(profession);",
            f"const careerTitle = formatCareerTitle(profession);\n\n    const careerGuide = await prisma.careerGuide.findUnique({{\n        where: {{ professionSlug: profession }},\n        select: {{ {field_name}: true }}\n    }});"
        )
    
    # 3. Hide title section when AI content present
    # Find the title div section
    title_pattern = r'(<div className="mb-8">.*?</div>\s*</div>)\s*(<SpokeNavigation)'
    def replace_title(match):
        title_div = match.group(1)
        spoke_nav = match.group(2)
        return f"{{!careerGuide?.{field_name} && (\n                {title_div}\n            )}}\n\n            {spoke_nav}"
    content = re.sub(title_pattern, replace_title, content, flags=re.DOTALL)
    
    # 4. Add conditional rendering after SpokeNavigation
    content = content.replace(
        '<SpokeNavigation profession={profession} currentSpoke="',
        f'<SpokeNavigation profession={{profession}} currentSpoke="'
    )
    # Find first content div/card after SpokeNavigation
    spoke_nav_pattern = r'(<SpokeNavigation[^>]+/>)\s*\n\s*(<(?:div|Card))'
    def add_conditional(match):
        spoke_nav = match.group(1)
        first_element = match.group(2)
        return f"{spoke_nav}\n\n            {{careerGuide?.{field_name} ? (\n                <MarkdownContent content={{careerGuide.{field_name}}} />\n            ) : (\n                <>\n            {first_element}"
    content = re.sub(spoke_nav_pattern, add_conditional, content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✅ Updated {filepath}")

if __name__ == "__main__":
    pages = [
        ("src/app/(profession-spokes)/certification-page/page.tsx", "certificationContent"),
        ("src/app/(profession-spokes)/skills-page/page.tsx", "skillsContent"),
        ("src/app/(profession-spokes)/specializations-page/page.tsx", "specializationsContent"),
        ("src/app/(profession-spokes)/career-path-page/page.tsx", "careerPathContent"),
        ("src/app/(profession-spokes)/work-life-balance-page/page.tsx", "workLifeBalanceContent"),
        ("src/app/(profession-spokes)/resume-page/page.tsx", "resumeContent"),
    ]
    
    for filepath, field_name in pages:
        update_spoke_page(filepath, field_name)
