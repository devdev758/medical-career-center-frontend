import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Lightbulb, AlertCircle, CheckCircle, DollarSign, Briefcase } from 'lucide-react';
import { Breadcrumb, getProfessionBreadcrumbs } from '@/components/ui/breadcrumb';
import { SpokeNavigation } from '@/components/profession/SpokeNavigation';
import { RelatedProfessions } from '@/components/profession/RelatedProfessions';
import { CrossPageLinks } from '@/components/profession/CrossPageLinks';
import { MarkdownContent } from '@/components/content/MarkdownContent';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        profession?: string;
    };
}

function formatCareerTitle(slug: string): string {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    return {
        title: `${careerTitle} Interview Questions & Answers 2025: Ace Your Interview`,
        description: `Top ${careerTitle.toLowerCase()} interview questions and sample answers. Preparation tips, what to wear, questions to ask, and salary negotiation strategies.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}-interview-questions`
        },
    };
}

export default async function InterviewPage({ searchParams }: PageProps) {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    // Fetch career guide data for AI-generated content
    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: profession },
        select: { interviewContent: true }
    });

    const commonQuestions = [
        "Why did you choose to become a " + careerTitle.toLowerCase() + "?",
        "What are your greatest strengths in this role?",
        "Describe a challenging situation you faced and how you handled it.",
        "How do you stay current with industry developments?",
        "Where do you see yourself in 5 years?",
        "How do you handle stress and pressure?",
        "What makes you a good fit for this position?",
        "Tell me about a time you worked as part of a team.",
    ];

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerTitle, href: `/${profession}` },
                    { label: 'Interview Preparation' }
                ]}
                className="mb-6"
            />

            {!careerGuide?.interviewContent && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="w-10 h-10 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-bold">
                            {careerTitle} Interview Questions & Preparation
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        Prepare for your interview with common questions, sample answers, and expert tips to help you land your dream job.
                    </p>
                </div>
            )}

            <SpokeNavigation profession={profession} currentSpoke="interview" />

            {/* Render AI-generated content if available, otherwise show placeholder content */}
            {careerGuide?.interviewContent ? (
                <MarkdownContent content={careerGuide.interviewContent} />
            ) : (
                <>
                    <Card className="my-12">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5" />
                                Common Interview Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {commonQuestions.map((question, idx) => (
                                    <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                                        <p className="font-semibold text-foreground">{question}</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            <strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result) to structure your answer.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8 my-12">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Interview Preparation Checklist
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Research the Organization</p>
                                            <p className="text-sm text-muted-foreground">Learn about their mission, values, and recent news</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Review the Job Description</p>
                                            <p className="text-sm text-muted-foreground">Match your skills to their requirements</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Prepare Your Documents</p>
                                            <p className="text-sm text-muted-foreground">Bring extra copies of resume, certifications, references</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Practice Your Answers</p>
                                            <p className="text-sm text-muted-foreground">Rehearse responses to common questions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Plan Your Route</p>
                                            <p className="text-sm text-muted-foreground">Arrive 10-15 minutes early</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    What to Wear
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Professional Attire:</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li>• Business professional or business casual</li>
                                            <li>• Clean, pressed clothing</li>
                                            <li>• Conservative colors (navy, black, gray)</li>
                                            <li>• Minimal jewelry and accessories</li>
                                            <li>• Well-groomed appearance</li>
                                        </ul>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                                        <p className="text-sm font-semibold mb-1">Pro Tip:</p>
                                        <p className="text-sm text-muted-foreground">
                                            When in doubt, dress one level more formal than the workplace dress code.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle>Questions to Ask the Interviewer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Asking thoughtful questions shows your interest and helps you evaluate if the position is right for you.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">About the Role:</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• What does a typical day look like?</li>
                                        <li>• What are the biggest challenges in this role?</li>
                                        <li>• How is success measured?</li>
                                        <li>• What opportunities for growth exist?</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">About the Organization:</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• What is the team culture like?</li>
                                        <li>• What are the organization's goals for the next year?</li>
                                        <li>• How do you support professional development?</li>
                                        <li>• What are the next steps in the hiring process?</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Salary Negotiation Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Before Negotiating:</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• Research market rates for your role and location</li>
                                        <li>• Know your minimum acceptable salary</li>
                                        <li>• Consider total compensation (benefits, PTO, etc.)</li>
                                        <li>• Wait for them to make the first offer</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">During Negotiation:</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• Express enthusiasm for the role first</li>
                                        <li>• Use data to support your request</li>
                                        <li>• Be professional and confident</li>
                                        <li>• Consider negotiating other benefits if salary is fixed</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 mb-12">
                        <h2 className="text-2xl font-bold mb-4">Ready to Apply?</h2>
                        <p className="text-muted-foreground mb-6">
                            Browse current {careerTitle.toLowerCase()} job openings and prepare your resume.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button asChild>
                                <Link href={`/${profession}-jobs`}>
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    Browse Jobs
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={`/${profession}-resume`}>
                                    Resume Examples
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={`/${profession}-salary`}>
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Salary Data
                                </Link>
                            </Button>
                        </div>
                    </div>


                </>
            )}

            {/* Related Professions */}
            <RelatedProfessions
                profession={profession}
                currentPageType="interview"
                maxItems={6}
                className="mb-12"
            />

            {/* Cross-Page Links */}
            <CrossPageLinks
                profession={profession}
                currentPage="interview"
                className="mb-12"
            />

            <div className="text-center text-sm text-muted-foreground">
                <p>
                    <Link href={`/${profession}`} className="text-primary hover:underline">
                        ← Back to {careerTitle} Hub
                    </Link>
                </p>
            </div>
        </main>
    );
}
