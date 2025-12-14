import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../src/lib/prisma';
import * as fs from 'fs';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

interface SpokeContent {
    name: string;
    field: string;
    wordCount: number;
    prompt: string;
}

const SPOKES: SpokeContent[] = [
    {
        name: 'Career Guide',
        field: 'fullContent',
        wordCount: 2500,
        prompt: `Write a comprehensive career guide for {profession} in 2,500 words. Use a professional yet approachable tone (like an experienced career coach). 

Include these sections with markdown formatting:
- Introduction
- What Does a {profession} Do? (daily responsibilities, work environment)
- Education and Training Requirements (degrees, programs, timeline)
- Licensure and Certification
- Essential Skills (technical and soft skills)
- Career Outlook and Job Market
- Salary and Compensation (include BLS data)
- Pros and Cons
- Getting Started: Your Action Plan
- Conclusion

Add 30-40 internal links naturally:
- Salary pages: /{slug}-salary, /{slug}-salary/ca, /{slug}-salary/ca/san-francisco
- Jobs pages: /{slug}-jobs, /{slug}-jobs/tx, /{slug}-jobs/ny
- Schools pages: /{slug}-schools, /{slug}-schools/ca
- Related professions from the same healthcare family
- Other spokes: /{slug}-skills, /{slug}-specializations, /{slug}-career-path

Add 10-15 external links to authoritative sources:
- Bureau of Labor Statistics (BLS)
- Professional associations
- Licensing boards
- Accreditation bodies

Write in a conversational, encouraging style. Be specific and data-driven. Avoid generic advice.`
    },
    {
        name: 'Interview Prep',
        field: 'interviewContent',
        wordCount: 2000,
        prompt: `Write a comprehensive interview preparation guide for {profession} in 2,000 words.

Include these sections:
- Introduction
- Understanding the Interview Process (formats, what employers evaluate)
- Common Interview Questions and Response Strategies (with STAR method examples)
- Clinical/Technical Scenario Questions
- Behavioral Questions
- Questions About Teamwork and Communication
- Questions to Ask the Interviewer
- Interview Preparation Checklist
- What to Wear
- Red Flags to Watch For
- After the Interview
- Final Tips for Success
- Conclusion

Include 15-20 specific interview questions with detailed example responses.
Add internal links to: career guide, jobs pages, salary pages, skills page.
Add external links to: professional associations, interview resources.

Tone: Professional, supportive, practical. Focus on actionable advice.`
    },
    {
        name: 'Certification',
        field: 'certificationContent',
        wordCount: 1200,
        prompt: `Write a certification guide for {profession} in 1,200 words.

Include:
- Introduction (why certification matters)
- Required Certifications (state licensure, national boards)
- Optional Specialty Certifications (list 5-8 with issuing bodies)
- Certification Process (steps, timeline, costs)
- Exam Preparation Tips
- Maintaining Certification (CEUs, renewal)
- Career Impact of Certification
- Conclusion

Add internal links to: career guide, schools, jobs pages.
Add external links to: certification bodies, licensing boards, professional organizations.

Tone: Informative, encouraging, detail-oriented.`
    },
    {
        name: 'Skills',
        field: 'skillsContent',
        wordCount: 1200,
        prompt: `Write a skills guide for {profession} in 1,200 words.

Include:
- Introduction
- Essential Technical Skills (8-10 specific skills with descriptions)
- Critical Soft Skills (6-8 skills with examples)
- Technology and Tools (software, equipment, systems)
- Developing These Skills (education, practice, resources)
- Skills for Career Advancement
- Emerging Skills in the Field
- Conclusion

Add internal links to: career guide, career path, specializations.
Add external links to: professional development resources, training programs.

Tone: Practical, skill-focused, development-oriented.`
    },
    {
        name: 'Specializations',
        field: 'specializationsContent',
        wordCount: 1500,
        prompt: `Write a specializations guide for {profession} in 1,500 words.

Include:
- Introduction (why specialize)
- Major Specialization Areas (8-12 specializations with descriptions)
- Requirements for Each Specialization (education, certification, experience)
- Career Opportunities by Specialization
- Salary Differences
- Choosing Your Specialization
- Emerging Specializations
- Conclusion

Add internal links to: career guide, certification, skills, jobs pages.
Add external links to: specialty organizations, certification bodies.

Tone: Informative, exploratory, career-focused.`
    },
    {
        name: 'Career Path',
        field: 'careerPathContent',
        wordCount: 1200,
        prompt: `Write a career path guide for {profession} in 1,200 words.

Include:
- Introduction
- Entry-Level Positions (new graduate roles)
- Mid-Career Advancement (3-7 years)
- Senior-Level Positions (8-15 years)
- Leadership and Management Roles
- Alternative Career Paths (education, research, consulting)
- Lateral Moves and Specialization Changes
- Timeline and Milestones
- Conclusion

Add internal links to: career guide, specializations, skills, salary pages.
Add external links to: professional associations, leadership resources.

Tone: Aspirational, realistic, growth-oriented.`
    },
    {
        name: 'Work-Life Balance',
        field: 'workLifeBalanceContent',
        wordCount: 1000,
        prompt: `Write a work-life balance guide for {profession} in 1,000 words.

Include:
- Introduction
- Typical Work Schedules (hours, shifts, flexibility)
- Physical Demands
- Emotional and Mental Health Considerations
- Strategies for Maintaining Balance
- Burnout Prevention
- Family and Personal Life
- Part-Time and Flexible Options
- Self-Care Tips
- Conclusion

Add internal links to: career guide, jobs pages.
Add external links to: wellness resources, professional support organizations.

Tone: Empathetic, realistic, supportive.`
    },
    {
        name: 'Resume',
        field: 'resumeContent',
        wordCount: 1000,
        prompt: `Write a resume guide for {profession} in 1,000 words.

Include:
- Introduction
- Resume Format and Structure
- Key Sections (summary, experience, education, certifications, skills)
- Action Verbs and Keywords for {profession}
- Quantifying Achievements
- Common Mistakes to Avoid
- ATS Optimization
- Cover Letter Tips
- Sample Resume Snippets
- Conclusion

Add internal links to: career guide, interview prep, skills.
Add external links to: resume resources, professional templates.

Tone: Practical, professional, actionable.`
    }
];

async function generateContent(profession: string, slug: string, spoke: SpokeContent): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = spoke.prompt
        .replace(/{profession}/g, profession)
        .replace(/{slug}/g, slug);

    console.log(`  Generating ${spoke.name}...`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    console.log(`  ✅ ${spoke.name} generated (${content.length} chars)`);

    return content;
}

async function generateAllSpokes(profession: string, slug: string) {
    console.log(`\n🚀 Generating all content for ${profession}...\n`);

    const contentMap: Record<string, string> = {};

    for (const spoke of SPOKES) {
        try {
            const content = await generateContent(profession, slug, spoke);
            contentMap[spoke.field] = content;

            // Rate limiting - wait 2 seconds between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`  ❌ Error generating ${spoke.name}:`, error);
            throw error;
        }
    }

    console.log(`\n✅ All content generated for ${profession}`);
    console.log(`📊 Total characters: ${Object.values(contentMap).reduce((sum, c) => sum + c.length, 0)}`);

    return contentMap;
}

async function deployContent(slug: string, contentMap: Record<string, string>) {
    console.log(`\n📦 Deploying content to database...`);

    await prisma.careerGuide.update({
        where: { professionSlug: slug },
        data: {
            ...contentMap,
            updatedAt: new Date()
        }
    });

    console.log(`✅ Content deployed successfully!`);
}

async function main() {
    const profession = 'Physical Therapists';
    const slug = 'physical-therapists';

    try {
        // Generate all content
        const contentMap = await generateAllSpokes(profession, slug);

        // Deploy to database
        await deployContent(slug, contentMap);

        console.log(`\n🎉 Complete! Review at:`);
        console.log(`   - https://beta.medicalcareercenter.org/how-to-become-${slug}`);
        console.log(`   - https://beta.medicalcareercenter.org/${slug}-interview-questions`);
        console.log(`   - https://beta.medicalcareercenter.org/${slug}-certification`);
        console.log(`   - https://beta.medicalcareercenter.org/${slug}-skills`);
        console.log(`   - https://beta.medicalcareercenter.org/${slug}-specializations`);
        console.log(`   - https://beta.medicalcareercenter.org/${slug}-career-path`);
        console.log(`   - https://beta.medicalcareercenter.org/${slug}-work-life-balance`);
        console.log(`   - https://beta.medicalcareercenter.org/${slug}-resume`);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
