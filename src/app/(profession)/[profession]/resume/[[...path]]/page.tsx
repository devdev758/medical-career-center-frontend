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
    ArrowRight,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RN_RESUME_GUIDE_CONTENT } from '@/lib/resume-content';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        path?: string[];
    };
}

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

            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {resumeTypeMeta
                        ? `${careerTitle} ${resumeTypeMeta.title}`
                        : `${careerTitle} Resume Guide`}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {resumeTypeMeta
                        ? resumeTypeMeta.description
                        : 'Expert tips to create a standout nursing resume that gets interviews'}
                </p>
            </div>

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

            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-semibold">
                                    Create Your Resume with AI
                                </h3>
                            </div>
                            <p className="text-muted-foreground mb-3">
                                Build a professional {careerTitle.toLowerCase()} resume in minutes with our AI-powered builder
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span>ATS-Optimized</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span>Keyword Suggestions</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span>Export to PDF</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span>Cover Letter Included</span>
                                </div>
                            </div>
                        </div>
                        <Button asChild size="lg" className="w-full md:w-auto">
                            <Link href="/resume-builder">
                                Build Resume Now <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {!isResumeType && (
                <article className="prose prose-slate dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                    prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                    prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    mb-12">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => {
                                const href = props.href || '';
                                if (href.startsWith('http')) {
                                    return <a href={href} target="_blank" rel="noopener noreferrer">{props.children}</a>;
                                }
                                return <Link href={href}>{props.children}</Link>;
                            }
                        }}
                    >
                        {RN_RESUME_GUIDE_CONTENT}
                    </ReactMarkdown>
                </article>
            )}

            {resumeKeywords.length > 0 && !isResumeType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">ATS Resume Keywords for {careerTitle} Positions</h2>
                    <p className="text-muted-foreground mb-4">
                        Include these keywords naturally throughout your resume to pass ATS screening. Use the exact terms from job descriptions and incorporate them in your professional summary, work experience, and skills sections.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {resumeKeywords.map((keyword: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{keyword}</Badge>
                        ))}
                    </div>
                </section>
            )}

            {!isResumeType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Skills to Highlight on Your Resume</h2>
                    <p className="text-muted-foreground mb-6">
                        These skills should appear in your resume's skills section and be demonstrated through specific examples in your work experience bullets. Balance technical competencies with soft skills to show you're a well-rounded candidate.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Technical Skills</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Procedures, technologies, and clinical competencies specific to nursing practice
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {technicalSkills.slice(0, 15).map((skill: string, idx: number) => (
                                        <Badge key={idx} variant="default">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Soft Skills</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Interpersonal abilities and personal qualities essential for patient care
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {softSkills.slice(0, 15).map((skill: string, idx: number) => (
                                        <Badge key={idx} variant="outline">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

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
