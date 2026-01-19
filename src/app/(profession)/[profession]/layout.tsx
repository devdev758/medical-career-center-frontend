import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfessionSidebar } from '@/components/profession/ProfessionSidebar';
import { validateProfession, getProfessionDisplayName, getBLSKeywords } from '@/lib/profession-utils';
import { urlSlugToDbSlug, getProfessionUrls } from '@/lib/url-utils';
import {
    Sparkles,
    TrendingUp,
    Briefcase,
    CheckCircle2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface LayoutProps {
    children: React.ReactNode;
    params: {
        profession: string;
    };
}

// Helper to ensure data exists (Self-Healing) - Copied from page.tsx logic
async function getOrSeedCareerGuide(slug: string) {
    const existing = await prisma.careerGuide.findUnique({
        where: { professionSlug: slug }
    });
    return existing;
}

export default async function ProfessionLayout({ children, params }: LayoutProps) {
    const { profession } = await params;

    // Validate profession
    const isValid = await validateProfession(profession);
    if (!isValid) {
        notFound();
    }

    const displayName = await getProfessionDisplayName(profession);
    const dbSlug = urlSlugToDbSlug(profession);
    const blsKeywords = await getBLSKeywords(profession);
    const urls = getProfessionUrls(profession);

    // Fetch Key Data for Hero
    const [careerGuide, salaryData, jobCount] = await Promise.all([
        getOrSeedCareerGuide(dbSlug),
        prisma.salaryData.findFirst({
            where: {
                careerKeyword: { in: blsKeywords },
                locationId: null,
            },
            orderBy: [{ year: 'desc' }, { employmentCount: 'desc' }],
        }),
        prisma.job.count({ where: { careerKeyword: dbSlug } })
    ]);

    const keyStats = (careerGuide?.keyStats || {}) as any;
    const medianSalary = salaryData?.annualMedian
        ? `$${Math.round(salaryData.annualMedian).toLocaleString()}`
        : keyStats?.medianSalary || 'N/A';

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* PERSISTENT HERO SECTION */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-border/40 bg-background">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />

                <div className="container mx-auto max-w-7xl">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Directory', href: '/professions' },
                            { label: careerGuide?.professionName || displayName }
                        ]}
                        className="mb-8"
                    />

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>Complete Career Hub</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-6 leading-[0.9] text-foreground">
                                {careerGuide?.professionName || displayName}
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                                {careerGuide?.overview ? careerGuide.overview.substring(0, 200) + '...' : `The definitive guide to becoming a ${displayName}. Explore salary data, find accredited schools, and land your dream job.`}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <Button size="lg" className="rounded-full shadow-lg shadow-primary/20" asChild>
                                    <Link href={urls.jobs}>Find Jobs</Link>
                                </Button>
                                <Button variant="outline" size="lg" className="rounded-full" asChild>
                                    <Link href={urls.salary}>See Salary Data</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Hero Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground mb-1">Median Salary</p>
                                    <p className="text-3xl font-bold text-foreground">{medianSalary}</p>
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs mt-2">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>National Avg</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground mb-1">Open Jobs</p>
                                    <p className="text-3xl font-bold text-foreground">{jobCount.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs mt-2">
                                        <Briefcase className="w-3 h-3" />
                                        <span>Active Listings</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground mb-1">Job Growth</p>
                                    <p className="text-3xl font-bold text-foreground">{keyStats.jobGrowth || '+5%'}</p>
                                    <div className="flex items-center gap-1 text-primary/80 text-xs mt-2">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>10-Year Outlook</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground mb-1">Employability</p>
                                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">High</p>
                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs mt-2">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Demand Score</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* SHARED LAYOUT GRID */}
            <div className="container mx-auto px-4 max-w-7xl pt-12">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* LEFT SIDEBAR (Shared) */}
                    <div className="lg:col-span-4">
                        <ProfessionSidebar profession={profession} />
                    </div>

                    {/* RIGHT CONTENT (Dynamic) */}
                    <div className="lg:col-span-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
