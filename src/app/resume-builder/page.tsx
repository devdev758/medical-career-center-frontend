import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Download, Edit, Trash2, Star } from 'lucide-react';
import { ResumeCard } from '@/components/resume/ResumeCard';

export const metadata = {
    title: 'Resume Builder | Medical Career Center',
    description: 'Create and manage your professional medical resumes',
};

export default async function ResumeBuilderPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/resume-builder');
    }

    // Fetch user's resumes
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

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Resume Builder</h1>
                        <p className="text-muted-foreground text-lg">
                            Create professional resumes tailored to your medical career
                        </p>
                    </div>
                    <Link href="/resume-builder/new">
                        <Button size="lg" className="gap-2">
                            <Plus className="w-5 h-5" />
                            Create New Resume
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Resumes List */}
            {resumes.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-md">
                            Create your first professional resume to start applying for jobs with confidence.
                        </p>
                        <Link href="/resume-builder/new">
                            <Button size="lg" className="gap-2">
                                <Plus className="w-5 h-5" />
                                Create Your First Resume
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Resumes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{resumes.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Applications Sent
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {resumes.reduce((sum, r) => sum + r._count.applications, 0)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Downloads
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {resumes.reduce((sum, r) => sum + r.downloadCount, 0)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resume Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
