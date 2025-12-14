import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { prisma } from '@/lib/prisma';

export async function generateResumePDF(userId: string, resumeId: string): Promise<Buffer> {
    const resume = await prisma.resume.findUnique({
        where: { id: resumeId, userId },
    });

    if (!resume) {
        throw new Error('Resume not found');
    }

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            workExperience: { orderBy: { startDate: 'desc' } },
            education: { orderBy: { startDate: 'desc' } },
            skills: true,
            certifications: { orderBy: { issueDate: 'desc' } },
            licenses: { orderBy: { issueDate: 'desc' } },
        },
    });

    if (!userData) {
        throw new Error('User not found');
    }

    const template = React.createElement(ProfessionalTemplate, {
        userData,
        resumeData: resume,
    });

    const pdfBuffer = await renderToBuffer(template);

    await prisma.resume.update({
        where: { id: resumeId },
        data: { pdfGeneratedAt: new Date() },
    });

    return pdfBuffer;
}

export async function getResumeFilename(resumeId: string): Promise<string> {
    const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
        select: { name: true },
    });

    if (!resume) {
        return 'resume.pdf';
    }

    const sanitized = resume.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${sanitized}.pdf`;
}
