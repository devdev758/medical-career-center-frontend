import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const resumeUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    professionSlug: z.string().optional(),
    templateId: z.string().optional(),
    customSummary: z.string().optional(),
    customSkills: z.any().optional(),
    selectedExp: z.any().optional(),
    selectedEdu: z.any().optional(),
    selectedCerts: z.any().optional(),
    isPrimary: z.boolean().optional(),
    isPublic: z.boolean().optional(),
});

// GET /api/resumes/[resumeId] - Get resume details
export async function GET(
    request: NextRequest,
    { params }: { params: { resumeId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resume = await prisma.resume.findUnique({
            where: {
                id: params.resumeId,
                userId: session.user.id, // Ensure user owns this resume
            },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resume' },
            { status: 500 }
        );
    }
}

// PATCH /api/resumes/[resumeId] - Update resume
export async function PATCH(
    request: NextRequest,
    { params }: { params: { resumeId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const existingResume = await prisma.resume.findUnique({
            where: {
                id: params.resumeId,
                userId: session.user.id,
            },
        });

        if (!existingResume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        const body = await request.json();
        const validatedData = resumeUpdateSchema.parse(body);

        // If setting as primary, unset other primary resumes
        if (validatedData.isPrimary) {
            await prisma.resume.updateMany({
                where: {
                    userId: session.user.id,
                    isPrimary: true,
                    id: { not: params.resumeId }
                },
                data: { isPrimary: false }
            });
        }

        const updatedResume = await prisma.resume.update({
            where: { id: params.resumeId },
            data: validatedData,
        });

        return NextResponse.json(updatedResume);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            );
        }

        console.error('Error updating resume:', error);
        return NextResponse.json(
            { error: 'Failed to update resume' },
            { status: 500 }
        );
    }
}

// DELETE /api/resumes/[resumeId] - Delete resume
export async function DELETE(
    request: NextRequest,
    { params }: { params: { resumeId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const existingResume = await prisma.resume.findUnique({
            where: {
                id: params.resumeId,
                userId: session.user.id,
            },
        });

        if (!existingResume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        await prisma.resume.delete({
            where: { id: params.resumeId },
        });

        return NextResponse.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json(
            { error: 'Failed to delete resume' },
            { status: 500 }
        );
    }
}
