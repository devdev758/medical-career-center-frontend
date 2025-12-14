import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// POST /api/resumes/enhance-content
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { workExperience, education, certifications } = body;

        console.log('[AI Enhance] Request:', {
            userId: session.user.id,
            expCount: workExperience?.length,
            eduCount: education?.length,
            certCount: certifications?.length
        });

        const enhancedContent = {
            workExperience: [] as any[],
            education: [] as any[],
            certifications: [] as any[],
        };

        // Enhance work experience
        if (workExperience && workExperience.length > 0) {
            for (const exp of workExperience) {
                const enhanced = await enhanceWorkExperience(exp);
                enhancedContent.workExperience.push({
                    ...exp,
                    aiDescription: enhanced
                });
            }
        }

        // Enhance education
        if (education && education.length > 0) {
            for (const edu of education) {
                const enhanced = await enhanceEducation(edu);
                enhancedContent.education.push({
                    ...edu,
                    aiDescription: enhanced
                });
            }
        }

        // Enhance certifications
        if (certifications && certifications.length > 0) {
            for (const cert of certifications) {
                const enhanced = await enhanceCertification(cert);
                enhancedContent.certifications.push({
                    ...cert,
                    aiDescription: enhanced
                });
            }
        }

        console.log('[AI Enhance] Success');

        return NextResponse.json(enhancedContent);
    } catch (error: any) {
        console.error('[AI Enhance] Error:', {
            message: error.message,
            name: error.name,
        });

        return NextResponse.json(
            {
                error: 'Failed to enhance content',
                details: error.message
            },
            { status: 500 }
        );
    }
}

async function enhanceWorkExperience(exp: any): Promise<string> {
    const prompt = `Generate 3-4 professional bullet points describing the responsibilities and achievements for this work experience:

Job Title: ${exp.title}
Company: ${exp.company}
Duration: ${exp.startDate} to ${exp.isCurrent ? 'Present' : exp.endDate}
${exp.description ? `Current Description: ${exp.description}` : ''}

Write professional bullet points that:
- Start with strong action verbs
- Highlight key responsibilities
- Include relevant achievements
- Are specific to the healthcare/medical field
- Sound professional and impactful

Return only the bullet points, each starting with "• ", no additional text.`;

    return await callOpenAI(prompt, 250);
}

async function enhanceEducation(edu: any): Promise<string> {
    const prompt = `Generate a brief 1-2 sentence description for this education entry:

Degree: ${edu.degree}
Institution: ${edu.institution}
Field of Study: ${edu.fieldOfStudy || 'Not specified'}
Duration: ${edu.startDate} to ${edu.isCurrent ? 'Present' : edu.endDate}

Write a professional description that:
- Highlights the relevance to healthcare career
- Mentions any specializations or focus areas
- Sounds professional and concise

Return only the description, no additional formatting.`;

    return await callOpenAI(prompt, 150);
}

async function enhanceCertification(cert: any): Promise<string> {
    const prompt = `Generate a brief 1 sentence description for this certification:

Certification: ${cert.name}
Issuing Organization: ${cert.issuingOrg}
Issue Date: ${cert.issueDate}

Write a professional sentence that:
- Explains the significance of this certification
- Mentions what skills or knowledge it validates
- Is relevant to healthcare professionals

Return only the description, no additional formatting.`;

    return await callOpenAI(prompt, 100);
}

async function callOpenAI(prompt: string, maxTokens: number): Promise<string> {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional resume writer specializing in healthcare careers. Write concise, impactful content.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
        }),
    });

    if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('[AI Enhance] OpenAI error:', errorText);
        throw new Error('OpenAI API error');
    }

    const result = await openaiResponse.json();
    return result.choices?.[0]?.message?.content?.trim() || '';
}
