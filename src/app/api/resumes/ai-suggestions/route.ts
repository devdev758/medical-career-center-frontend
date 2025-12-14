import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/resumes/ai-suggestions
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    console.log('[AI Suggestions] Request:', { type, userId: session.user.id });

    let suggestion = '';

    switch (type) {
      case 'summary':
        suggestion = await generateProfessionalSummary(data);
        break;
      case 'bulletPoints':
        suggestion = await enhanceBulletPoints(data);
        break;
      case 'skills':
        suggestion = await recommendSkills(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid suggestion type' }, { status: 400 });
    }

    console.log('[AI Suggestions] Success:', { type, suggestionLength: suggestion.length });

    return NextResponse.json({ suggestion });
  } catch (error: any) {
    console.error('[AI Suggestions] Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response?.data,
    });

    return NextResponse.json(
      {
        error: 'Failed to generate suggestion',
        details: error.message
      },
      { status: 500 }
    );
  }
}

async function generateProfessionalSummary(data: any): Promise<string> {
  const { workExperience, education, skills, profession } = data;

  const prompt = `Generate a compelling professional summary for a ${profession || 'healthcare professional'} resume based on the following information:

Work Experience:
${workExperience?.map((exp: any) => `- ${exp.title} at ${exp.company} (${exp.years || 'current'})`).join('\n') || 'No experience provided'}

Education:
${education?.map((edu: any) => `- ${edu.degree} from ${edu.institution}`).join('\n') || 'No education provided'}

Skills:
${skills?.join(', ') || 'No skills provided'}

Write a 3-4 sentence professional summary that:
1. Highlights key qualifications and experience
2. Emphasizes relevant skills and achievements
3. Shows career progression and expertise
4. Uses strong action words and quantifiable results where possible
5. Is tailored for the medical/healthcare field

Return only the summary text, no additional formatting or explanations.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional resume writer specializing in healthcare and medical careers. Generate compelling, concise professional summaries.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  const result = completion.choices[0]?.message?.content || '';
  console.log('[AI] Summary generated:', { length: result.length });
  return result;
}

async function enhanceBulletPoints(data: any): Promise<string> {
  const { description, title, company } = data;

  const prompt = `Enhance the following job description bullet points for a ${title} position at ${company}:

Current description:
${description}

Improve these bullet points by:
1. Starting with strong action verbs
2. Adding quantifiable metrics where appropriate
3. Highlighting achievements and impact
4. Using concise, professional language
5. Focusing on results and outcomes

Return 3-5 enhanced bullet points, each on a new line starting with a dash (-). Return only the bullet points, no additional text.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional resume writer. Enhance job descriptions with strong action verbs and quantifiable achievements.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  return completion.choices[0]?.message?.content || '';
}

async function recommendSkills(data: any): Promise<string> {
  const { profession, currentSkills, experience } = data;

  const prompt = `Based on the following information for a ${profession}:

Current Skills: ${currentSkills?.join(', ') || 'None listed'}
Experience Level: ${experience || 'Not specified'}

Recommend 5-10 additional relevant skills that would strengthen this resume. Focus on:
1. Technical skills specific to ${profession}
2. Soft skills valued in healthcare
3. Certifications or specialized knowledge
4. Industry-standard tools and technologies

Return only a comma-separated list of skills, no explanations.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a career advisor specializing in healthcare professions. Recommend relevant skills for resumes.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return completion.choices[0]?.message?.content || '';
}
