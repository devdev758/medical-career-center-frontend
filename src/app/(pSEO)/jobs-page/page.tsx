import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Building2, DollarSign, Clock, ExternalLink } from 'lucide-react';

const prisma = new PrismaClient();

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

    // Fetch jobs
    const jobs = await prisma.job.findMany({
        where: whereClause,
        orderBy: {
            createdAt: 'desc'
        },
        take: 50
    });

    const careerTitle = formatCareerTitle(profession);
    const locationName = city || location || 'United States';

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Home
                </Link>
            </div>

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

            {/* Job Listings */}
            {jobs.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-xl text-muted-foreground mb-4">
                            No jobs found for {careerTitle} {locationName !== 'United States' && `in ${locationName}`}
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            Try searching in a different location or check back later for new opportunities.
                        </p>
                        <Button asChild variant="outline">
                            <Link href={`/${profession}-jobs`}>
                                View All {careerTitle} Jobs
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl mb-2">
                                            {job.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                <span>{job.companyName || 'Company'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{job.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {job.salary && (
                                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold mb-2">
                                                <DollarSign className="w-4 h-4" />
                                                <span>{job.salary}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span>{formatDate(job.createdAt.toISOString())}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <p className="text-muted-foreground line-clamp-3">
                                        {job.description.substring(0, 300)}...
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Badge variant="secondary">{job.type.replace('_', ' ')}</Badge>
                                        {job.remote && <Badge variant="outline">Remote</Badge>}
                                    </div>

                                    <Button asChild>
                                        <a
                                            href={job.externalUrl || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2"
                                        >
                                            Apply Now
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* SEO Content Section */}
            <div className="mt-12 prose prose-lg dark:prose-invert max-w-none">
                <h2>About {careerTitle} Jobs {locationName !== 'United States' && `in ${locationName}`}</h2>
                <p>
                    Looking for {careerTitle.toLowerCase()} opportunities? Browse our current openings and find your next career move.
                    We aggregate jobs from top healthcare employers to bring you the most comprehensive list of {careerTitle.toLowerCase()} positions available.
                </p>
            </div>
        </main>
    );
}
