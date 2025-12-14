import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Award, DollarSign, Briefcase, BookOpen } from 'lucide-react';
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
        select: { specializationsContent: true }
    });

    return {
        title: `${careerTitle} Specializations 2025: Career Paths & Opportunities`,
        description: `Explore ${careerTitle.toLowerCase()} specialization options, requirements, salary potential, and career paths. Find the right specialty for your career goals.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}-specializations`
        },
    };
}

export default async function SpecializationsPage({ searchParams }: PageProps) {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: profession },
        select: { specializationsContent: true }
    });

    const specializations = [
        { name: "Critical Care", description: "Work in intensive care units with critically ill patients", demand: "High", salary: "+15-20%" },
        { name: "Emergency", description: "Fast-paced environment treating acute injuries and illnesses", demand: "High", salary: "+10-15%" },
        { name: "Pediatrics", description: "Specialize in care for infants, children, and adolescents", demand: "Medium", salary: "+5-10%" },
        { name: "Oncology", description: "Focus on cancer treatment and patient care", demand: "High", salary: "+10-15%" },
        { name: "Geriatrics", description: "Specialized care for elderly patients", demand: "High", salary: "+5-10%" },
        { name: "Mental Health", description: "Psychiatric and behavioral health specialization", demand: "High", salary: "+10-15%" },
    ];

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerTitle, href: `/${profession}` },
                    { label: 'Specializations' }
                ]}
                className="mb-6"
            />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Target className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {careerTitle} Specializations & Career Paths
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Explore specialization options, certification requirements, and career advancement opportunities in your field.
                </p>
            </div>

            <SpokeNavigation profession={profession} currentSpoke="specializations" />

            {careerGuide?.specializationsContent ? (
                <MarkdownContent content={careerGuide.specializationsContent} />
            ) : (
                <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
                {specializations.map((spec, idx) => (
                    <Card key={idx}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg">{spec.name}</CardTitle>
                                <Badge variant={spec.demand === 'High' ? 'default' : 'secondary'}>
                                    {spec.demand} Demand
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{spec.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-green-600">{spec.salary} avg salary</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>How to Choose a Specialization</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Consider Your Interests:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• What patient populations do you enjoy working with?</li>
                                <li>• Do you prefer fast-paced or slower-paced environments?</li>
                                <li>• Are you interested in a specific medical condition or treatment area?</li>
                                <li>• What type of work schedule appeals to you?</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Evaluate Career Goals:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Salary expectations and earning potential</li>
                                <li>• Job availability in your desired location</li>
                                <li>• Opportunities for advancement</li>
                                <li>• Work-life balance considerations</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Certification Requirements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Most specializations require additional certification beyond your basic credentials:
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Typical Requirements:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• 1-2 years of experience in the specialty</li>
                                    <li>• Completion of specialty training program</li>
                                    <li>• Passing a certification exam</li>
                                    <li>• Continuing education credits</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Timeline:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Training: 6-24 months</li>
                                    <li>• Exam preparation: 3-6 months</li>
                                    <li>• Certification renewal: Every 2-5 years</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Ready to Specialize?</h2>
                <p className="text-muted-foreground mb-6">
                    Explore certification programs, salary data, and job opportunities in your chosen specialty.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={`/${profession}-certification`}>
                            <Award className="w-4 h-4 mr-2" />
                            Certification Guide
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}-salary`}>
                            <DollarSign className="w-4 h-4 mr-2" />
                            Salary Data
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
                currentPageType="specializations"
                maxItems={6}
                className="mb-12"
            />

            {/* Cross-Page Links */}
            <CrossPageLinks
                profession={profession}
                currentPage="specializations"
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
