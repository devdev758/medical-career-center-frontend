import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, MapPin, FileCheck, BookOpen, DollarSign, GraduationCap } from 'lucide-react';
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
        title: `${careerTitle} Certification & Licensing 2025: Requirements by State`,
        description: `${careerTitle} certification and licensing requirements. State-by-state guide, exam prep, renewal process, and continuing education requirements.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}-certification`
        },
    };
}

export default async function CertificationPage({ searchParams }: PageProps) {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerTitle, href: `/${profession}` },
                    { label: 'Certification & Licensing' }
                ]}
                className="mb-6"
            />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Award className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {careerTitle} Certification & Licensing Guide
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Complete guide to certification requirements, licensing by state, exam preparation, and maintaining your credentials.
                </p>
            </div>

            <SpokeNavigation profession={profession} currentSpoke="certification" />

            <div className="grid md:grid-cols-2 gap-8 my-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileCheck className="w-5 h-5" />
                            Certification Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Basic Requirements:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Completion of accredited program</li>
                                    <li>• Passing score on certification exam</li>
                                    <li>• Background check clearance</li>
                                    <li>• CPR/BLS certification</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Exam Information:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• National certification exam required</li>
                                    <li>• Computer-based testing available</li>
                                    <li>• Multiple testing windows per year</li>
                                    <li>• Results typically within 2-4 weeks</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            State Licensing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Licensing requirements vary by state. Most states require:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• State-specific application and fees</li>
                                <li>• Proof of national certification</li>
                                <li>• Criminal background check</li>
                                <li>• Continuing education credits</li>
                            </ul>
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg mt-4">
                                <p className="text-sm font-semibold mb-1">Important:</p>
                                <p className="text-sm text-muted-foreground">
                                    Always verify current requirements with your state's licensing board, as regulations change frequently.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Exam Preparation Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2">Study Materials</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Official study guides</li>
                                <li>• Practice exams</li>
                                <li>• Review courses</li>
                                <li>• Study groups</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Preparation Timeline</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• 3-6 months recommended</li>
                                <li>• Daily study sessions</li>
                                <li>• Regular practice tests</li>
                                <li>• Review weak areas</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Exam Day Tips</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Arrive early</li>
                                <li>• Bring required ID</li>
                                <li>• Read questions carefully</li>
                                <li>• Manage your time</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Renewal & Continuing Education</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Renewal Requirements:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Renewal every 2-3 years (varies by state)</li>
                                <li>• Continuing education credits (typically 20-40 hours)</li>
                                <li>• Renewal fees ($100-$300)</li>
                                <li>• Proof of active practice</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Continuing Education Options:</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Online courses and webinars</li>
                                <li>• Professional conferences</li>
                                <li>• Workshops and seminars</li>
                                <li>• Academic coursework</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Ready to Start Your Career?</h2>
                <p className="text-muted-foreground mb-6">
                    Explore schools, salary information, and current job openings for {careerTitle.toLowerCase()}s.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={`/${profession}-schools`}>
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Find Schools
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
                            Browse Jobs
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Related Professions */}
            <RelatedProfessions
                profession={profession}
                currentPageType="certification"
                maxItems={6}
                className="mb-12"
            />

            {/* Cross-Page Links */}
            <CrossPageLinks
                profession={profession}
                currentPage="certification"
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
