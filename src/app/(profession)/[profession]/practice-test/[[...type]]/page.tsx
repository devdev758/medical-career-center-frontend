import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, BookOpen, Clock, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';
import { getContentYear } from '@/lib/date-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        type?: string[];  // [[...type]] -> can be [], ['free'], ['skills'], ['state']
    };
}

const TEST_TYPES = {
    'free': { title: 'Free Practice Test', description: 'Free CNA practice questions with answers' },
    'skills': { title: 'Skills Test Prep', description: 'Prepare for the hands-on clinical skills evaluation' },
    'state': { title: 'State Exam Prep', description: 'State-specific exam preparation resources' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, type } = await params;
    const careerTitle = formatSlugForDisplay(profession);
    const testType = type?.[0];
    const testMeta = testType && TEST_TYPES[testType as keyof typeof TEST_TYPES];

    const currentYear = getContentYear();
    let title, description, urlPath;

    if (testMeta) {
        title = `${testMeta.title} ${currentYear} | CNA Exam Preparation`;
        description = `${testMeta.description}. Practice with realistic CNA exam questions and prepare for your certification.`;
        urlPath = `/${profession}/practice-test/${testType}`;
    } else {
        title = `CNA Practice Test ${currentYear}: Free Exam Questions & Answers`;
        description = `Free CNA practice tests to help you prepare for the certification exam. Includes skills test prep, state exam practice, and detailed answer explanations.`;
        urlPath = `/${profession}/practice-test`;
    }

    return {
        title,
        description,
        alternates: { canonical: `https://medicalcareercenter.org${urlPath}` },
    };
}

export default async function PracticeTestPage({ params }: PageProps) {
    const { profession, type } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const testType = type?.[0];
    const testMeta = testType && TEST_TYPES[testType as keyof typeof TEST_TYPES];

    // Only show for CNA
    if (profession !== 'cna') {
        notFound();
    }

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: { professionName: true }
    });

    if (!careerGuide) notFound();

    // Build breadcrumb
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
    ];

    if (testMeta) {
        breadcrumbItems.push({ label: 'Practice Test', href: `/${profession}/practice-test` });
        breadcrumbItems.push({ label: testMeta.title });
    } else {
        breadcrumbItems.push({ label: 'Practice Test' });
    }

    // Sample practice questions
    const sampleQuestions = [
        {
            question: "What is the correct hand hygiene technique before patient care?",
            options: ["A) Quick rinse with water", "B) 20 seconds with soap and water", "C) Wipe hands on uniform", "D) Hand sanitizer only"],
            answer: "B"
        },
        {
            question: "When taking vital signs, blood pressure should be measured:",
            options: ["A) While patient is standing", "B) After patient has been resting", "C) Immediately after exercise", "D) While patient is talking"],
            answer: "B"
        },
        {
            question: "The normal oral temperature range for an adult is:",
            options: ["A) 96.8°F - 98.6°F", "B) 97.6°F - 99.6°F", "C) 100°F - 102°F", "D) 95°F - 96°F"],
            answer: "B"
        },
    ];

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <ClipboardCheck className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {testMeta ? testMeta.title : 'CNA Practice Test'}
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                    {testMeta ? testMeta.description : 'Prepare for your CNA certification exam with free practice questions'}
                </p>
            </div>

            {/* Test Type Navigation */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-lg">Choose Practice Type</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        {Object.entries(TEST_TYPES).map(([slug, meta]) => (
                            <Link
                                key={slug}
                                href={`/${profession}/practice-test/${slug}`}
                                className={`p-4 rounded-lg border transition-colors ${testType === slug
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <h3 className="font-semibold mb-1">{meta.title}</h3>
                                <p className={`text-sm ${testType === slug ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                    {meta.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Exam Overview */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">CNA Exam Overview</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                            <p className="text-2xl font-bold">60-90</p>
                            <p className="text-sm text-muted-foreground">Written Questions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                            <p className="text-2xl font-bold">5</p>
                            <p className="text-sm text-muted-foreground">Skills to Demonstrate</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                            <p className="text-2xl font-bold">90 min</p>
                            <p className="text-sm text-muted-foreground">Written Test Time</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Sample Questions */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Sample Practice Questions</h2>
                <div className="space-y-6">
                    {sampleQuestions.map((q, idx) => (
                        <Card key={idx}>
                            <CardContent className="p-6">
                                <p className="font-semibold mb-4">
                                    <Badge variant="outline" className="mr-2">Q{idx + 1}</Badge>
                                    {q.question}
                                </p>
                                <div className="grid md:grid-cols-2 gap-2 mb-4">
                                    {q.options.map((opt, optIdx) => (
                                        <div key={optIdx} className="p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors">
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                                <details className="mt-4">
                                    <summary className="text-sm text-primary cursor-pointer hover:underline">
                                        Show Answer
                                    </summary>
                                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="font-medium">Correct Answer: {q.answer}</span>
                                    </div>
                                </details>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Key Topics */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Key Topics Covered on the CNA Exam</h2>
                <div className="grid md:grid-cols-2 gap-3">
                    {[
                        'Basic Nursing Skills',
                        'Infection Control & Safety',
                        'Communication & Interpersonal Skills',
                        'Patient Rights & Legal Issues',
                        'Personal Care Skills',
                        'Vital Signs & Measurements',
                        'Emergency Procedures',
                        'Mental Health & Social Needs',
                        'Data Collection & Reporting',
                        'Restorative Care',
                    ].map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 rounded-lg border">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{topic}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
                <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Ready to Start Your CNA Career?</h3>
                    <p className="text-muted-foreground mb-4">
                        Find CNA training programs near you and get certified
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild>
                            <Link href={urls.schools}>
                                Find Training Programs <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={urls.jobs}>Browse CNA Jobs</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Related Resources */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More CNA Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">How to Become</p>
                    </Link>
                    <Link href={urls.schools} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Training Schools</p>
                    </Link>
                    <Link href={`/${profession}/registry`} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">CNA Registry</p>
                    </Link>
                    <Link href={urls.license} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Certification</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
