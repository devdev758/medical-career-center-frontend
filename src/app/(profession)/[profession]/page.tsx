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
import { getProfessionFormalName } from '@/lib/content-generator';
import { professionGuides, getCareerGuideDefaults } from '@/lib/career-data';
import { RN_SPOKE_HIGHLIGHTS, getAllHighlightsPriority } from '@/lib/rn-landing-highlights';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

// Helper to ensure data exists (Self-Healing)
async function getOrSeedCareerGuide(slug: string) {
    const existing = await prisma.careerGuide.findUnique({
        where: { professionSlug: slug }
    });

    if (existing) return existing;

    // Try to find in static data
    const staticData = professionGuides.find(g => g.slug === slug);
    if (staticData) {
        try {
            console.log(`Self-healing: Seeding ${slug} on demand...`);
            const defaults = getCareerGuideDefaults(staticData);
            return await prisma.careerGuide.upsert({
                where: { professionSlug: slug },
                update: {},
                create: defaults
            });
        } catch (error) {
            console.error(`Failed to self-heal ${slug}:`, error);
            return null;
        }
    }
    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const formalName = getProfessionFormalName(profession);

    // Try to get guide (with self-healing fallback)
    const careerGuide = await getOrSeedCareerGuide(dbSlug);

    if (!careerGuide) {
        return {
            title: 'Profession Not Found',
            description: 'The requested profession guide could not be found.'
        };
    }

    // ... existing metadata logic uses careerGuide ...
    return {
        title: careerGuide.metaTitle || `${formalName} Career Guide & Salary (2026)`,
        description: careerGuide.metaDescription || `Everything you need to know about becoming a ${formalName}. Salary, requirements, and job outlook updated for 2026.`,
        alternates: {
            canonical: `/${profession}`
        }
    };
}

// Spoke navigation items - ALL spokes in priority order
const spokeNavItems = [
    { id: 'how-to-become', label: 'How to Become', icon: BookOpen, path: '/how-to-become' },
    { id: 'salary', label: 'Salary', icon: DollarSign, path: '/salary' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
    { id: 'schools', label: 'Schools', icon: GraduationCap, path: '/schools' },
    { id: 'license', label: 'License', icon: Award, path: '/license' },
    { id: 'crna', label: 'CRNA', icon: Stethoscope, path: '/crna' },
    { id: 'specializations', label: 'Specializations', icon: Target, path: '/specializations' },
    { id: 'resume', label: 'Resume', icon: FileText, path: '/resume' },
    { id: 'interview', label: 'Interview', icon: MessageSquare, path: '/interview' },
    { id: 'skills', label: 'Skills', icon: Zap, path: '/skills' },
    { id: 'career-path', label: 'Career Path', icon: TrendingUp, path: '/career-path' },
    { id: 'work-life-balance', label: 'Work-Life', icon: Heart, path: '/work-life-balance' },
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
            </div>

            {/* CRNA Hero Card - For RN Only */}
            {isRegisteredNurse && (
                <Card className="mb-12 overflow-hidden border-0">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-8 text-white">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                                    Highest-Paid RN Specialty
                                </Badge>
                                <h2 className="text-3xl font-bold mb-3">CRNA - Nurse Anesthetist</h2>
                                <p className="text-white/90 mb-6 text-lg max-w-2xl">
                                    Become a Certified Registered Nurse Anesthetist and earn $180K-$250K annually.
                                    Administer anesthesia independently in all 50 states after completing a 3-year doctoral program.
                                </p>
                                <div className="flex flex-wrap gap-6 mb-6">
                                    <div>
                                        <p className="text-white/80 text-sm">Average Salary</p>
                                        <p className="text-2xl font-bold">$200K+</p>
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-sm">Program Length</p>
                                        <p className="text-2xl font-bold">3 Years</p>
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-sm">Prerequisites</p>
                                        <p className="text-2xl font-bold">BSN + ICU</p>
                                    </div>
                                </div>
                                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                                    <Link href={`/${profession}/crna`}>
                                        Explore CRNA Career <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                            <Stethoscope className="w-24 h-24 text-white/20 hidden lg:block" />
                        </div>
                    </div>
                </Card>
            )}

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

            {/* Spoke Highlights - RN Only */}
            {isRegisteredNurse && (
                <>
                    {/* Section Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">Explore Your RN Career Path</h2>
                        <p className="text-muted-foreground text-lg">
                            Everything you need to know about becoming and advancing as a Registered Nurse
                        </p>
                    </div>

                    {/* Tier 1: Most Comprehensive Content - Full Featured Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {Object.entries(RN_SPOKE_HIGHLIGHTS)
                            .filter(([key, highlight]) => highlight.tier === 1 && key !== 'crna') // Exclude CRNA, it has hero card
                            .map(([key, highlight]) => {
                                const iconName = highlight.icon;
                                // Dynamic icon import - map string to component
                                const iconMap: Record<string, any> = {
                                    'BookOpen': BookOpen,
                                    'DollarSign': DollarSign,
                                    'Briefcase': Briefcase,
                                    'GraduationCap': GraduationCap,
                                };
                                const Icon = iconMap[iconName] || BookOpen;

                                return (
                                    <Card
                                        key={key}
                                        className={`hover:shadow-lg transition-all ${highlight.gradient ? 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20' : ''}`}
                                    >
                                        <CardHeader>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-3 bg-primary/10 rounded-lg">
                                                    <Icon className="w-6 h-6 text-primary" />
                                                </div>
                                                <CardTitle className="text-xl">{highlight.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                                {highlight.snippet}
                                            </p>
                                            <Button asChild variant="outline" className="w-full group">
                                                <Link href={highlight.href}>
                                                    {highlight.cta}
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                    </div>

                    {/* Tier 2: Important Spokes - Compact Cards */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {Object.entries(RN_SPOKE_HIGHLIGHTS)
                            .filter(([_, highlight]) => highlight.tier === 2)
                            .map(([key, highlight]) => {
                                const iconName = highlight.icon;
                                const iconMap: Record<string, any> = {
                                    'Award': Award,
                                    'Target': Target,
                                    'FileText': FileText,
                                    'MessageSquare': MessageSquare,
                                };
                                const Icon = iconMap[iconName] || Award;

                                return (
                                    <Card key={key} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3 mb-3">
                                                <Icon className="w-5 h-5 text-primary mt-0.5" />
                                                <div>
                                                    <h3 className="font-semibold mb-1">{highlight.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                                        {highlight.snippet}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={highlight.href}
                                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                            >
                                                {highlight.cta} <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                    </div>

                    {/* Tier 3: Supporting Content - Compact List */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle>Additional Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                {Object.entries(RN_SPOKE_HIGHLIGHTS)
                                    .filter(([_, highlight]) => highlight.tier === 3)
                                    .map(([key, highlight]) => {
                                        const iconName = highlight.icon;
                                        const iconMap: Record<string, any> = {
                                            'Zap': Zap,
                                            'TrendingUp': TrendingUp,
                                            'Heart': Heart,
                                        };
                                        const Icon = iconMap[iconName] || Zap;

                                        return (
                                            <Link
                                                key={key}
                                                href={highlight.href}
                                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <Icon className="w-4 h-4 text-primary mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm mb-0.5">{highlight.title}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{highlight.snippet}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Fallback for non-RN professions - Keep original content */}
            {!isRegisteredNurse && (
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
            )}

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Ready to Start Your Career as a {careerGuide.professionName}?
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Explore accredited programs, discover job opportunities, and get the complete career guide to launch your nursing career.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href={urls.schools}>
                                Find Schools & Programs
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href={urls.jobs}>
                                Browse Jobs
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href={urls.howToBecome}>
                                View Career Guide
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
