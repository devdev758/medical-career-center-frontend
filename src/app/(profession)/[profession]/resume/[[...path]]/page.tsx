import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Download,
    Layout,
    GraduationCap,
    Mail,
    ArrowRight
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        path?: string[];  // [[...path]] -> can be [], ['examples'], ['template'], ['new-grad'], ['cover-letter']
    };
}

// Resume type slugs
const RESUME_TYPE_SLUGS = ['examples', 'template', 'new-grad', 'icu', 'cover-letter'];

const RESUME_TYPE_META: Record<string, { title: string; description: string; icon: any }> = {
    'examples': {
        title: 'Resume Examples',
        description: 'View sample resumes from real nurses',
        icon: FileText,
    },
    'template': {
        title: 'Resume Templates',
        description: 'Download free nursing resume templates',
        icon: Download,
    },
    'new-grad': {
        title: 'New Grad Resume',
        description: 'Resume tips for new nursing graduates',
        icon: GraduationCap,
    },
    'icu': {
        title: 'ICU Nurse Resume',
        description: 'Resume tips for ICU nursing positions',
        icon: Layout,
    },
    'cover-letter': {
        title: 'Cover Letter',
        description: 'Write a compelling nursing cover letter',
        icon: Mail,
    },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, path } = await params;
    const careerTitle = formatSlugForDisplay(profession);

    const firstParam = path?.[0];
    const isResumeType = firstParam && RESUME_TYPE_SLUGS.includes(firstParam);
    const resumeTypeMeta = isResumeType ? RESUME_TYPE_META[firstParam] : null;

    const currentYear = new Date().getFullYear();
    let title, description, urlPath;

    if (resumeTypeMeta) {
        title = `${careerTitle} ${resumeTypeMeta.title} ${currentYear} | Medical Career Center`;
        description = `${resumeTypeMeta.description}. Expert tips and samples to help you land your ${careerTitle.toLowerCase()} job.`;
        urlPath = `/${profession}/resume/${firstParam}`;
    } else {
        title = `${careerTitle} Resume Guide: Tips, Examples & Templates ${currentYear}`;
        description = `Create a standout ${careerTitle.toLowerCase()} resume. Expert tips, keyword optimization, and ATS-friendly templates to help you get hired.`;
        urlPath = `/${profession}/resume`;
    }

    return {
        title,
        description,
        alternates: { canonical: `https://medicalcareercenter.org${urlPath}` },
        openGraph: { title, description, type: 'website' },
        robots: { index: true, follow: true },
    };
}

export default async function ResumePage({ params }: PageProps) {
    const { profession, path } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const firstParam = path?.[0];
    const isResumeType = firstParam && RESUME_TYPE_SLUGS.includes(firstParam);
    const resumeTypeMeta = isResumeType ? RESUME_TYPE_META[firstParam] : null;

    // Fetch career guide for resume data
    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: {
            professionName: true,
            resumeKeywords: true,
            resumeContent: true,
            interviewTips: true,
            technicalSkills: true,
            softSkills: true,
        }
    });

    if (!careerGuide) {
        notFound();
    }

    const resumeKeywords = (careerGuide.resumeKeywords as string[]) || [];
    const technicalSkills = (careerGuide.technicalSkills as string[]) || [];
    const softSkills = (careerGuide.softSkills as string[]) || [];
    const isRegisteredNurse = profession === 'registered-nurse';

    // Build breadcrumb items
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
    ];

    if (isResumeType && resumeTypeMeta) {
        breadcrumbItems.push({ label: 'Resume', href: `/${profession}/resume` });
        breadcrumbItems.push({ label: resumeTypeMeta.title });
    } else {
        breadcrumbItems.push({ label: 'Resume Guide' });
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {resumeTypeMeta
                        ? `${careerTitle} ${resumeTypeMeta.title}`
                        : `${careerTitle} Resume Guide`}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {resumeTypeMeta
                        ? resumeTypeMeta.description
                        : 'Expert tips to create a standout nursing resume'}
                </p>
            </div>

            {/* Resume Type Navigation */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-lg">Resume Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {Object.entries(RESUME_TYPE_META).map(([slug, meta]) => {
                            const Icon = meta.icon;
                            const isActive = firstParam === slug;
                            return (
                                <Link
                                    key={slug}
                                    href={`/${profession}/resume/${slug}`}
                                    className={`p-4 rounded-lg border transition-colors text-center ${isActive
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'hover:bg-muted'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mx-auto mb-2" />
                                    <p className="font-medium text-sm">{meta.title.replace('Resume ', '')}</p>
                                </Link>
                            );
                        })}
                    </div>
                    {isResumeType && (
                        <div className="mt-4 pt-4 border-t">
                            <Link href={`/${profession}/resume`} className="text-sm text-primary hover:underline">
                                ← View resume overview
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resume Builder CTA */}
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                📝 Create Your Resume Online
                            </h3>
                            <p className="text-muted-foreground">
                                Use our AI-powered resume builder to create a professional {careerTitle.toLowerCase()} resume in minutes
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/resume-builder">
                                Build Resume →
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Resume Tips Overview */}
            {!isResumeType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Resume Writing Tips</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                            A well-crafted resume is your ticket to landing interviews for {careerTitle.toLowerCase()} positions.
                            Focus on quantifiable achievements, relevant clinical experience, and key certifications.
                        </p>
                        <ul className="space-y-2 mt-4">
                            <li>Lead with a compelling professional summary</li>
                            <li>Highlight relevant clinical experience and specializations</li>
                            <li>Include all licenses, certifications, and credentials</li>
                            <li>Quantify achievements (e.g., "Managed care for 15+ patients per shift")</li>
                            <li>Use ATS-friendly formatting and keywords</li>
                        </ul>
                    </div>
                </section>
            )}

            {/* Resume Keywords */}
            {resumeKeywords.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Resume Keywords to Include</h2>
                    <p className="text-muted-foreground mb-4">
                        Include these keywords to pass ATS screening and highlight relevant skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {resumeKeywords.map((keyword: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{keyword}</Badge>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills to Highlight */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Skills to Highlight</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Technical Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {technicalSkills.slice(0, 10).map((skill: string, idx: number) => (
                                    <Badge key={idx} variant="default">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Soft Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {softSkills.slice(0, 10).map((skill: string, idx: number) => (
                                    <Badge key={idx} variant="outline">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Quick Navigation */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.interview} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Interview Prep</p>
                    </Link>
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Browse Jobs</p>
                    </Link>
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
