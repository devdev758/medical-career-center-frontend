import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// GET /api/test-openai - Test OpenAI connection
export async function GET(request: NextRequest) {
    try {
        console.log('[Test OpenAI] API Key exists:', !!process.env.OPENAI_API_KEY);
        console.log('[Test OpenAI] API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 7));

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        console.log('[Test OpenAI] Calling OpenAI...');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: 'Say "Hello, OpenAI is working!"'
                }
            ],
            max_tokens: 50,
        });

        console.log('[Test OpenAI] Response:', completion);

        return NextResponse.json({
            success: true,
            message: completion.choices[0]?.message?.content,
            finishReason: completion.choices[0]?.finish_reason,
            model: completion.model,
        });
    } catch (error: any) {
        console.error('[Test OpenAI] Error:', {
            message: error.message,
            type: error.type,
            code: error.code,
            status: error.status,
        });

        return NextResponse.json({
            success: false,
            error: error.message,
            type: error.type,
            code: error.code,
            status: error.status,
        }, { status: 500 });
    }
}
