import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Home, GraduationCap, Plane, Clock } from 'lucide-react';
import { JobListingsWithFilters } from '@/components/jobs/JobListingsWithFilters';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { urlSlugToDbSlug, formatSlugForBreadcrumb, getProfessionUrls } from '@/lib/url-utils';
import { validateProfession, getProfessionDisplayName, getBLSKeywords } from '@/lib/profession-utils';
import { cache } from 'react';
import { getContentYear } from '@/lib/date-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        params?: string[];  // [[...params]] -> can be [], ['remote'], ['ca'], ['ca', 'los-angeles']
    };
}

// Job type slugs that map to filters
const JOB_TYPE_SLUGS = ['remote', 'work-from-home', 'new-grad', 'travel', 'part-time', 'hospital', 'pediatric', 'agency', 'hospice', 'nicu', 'assisted-living'];

// US State codes for location detection
const US_STATE_CODES = [
    'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
    'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
    'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
    'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
    'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy', 'dc', 'pr'
];

// Job type metadata
const JOB_TYPE_META: Record<string, { title: string; description: string; icon: any; filter?: Record<string, any> }> = {
    'remote': {
        title: 'Remote',
        description: 'Work from anywhere positions',
        icon: Home,
        filter: { OR: [{ remote: true }, { location: { contains: 'remote', mode: 'insensitive' } }] }
    },
    'work-from-home': {
        title: 'Work From Home',
        description: 'Telehealth and remote nursing positions',
        icon: Home,
        filter: { OR: [{ remote: true }, { location: { contains: 'remote', mode: 'insensitive' } }] }
    },
    'new-grad': {
        title: 'New Graduate',
        description: 'Entry-level positions for recent graduates',
        icon: GraduationCap,
        filter: {
            OR: [
                { title: { contains: 'new grad', mode: 'insensitive' } },
                { title: { contains: 'graduate', mode: 'insensitive' } },
                { title: { contains: 'entry level', mode: 'insensitive' } },
                { title: { contains: 'entry-level', mode: 'insensitive' } }
            ]
        }
    },
    'travel': {
        title: 'Travel',
        description: 'Travel nursing and contract positions',
        icon: Plane,
        filter: {
            OR: [
                { title: { contains: 'travel', mode: 'insensitive' } },
                { title: { contains: 'contract', mode: 'insensitive' } }
            ]
        }
    },
    'part-time': {
        title: 'Part-Time & PRN',
        description: 'Flexible part-time, PRN, and per diem positions',
        icon: Clock,
        filter: {
            OR: [
                { title: { contains: 'part time', mode: 'insensitive' } },
                { title: { contains: 'part-time', mode: 'insensitive' } },
                { title: { contains: 'prn', mode: 'insensitive' } },
                { title: { contains: 'per diem', mode: 'insensitive' } }
            ]
        }
    },
    'hospital': {
        title: 'Hospital',
        description: 'Hospital CNA positions in acute care settings',
        icon: Briefcase,
        filter: {
            OR: [
                { title: { contains: 'hospital', mode: 'insensitive' } },
                { title: { contains: 'acute care', mode: 'insensitive' } },
                { companyName: { contains: 'hospital', mode: 'insensitive' } }
            ]
        }
    },
    'pediatric': {
        title: 'Pediatric',
        description: 'Pediatric CNA jobs working with children',
        icon: GraduationCap,
        filter: {
            OR: [
                { title: { contains: 'pediatric', mode: 'insensitive' } },
                { title: { contains: 'peds', mode: 'insensitive' } },
                { title: { contains: 'children', mode: 'insensitive' } }
            ]
        }
    },
    'agency': {
        title: 'Agency & Contract',
        description: 'Staffing agency and contract CNA positions',
        icon: Briefcase,
        filter: {
            OR: [
                { title: { contains: 'agency', mode: 'insensitive' } },
                { title: { contains: 'contract', mode: 'insensitive' } },
                { title: { contains: 'staffing', mode: 'insensitive' } },
                { companyName: { contains: 'staffing', mode: 'insensitive' } }
            ]
        }
    },
    'hospice': {
        title: 'Hospice',
        description: 'Hospice and end-of-life care CNA positions',
        icon: Home,
        filter: {
            OR: [
                { title: { contains: 'hospice', mode: 'insensitive' } },
                { title: { contains: 'palliative', mode: 'insensitive' } }
            ]
        }
    },
    'nicu': {
        title: 'NICU',
        description: 'Neonatal intensive care unit positions',
        icon: GraduationCap,
        filter: {
            OR: [
                { title: { contains: 'nicu', mode: 'insensitive' } },
                { title: { contains: 'neonatal', mode: 'insensitive' } }
            ]
        }
    },
    'assisted-living': {
        title: 'Assisted Living',
        description: 'Assisted living and long-term care positions',
        icon: Home,
        filter: {
            OR: [
                { title: { contains: 'assisted living', mode: 'insensitive' } },
                { title: { contains: 'long term care', mode: 'insensitive' } },
                { title: { contains: 'nursing home', mode: 'insensitive' } },
                { title: { contains: 'skilled nursing', mode: 'insensitive' } }
            ]
        }
    }
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

// Helper to format city name from slug
function formatCityName(slug: string): string {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, params: routeParams } = await params;

    // Validate profession
    const isValid = await validateProfession(profession);
    if (!isValid) {
        return { title: 'Profession Not Found' };
    }

    const displayName = await getProfessionDisplayName(profession);
    const blsKeywords = await getBLSKeywords(profession);
    const dbSlug = urlSlugToDbSlug(profession);
    const careerTitle = formatSlugForBreadcrumb(profession);

    const firstParam = routeParams?.[0]?.toLowerCase();
    const secondParam = routeParams?.[1];

    const isJobType = firstParam && JOB_TYPE_SLUGS.includes(firstParam);
    const isState = firstParam && US_STATE_CODES.includes(firstParam);
    const isCity = isState && secondParam;

    const jobTypeMeta = isJobType ? JOB_TYPE_META[firstParam] : null;

    const jobCount = await prisma.job.count({
        where: { careerKeyword: { in: blsKeywords } }
    });

    const currentYear = getContentYear();
    let title, description, urlPath;

    if (isCity && isState) {
        const cityName = formatCityName(secondParam);
        const stateName = getStateName(firstParam);
        title = `${careerTitle} Jobs in ${cityName}, ${stateName} ${currentYear} | Medical Career Center`;
        description = `Find ${careerTitle.toLowerCase()} jobs in ${cityName}, ${stateName}. Browse current openings and apply today.`;
        urlPath = `/${profession}/jobs/${firstParam}/${secondParam}`;
    } else if (isState) {
        const stateName = getStateName(firstParam);
        title = `${careerTitle} Jobs in ${stateName} ${currentYear} | Medical Career Center`;
        description = `Find ${careerTitle.toLowerCase()} jobs in ${stateName}. Browse current openings across the state and apply today.`;
        urlPath = `/${profession}/jobs/${firstParam}`;
    } else if (jobTypeMeta) {
        title = `${jobTypeMeta.title} ${careerTitle} Jobs ${currentYear} | Medical Career Center`;
        description = `Browse ${jobTypeMeta.title.toLowerCase()} ${careerTitle.toLowerCase()} jobs. ${jobTypeMeta.description}. ${jobCount}+ positions available.`;
        urlPath = `/${profession}/jobs/${firstParam}`;
    } else {
        title = `${careerTitle} Jobs ${currentYear}: ${jobCount}+ Open Positions | Medical Career Center`;
        description = `Find ${careerTitle.toLowerCase()} jobs near you. Browse ${jobCount}+ current openings. Remote, travel, and local positions available.`;
        urlPath = `/${profession}/jobs`;
    }

    return {
        title,
        description,
        alternates: { canonical: `https://medicalcareercenter.org${urlPath}` },
        openGraph: { title, description, type: 'website' },
        robots: { index: true, follow: true },
    };
}

export default async function JobsPage({ params }: PageProps) {
    const { profession, params: routeParams } = await params;

    // Validate profession
    const isValid = await validateProfession(profession);
    if (!isValid) {
        notFound();
    }

    const displayName = await getProfessionDisplayName(profession);
    const blsKeywords = await getBLSKeywords(profession);
    const urls = getProfessionUrls(profession);
    const dbSlug = urlSlugToDbSlug(profession);
    const careerTitle = formatSlugForBreadcrumb(profession);

    const firstParam = routeParams?.[0]?.toLowerCase();
    const secondParam = routeParams?.[1];

    const isJobType = firstParam && JOB_TYPE_SLUGS.includes(firstParam);
    const isState = firstParam && US_STATE_CODES.includes(firstParam);
    const isCity = isState && secondParam;

    const jobTypeMeta = isJobType ? JOB_TYPE_META[firstParam] : null;

    // Build query using BLS keywords
    const whereClause: any = {
        careerKeyword: { in: blsKeywords }
    };

    // Apply filters based on route type
    if (isCity && isState) {
        // City filter: match "City, ST" pattern
        const cityName = formatCityName(secondParam);
        const stateCode = firstParam.toUpperCase();
        whereClause.location = { contains: `${cityName}, ${stateCode}`, mode: 'insensitive' };
    } else if (isState) {
        // State filter: match ", ST" pattern
        const stateCode = firstParam.toUpperCase();
        whereClause.location = { contains: `, ${stateCode}`, mode: 'insensitive' };
    } else if (jobTypeMeta?.filter) {
        Object.assign(whereClause, jobTypeMeta.filter);
    }

    // Fetch jobs
    const jobs = await prisma.job.findMany({
        where: whereClause,
        orderBy: [
            { source: 'asc' },
            { createdAt: 'desc' }
        ],
        take: 200
    });

    // Get total job count for the profession
    const totalJobCount = await prisma.job.count({
        where: { careerKeyword: dbSlug }
    });

    // Get top states with job counts for navigation
    const topStates = await prisma.location.findMany({
        where: { city: '' },
        select: { state: true, stateName: true }
    });

    // Get cities for current state if viewing a state
    let stateCities: { city: string; state: string }[] = [];
    if (isState && !isCity) {
        const stateCode = firstParam.toUpperCase();
        stateCities = await prisma.location.findMany({
            where: { state: stateCode, city: { not: '' } },
            select: { city: true, state: true },
            take: 20
        });
    }

    // Build breadcrumb items
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerTitle, href: `/${profession}` },
    ];

    if (isCity && isState) {
        const stateName = getStateName(firstParam);
        const cityName = formatCityName(secondParam);
        breadcrumbItems.push({ label: 'Jobs', href: `/${profession}/jobs` });
        breadcrumbItems.push({ label: stateName, href: `/${profession}/jobs/${firstParam}` });
        breadcrumbItems.push({ label: cityName });
    } else if (isState) {
        const stateName = getStateName(firstParam);
        breadcrumbItems.push({ label: 'Jobs', href: `/${profession}/jobs` });
        breadcrumbItems.push({ label: stateName });
    } else if (isJobType && jobTypeMeta) {
        breadcrumbItems.push({ label: 'Jobs', href: `/${profession}/jobs` });
        breadcrumbItems.push({ label: jobTypeMeta.title });
    } else {
        breadcrumbItems.push({ label: 'Jobs' });
    }

    // Show job type navigation for main professions
    const showJobTypeNav = ['registered-nurse', 'cna', 'licensed-practical-nurse'].includes(profession);

    // Determine page title and subtitle
    let pageTitle = `${careerTitle} Jobs`;
    let pageSubtitle = `${jobs.length} positions available`;

    if (isCity && isState) {
        const cityName = formatCityName(secondParam);
        const stateName = getStateName(firstParam);
        pageTitle = `${careerTitle} Jobs in ${cityName}, ${stateName}`;
        pageSubtitle = `${jobs.length} positions in ${cityName}`;
    } else if (isState) {
        const stateName = getStateName(firstParam);
        pageTitle = `${careerTitle} Jobs in ${stateName}`;
        pageSubtitle = `${jobs.length} positions in ${stateName}`;
    } else if (jobTypeMeta) {
        pageTitle = `${jobTypeMeta.title} ${careerTitle} Jobs`;
        pageSubtitle = `${jobs.length} ${jobTypeMeta.title.toLowerCase()} positions available`;
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {pageTitle}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {pageSubtitle}
                    {(isState || isCity || isJobType) && ` (${totalJobCount} total ${careerTitle.toLowerCase()} jobs)`}
                </p>
            </div>

            <QuickNavigation profession={profession} currentPath="jobs" />

            {/* Job Type Quick Navigation */}
            {showJobTypeNav && !isState && !isCity && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Browse by Job Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {Object.entries(JOB_TYPE_META).map(([slug, meta]) => {
                                const Icon = meta.icon;
                                const isActive = firstParam === slug;
                                return (
                                    <Link
                                        key={slug}
                                        href={`/${profession}/jobs/${slug}`}
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
                        {isJobType && (
                            <div className="mt-4 pt-4 border-t">
                                <Link href={`/${profession}/jobs`} className="text-sm text-primary hover:underline">
                                    ← View all {careerTitle.toLowerCase()} jobs
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* State Navigation */}
            {!isJobType && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            {isState ? `Cities in ${getStateName(firstParam)}` : 'Browse by State'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isState && stateCities.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {stateCities.map((loc) => (
                                    <Link
                                        key={loc.city}
                                        href={`/${profession}/jobs/${loc.state.toLowerCase()}/${loc.city.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="px-3 py-1.5 rounded-full border text-sm hover:bg-muted transition-colors"
                                    >
                                        {loc.city}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {topStates.slice(0, 20).map((loc) => (
                                    <Link
                                        key={loc.state}
                                        href={`/${profession}/jobs/${loc.state.toLowerCase()}`}
                                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${firstParam === loc.state.toLowerCase()
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        {loc.stateName || loc.state}
                                    </Link>
                                ))}
                            </div>
                        )}
                        {(isState || isCity) && (
                            <div className="mt-4 pt-4 border-t">
                                <Link href={`/${profession}/jobs`} className="text-sm text-primary hover:underline">
                                    ← View all {careerTitle.toLowerCase()} jobs
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Link to Salary Page */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                💰 Curious about {careerTitle} salaries{isState ? ` in ${getStateName(firstParam)}` : ''}?
                            </h3>
                            <p className="text-muted-foreground">
                                View detailed salary data, ranges, and insights
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={isState ? `${urls.salary}/${firstParam}` : urls.salary}>
                                View Salary Data →
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Job Listings with Filters */}
            <JobListingsWithFilters jobs={jobs} profession={dbSlug} />

            {/* SEO Content Section */}
            <div className="mt-12 prose prose-lg dark:prose-invert max-w-none">
                <h2>About {pageTitle}</h2>
                {isCity && isState ? (
                    <p>
                        Looking for {careerTitle.toLowerCase()} opportunities in {formatCityName(secondParam!)}?
                        Browse our current openings and find your next career move in {getStateName(firstParam)}.
                    </p>
                ) : isState ? (
                    <p>
                        Looking for {careerTitle.toLowerCase()} opportunities in {getStateName(firstParam)}?
                        We aggregate jobs from top healthcare employers across the state to bring you the most comprehensive list of positions.
                    </p>
                ) : jobTypeMeta ? (
                    <p>
                        Looking for {jobTypeMeta.title.toLowerCase()} {careerTitle.toLowerCase()} opportunities?
                        {jobTypeMeta.description}. Browse our current openings and find your next career move.
                    </p>
                ) : (
                    <p>
                        Looking for {careerTitle.toLowerCase()} opportunities? Browse our current openings and find your next career move.
                        We aggregate jobs from top healthcare employers to bring you the most comprehensive list of {careerTitle.toLowerCase()} positions available.
                    </p>
                )}
            </div>

            {/* Quick Navigation */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                    <Link href={urls.schools} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Find Schools</p>
                    </Link>
                    <Link href={urls.resume} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Resume Tips</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
