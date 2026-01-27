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
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { urlSlugToDbSlug, formatSlugForBreadcrumb, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';
import { validateProfession, getProfessionDisplayName } from '@/lib/profession-utils';
import { cache } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RN_SCHOOLS_CONTENT } from '@/lib/rn-schools-content';
import { PROGRAM_TYPE_CONTENT_MAP } from '@/lib/schools';
import { getContentYear } from '@/lib/date-utils';

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

    const currentYear = getContentYear();
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

    // Validate profession
    const isValid = await validateProfession(profession);
    if (!isValid) {
        notFound();
    }

    const displayName = await getProfessionDisplayName(profession);
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

    // Career guide is optional - pages work without it

    // Get all states from Location table for navigation
    const allStates = await prisma.location.findMany({
        where: { city: '' },
        select: { state: true, stateName: true },
        orderBy: { stateName: 'asc' }
    });

    const topSchools = (careerGuide?.topSchools as any[]) || [];
    const programTypes = (careerGuide?.programTypes as any[]) || [];
    const isRegisteredNurse = profession === 'registered-nurse';

    // Build breadcrumb items
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide?.professionName || displayName, href: `/${profession}` },
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
            <div className="space-y-12 animate-in fade-in duration-500">
                <div className="border-b border-[#006494]/10 pb-8">
                    <h1 className="text-3xl font-bold mb-4 text-[#003554]">
                        {careerTitle} Schools in {stateName}
                    </h1>
                    <p className="text-xl text-[#4A5568] leading-relaxed">
                        Find accredited nursing programs in {stateName}. Compare tuition, duration, and outcomes.
                    </p>
                </div>

                {/* Coming Soon Notice */}
                <Card className="mb-8 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <GraduationCap className="w-5 h-5" />
                            School Directory Coming Soon
                        </h3>
                        <p className="text-muted-foreground">
                            We're building a comprehensive directory of {careerTitle.toLowerCase()} schools in {stateName}.
                            Check back soon for detailed program listings, requirements, and tuition information.
                        </p>
                    </CardContent>
                </Card>

                {/* State Overview */}
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#003554]">Nursing Education in {stateName}</h2>
                    <p className="text-[#4A5568] leading-relaxed text-lg">
                        {stateName} offers a variety of nursing education pathways for aspiring {careerTitle.toLowerCase()}s.
                        From associate degree programs to bachelor's and master's degrees, you can find programs that fit your
                        schedule and career goals. Many schools also offer online and hybrid options for working professionals.
                    </p>
                </section>

                {/* Program Types Available */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-[#003554]">Program Types in {stateName}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(PROGRAM_TYPE_META).map(([slug, meta]) => {
                            const Icon = meta.icon;
                            return (
                                <Card key={slug} className="hover:shadow-md transition-shadow cursor-pointer bg-white border-[#006494]/10">
                                    <CardContent className="p-6">
                                        <Icon className="w-6 h-6 mb-3 text-[#0582CA]" />
                                        <h3 className="font-semibold mb-2 text-[#003554]">{meta.title}</h3>
                                        <p className="text-sm text-[#6B7280]">{meta.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Browse Other States */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-secondary" />
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
                                        : 'bg-background hover:bg-muted text-muted-foreground border-border'
                                        }`}
                                >
                                    {loc.stateName || loc.state}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Default schools page (program types or main)
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="border-b border-[#006494]/10 pb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#003554]">
                    {programTypeMeta ? `${programTypeMeta.title} ` : ''}{careerTitle} Schools & Programs
                </h1>
                <p className="text-xl text-[#4A5568] leading-relaxed">
                    {programTypeMeta
                        ? programTypeMeta.description
                        : `Find accredited nursing programs and schools for aspiring ${careerTitle}s.`}
                </p>
            </div>

            {/* Program Type Navigation */}
            {isRegisteredNurse && (
                <Card className="border-[#006494]/10">
                    <CardHeader>
                        <CardTitle className="text-lg text-[#003554]">Browse by Program Type</CardTitle>
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
                                            ? 'bg-[#003554] text-white border-[#003554]'
                                            : 'bg-white hover:bg-[#F0F4F8] border-[#006494]/10 text-[#003554]'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mx-auto mb-2" />
                                        <p className="font-medium text-sm">{meta.title}</p>
                                    </Link>
                                );
                            })}
                        </div>
                        {isProgramType && (
                            <div className="mt-4 pt-4 border-t border-[#006494]/10">
                                <Link href={`/${profession}/schools`} className="text-sm text-[#0582CA] hover:underline font-medium">
                                    ← View all {careerTitle.toLowerCase()} schools
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Program-Type Specific Content for RN */}
            {isProgramType && isRegisteredNurse && firstParam && PROGRAM_TYPE_CONTENT_MAP[firstParam] && (
                <article className="prose prose-slate dark:prose-invert max-w-none mb-12 bg-card p-8 rounded-2xl border border-border/50">
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
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-secondary" />
                        Browse Schools by State
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {allStates.map((loc) => (
                            <Link
                                key={loc.state}
                                href={`/${profession}/schools/${loc.state.toLowerCase()}`}
                                className="px-3 py-1.5 rounded-full border border-border text-sm hover:bg-muted text-muted-foreground transition-colors"
                            >
                                {loc.stateName || loc.state}
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Schools (Featured) */}
            {topSchools.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-foreground">Featured Programs</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {topSchools.map((school: any, idx: number) => (
                            <Card key={idx} className="border-border/50 hover:border-primary/50 transition-colors">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2 text-foreground">{school.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {school.location}
                                        </span>
                                        <Badge variant="outline" className="text-xs border-border">{school.programType}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Financial Aid */}
            {careerGuide?.financialAid && (
                <section>
                    <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-700 dark:text-green-300">
                                <DollarSign className="w-5 h-5" />
                                Financial Aid & Scholarships
                            </h3>
                            <p className="text-muted-foreground">{careerGuide?.financialAid}</p>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* CTA */}
            <Card className="mt-8 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary">
                <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-2 text-white">
                        Ready to Start Your {careerTitle} Career?
                    </h3>
                    <p className="text-white/80 mb-6 text-lg">
                        Learn about requirements, timeline, and steps to become a {careerTitle.toLowerCase()}.
                    </p>
                    <Button size="lg" variant="secondary" asChild className="font-bold">
                        <Link href={urls.howToBecome}>
                            Read the Full Career Guide <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
