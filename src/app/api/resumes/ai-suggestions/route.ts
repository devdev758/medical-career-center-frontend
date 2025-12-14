import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

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
    console.log('[AI Suggestions] API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('[AI Suggestions] API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 10));

    // Direct fetch to OpenAI API instead of using SDK
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
            content: 'You are a professional resume writer specializing in healthcare careers.'
          },
          {
            role: 'user',
            content: `Generate a brief professional summary for a ${data.profession || 'healthcare professional'} with the following background:\n\nExperience: ${data.workExperience?.map((exp: any) => exp.title).join(', ') || 'Not specified'}\nEducation: ${data.education?.map((edu: any) => edu.degree).join(', ') || 'Not specified'}\nSkills: ${data.skills?.join(', ') || 'Not specified'}\n\nWrite a 2-3 sentence professional summary.`
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    console.log('[AI Suggestions] OpenAI status:', openaiResponse.status);

    const responseText = await openaiResponse.text();
    console.log('[AI Suggestions] OpenAI raw response:', responseText.substring(0, 500));

    if (!openaiResponse.ok) {
      console.error('[AI Suggestions] OpenAI error response:', responseText);
      return NextResponse.json(
        {
          error: 'OpenAI API error',
          details: responseText,
          status: openaiResponse.status
        },
        { status: 500 }
      );
    }

    const result = JSON.parse(responseText);
    const suggestion = result.choices?.[0]?.message?.content || '';

    console.log('[AI Suggestions] Success:', {
      suggestionLength: suggestion.length,
      finishReason: result.choices?.[0]?.finish_reason
    });

    return NextResponse.json({ suggestion });
  } catch (error: any) {
    console.error('[AI Suggestions] Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 500),
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
