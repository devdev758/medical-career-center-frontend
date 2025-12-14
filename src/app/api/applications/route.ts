import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// POST /api/applications - Submit job application
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const jobId = formData.get('jobId') as string;
        const phone = formData.get('phone') as string;
        const coverLetter = formData.get('coverLetter') as string | null;
        const resumeId = formData.get('resumeId') as string | null;
        const resumeFile = formData.get('resume') as File | null;

        if (!jobId || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if already applied
        const existingApplication = await prisma.application.findUnique({
            where: {
                jobId_userId: {
                    jobId,
                    userId: session.user.id,
                },
            },
        });

        if (existingApplication) {
            return NextResponse.json({ error: 'Already applied to this job' }, { status: 400 });
        }

        let resumeUrl = null;

        // Handle resume upload if provided
        if (resumeFile && resumeFile.size > 0) {
            // Upload to Vercel Blob or your storage solution
            const blob = await put(`resumes/${session.user.id}/${Date.now()}-${resumeFile.name}`, resumeFile, {
                access: 'public',
            });
            resumeUrl = blob.url;
        } else if (resumeId) {
            // Generate PDF from saved resume
            const resume = await prisma.resume.findUnique({
                where: { id: resumeId, userId: session.user.id },
            });

            if (resume) {
                // Use the resume's PDF URL if available, or generate on-demand
                resumeUrl = `/api/resumes/${resumeId}/pdf`;
            }
        }

        // Create application
        const application = await prisma.application.create({
            data: {
                jobId,
                userId: session.user.id,
                phone,
                coverLetter,
                resumeUrl,
                resumeId,
                status: 'PENDING',
            },
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error('Error creating application:', error);
        return NextResponse.json(
            { error: 'Failed to submit application' },
            { status: 500 }
        );
    }
}
