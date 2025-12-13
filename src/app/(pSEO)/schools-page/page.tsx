import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { School, MapPin, DollarSign, GraduationCap, BookOpen, Award } from 'lucide-react';
import { Breadcrumb, getProfessionBreadcrumbs } from '@/components/ui/breadcrumb';
import { SpokeNavigation } from '@/components/profession/SpokeNavigation';
import { RelatedProfessions } from '@/components/profession/RelatedProfessions';
import { NearbyStatesLinks } from '@/components/geo/NearbyStatesLinks';
import { CrossPageLinks } from '@/components/profession/CrossPageLinks';
import statesList from '@/data/states-list.json';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        profession?: string;
        location?: string; // 2-letter state code like "ca", "tx"
    };
}

function formatCareerTitle(slug: string): string {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatLocationName(location: string): string {
    // Convert state abbreviation to full name
    const state = statesList.find(s => s.abbr.toLowerCase() === location.toLowerCase());
    return state ? state.name : location.toUpperCase();
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const profession = searchParams.profession || 'registered-nurses';
    const location = searchParams.location;
    const careerTitle = formatCareerTitle(profession);

    if (location) {
        const stateName = formatLocationName(location);
        return {
            title: `${careerTitle} Schools in ${stateName} 2025: Accredited Programs`,
            description: `Find accredited ${careerTitle.toLowerCase()} programs in ${stateName}. Compare schools, tuition costs, admission requirements, and financial aid options.`,
            alternates: {
                canonical: `https://medicalcareercenter.org/${profession}-schools/${location.toLowerCase()}`
            },
        };
    }

    return {
        title: `${careerTitle} Schools & Programs 2025: Accredited Training Programs`,
        description: `Find accredited ${careerTitle.toLowerCase()} programs nationwide. Compare schools, tuition costs, program types, and admission requirements. Start your career today.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}-schools`
        },
    };
}

export default async function SchoolsPage({ searchParams }: PageProps) {
    const profession = searchParams.profession || 'registered-nurses';
    const location = searchParams.location;
    const careerTitle = formatCareerTitle(profession);
    const stateName = location ? formatLocationName(location) : null;

    const breadcrumbItems = stateName
        ? [
            { label: 'Home', href: '/' },
            { label: careerTitle, href: `/${profession}` },
            { label: 'Schools & Programs', href: `/${profession}-schools` },
            { label: stateName }
        ]
        : [
            { label: 'Home', href: '/' },
            { label: careerTitle, href: `/${profession}` },
            { label: 'Schools & Programs' }
        ];

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <School className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {careerTitle} Schools {stateName && `in ${stateName}`}
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Find accredited programs{stateName && ` in ${stateName}`}, compare schools, and start your journey to becoming a {careerTitle.toLowerCase()}.
                </p>
            </div>

            <SpokeNavigation profession={profession} currentSpoke="schools" />

            {stateName && (
                <Card className="my-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Schools in {stateName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            {stateName} offers numerous accredited {careerTitle.toLowerCase()} programs across the state. Below you'll find information about program types, costs, and requirements specific to {stateName}.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href={`/${profession}-schools`}>
                                <Button variant="outline" size="sm">
                                    View All States
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid md:grid-cols-2 gap-8 my-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            Program Types
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <div>
                                    <strong>Associate Degree Programs</strong>
                                    <p className="text-sm text-muted-foreground">2-year programs, entry-level preparation</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <div>
                                    <strong>Bachelor's Degree Programs</strong>
                                    <p className="text-sm text-muted-foreground">4-year programs, comprehensive training</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <div>
                                    <strong>Master's Degree Programs</strong>
                                    <p className="text-sm text-muted-foreground">Advanced specialization and leadership</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <div>
                                    <strong>Online Programs</strong>
                                    <p className="text-sm text-muted-foreground">Flexible learning options</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Tuition & Financial Aid
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold">Average Program Costs{stateName && ` in ${stateName}`}:</p>
                                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                    <li>• Associate Degree: $10,000 - $30,000</li>
                                    <li>• Bachelor's Degree: $40,000 - $100,000</li>
                                    <li>• Master's Degree: $30,000 - $80,000</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold">Financial Aid Options:</p>
                                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                    <li>• Federal student loans</li>
                                    <li>• Scholarships and grants</li>
                                    {stateName && <li>• {stateName}-specific financial aid programs</li>}
                                    <li>• Employer tuition assistance</li>
                                    <li>• Military benefits</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Accreditation & Program Quality
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Ensure your program is accredited by recognized accrediting bodies. Accreditation ensures quality education and is often required for licensure and employment{stateName && ` in ${stateName}`}.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <p className="font-semibold mb-2">Key Accrediting Bodies:</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Commission on Accreditation of Allied Health Education Programs (CAAHEP)</li>
                            <li>• Accreditation Commission for Education in Nursing (ACEN)</li>
                            <li>• Commission on Collegiate Nursing Education (CCNE)</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Related Professions - Show on both national and state pages */}
            <RelatedProfessions
                profession={profession}
                currentPageType="schools"
                state={location}
                maxItems={6}
                className="mb-12"
            />

            {/* Nearby States Links - Only show on state pages */}
            {location && (
                <NearbyStatesLinks
                    profession={profession}
                    currentState={location}
                    pageType="schools"
                    maxStates={5}
                    className="mb-12"
                />
            )}

            {/* Cross-Page Links */}
            <CrossPageLinks
                profession={profession}
                state={location}
                currentPage="schools"
                className="mb-12"
            />

            {!stateName && (
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Browse Schools by State</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Find {careerTitle.toLowerCase()} programs in your state:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {statesList.map((state) => (
                                <Link
                                    key={state.abbr}
                                    href={`/${profession}-schools/${state.abbr.toLowerCase()}`}
                                    className="text-sm text-primary hover:underline"
                                >
                                    {state.name}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Ready to Start Your Education?</h2>
                <p className="text-muted-foreground mb-6">
                    Explore comprehensive career information, salary data, and current job openings for {careerTitle.toLowerCase()}s{stateName && ` in ${stateName}`}.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={`/how-to-become-${profession}`}>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Career Guide
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={stateName ? `/${profession}-salary/${location}` : `/${profession}-salary`}>
                            <DollarSign className="w-4 h-4 mr-2" />
                            Salary Data{stateName && ` in ${stateName}`}
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={stateName ? `/${profession}-jobs/${location}` : `/${profession}-jobs`}>
                            Browse Jobs{stateName && ` in ${stateName}`}
                        </Link>
                    </Button>
                </div>
            </div>

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
