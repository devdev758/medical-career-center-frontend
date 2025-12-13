import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    DollarSign,
    Briefcase,
    TrendingUp,
    Users,
    GraduationCap,
    ArrowRight,
    MapPin,
    Clock
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

export default async function ProfessionHubPage({ params }: PageProps) {
    const { profession } = await params;

    // If the profession starts with "how-to-become-", this should be handled by the career guide route
    // But Next.js might route it here first, so we need to return notFound to let it fall through
    if (profession.startsWith('how-to-become-')) {
        notFound();
    }

    // Fetch career guide
    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: profession },
    });

    if (!careerGuide) {
        notFound();
    }

    // Fetch salary data (national average)
    const salaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: profession,
            locationId: null, // National data
        },
        orderBy: { year: 'desc' },
    });

    // Fetch job count
    const jobCount = await prisma.job.count({
        where: { careerKeyword: profession },
    });

    // Fetch recent jobs (top 3)
    const recentJobs = await prisma.job.findMany({
        where: { careerKeyword: profession },
        orderBy: { createdAt: 'desc' },
        take: 3,
    });

    const keyStats = careerGuide.keyStats as any;
    const medianSalary = salaryData?.annualMedian
        ? `$${Math.round(salaryData.annualMedian).toLocaleString()}`
        : keyStats.medianSalary;

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            {/* Hero Section */}
            <div className="mb-12">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span>/</span>
                    <span>{careerGuide.professionName}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {careerGuide.professionName}
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    {careerGuide.overview.substring(0, 200)}...
                </p>
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Median Salary</p>
                                <p className="text-2xl font-bold">{medianSalary}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Job Growth</p>
                                <p className="text-2xl font-bold">{keyStats.jobGrowth}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Open Jobs</p>
                                <p className="text-2xl font-bold">{jobCount.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Employed</p>
                                <p className="text-2xl font-bold">{keyStats.totalEmployed}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Navigation Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {/* Career Guide */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-8 h-8 text-primary" />
                            <CardTitle>Career Guide</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Complete guide to becoming a {careerGuide.professionName.toLowerCase()}, including education, certification, and career paths.
                        </p>
                        <ul className="space-y-2 mb-6 text-sm">
                            <li className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                <span>Education Requirements</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    {careerGuide.timeline || '1-4 years'}
                                </Badge>
                                <span>Timeline to Career</span>
                            </li>
                        </ul>
                        <Button asChild className="w-full">
                            <Link href={`/how-to-become-${profession}`}>
                                Read Full Guide <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Salary Information */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="w-8 h-8 text-primary" />
                            <CardTitle>Salary Data</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Explore detailed salary information by state and city, including percentiles and trends.
                        </p>
                        <div className="space-y-3 mb-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Entry Level</p>
                                <p className="text-lg font-semibold">{careerGuide.entryLevelRange}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Experienced</p>
                                <p className="text-lg font-semibold">{careerGuide.experiencedRange}</p>
                            </div>
                        </div>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={`/${profession}-salary`}>
                                View Salary Data <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Job Listings */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Briefcase className="w-8 h-8 text-primary" />
                            <CardTitle>Job Openings</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Browse {jobCount.toLocaleString()} current job openings for {careerGuide.professionName.toLowerCase()}s across the country.
                        </p>
                        <div className="space-y-2 mb-6">
                            {recentJobs.map((job) => (
                                <div key={job.id} className="text-sm">
                                    <p className="font-medium truncate">{job.title}</p>
                                    <p className="text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {job.location || 'Remote'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={`/${profession}-jobs`}>
                                View All Jobs <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Career Overview Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">What Does a {careerGuide.professionName} Do?</h2>
                    <p className="text-muted-foreground mb-6">
                        {careerGuide.rolesDescription}
                    </p>
                    <h3 className="font-semibold mb-3">Daily Responsibilities:</h3>
                    <ul className="space-y-2">
                        {(careerGuide.dailyTasks as string[]).slice(0, 5).map((task, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-muted-foreground">{task}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Skills & Qualifications</h2>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Technical Skills:</h3>
                        <div className="flex flex-wrap gap-2">
                            {(careerGuide.technicalSkills as string[]).slice(0, 6).map((skill, idx) => (
                                <Badge key={idx} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3">Soft Skills:</h3>
                        <div className="flex flex-wrap gap-2">
                            {(careerGuide.softSkills as string[]).slice(0, 6).map((skill, idx) => (
                                <Badge key={idx} variant="outline">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Ready to Start Your Career as a {careerGuide.professionName}?
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Explore our comprehensive career guide, find accredited programs, and discover job opportunities in your area.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href={`/how-to-become-${profession}`}>
                                View Career Guide
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href={`/${profession}-jobs`}>
                                Browse Jobs
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
