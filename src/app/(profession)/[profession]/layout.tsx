import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfessionSubNav } from '@/components/profession/ProfessionSubNav';
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
            {/* PERSISTENT HERO SECTION - Compact Version */}
            <div className="relative pt-32 pb-12 px-4 overflow-hidden border-b border-border/40 bg-card">
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

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4 border border-secondary/20">
                                <Sparkles className="w-4 h-4" />
                                <span>Complete Career Hub</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-4 text-foreground">
                                {careerGuide?.professionName || displayName}
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                {careerGuide?.overview ? careerGuide.overview.substring(0, 160) + '...' : `The definitive guide to becoming a ${displayName}. Explore salary data, accredited schools, and job opportunities.`}
                            </p>
                        </div>

                        {/* Quick Stats - Condensed */}
                        <div className="flex gap-4">
                            <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-4 min-w-[140px]">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Salary</p>
                                <p className="text-xl font-bold text-foreground">{medianSalary}</p>
                            </div>
                            <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-4 min-w-[140px]">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Open Jobs</p>
                                <p className="text-xl font-bold text-foreground">{jobCount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY SUB-NAVIGATION */}
            <ProfessionSubNav profession={profession} />

            {/* MAIN CONTENT - Centered Single Column */}
            <main className="container mx-auto px-4 max-w-5xl py-12">
                {children}
            </main>
        </div>
    );
}
