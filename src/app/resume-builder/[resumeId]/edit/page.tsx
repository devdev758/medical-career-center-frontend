import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { ResumeEditor } from '@/components/resume/ResumeEditor';

export const metadata = {
    title: 'Edit Resume | Medical Career Center',
    description: 'Customize your professional resume',
};

interface EditResumePageProps {
    params: {
        resumeId: string;
    };
}

export default async function EditResumePage({ params }: EditResumePageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/resume-builder');
    }

    // Fetch resume
    const resume = await prisma.resume.findUnique({
        where: {
            id: params.resumeId,
            userId: session.user.id, // Ensure user owns this resume
        },
    });

    if (!resume) {
        notFound();
    }

    // Fetch user's profile data
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
            licenses: {
                orderBy: { issueDate: 'desc' }
            },
        },
    });

    if (!userData) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <ResumeEditor resume={resume} userData={userData} />
        </div>
    );
}
