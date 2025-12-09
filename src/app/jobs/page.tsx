import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JobsHeroSection } from '@/components/jobs/JobsHeroSection';
import { ProfessionBrowseGrid } from '@/components/jobs/ProfessionBrowseGrid';
import { JobListingsWithFilters } from '@/components/jobs/JobListingsWithFilters';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        q?: string;
        location?: string;
        profession?: string;
        page?: string;
    };
}

export default async function JobsLandingPage({ searchParams }: PageProps) {
    const page = parseInt(searchParams.page || '1');
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    // Build query
    const whereClause: any = {};

    if (searchParams.q) {
        whereClause.OR = [
            { title: { contains: searchParams.q, mode: 'insensitive' as const } },
            { description: { contains: searchParams.q, mode: 'insensitive' as const } },
            { companyName: { contains: searchParams.q, mode: 'insensitive' as const } },
        ];
    }

    if (searchParams.location) {
        whereClause.location = {
            contains: searchParams.location,
            mode: 'insensitive' as const
        };
    }

    if (searchParams.profession) {
        whereClause.careerKeyword = searchParams.profession;
    }

    // Fetch jobs with pagination
    const [jobs, totalJobs] = await Promise.all([
        prisma.job.findMany({
            where: whereClause,
            orderBy: [
                { source: 'asc' }, // Internal jobs first
                { createdAt: 'desc' }
            ],
            take: pageSize,
            skip: skip
        }),
        prisma.job.count({ where: whereClause })
    ]);

    // Get profession counts for browse grid (top 20 professions)
    const professionCounts = await prisma.job.groupBy({
        by: ['careerKeyword'],
        _count: true,
        where: {
            careerKeyword: { not: null }
        },
        orderBy: {
            _count: {
                careerKeyword: 'desc'
            }
        },
        take: 20
    });

    const professionsWithCounts = professionCounts
        .filter(p => p.careerKeyword)
        .map(p => ({
            slug: p.careerKeyword!,
            name: p.careerKeyword!.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            jobCount: p._count
        }));

    // Get total profession count
    const totalProfessions = await prisma.job.findMany({
        where: { careerKeyword: { not: null } },
        select: { careerKeyword: true },
        distinct: ['careerKeyword']
    });

    const totalPages = Math.ceil(totalJobs / pageSize);
    const hasFilters = searchParams.q || searchParams.location || searchParams.profession;

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            {/* Hero Section */}
            <JobsHeroSection
                totalJobs={totalJobs}
                totalProfessions={totalProfessions.length}
            />

            {/* Show profession grid only if no filters applied */}
            {!hasFilters && (
                <ProfessionBrowseGrid professions={professionsWithCounts} />
            )}

            {/* Job Listings Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            {hasFilters ? 'Search Results' : 'All Jobs'}
                        </h2>
                        <p className="text-muted-foreground">
                            {totalJobs.toLocaleString()} jobs found
                            {searchParams.q && ` for "${searchParams.q}"`}
                            {searchParams.location && ` in ${searchParams.location}`}
                        </p>
                    </div>
                </div>

                {jobs.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-xl text-muted-foreground mb-4">
                                No jobs found matching your criteria
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                Try adjusting your search or browse by profession above
                            </p>
                            <Button asChild variant="outline">
                                <Link href="/jobs">
                                    Clear Filters
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <JobListingsWithFilters jobs={jobs} profession="" />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {page > 1 && (
                                    <Button variant="outline" asChild>
                                        <Link href={`/jobs?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() }).toString()}`}>
                                            Previous
                                        </Link>
                                    </Button>
                                )}

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={page === pageNum ? 'default' : 'outline'}
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/jobs?${new URLSearchParams({ ...searchParams, page: pageNum.toString() }).toString()}`}>
                                                    {pageNum}
                                                </Link>
                                            </Button>
                                        );
                                    })}
                                    {totalPages > 5 && <span className="text-muted-foreground">...</span>}
                                    {totalPages > 5 && (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/jobs?${new URLSearchParams({ ...searchParams, page: totalPages.toString() }).toString()}`}>
                                                {totalPages}
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {page < totalPages && (
                                    <Button variant="outline" asChild>
                                        <Link href={`/jobs?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() }).toString()}`}>
                                            Next
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* SEO Content */}
            <div className="mt-16 prose prose-lg dark:prose-invert max-w-none">
                <h2>Healthcare Jobs Across All Specialties</h2>
                <p>
                    Medical Career Center is your comprehensive resource for finding healthcare jobs across all {totalProfessions.length} medical professions.
                    Whether you're a registered nurse, physician, dental professional, or allied health worker, we connect you with opportunities
                    from leading healthcare employers nationwide.
                </p>
                <p>
                    Browse by profession to find specialized opportunities, or use our advanced filters to narrow down jobs by location,
                    salary range, employment type, and more. We aggregate both direct employer postings and external job listings to give
                    you the most comprehensive view of available healthcare positions.
                </p>

                <div className="grid md:grid-cols-2 gap-6 not-prose mt-8">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-2">Explore Salary Data</h3>
                            <p className="text-muted-foreground mb-4">
                                Research competitive salaries for your profession across different locations
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/">
                                    View Salary Pages <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-2">For Employers</h3>
                            <p className="text-muted-foreground mb-4">
                                Post jobs and connect with qualified healthcare professionals
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/employer/jobs/new">
                                    Post a Job <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
