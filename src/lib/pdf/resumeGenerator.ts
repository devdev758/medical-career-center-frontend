import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { prisma } from '@/lib/prisma';

export async function generateResumePDF(userId: string, resumeId: string): Promise<Buffer> {
    // Fetch resume data
    const resume = await prisma.resume.findUnique({
        where: { id: resumeId, userId },
    });

    if (!resume) {
        throw new Error('Resume not found');
    }

    // Fetch user data
    const userData = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            workExperience: {
                orderBy: { startDate: 'desc' }
            },
            education: {
                orderBy: { startDate: 'desc' }
            },
            skills: true,
            certifications: {
                orderBy: { issueDate: 'desc' }
            },
            licenses: {
                orderBy: { issueDate: 'desc' }
            },
        },
    });

    if (!userData) {
        throw new Error('User not found');
    }

    // Select template based on resume.templateId
    let template;
    switch (resume.templateId) {
        case 'professional':
        default:
            template = <ProfessionalTemplate userData={ userData } resumeData = { resume } />;
            break;
        // Add more templates here as they're created
        // case 'modern':
        //   template = <ModernTemplate userData={userData} resumeData={resume} />;
        //   break;
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(template);

    // Update resume with generation timestamp
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

    // Sanitize filename
    const sanitized = resume.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${sanitized}.pdf`;
}
