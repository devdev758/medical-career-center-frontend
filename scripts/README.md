# Content Generation Script Setup

## Quick Start

1. Get a free Gemini API key from: https://aistudio.google.com/app/apikey

2. Add to your `.env.local` file:
```
GEMINI_API_KEY=your_api_key_here
```

3. Run the script:
```bash
npx tsx scripts/generate_content.ts
```

## What It Does

- Generates all 8 spokes for Physical Therapists (~12,600 words total)
- Uses Gemini 2.0 Flash (free tier)
- Includes 30-40 internal links per spoke
- Includes 10-15 external links per spoke
- Deploys directly to database
- Takes ~20-30 minutes

## Review URLs

After running, review at:
- https://beta.medicalcareercenter.org/how-to-become-physical-therapists
- https://beta.medicalcareercenter.org/physical-therapists-interview-questions
- https://beta.medicalcareercenter.org/physical-therapists-certification
- https://beta.medicalcareercenter.org/physical-therapists-skills
- https://beta.medicalcareercenter.org/physical-therapists-specializations
- https://beta.medicalcareercenter.org/physical-therapists-career-path
- https://beta.medicalcareercenter.org/physical-therapists-work-life-balance
- https://beta.medicalcareercenter.org/physical-therapists-resume

## For Batch Generation (All 91 Professions)

Once you approve PT content, I'll create a batch script that runs overnight for all professions.
