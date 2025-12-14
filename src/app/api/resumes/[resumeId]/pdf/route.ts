import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateResumePDF, getResumeFilename } from '@/lib/pdf/resumeGenerator';
import { prisma } from '@/lib/prisma';

// GET /api/resumes/[resumeId]/pdf - Generate and download PDF
export async function GET(
    request: NextRequest,
    { params }: { params: { resumeId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const resume = await prisma.resume.findUnique({
            where: {
                id: params.resumeId,
                userId: session.user.id,
            },
        });

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        // Generate PDF
        const pdfBuffer = await generateResumePDF(session.user.id, params.resumeId);
        const filename = await getResumeFilename(params.resumeId);

        // Increment download count
        await prisma.resume.update({
            where: { id: params.resumeId },
            data: { downloadCount: { increment: 1 } },
        });

        // Return PDF as downloadable file
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}
