import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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
    Award,
    MessageSquare,
    FileText,
    Target,
    Zap,
    Heart,
    Building2,
    Stethoscope
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: { professionName: true, keyStats: true }
    });

    const jobCount = await prisma.job.count({
        where: { careerKeyword: dbSlug }
    });

    if (!careerGuide) {
        return {
            title: 'Profession Not Found',
            description: 'The requested profession could not be found.'
        };
    }

    const keyStats = careerGuide.keyStats as any;
    const currentYear = new Date().getFullYear();

    return {
        title: `${careerGuide.professionName} Career Guide: Salary, Jobs & How to Become One | ${currentYear}`,
        description: `Explore ${careerGuide.professionName.toLowerCase()} careers. Average salary: ${keyStats.medianSalary}. ${jobCount}+ open positions. Learn education requirements, job outlook, and how to start your career today.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}`
        },
        openGraph: {
            title: `${careerGuide.professionName} Career Guide | Medical Career Center`,
            description: `Complete guide to ${careerGuide.professionName.toLowerCase()} careers including salary data, education requirements, and job opportunities.`,
            type: 'website',
        },
    };
}

// Spoke navigation items with new hierarchical URLs
const spokeNavItems = [
    { id: 'how-to-become', label: 'Career Guide', icon: BookOpen, path: '/how-to-become' },
    { id: 'schools', label: 'Schools', icon: GraduationCap, path: '/schools' },
    { id: 'license', label: 'License & Certification', icon: Award, path: '/license' },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquare, path: '/interview' },
    { id: 'resume', label: 'Resume', icon: FileText, path: '/resume' },
    { id: 'specializations', label: 'Specializations', icon: Target, path: '/specializations' },
    { id: 'skills', label: 'Skills', icon: Zap, path: '/skills' },
    { id: 'career-path', label: 'Career Path', icon: TrendingUp, path: '/career-path' },
    { id: 'work-life-balance', label: 'Work-Life Balance', icon: Heart, path: '/work-life-balance' },
];

// CNA-specific navigation items
const cnaSpokeNavItems = [
    { id: 'how-to-become', label: 'Career Guide', icon: BookOpen, path: '/how-to-become' },
    { id: 'schools', label: 'Schools & Training', icon: GraduationCap, path: '/schools' },
    { id: 'training', label: 'Training Programs', icon: BookOpen, path: '/training' },
    { id: 'license', label: 'Certification', icon: Award, path: '/license' },
    { id: 'registry', label: 'CNA Registry', icon: Users, path: '/registry' },
    { id: 'practice-test', label: 'Practice Test', icon: Target, path: '/practice-test' },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquare, path: '/interview' },
    { id: 'resume', label: 'Resume', icon: FileText, path: '/resume' },
    { id: 'skills', label: 'Skills', icon: Zap, path: '/skills' },
    { id: 'career-path', label: 'Career Path', icon: TrendingUp, path: '/career-path' },
];


export default async function ProfessionHubPage({ params }: PageProps) {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);

    // Fetch career guide using database slug
    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
    });

    if (!careerGuide) {
        notFound();
    }

    // Fetch salary data (national average)
    const salaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: dbSlug,
            locationId: null, // National data
        },
        orderBy: { year: 'desc' },
    });

    // Fetch job count
    const jobCount = await prisma.job.count({
        where: { careerKeyword: dbSlug },
    });

    // Fetch recent jobs (top 3)
    const recentJobs = await prisma.job.findMany({
        where: { careerKeyword: dbSlug },
        orderBy: { createdAt: 'desc' },
        take: 3,
    });

    const keyStats = careerGuide.keyStats as any;
    const medianSalary = salaryData?.annualMedian
        ? `$${Math.round(salaryData.annualMedian).toLocaleString()}`
        : keyStats.medianSalary;

    // Check if this is RN (has CRNA specialty)
    const isRegisteredNurse = profession === 'registered-nurse';

    // Check if this is CNA (has special navigation)
    const isCNA = profession === 'cna';

    // Use appropriate navigation items
    const navItems = isCNA ? cnaSpokeNavItems : spokeNavItems;

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerGuide.professionName }
                ]}
                className="mb-4"
            />

            {/* Hero Section */}
            <div className="mb-12">
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

            {/* Quick Navigation */}
            <div className="bg-muted/50 rounded-lg p-6 mb-12">
                <h2 className="font-semibold mb-4 text-lg">Quick Navigation</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={`/${profession}${item.path}`}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background hover:bg-primary/10 transition-colors border"
                            >
                                <Icon className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* CRNA Quick Link for RN */}
                {isRegisteredNurse && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-3">Popular Specialty:</p>
                        <Link
                            href={`/${profession}/crna`}
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-colors"
                        >
                            <Stethoscope className="w-4 h-4" />
                            <span className="font-medium">CRNA (Nurse Anesthetist) Guide</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
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
                            <Link href={urls.howToBecome}>
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
                            <Link href={urls.salary}>
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
                            <Link href={urls.jobs}>
                                View All Jobs <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Jobs Sub-Navigation (for RN with remote, new-grad, etc.) */}
            {isRegisteredNurse && (
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Browse Jobs by Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <Link href={`/${profession}/jobs/remote`} className="p-4 rounded-lg border hover:bg-muted transition-colors text-center">
                                <p className="font-medium">Remote Jobs</p>
                                <p className="text-xs text-muted-foreground">Work from home</p>
                            </Link>
                            <Link href={`/${profession}/jobs/new-grad`} className="p-4 rounded-lg border hover:bg-muted transition-colors text-center">
                                <p className="font-medium">New Grad Jobs</p>
                                <p className="text-xs text-muted-foreground">Entry level</p>
                            </Link>
                            <Link href={`/${profession}/jobs/travel`} className="p-4 rounded-lg border hover:bg-muted transition-colors text-center">
                                <p className="font-medium">Travel Jobs</p>
                                <p className="text-xs text-muted-foreground">Travel nursing</p>
                            </Link>
                            <Link href={`/${profession}/jobs/part-time`} className="p-4 rounded-lg border hover:bg-muted transition-colors text-center">
                                <p className="font-medium">Part-Time Jobs</p>
                                <p className="text-xs text-muted-foreground">Flexible hours</p>
                            </Link>
                            <Link href={urls.jobs} className="p-4 rounded-lg border hover:bg-muted transition-colors text-center bg-primary/5">
                                <p className="font-medium">All Jobs</p>
                                <p className="text-xs text-muted-foreground">{jobCount.toLocaleString()} openings</p>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

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
                            <Link href={urls.howToBecome}>
                                View Career Guide
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href={urls.jobs}>
                                Browse Jobs
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
