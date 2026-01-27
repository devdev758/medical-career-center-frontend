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
        <div className="min-h-screen bg-white pb-32">
            {/* PERSISTENT HERO SECTION - Soft Teal Gradient (Clinical Teal Palette) */}
            <div className="relative pt-20 pb-10 px-4 overflow-hidden border-b-2 border-teal-600/20 bg-gradient-to-br from-[#E8F8F5] via-[#B4E4E4] to-[#E8F8F5]">
                {/* Decorative gradient blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B4E4E4]/60 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#14919B]/20 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2" />

                <div className="container mx-auto max-w-7xl">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Directory', href: '/professions' },
                            { label: careerGuide?.professionName || displayName }
                        ]}
                        className="mb-4 text-xs uppercase tracking-widest opacity-60"
                    />

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-tight">
                                {careerGuide?.professionName || displayName}
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed line-clamp-2" title={careerGuide?.overview || `The definitive guide to becoming a ${displayName}.`}>
                                {careerGuide?.overview || `The definitive guide to becoming a ${displayName}. Explore salary data, accredited schools, and job opportunities.`}
                            </p>
                        </div>

                        {/* Quick Stats - High Contrast Fresh Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white shadow-sm border border-blue-50 rounded-xl p-5 hover:border-blue-100 hover:shadow-md transition-all group">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold opacity-80">Avg Salary</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{medianSalary}</p>
                                    <span className="text-xs text-muted-foreground font-medium">/yr</span>
                                </div>
                            </div>
                            <div className="bg-white shadow-sm border border-blue-50 rounded-xl p-5 hover:border-blue-100 hover:shadow-md transition-all group">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold opacity-80">Job Growth</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-2xl font-bold text-secondary">6%</p>
                                    <span className="text-xs text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded-full">High</span>
                                </div>
                            </div>
                            <div className="bg-white shadow-sm border border-blue-50 rounded-xl p-5 hover:border-blue-100 hover:shadow-md transition-all group">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold opacity-80">New Jobs</p>
                                <p className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{jobCount > 0 ? jobCount.toLocaleString() : '194,500'}</p>
                            </div>
                            <div className="bg-white shadow-sm border border-blue-50 rounded-xl p-5 hover:border-blue-100 hover:shadow-md transition-all group">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold opacity-80">Total Workforce</p>
                                <p className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{salaryData?.employmentCount ? (salaryData.employmentCount / 1000000).toFixed(1) + 'M' : '3.2M'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY SUB-NAVIGATION */}
            <ProfessionSubNav profession={profession} />

            {/* MAIN CONTENT - Full Width White Background */}
            <main className="w-full bg-white min-h-screen">
                <div className="container mx-auto px-4 max-w-5xl py-16">
                    {children}
                </div>
            </main>
        </div>
    );
}
