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
        <div className="min-h-screen bg-[#F0F4F8]">
            {/* HERO SECTION - Stronger Blue Wash with Clear Definition */}
            <div className="relative pt-28 pb-12 px-4 overflow-hidden bg-gradient-to-b from-[#003554]/15 via-[#006494]/10 to-[#00A6FB]/5 border-b border-[#006494]/10">
                {/* Decorative gradient blobs - Stronger */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00A6FB]/20 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-[#0582CA]/15 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/4" />

                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#051923] leading-tight">
                                {careerGuide?.professionName || displayName}
                            </h1>
                            <p className="text-base md:text-lg text-[#003554] max-w-xl font-normal leading-relaxed line-clamp-2" title={careerGuide?.overview || `The definitive guide to becoming a ${displayName}.`}>
                                {careerGuide?.overview || `The definitive guide to becoming a ${displayName}. Explore salary data, accredited schools, and job opportunities.`}
                            </p>
                        </div>

                        {/* Stats Cards - Clean White on Blue */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white shadow-lg border border-[#006494]/10 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                                <p className="text-[9px] uppercase tracking-widest text-[#006494] mb-1 font-bold">Avg Salary</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-xl font-bold text-[#003554] tracking-tight">{medianSalary}</p>
                                    <span className="text-[10px] text-[#006494] font-medium">/yr</span>
                                </div>
                            </div>
                            <div className="bg-white shadow-lg border border-[#006494]/10 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                                <p className="text-[9px] uppercase tracking-widest text-[#006494] mb-1 font-bold">Job Growth</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-xl font-bold text-[#003554]">6%</p>
                                    <span className="text-[10px] font-bold bg-[#FFC300] text-[#051923] px-1.5 py-0.5 rounded-full">High</span>
                                </div>
                            </div>
                            <div className="bg-white shadow-lg border border-[#006494]/10 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                                <p className="text-[9px] uppercase tracking-widest text-[#006494] mb-1 font-bold">New Jobs</p>
                                <p className="text-xl font-bold text-[#003554] tracking-tight">{jobCount > 0 ? jobCount.toLocaleString() : '194,500'}</p>
                            </div>
                            <div className="bg-white shadow-lg border border-[#006494]/10 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                                <p className="text-[9px] uppercase tracking-widest text-[#006494] mb-1 font-bold">Workforce</p>
                                <p className="text-xl font-bold text-[#003554] tracking-tight">{salaryData?.employmentCount ? (salaryData.employmentCount / 1000000).toFixed(1) + 'M' : '3.2M'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY SUB-NAVIGATION */}
            <ProfessionSubNav profession={profession} />

            {/* MAIN CONTENT - White Background Starting Right After SubNav */}
            <main className="w-full bg-white min-h-screen -mt-7 pt-14">
                <div className="container mx-auto px-4 max-w-5xl py-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
