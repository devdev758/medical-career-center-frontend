import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

// Validation schema for creating/updating resumes
const resumeSchema = z.object({
    name: z.string().min(1, 'Resume name is required'),
    professionSlug: z.string().optional(),
    templateId: z.string().default('professional'),
    customSummary: z.string().optional(),
    customSkills: z.any().optional(),
    selectedExp: z.any().optional(),
    selectedEdu: z.any().optional(),
    selectedCerts: z.any().optional(),
    isPrimary: z.boolean().default(false),
    isPublic: z.boolean().default(false),
});

// GET /api/resumes - List user's resumes
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resumes = await prisma.resume.findMany({
            where: { userId: session.user.id },
            orderBy: [
                { isPrimary: 'desc' },
                { updatedAt: 'desc' }
            ],
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });

        return NextResponse.json(resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resumes' },
            { status: 500 }
        );
    }
}

// POST /api/resumes - Create new resume
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = resumeSchema.parse(body);

        // If setting as primary, unset other primary resumes
        if (validatedData.isPrimary) {
            await prisma.resume.updateMany({
                where: {
                    userId: session.user.id,
                    isPrimary: true
                },
                data: { isPrimary: false }
            });
        }

        const resume = await prisma.resume.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
        });

        return NextResponse.json(resume, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            );
        }

        console.error('Error creating resume:', error);
        return NextResponse.json(
            { error: 'Failed to create resume' },
            { status: 500 }
        );
    }
}
