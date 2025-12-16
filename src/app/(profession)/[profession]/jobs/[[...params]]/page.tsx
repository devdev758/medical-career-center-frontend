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
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        params?: string[];  // [[...params]] -> can be [], ['remote'], ['new-grad'], ['ca'], ['ca', 'los-angeles']
    };
}

// Job type slugs that map to filters
const JOB_TYPE_SLUGS = ['remote', 'work-from-home', 'new-grad', 'travel', 'part-time'];

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
        title: 'Part-Time',
        description: 'Flexible part-time and PRN positions',
        icon: Clock,
        filter: {
            OR: [
                { title: { contains: 'part time', mode: 'insensitive' } },
                { title: { contains: 'part-time', mode: 'insensitive' } },
                { title: { contains: 'prn', mode: 'insensitive' } },
                { title: { contains: 'per diem', mode: 'insensitive' } }
            ]
        }
    }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, params: routeParams } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const firstParam = routeParams?.[0];
    const isJobType = firstParam && JOB_TYPE_SLUGS.includes(firstParam);
    const jobTypeMeta = isJobType ? JOB_TYPE_META[firstParam] : null;

    const jobCount = await prisma.job.count({
        where: { careerKeyword: dbSlug }
    });

    const currentYear = new Date().getFullYear();
    let title, description, urlPath;

    if (jobTypeMeta) {
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
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const firstParam = routeParams?.[0];
    const isJobType = firstParam && JOB_TYPE_SLUGS.includes(firstParam);
    const jobTypeMeta = isJobType ? JOB_TYPE_META[firstParam] : null;

    // Build query
    const whereClause: any = {
        careerKeyword: dbSlug
    };

    // Apply job type filter if applicable
    if (jobTypeMeta?.filter) {
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

    // Build breadcrumb items - last item should not have href
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerTitle, href: `/${profession}` },
    ];

    if (isJobType && jobTypeMeta) {
        breadcrumbItems.push({ label: 'Jobs', href: `/${profession}/jobs` });
        breadcrumbItems.push({ label: jobTypeMeta.title });
    } else {
        breadcrumbItems.push({ label: 'Jobs' });
    }

    const isRegisteredNurse = profession === 'registered-nurse';

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={breadcrumbItems}
                className="mb-6"
            />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {jobTypeMeta ? `${jobTypeMeta.title} ` : ''}{careerTitle} Jobs
                </h1>
                <p className="text-xl text-muted-foreground">
                    {jobs.length} {jobTypeMeta ? jobTypeMeta.title.toLowerCase() : ''} positions available
                    {jobTypeMeta && ` (${totalJobCount} total ${careerTitle.toLowerCase()} jobs)`}
                </p>
            </div>

            {/* Job Type Quick Navigation */}
            {isRegisteredNurse && (
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

            {/* Link to Salary Page */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                💰 Curious about {careerTitle} salaries?
                            </h3>
                            <p className="text-muted-foreground">
                                View detailed salary data, ranges, and insights for this profession
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={urls.salary}>
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
                <h2>About {jobTypeMeta ? `${jobTypeMeta.title} ` : ''}{careerTitle} Jobs</h2>
                {jobTypeMeta ? (
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
