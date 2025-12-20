import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    GraduationCap,
    MapPin,
    Clock,
    DollarSign,
    Globe,
    Zap,
    BookOpen,
    ArrowRight
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RN_SCHOOLS_CONTENT } from '@/lib/rn-schools-content';
import { PROGRAM_TYPE_CONTENT_MAP } from '@/lib/schools';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        path?: string[];  // [[...path]] -> can be [], ['online'], ['accelerated'], ['ca'], etc.
    };
}

// School program type slugs
const PROGRAM_TYPE_SLUGS = ['online', 'accelerated', 'associate', 'bsn', 'msn'];

// US State codes for location detection
const US_STATE_CODES = [
    'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
    'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
    'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
    'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
    'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy', 'dc', 'pr'
];

const PROGRAM_TYPE_META: Record<string, { title: string; description: string; icon: any }> = {
    'online': {
        title: 'Online',
        description: 'Flexible online programs for working professionals',
        icon: Globe,
    },
    'accelerated': {
        title: 'Accelerated',
        description: 'Fast-track programs for career changers',
        icon: Zap,
    },
    'associate': {
        title: 'Associate Degree',
        description: 'ADN programs - 2 year pathway to licensure',
        icon: BookOpen,
    },
    'bsn': {
        title: 'BSN Programs',
        description: 'Bachelor of Science in Nursing',
        icon: GraduationCap,
    },
    'msn': {
        title: 'MSN Programs',
        description: 'Master of Science in Nursing',
        icon: GraduationCap,
    },
};

// Helper to get state name from code
function getStateName(stateCode: string): string {
    const stateNames: Record<string, string> = {
        'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas', 'ca': 'California',
        'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware', 'fl': 'Florida', 'ga': 'Georgia',
        'hi': 'Hawaii', 'id': 'Idaho', 'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa',
        'ks': 'Kansas', 'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
        'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi', 'mo': 'Missouri',
        'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada', 'nh': 'New Hampshire', 'nj': 'New Jersey',
        'nm': 'New Mexico', 'ny': 'New York', 'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio',
        'ok': 'Oklahoma', 'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
        'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah', 'vt': 'Vermont',
        'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia', 'wi': 'Wisconsin', 'wy': 'Wyoming',
        'dc': 'District of Columbia', 'pr': 'Puerto Rico'
    };
    return stateNames[stateCode.toLowerCase()] || stateCode.toUpperCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, path } = await params;
    const careerTitle = formatSlugForDisplay(profession);

    const firstParam = path?.[0]?.toLowerCase();
    const isProgramType = firstParam && PROGRAM_TYPE_SLUGS.includes(firstParam);
    const isState = firstParam && US_STATE_CODES.includes(firstParam);
    const programTypeMeta = isProgramType ? PROGRAM_TYPE_META[firstParam] : null;

    const currentYear = new Date().getFullYear();
    let title, description, urlPath;

    if (isState) {
        const stateName = getStateName(firstParam);
        title = `${careerTitle} Schools in ${stateName} ${currentYear} | Medical Career Center`;
        description = `Find accredited ${careerTitle.toLowerCase()} schools and programs in ${stateName}. Compare nursing programs, requirements, and tuition costs.`;
        urlPath = `/${profession}/schools/${firstParam}`;
    } else if (programTypeMeta) {
        title = `${programTypeMeta.title} ${careerTitle} Programs ${currentYear} | Medical Career Center`;
        description = `Find ${programTypeMeta.title.toLowerCase()} ${careerTitle.toLowerCase()} programs. ${programTypeMeta.description}. Compare accredited schools and start your career.`;
        urlPath = `/${profession}/schools/${firstParam}`;
    } else {
        title = `${careerTitle} Schools & Programs ${currentYear} | Medical Career Center`;
        description = `Discover accredited ${careerTitle.toLowerCase()} schools and programs. Compare online, accelerated, and traditional programs. Find the right path for your nursing career.`;
        urlPath = `/${profession}/schools`;
    }

    return {
        title,
        description,
        alternates: { canonical: `https://medicalcareercenter.org${urlPath}` },
        openGraph: { title, description, type: 'website' },
        robots: { index: true, follow: true },
    };
}

export default async function SchoolsPage({ params }: PageProps) {
    const { profession, path } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const firstParam = path?.[0]?.toLowerCase();
    const isProgramType = firstParam && PROGRAM_TYPE_SLUGS.includes(firstParam);
    const isState = firstParam && US_STATE_CODES.includes(firstParam);
    const programTypeMeta = isProgramType ? PROGRAM_TYPE_META[firstParam] : null;

    // Fetch career guide for school data
    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: {
            professionName: true,
            schoolsOverview: true,
            topSchools: true,
            programTypes: true,
            financialAid: true,
            educationPath: true,
        }
    });

    if (!careerGuide) {
        notFound();
    }

    // Get all states from Location table for navigation
    const allStates = await prisma.location.findMany({
        where: { city: '' },
        select: { state: true, stateName: true },
        orderBy: { stateName: 'asc' }
    });

    const topSchools = (careerGuide.topSchools as any[]) || [];
    const programTypes = (careerGuide.programTypes as any[]) || [];
    const isRegisteredNurse = profession === 'registered-nurse';

    // Build breadcrumb items
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
    ];

    if (isState) {
        const stateName = getStateName(firstParam);
        breadcrumbItems.push({ label: 'Schools', href: `/${profession}/schools` });
        breadcrumbItems.push({ label: stateName });
    } else if (isProgramType && programTypeMeta) {
        breadcrumbItems.push({ label: 'Schools', href: `/${profession}/schools` });
        breadcrumbItems.push({ label: programTypeMeta.title });
    } else {
        breadcrumbItems.push({ label: 'Schools' });
    }

    // State-specific page content
    if (isState) {
        const stateName = getStateName(firstParam);
        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />

                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        {careerTitle} Schools in {stateName}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Find accredited nursing programs in {stateName}
                    </p>
                </div>

                {/* Coming Soon Notice */}
                <Card className="mb-8 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-yellow-600" />
                            School Directory Coming Soon
                        </h3>
                        <p className="text-muted-foreground">
                            We're building a comprehensive directory of {careerTitle.toLowerCase()} schools in {stateName}.
                            Check back soon for detailed program listings, requirements, and tuition information.
                        </p>
                    </CardContent>
                </Card>

                {/* State Overview */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Nursing Education in {stateName}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {stateName} offers a variety of nursing education pathways for aspiring {careerTitle.toLowerCase()}s.
                        From associate degree programs to bachelor's and master's degrees, you can find programs that fit your
                        schedule and career goals. Many schools also offer online and hybrid options for working professionals.
                    </p>
                </section>

                {/* Program Types Available */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Program Types in {stateName}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(PROGRAM_TYPE_META).map(([slug, meta]) => {
                            const Icon = meta.icon;
                            return (
                                <Card key={slug} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <Icon className="w-6 h-6 mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">{meta.title}</h3>
                                        <p className="text-sm text-muted-foreground">{meta.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Browse Other States */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Browse Schools by State
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {allStates.map((loc) => (
                                <Link
                                    key={loc.state}
                                    href={`/${profession}/schools/${loc.state.toLowerCase()}`}
                                    className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${firstParam === loc.state.toLowerCase()
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    {loc.stateName || loc.state}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Navigation */}
                <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link href={`${urls.salary}/${firstParam}`} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                            <p className="font-medium text-sm">{stateName} Salary</p>
                        </Link>
                        <Link href={`${urls.jobs}/${firstParam}`} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                            <p className="font-medium text-sm">{stateName} Jobs</p>
                        </Link>
                        <Link href={urls.license} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                            <p className="font-medium text-sm">License Info</p>
                        </Link>
                        <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                            <p className="font-medium text-sm">Career Guide</p>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Default schools page (program types or main)
    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {programTypeMeta ? `${programTypeMeta.title} ` : ''}{careerTitle} Schools & Programs
                </h1>
                <p className="text-xl text-muted-foreground">
                    {programTypeMeta
                        ? programTypeMeta.description
                        : 'Find accredited nursing programs to start your healthcare career'}
                </p>
            </div>

            {/* Program Type Navigation */}
            {isRegisteredNurse && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Browse by Program Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {Object.entries(PROGRAM_TYPE_META).map(([slug, meta]) => {
                                const Icon = meta.icon;
                                const isActive = firstParam === slug;
                                return (
                                    <Link
                                        key={slug}
                                        href={`/${profession}/schools/${slug}`}
                                        className={`p-4 rounded-lg border transition-colors text-center ${isActive
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mx-auto mb-2" />
                                        <p className="font-medium text-sm">{meta.title}</p>
                                    </Link>
                                );
                            })}
                        </div>
                        {isProgramType && (
                            <div className="mt-4 pt-4 border-t">
                                <Link href={`/${profession}/schools`} className="text-sm text-primary hover:underline">
                                    ← View all {careerTitle.toLowerCase()} schools
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Program-Type Specific Content for RN */}
            {isProgramType && isRegisteredNurse && firstParam && PROGRAM_TYPE_CONTENT_MAP[firstParam] && (
                <article className="prose prose-slate dark:prose-invert max-w-none mb-12
                    prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-semibold
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                    prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                    prose-table:my-6 prose-table:border-collapse
                    prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:font-semibold prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700
                    prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
                    prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded">
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
                        {PROGRAM_TYPE_CONTENT_MAP[firstParam]}
                    </ReactMarkdown>
                </article>
            )}

            {/* State Navigation */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Browse Schools by State
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {allStates.map((loc) => (
                            <Link
                                key={loc.state}
                                href={`/${profession}/schools/${loc.state.toLowerCase()}`}
                                className="px-3 py-1.5 rounded-full border text-sm hover:bg-muted transition-colors"
                            >
                                {loc.stateName || loc.state}
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Comprehensive Schools Guide for RN */}
            {isRegisteredNurse && (
                <article className="prose prose-slate dark:prose-invert max-w-none mb-12
                    prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-semibold
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                    prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                    prose-table:my-6 prose-table:border-collapse
                    prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:font-semibold prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700
                    prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
                    prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded">
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
                        {RN_SCHOOLS_CONTENT}
                    </ReactMarkdown>
                </article>
            )}

            {/* Overview - fallback for non-RN professions */}
            {!isRegisteredNurse && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Education Overview</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        {careerGuide.schoolsOverview || careerGuide.educationPath}
                    </p>
                </section>
            )}

            {/* Program Types */}
            {programTypes.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Program Types</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {programTypes.map((type: any, idx: number) => (
                            <Card key={idx}>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">{type.type}</h3>
                                    <p className="text-sm text-muted-foreground">{type.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Top Schools */}
            {topSchools.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Featured Programs</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {topSchools.map((school: any, idx: number) => (
                            <Card key={idx}>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">{school.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {school.location}
                                        </span>
                                        <Badge variant="outline" className="text-xs">{school.programType}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Financial Aid */}
            {careerGuide.financialAid && (
                <section className="mb-12">
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                Financial Aid & Scholarships
                            </h3>
                            <p className="text-muted-foreground">{careerGuide.financialAid}</p>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* Quick Navigation */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                    <Link href={urls.license} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">License Info</p>
                    </Link>
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Browse Jobs</p>
                    </Link>
                </div>
            </div>

            {/* CTA */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
                <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">
                        Ready to Start Your {careerTitle} Career?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Learn about requirements, timeline, and steps to become a {careerTitle.toLowerCase()}.
                    </p>
                    <Button asChild>
                        <Link href={urls.howToBecome}>
                            Read the Full Career Guide <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
