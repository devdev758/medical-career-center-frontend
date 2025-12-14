import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, DollarSign, Clock, Briefcase, BookOpen } from 'lucide-react';
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

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: profession },
        select: { careerPathContent: true }
    });

    return {
        title: `${careerTitle} Career Path 2025: Progression & Advancement Opportunities`,
        description: `${careerTitle} career progression from entry-level to senior positions. Timeline, salary growth, and advancement opportunities at each stage.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}-career-path`
        },
    };
}

export default async function CareerPathPage({ searchParams }: PageProps) {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: profession },
        select: { careerPathContent: true }
    });

    const careerStages = [
        {
            level: "Entry-Level",
            years: "0-2 years",
            title: `Junior ${careerTitle}`,
            salary: "$45,000 - $60,000",
            responsibilities: [
                "Learn fundamental procedures and protocols",
                "Work under supervision of senior staff",
                "Build foundational clinical skills",
                "Complete required training and certifications"
            ]
        },
        {
            level: "Mid-Level",
            years: "3-7 years",
            title: `${careerTitle}`,
            salary: "$60,000 - $85,000",
            responsibilities: [
                "Work independently with minimal supervision",
                "Mentor junior staff members",
                "Handle complex cases and procedures",
                "Pursue specialty certifications"
            ]
        },
        {
            level: "Senior-Level",
            years: "8-15 years",
            title: `Senior ${careerTitle}`,
            salary: "$85,000 - $110,000",
            responsibilities: [
                "Lead teams and coordinate care",
                "Train and evaluate staff",
                "Contribute to policy development",
                "Specialize in advanced procedures"
            ]
        },
        {
            level: "Leadership",
            years: "15+ years",
            title: `Lead ${careerTitle} / Manager`,
            salary: "$110,000 - $150,000+",
            responsibilities: [
                "Oversee department operations",
                "Manage budgets and resources",
                "Develop strategic initiatives",
                "Represent department in leadership meetings"
            ]
        }
    ];

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerTitle, href: `/${profession}` },
                    { label: 'Career Path' }
                ]}
                className="mb-6"
            />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {careerTitle} Career Path & Progression
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Explore career advancement opportunities, salary growth, and the typical progression path from entry-level to leadership positions.
                </p>
            </div>

            <SpokeNavigation profession={profession} currentSpoke="career-path" />

            {careerGuide?.careerPathContent ? (
                <MarkdownContent content={careerGuide.careerPathContent} />
            ) : (
                <>
            <div className="space-y-6 my-12">
                {careerStages.map((stage, idx) => (
                    <Card key={idx}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge variant={idx === 0 ? "secondary" : "default"}>
                                            {stage.level}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">{stage.years}</span>
                                    </div>
                                    <CardTitle className="text-2xl">{stage.title}</CardTitle>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Salary Range</p>
                                    <p className="text-lg font-bold text-green-600">{stage.salary}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h4 className="font-semibold mb-3">Key Responsibilities:</h4>
                            <ul className="grid md:grid-cols-2 gap-2">
                                {stage.responsibilities.map((resp, ridx) => (
                                    <li key={ridx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{resp}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>How to Advance Your Career</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                Education & Certifications
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Pursue advanced degrees (Bachelor's, Master's)</li>
                                <li>• Obtain specialty certifications</li>
                                <li>• Complete continuing education requirements</li>
                                <li>• Attend professional development workshops</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Professional Development
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Seek mentorship from senior professionals</li>
                                <li>• Take on leadership roles in projects</li>
                                <li>• Join professional associations</li>
                                <li>• Network at industry conferences</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Timeline Expectations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Career progression timelines vary based on individual performance, opportunities, and market conditions. Here's what typically influences advancement:
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Faster Advancement:</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• High-demand specialties</li>
                                    <li>• Advanced certifications</li>
                                    <li>• Strong performance reviews</li>
                                    <li>• Leadership initiative</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Typical Timeline:</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Entry to Mid: 3-5 years</li>
                                    <li>• Mid to Senior: 5-8 years</li>
                                    <li>• Senior to Leadership: 7-10 years</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Factors to Consider:</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Organization size and structure</li>
                                    <li>• Geographic location</li>
                                    <li>• Market demand</li>
                                    <li>• Personal career goals</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Ready to Advance Your Career?</h2>
                <p className="text-muted-foreground mb-6">
                    Explore education programs, certifications, and job opportunities to take the next step in your career.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={`/${profession}-schools`}>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Education Programs
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}-certification`}>
                            <Award className="w-4 h-4 mr-2" />
                            Certifications
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}-jobs`}>
                            <Briefcase className="w-4 h-4 mr-2" />
                            Browse Jobs
                        </Link>
                    </Button>
                </div>
            </div>


                </>
            )}

            
            {/* Related Professions */}
            <RelatedProfessions 
                profession={profession}
                currentPageType="career-path"
                maxItems={6}
                className="mb-12"
            />

            {/* Cross-Page Links */}
            <CrossPageLinks
                profession={profession}
                currentPage="career-path"
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
