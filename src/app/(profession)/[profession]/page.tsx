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
        title: careerGuide.metaTitle || `${formalName} Career Guide, Salary & Jobs (2026)`,
        description: careerGuide.metaDescription || `Complete ${formalName} career resource. Explore education pathways, schools, NCLEX licensing, salary data by state, job opportunities, specializations, and career advancement. Find programs, browse jobs, and plan your nursing career.`,
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

            {/* Spoke Content - RN Only - Article Format */}
            {isRegisteredNurse && (
                <div className="mb-12">
                    {/* Section Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-3">Your Complete Guide to RN Success</h2>
                        <p className="text-muted-foreground text-lg max-w-3xl">
                            From education to career advancement, here's everything you need to know about becoming and thriving as a Registered Nurse.
                        </p>
                    </div>

                    {/* Article-Style Content */}
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        {/* Education & Getting Started */}
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                Education Pathways & Schools
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Your nursing journey begins with choosing the right educational path. <strong>Associate Degree in Nursing (ADN)</strong> programs offer the fastest route—just 2 years and $6,000-$20,000 in costs. While ADN grads earn RN licenses and can start working immediately, many hospitals increasingly prefer <strong>Bachelor of Science in Nursing (BSN)</strong> degrees for new hires, especially in competitive markets.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                BSN programs typically take 4 years and cost $40,000-$80,000, but they open doors to specialized roles and higher salaries ($90K-$200K+ in premium specialties). For career changers with existing bachelor's degrees, <strong>Accelerated BSN programs</strong> compress the curriculum into 11-18 months of intensive study. Already working as an RN? <strong>Online RN-to-BSN</strong> programs let you upgrade your credentials while maintaining your job, typically costing $15,000-$40,000. When evaluating schools, prioritize NCLEX pass rates above 90% and CCNE or ACEN accreditation.
                            </p>
                            <Link href="/registered-nurse/schools" className="inline-flex items-center gap-2 text-primary hover:underline font-medium mt-2">
                                Compare nursing programs and find accredited schools <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Licensing */}
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                Licensing & NCLEX Exam
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                After graduating, you must pass the <strong>NCLEX-RN</strong> (National Council Licensure Examination for Registered Nurses) to practice. The computerized adaptive test contains 75-145 questions and has an 87% first-time pass rate nationally. The exam costs $200, and most states require additional fees for initial licensure ($100-$400).
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Good news for travel nurses and those planning to relocate: <strong>43 states participate in the Nurse Licensure Compact (NLC)</strong>, allowing you to practice across state lines with a single multistate license. For non-compact states, you'll need to apply for licensure by endorsement, which typically takes 4-8 weeks. RN licenses require renewal every 2-3 years (varies by state) with continuing education requirements ranging from 15-30 hours.
                            </p>
                            <Link href="/registered-nurse/license" className="inline-flex items-center gap-2 text-primary hover:underline font-medium mt-2">
                                View complete licensing guide and state requirements <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Salary & Compensation */}
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                Salary & Earning Potential
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Registered Nurses earn a national median salary of around <strong>$81,000 annually</strong>, but compensation varies dramatically by location and specialty. <strong>California leads the nation at $124,000 median</strong>, while states like South Dakota and Mississippi average $60,000-$65,000. Geographic arbitrage is real—California RNs can earn double their Southern counterparts for the same work.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                New graduates typically start at $60,000-$75,000, while experienced RNs in specialized units (ICU, ER, OR) earn 15-20% above base rates. <strong>Travel nurses command premium pay:</strong> $2,000-$3,000 per week plus housing stipends and bonuses. Remote case management and telehealth positions have surged 40% since 2024, offering work-life balance with competitive $70,000-$90,000 salaries. Per diem and PRN shifts pay hourly rates 20-30% higher than staff positions, ideal for flexible schedules.
                            </p>
                            <Link href="/registered-nurse/salary" className="inline-flex items-center gap-2 text-primary hover:underline font-medium mt-2">
                                Explore detailed salary data by state and specialty <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Specializations */}
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                    <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                Specializations & Career Paths
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                While general medical-surgical nursing offers a solid foundation, specialization significantly boosts both earning potential and job satisfaction. <strong>ICU (Intensive Care Unit) nurses</strong> manage critically ill patients with complex conditions, earning $85,000-$110,000 with CCRN certification. <strong>Emergency Room nurses</strong> thrive in fast-paced environments, making quick decisions under pressure for similar compensation.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                <strong>Operating Room (OR) nurses</strong> assist in surgical procedures and can earn $80,000-$105,000 with CNOR credentials. For those drawn to specific populations, <strong>Pediatric</strong>, <strong>Neonatal ICU (NICU)</strong>, and <strong>Labor & Delivery</strong> nursing offer rewarding paths working with children and families. Emerging specialties like <strong>Psychiatric nursing</strong> and <strong>Aesthetic/Cosmetic nursing</strong> provide alternatives to traditional hospital settings. Most specializations require 1-2 years of general nursing experience before specializing, plus specialty certification exams.
                            </p>
                            <Link href="/registered-nurse/specializations" className="inline-flex items-center gap-2 text-primary hover:underline font-medium mt-2">
                                Explore all 10 nursing specialties in detail <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Job Search & Career Launch */}
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                                    <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                Landing Your First Job & Interview Success
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                The nursing job market remains strong with hundreds of thousands of openings nationwide. New graduates should target <strong>new grad residency programs</strong> at major health systems—these structured 6-12 month programs provide mentorship and gradual responsibility increases, dramatically improving first-year retention and confidence.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Your <strong>ATS-optimized resume</strong> needs to highlight clinical rotations, relevant skills (IV insertion, wound care, EHR systems), and any healthcare experience. Approach interviews prepared for <strong>behavioral questions using the STAR method</strong> and clinical scenarios testing critical thinking. Common questions include handling difficult patients, medication errors, and end-of-life situations. Salary negotiation is appropriate—research local market rates and emphasize unique certifications or bilingual abilities. Most hospitals offer sign-on bonuses ($5,000-$15,000) for hard-to-fill specialties or locations.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-4">
                                <Link href="/registered-nurse/jobs" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                                    Browse current job openings <ArrowRight className="w-4 h-4" />
                                </Link>
                                <span className="text-muted-foreground">|</span>
                                <Link href="/registered-nurse/resume" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                                    View resume templates & examples <ArrowRight className="w-4 h-4" />
                                </Link>
                                <span className="text-muted-foreground">|</span>
                                <Link href="/registered-nurse/interview" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                                    Prepare for interviews <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Career Advancement */}
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                                </div>
                                Career Advancement & Long-Term Growth
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Nursing offers clear career ladders beyond bedside care. <strong>Clinical advancement:</strong> Staff RN ($75K) → Charge Nurse ($85K) → Clinical Nurse Specialist ($105K). <strong>Management track:</strong> Nurse Manager ($95K) → Director of Nursing ($110K) → Chief Nursing Officer ($150K+).
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                <strong>Advanced practice roles</strong> require a Master's (MSN) or Doctorate (DNP): Nurse Practitioners earn $115,000 median, Nurse Anesthetists (CRNAs) command $200,000+, and Clinical Nurse Specialists make $105,000. Other paths include nursing education ($75,000-$95,000), informatics ($90,000-$115,000), and quality/safety roles ($85,000-$110,000). Most advancement requires a BSN minimum, with MSN/DNP preferred for leadership positions.
                            </p>
                            <Link href="/registered-nurse/career-path" className="inline-flex items-center gap-2 text-primary hover:underline font-medium mt-2">
                                Explore career advancement paths in detail <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Work-Life Balance Note */}
                        <div className="bg-muted/50 rounded-lg p-6">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-primary" />
                                Work-Life Balance Reality
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Most hospital RNs work 12-hour shifts, typically three days per week (36 hours = full-time). While 75% report career satisfaction, burnout affects 60% of nurses—particularly in high-intensity units. Flexible schedules, self-care strategies, and choosing the right specialty significantly impact quality of life. Remote opportunities (telehealth, case management), part-time options, and PRN positions offer alternatives to traditional hospital shifts.
                            </p>
                            <Link href="/registered-nurse/work-life-balance" className="text-sm inline-flex items-center gap-1 text-primary hover:underline font-medium mt-2">
                                Learn about nursing work-life balance <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Fallback for non-RN professions - Keep original */}
            {!isRegisteredNurse && (
                <>
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
                </>
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
