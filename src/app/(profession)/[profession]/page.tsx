import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentSection, ContentCard, FeatureCard } from '@/components/ui/prose-content';
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
        <article className="space-y-12 animate-in fade-in duration-500">
            {/* About the Role Section */}
            <ContentSection title="About the Role">
                <ContentCard className="mb-8">
                    <p className="leading-relaxed text-[#4A5568] text-lg">
                        {careerGuide?.rolesDescription || `${displayName}s play a crucial role in the healthcare system, providing essential care and support to patients. This comprehensive guide covers everything you need to start and advance your career.`}
                    </p>
                </ContentCard>

                <div className="grid md:grid-cols-2 gap-6">
                    <FeatureCard variant="blue">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-[#003554]">
                            <Target className="w-5 h-5 text-[#0582CA]" />
                            Key Responsibilities
                        </h3>
                        <ul className="space-y-3">
                            {((careerGuide?.dailyTasks as string[]) || []).slice(0, 5).map((task, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-[#4A5568]">
                                    <span className="text-[#0582CA] mt-1 shrink-0">•</span>
                                    <span>{task}</span>
                                </li>
                            ))}
                        </ul>
                    </FeatureCard>
                    <FeatureCard variant="gold">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-[#003554]">
                            <Zap className="w-5 h-5 text-[#FFC300]" />
                            Essential Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {((careerGuide?.technicalSkills as string[]) || []).slice(0, 8).map((skill, idx) => (
                                <Badge key={idx} className="bg-white border border-[#006494]/20 text-[#003554] hover:bg-[#F0F4F8]">{skill}</Badge>
                            ))}
                        </div>
                    </FeatureCard>
                </div>
            </ContentSection>

            {/* How to Become Section */}
            <ContentSection title={`How to Become a ${displayName}`}>
                <ContentCard className="bg-gradient-to-br from-[#003554]/5 to-white">
                    <p className="text-lg text-[#4A5568] mb-6 leading-relaxed">
                        {careerGuide?.educationPath || `Becoming a ${displayName} requires a specific educational path and licensing. Our comprehensive guide covers every step from choosing a school to passing your exams.`}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="default" size="lg" className="h-12 px-6 font-semibold bg-[#003554] hover:bg-[#006494]" asChild>
                            <Link href={urls.howToBecome}>
                                <BookOpen className="w-4 h-4 mr-2" />
                                Read Full Career Guide
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-6 font-semibold border-[#006494]/30 text-[#003554] hover:bg-[#F0F4F8]" asChild>
                            <Link href={urls.schools}>
                                <GraduationCap className="w-4 h-4 mr-2" />
                                Find Schools
                            </Link>
                        </Button>
                    </div>
                </ContentCard>
            </ContentSection>

            {/* Career Path Section */}
            <ContentSection title="Career Path & Advancement">
                <p className="text-[#4A5568] leading-relaxed text-lg">
                    The career trajectory for a {displayName} offers multiple avenues for growth. Starting as an entry-level professional, you can advance through specialized certifications, higher education, or management roles.
                    {profession === 'registered-nurse' && " For example, RNs can become Nurse Practitioners or CRNAs with advanced degrees, significantly increasing autonomy and salary."}
                </p>
            </ContentSection>

            {/* Call to Action Banner */}
            <div className="rounded-3xl bg-primary p-8 md:p-12 text-center text-primary-foreground relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">Start Your Journey Today</h2>
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
    );
}
