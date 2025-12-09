import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Building2, DollarSign, Clock, ExternalLink, Briefcase, Calendar } from 'lucide-react';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        id: string;
    };
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

export default async function JobDetailPage({ params }: PageProps) {
    const job = await prisma.job.findUnique({
        where: { id: params.id },
        include: { company: true }
    });

    if (!job) {
        return notFound();
    }

    const isExternal = job.source !== 'INTERNAL';

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="mb-6">
                <Link
                    href={job.careerKeyword ? `/${job.careerKeyword}-jobs` : '/jobs'}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Job Listings
                </Link>
            </div>

            {/* Job Header */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-3xl mb-3">{job.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    <span className="font-medium">{job.companyName || job.company?.name || 'Company'}</span>
                                </div>
                                {job.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{job.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Posted {formatDate(job.createdAt.toISOString())}</span>
                                </div>
                            </div>
                        </div>
                        {job.salary && (
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <DollarSign className="w-5 h-5" />
                                    {job.salary}
                                </div>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Badge variant="secondary">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {job.type.replace('_', ' ')}
                        </Badge>
                        {job.remote && <Badge variant="outline">Remote</Badge>}
                        {isExternal && <Badge variant="outline">External Listing</Badge>}
                    </div>

                    {/* Apply Button */}
                    <div className="flex gap-3">
                        {isExternal ? (
                            <Button size="lg" asChild className="flex-1">
                                <a
                                    href={job.externalUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2"
                                >
                                    Apply on Company Site
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        ) : (
                            <Button size="lg" asChild className="flex-1">
                                <Link href={`/jobs/${job.slug}/apply`}>
                                    Apply Now
                                </Link>
                            </Button>
                        )}
                        <Button size="lg" variant="outline">
                            Save Job
                        </Button>
                    </div>

                    {isExternal && (
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            This job is hosted on an external site. You'll be redirected to apply.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        {job.description.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Company Info (if available) */}
            {job.company && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>About {job.company.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{job.company.description || 'No company description available.'}</p>
                        {job.company.website && (
                            <Button variant="link" asChild className="mt-2 px-0">
                                <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                                    Visit Company Website →
                                </a>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Related Jobs */}
            <Card>
                <CardHeader>
                    <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        <Link href={job.careerKeyword ? `/${job.careerKeyword}-jobs` : '/jobs'} className="text-primary hover:underline">
                            View all {job.careerKeyword?.replace(/-/g, ' ')} jobs →
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
