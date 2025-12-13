import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, AlertCircle, TrendingUp, Briefcase, DollarSign } from 'lucide-react';
import { Breadcrumb, getProfessionBreadcrumbs } from '@/components/ui/breadcrumb';
import { SpokeNavigation } from '@/components/profession/SpokeNavigation';
import { RelatedProfessions } from '@/components/profession/RelatedProfessions';
import { CrossPageLinks } from '@/components/profession/CrossPageLinks';

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
        title: `${careerTitle} Work-Life Balance 2025: Schedules, Stress & Lifestyle`,
        description: `Real insights into ${careerTitle.toLowerCase()} work-life balance. Typical schedules, stress levels, burnout prevention, and lifestyle considerations.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}-work-life-balance`
        },
    };
}

export default async function WorkLifeBalancePage({ searchParams }: PageProps) {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerTitle, href: `/${profession}` },
                    { label: 'Work-Life Balance' }
                ]}
                className="mb-6"
            />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {careerTitle} Work-Life Balance & Lifestyle
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Understand the realities of work schedules, stress levels, and lifestyle considerations for {careerTitle.toLowerCase()}s.
                </p>
            </div>

            <SpokeNavigation profession={profession} currentSpoke="work-life" />

            <div className="grid md:grid-cols-2 gap-8 my-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Typical Work Schedules
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Common Shift Types:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• <strong>Day Shifts:</strong> 7am-3pm or 8am-4pm</li>
                                    <li>• <strong>Evening Shifts:</strong> 3pm-11pm</li>
                                    <li>• <strong>Night Shifts:</strong> 11pm-7am</li>
                                    <li>• <strong>12-Hour Shifts:</strong> 7am-7pm or 7pm-7am</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-1">Typical Schedule:</p>
                                <p className="text-sm text-muted-foreground">
                                    Most work 36-40 hours per week, often with rotating shifts including weekends and holidays.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Stress Levels & Challenges
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Common Stressors:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• High patient volume and workload</li>
                                    <li>• Emotional demands of patient care</li>
                                    <li>• Physical demands (standing, lifting)</li>
                                    <li>• Irregular schedules and shift work</li>
                                </ul>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-1">Stress Level:</p>
                                <p className="text-sm text-muted-foreground">
                                    Moderate to High - Varies by specialty and work environment
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Burnout Prevention Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3">Self-Care Practices</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Regular exercise and physical activity</li>
                                <li>• Adequate sleep and rest</li>
                                <li>• Healthy eating habits</li>
                                <li>• Mindfulness and meditation</li>
                                <li>• Hobbies and personal interests</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Professional Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Peer support groups</li>
                                <li>• Professional counseling</li>
                                <li>• Mentorship programs</li>
                                <li>• Employee assistance programs</li>
                                <li>• Continuing education</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Workplace Strategies</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Set clear boundaries</li>
                                <li>• Take regular breaks</li>
                                <li>• Communicate with supervisors</li>
                                <li>• Request schedule flexibility</li>
                                <li>• Use vacation time</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Work Environment & Culture</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Positive Aspects:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Meaningful, rewarding work</li>
                                    <li>• Team collaboration and support</li>
                                    <li>• Diverse career opportunities</li>
                                    <li>• Job security and stability</li>
                                    <li>• Continuous learning</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Challenges to Consider:</h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Shift work and irregular hours</li>
                                    <li>• Physical and emotional demands</li>
                                    <li>• Exposure to illness and injury</li>
                                    <li>• Administrative workload</li>
                                    <li>• Work-life balance challenges</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Lifestyle Considerations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Family & Personal Life:</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Shift work can impact family time and social activities. Many find success with:
                            </p>
                            <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                                <li>• Flexible childcare arrangements</li>
                                <li>• Strong communication with family</li>
                                <li>• Planning activities around work schedule</li>
                                <li>• Building support networks</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Financial Stability:</h4>
                            <p className="text-sm text-muted-foreground">
                                Competitive salaries, benefits packages, and opportunities for overtime provide financial security for most professionals in this field.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Is This Career Right for You?</h2>
                <p className="text-muted-foreground mb-6">
                    Explore salary information, job opportunities, and career paths to make an informed decision.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
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
                    <Button asChild variant="outline">
                        <Link href={`/how-to-become-${profession}`}>
                            Career Guide
                        </Link>
                    </Button>
                </div>
            </div>


            {/* Related Professions */}
            <RelatedProfessions 
                profession={profession}
                currentPageType="work-life"
                maxItems={6}
                className="mb-12"
            />

            {/* Cross-Page Links */}
            <CrossPageLinks
                profession={profession}
                currentPage="work-life"
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
