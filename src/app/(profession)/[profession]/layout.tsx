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
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* PERSISTENT HERO SECTION - Dark Navy (WGU Style) */}
            <div className="relative pt-32 pb-16 px-4 overflow-hidden bg-primary shadow-2xl">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/2" />

                <div className="container mx-auto max-w-7xl">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Directory', href: '/professions' },
                            { label: careerGuide?.professionName || displayName }
                        ]}
                        className="mb-6 text-xs uppercase tracking-widest text-blue-200"
                    />

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white leading-tight">
                                {careerGuide?.professionName || displayName}
                            </h1>
                            <p className="text-xl text-blue-100 max-w-2xl font-light leading-relaxed line-clamp-3" title={careerGuide?.overview || `The definitive guide to becoming a ${displayName}.`}>
                                {careerGuide?.overview || `The definitive guide to becoming a ${displayName}. Explore salary data, accredited schools, and job opportunities.`}
                            </p>
                        </div>

                        {/* Quick Stats - Floating White Cards on Dark Hero */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl p-5 shadow-lg shadow-black/10 border border-white/10 hover:scale-[1.02] transition-transform">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold opacity-80">Avg Salary</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-3xl font-bold text-primary tracking-tight">{medianSalary}</p>
                                    <span className="text-xs text-muted-foreground font-medium">/yr</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-lg shadow-black/10 border border-white/10 hover:scale-[1.02] transition-transform">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold opacity-80">Job Growth</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-3xl font-bold text-secondary">6%</p>
                                    <span className="text-xs text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded-full">High</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-lg shadow-black/10 border border-white/10 hover:scale-[1.02] transition-transform">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold opacity-80">New Jobs</p>
                                <p className="text-3xl font-bold text-primary tracking-tight">{jobCount > 0 ? jobCount.toLocaleString() : '194,500'}</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-lg shadow-black/10 border border-white/10 hover:scale-[1.02] transition-transform">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold opacity-80">Total Workforce</p>
                                <p className="text-3xl font-bold text-primary tracking-tight">{salaryData?.employmentCount ? (salaryData.employmentCount / 1000000).toFixed(1) + 'M' : '3.2M'}</p>
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
