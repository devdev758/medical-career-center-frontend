import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession } = await params;
    const careerTitle = formatSlugForDisplay(profession);
    const currentYear = new Date().getFullYear();

    return {
        title: `${careerTitle} Interview Questions & Answers ${currentYear} | Medical Career Center`,
        description: `Prepare for your ${careerTitle.toLowerCase()} interview with common questions, sample answers, and expert tips. Ace your nursing interview and land your dream job.`,
        alternates: { canonical: `https://medicalcareercenter.org/${profession}/interview` },
        openGraph: { title: `${careerTitle} Interview Questions`, type: 'website' },
        robots: { index: true, follow: true },
    };
}

export default async function InterviewPage({ params }: PageProps) {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: {
            professionName: true,
            interviewTips: true,
            interviewContent: true,
        }
    });

    if (!careerGuide) {
        notFound();
    }

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
        { label: 'Interview Prep' }
    ];

    // Common interview questions for nursing
    const commonQuestions = [
        "Why did you choose nursing as a career?",
        "Tell me about a challenging patient situation and how you handled it.",
        "How do you handle stress in a fast-paced clinical environment?",
        "Describe a time you had to work with a difficult team member.",
        "What is your biggest strength and weakness as a nurse?",
        "How do you prioritize patient care when you have multiple urgent needs?",
        "Tell me about your experience with electronic health records.",
        "How do you stay current with nursing best practices?",
        "Why are you interested in working at our facility?",
        "Where do you see yourself in 5 years?",
    ];

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {careerTitle} Interview Questions & Answers
                </h1>
                <p className="text-xl text-muted-foreground">
                    Prepare for your nursing interview with expert tips and sample answers
                </p>
            </div>

            {/* Interview Tips */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Interview Tips</h2>
                <p className="text-muted-foreground leading-relaxed">
                    {careerGuide.interviewTips ||
                        'Preparation is key to acing your nursing interview. Research the facility, review common questions, and practice your responses. Be ready to provide specific examples that demonstrate your clinical skills and patient care philosophy.'}
                </p>
            </section>

            {/* Common Questions */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Common Interview Questions</h2>
                <div className="space-y-4">
                    {commonQuestions.map((question, idx) => (
                        <Card key={idx}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                                        {idx + 1}
                                    </span>
                                    <p className="font-medium pt-1">{question}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Interview Preparation Checklist */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Interview Preparation Checklist</h2>
                <Card>
                    <CardContent className="p-6">
                        <ul className="space-y-3">
                            {[
                                "Research the healthcare facility and its values",
                                "Review the job description and required qualifications",
                                "Prepare STAR-method examples of your clinical experiences",
                                "Bring copies of your resume, certifications, and references",
                                "Plan your professional attire",
                                "Prepare questions to ask the interviewer",
                                "Practice answers to common nursing questions",
                                "Arrive 15 minutes early"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>

            {/* Quick Navigation */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.resume} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Resume Tips</p>
                    </Link>
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Browse Jobs</p>
                    </Link>
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
