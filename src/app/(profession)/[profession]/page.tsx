import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
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
    Stethoscope,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, getProfessionUrls } from '@/lib/url-utils';
import { professionGuides, getCareerGuideDefaults } from '@/lib/career-data';
import { validateProfession, getProfessionDisplayName, getBLSKeywords } from '@/lib/profession-utils';

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

    // Validate profession exists in our approved 55
    const isValid = await validateProfession(profession);
    if (!isValid) {
        return {
            title: 'Profession Not Found',
            description: 'The requested profession could not be found.'
        };
    }

    const displayName = await getProfessionDisplayName(profession);
    const dbSlug = urlSlugToDbSlug(profession);

    // Try to get guide (with self-healing fallback)
    const careerGuide = await getOrSeedCareerGuide(dbSlug);

    // Use careerGuide if available, otherwise use profession displayName
    return {
        title: careerGuide?.metaTitle || `${displayName} Career Guide, Salary & Jobs (2026)`,
        description: careerGuide?.metaDescription || `Complete ${displayName} career resource. Explore education pathways, schools, licensing, salary data by state, job opportunities, specializations, and career advancement.`,
        alternates: {
            canonical: `/${profession}`
        }
    };
}

// Spoke navigation items - ALL spokes in priority order
const spokeNavItems = [
    { id: 'how-to-become', label: 'Career Guide', icon: BookOpen, path: '/how-to-become', desc: 'Step-by-step roadmap' },
    { id: 'salary', label: 'Salary Data', icon: DollarSign, path: '/salary', desc: 'Earnings by state' },
    { id: 'jobs', label: 'Job Board', icon: Briefcase, path: '/jobs', desc: 'Open positions' },
    { id: 'schools', label: 'Schools', icon: GraduationCap, path: '/schools', desc: 'Find programs' },
    { id: 'license', label: 'Licensing', icon: Award, path: '/license', desc: 'State requirements' },
    { id: 'crna', label: 'CRNA Path', icon: Stethoscope, path: '/crna', desc: 'Advanced practice' },
    { id: 'specializations', label: 'Specialties', icon: Target, path: '/specializations', desc: 'Career niches' },
    { id: 'resume', label: 'Resume', icon: FileText, path: '/resume', desc: 'Templates & tips' },
    { id: 'interview', label: 'Interview', icon: MessageSquare, path: '/interview', desc: 'Prep questions' },
];

// CNA-specific navigation items
const cnaSpokeNavItems = [
    { id: 'how-to-become', label: 'Career Guide', icon: BookOpen, path: '/how-to-become', desc: 'Step-by-step roadmap' },
    { id: 'schools', label: 'Classes', icon: GraduationCap, path: '/schools', desc: 'Training programs' },
    { id: 'training', label: 'Training', icon: BookOpen, path: '/training', desc: 'Skills training' },
    { id: 'license', label: 'Certification', icon: Award, path: '/license', desc: 'Exam & Registry' },
    { id: 'registry', label: 'Registry', icon: Users, path: '/registry', desc: 'State lookups' },
    { id: 'practice-test', label: 'Practice Test', icon: Target, path: '/practice-test', desc: 'Exam prep' },
    { id: 'interview', label: 'Interview', icon: MessageSquare, path: '/interview', desc: 'Prep questions' },
    { id: 'resume', label: 'Resume', icon: FileText, path: '/resume', desc: 'Templates' },
];


export default async function ProfessionHubPage({ params }: PageProps) {
    const { profession } = await params;

    // CRITICAL: Validate profession exists in our approved 55
    const isValid = await validateProfession(profession);
    if (!isValid) {
        notFound();
    }

    const displayName = await getProfessionDisplayName(profession);
    const blsKeywords = await getBLSKeywords(profession);
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);

    // Fetch career guide using database slug (optional - for RN and others with guides)
    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
    });

    // Fetch salary data using BLS keywords (supports consolidated professions)
    const salaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: { in: blsKeywords }, // Query using ALL BLS keywords
            locationId: null, // National data
        },
        orderBy: [
            { year: 'desc' },
            { employmentCount: 'desc' } // Prefer keyword with more data
        ],
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

    const keyStats = (careerGuide?.keyStats || {}) as any;
    const medianSalary = salaryData?.annualMedian
        ? `$${Math.round(salaryData.annualMedian).toLocaleString()}`
        : keyStats?.medianSalary || 'N/A';

    // Check if this is CNA (has special navigation)
    const isCNA = profession === 'cna';

    // Use appropriate navigation items
    // Filter CRNA for non-RN professions
    const navItems = isCNA ? cnaSpokeNavItems : spokeNavItems.filter(item =>
        item.id !== 'crna' || profession === 'registered-nurse'
    );

    return (
        <main className="min-h-screen bg-background pb-32">
            {/* Immersive Hero Section */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-border/40">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />

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
                            <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-6 leading-[0.9]">
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
                            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground mb-1">Median Salary</p>
                                    <p className="text-3xl font-bold text-primary">{medianSalary}</p>
                                    <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>National Avg</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-background/50 backdrop-blur-sm border-secondary/20">
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground mb-1">Open Jobs</p>
                                    <p className="text-3xl font-bold text-secondary">{jobCount.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 text-blue-400 text-xs mt-2">
                                        <Briefcase className="w-3 h-3" />
                                        <span>Active Listings</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-background/50 backdrop-blur-sm border-purple-500/20">
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground mb-1">Job Growth</p>
                                    <p className="text-3xl font-bold text-purple-400">{keyStats.jobGrowth || '+5%'}</p>
                                    <div className="flex items-center gap-1 text-purple-400 text-xs mt-2">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>10-Year Outlook</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-background/50 backdrop-blur-sm border-orange-500/20">
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground mb-1">Employability</p>
                                    <p className="text-3xl font-bold text-orange-400">High</p>
                                    <div className="flex items-center gap-1 text-orange-400 text-xs mt-2">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Demand Score</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Layout: Stack Navigation + Main Content */}
            <div className="container mx-auto px-4 max-w-7xl pt-12">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* LEFT: Command Stack Navigation */}
                    <aside className="lg:col-span-4 space-y-4">
                        <div className="sticky top-24 space-y-4">
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2">Career Modules</h2>
                            <div className="space-y-3">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link key={item.id} href={`/${profession}${item.path}`} className="block group">
                                            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 active-card">
                                                <div className={`p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold font-heading text-foreground group-hover:text-primary transition-colors">{item.label}</h3>
                                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Mini Job Feed in Sidebar */}
                            <div className="mt-8 pt-8 border-t border-border/50">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    Latest Jobs
                                </h3>
                                <div className="space-y-3">
                                    {recentJobs.map((job) => (
                                        <Link key={job.id} href={urls.jobs} className="block p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors border border-transparent hover:border-border">
                                            <p className="font-medium text-sm line-clamp-1">{job.title}</p>
                                            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                                                <span>{job.location || 'Remote'}</span>
                                                <span>New</span>
                                            </div>
                                        </Link>
                                    ))}
                                    <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                                        <Link href={urls.jobs}>View All {jobCount} Jobs</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT: Main Content Feed */}
                    <article className="lg:col-span-8 space-y-12">
                        {/* Intro Section */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <h2 className="text-3xl font-heading font-bold mb-6">About the Role</h2>
                            <p className="leading-relaxed text-muted-foreground">
                                {careerGuide?.rolesDescription || `${displayName}s play a crucial role in the healthcare system, providing essential care and support to patients. This comprehensive guide covers everything you need to start and advance your career.`}
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 my-8 not-prose">
                                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-secondary" />
                                        Key Responsibilities
                                    </h3>
                                    <ul className="space-y-2">
                                        {((careerGuide?.dailyTasks as string[]) || []).slice(0, 5).map((task, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="text-secondary mt-1">•</span>
                                                <span>{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-yellow-500" />
                                        Essential Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {((careerGuide?.technicalSkills as string[]) || []).slice(0, 8).map((skill, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-background border-border">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <h3>Career Path & Advancement</h3>
                            <p className="text-muted-foreground">
                                The career trajectory for a {displayName} offers multiple avenues for growth. Starting as an entry-level professional, you can advance through specialized certifications, higher education, or management roles.
                                {profession === 'registered-nurse' && " For example, RNs can become Nurse Practitioners or CRNAs with advanced degrees, significantly increasing autonomy and salary."}
                            </p>
                        </div>

                        {/* Call to Action Banner */}
                        <div className="rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-secondary p-8 md:p-12 text-center text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Start Your Journey Today</h2>
                                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                    Whether you're looking for school programs or your next job, we have the tools to help you succeed.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" variant="secondary" className="font-bold h-12 px-8" asChild>
                                        <Link href={urls.schools}>Find Schools</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="font-bold h-12 px-8 bg-transparent text-white border-white hover:bg-white hover:text-primary" asChild>
                                        <Link href={urls.jobs}>Browse Jobs</Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Abstract Shapes */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
