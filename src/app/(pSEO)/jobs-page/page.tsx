import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { JobListingsWithFilters } from '@/components/jobs/JobListingsWithFilters';
import { Breadcrumb, getProfessionBreadcrumbs } from '@/components/ui/breadcrumb';
import { getJobsPageMetaTags, getCanonicalUrl, getOpenGraphTags, getTwitterCardTags } from '@/lib/meta-tags';
import { InternalLinks } from '@/components/salary/InternalLinks';
import { CrossPageLinks } from '@/components/profession/CrossPageLinks';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        profession?: string;
        location?: string;
        city?: string;
    };
}

function formatCareerTitle(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const profession = searchParams.profession || 'registered-nurses';
    const location = searchParams.location;
    const city = searchParams.city;

    const careerTitle = formatCareerTitle(profession);
    const isNational = !location && !city;
    const locationName = city || location || 'United States';

    const jobCount = await prisma.job.count({
        where: { careerKeyword: profession }
    });

    const metaTags = getJobsPageMetaTags(careerTitle, locationName, jobCount, isNational);
    const urlPath = city && location
        ? `/${profession}-jobs/${location}/${city}`
        : location
            ? `/${profession}-jobs/${location}`
            : `/${profession}-jobs`;

    const canonicalUrl = getCanonicalUrl(urlPath);
    const ogTags = getOpenGraphTags(metaTags.title, metaTags.description, canonicalUrl);
    const twitterTags = getTwitterCardTags(metaTags.title, metaTags.description);

    return {
        title: metaTags.title,
        description: metaTags.description,
        alternates: { canonical: canonicalUrl },
        openGraph: ogTags,
        twitter: twitterTags,
        robots: { index: true, follow: true },
    };
}

export default async function JobsPage({ searchParams }: PageProps) {
    // Extract parameters from search params (set by middleware)
    const profession = searchParams.profession || 'registered-nurses';
    const location = searchParams.location;
    const city = searchParams.city;

    // Build query
    const whereClause: any = {
        careerKeyword: profession
    };

    if (city) {
        whereClause.location = {
            contains: city,
            mode: 'insensitive' as const
        };
    } else if (location) {
        whereClause.location = {
            contains: location,
            mode: 'insensitive' as const
        };
    }

    // Fetch jobs (both internal employer postings and external Adzuna jobs)
    const jobs = await prisma.job.findMany({
        where: whereClause,
        orderBy: [
            { source: 'asc' }, // Internal jobs first
            { createdAt: 'desc' }
        ],
        take: 200 // Increased limit for filtering
    });

    const careerTitle = formatCareerTitle(profession);
    const locationName = city || location || 'United States';

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={getProfessionBreadcrumbs(profession, careerTitle, 'jobs')}
                className="mb-6"
            />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {careerTitle} Jobs {locationName !== 'United States' && `in ${locationName}`}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {jobs.length} open positions available
                </p>
            </div>

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
                            <Link href={`/${profession}-salary${location ? `/${location}` : ''}`}>
                                View Salary Data →
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Job Listings with Filters */}
            <JobListingsWithFilters jobs={jobs} profession={profession} />

            {/* SEO Content Section */}
            <div className="mt-12 prose prose-lg dark:prose-invert max-w-none">
                <h2>About {careerTitle} Jobs {locationName !== 'United States' && `in ${locationName}`}</h2>
                <p>
                    Looking for {careerTitle.toLowerCase()} opportunities? Browse our current openings and find your next career move.
                    We aggregate jobs from top healthcare employers to bring you the most comprehensive list of {careerTitle.toLowerCase()} positions available.
                </p>
            </div>

            {/* Internal Linking Section */}
            <InternalLinks
                profession={profession}
                state={location}
                city={city}
            />

            {/* Cross-Page Spoke Links */}
            <CrossPageLinks
                profession={profession}
                state={location}
                city={city}
                currentPage="jobs"
                className="mt-8"
            />
        </main>
    );
}
