import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { ResumePreview } from '@/components/resume/ResumePreview';

export const metadata = {
    title: 'Preview Resume | Medical Career Center',
    description: 'Preview your professional resume',
};

interface PreviewResumePageProps {
    params: {
        resumeId: string;
    };
}

export default async function PreviewResumePage({ params }: PreviewResumePageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/resume-builder');
    }

    // Fetch resume
    const resume = await prisma.resume.findUnique({
        where: {
            id: params.resumeId,
            userId: session.user.id,
        },
    });

    if (!resume) {
        notFound();
    }

    // Fetch user data
    const userData = await prisma.user.findUnique({
        where: { id: session.user.id },
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
        },
    });

    if (!userData) {
        notFound();
    }

    const customData = {
        name: resume.name,
        customSummary: resume.customSummary || '',
        selectedExp: (resume.selectedExp as string[]) || [],
        selectedEdu: (resume.selectedEdu as string[]) || [],
        selectedCerts: (resume.selectedCerts as string[]) || [],
        customSkills: (resume.customSkills as string[]) || [],
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/resume-builder">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Resumes
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-bold">Resume Preview</h1>
                    <p className="text-muted-foreground mt-2">{resume.name}</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/resume-builder/${resume.id}/edit`}>
                        <Button variant="outline">Edit Resume</Button>
                    </Link>
                    <a href={`/api/resumes/${resume.id}/pdf`} download>
                        <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                    </a>
                </div>
            </div>

            {/* Preview */}
            <div className="max-w-3xl mx-auto">
                <ResumePreview
                    resume={resume}
                    userData={userData}
                    customData={customData}
                />
            </div>
        </div>
    );
}
