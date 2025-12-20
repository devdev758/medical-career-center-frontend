import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Stethoscope,
    DollarSign,
    GraduationCap,
    TrendingUp,
    Award,
    Clock,
    ArrowRight,
    Briefcase
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, getProfessionUrls } from '@/lib/url-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CRNA_HUB_CONTENT } from '@/lib/crna/hub-content';
import { CRNA_HOWTOBECOME_CONTENT } from '@/lib/crna/how-to-become-content';
import { CRNA_SCHOOLS_CONTENT } from '@/lib/crna/schools-content';
import { getContentYear } from '@/lib/date-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        path?: string[];  // [[...path]] -> can be [], ['salary'], ['schools'], ['how-to-become']
    };
}

// CRNA sub-page types
const CRNA_SUBPAGE_TYPES = ['salary', 'schools', 'how-to-become'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, path } = await params;
    const subPage = path?.[0];

    const currentYear = getContentYear();

    if (subPage === 'salary') {
        return {
            title: `CRNA Salary ${currentYear}: How Much Do Nurse Anesthetists Make?`,
            description: 'CRNAs earn an average salary of $200,000+. Explore nurse anesthetist salary by state, experience level, and work setting. One of the highest-paying nursing specialties.',
            alternates: { canonical: `https://medicalcareercenter.org/${profession}/crna/salary` },
        };
    }

    if (subPage === 'schools') {
        return {
            title: `CRNA Schools & Programs ${currentYear}: Best Nurse Anesthesia Programs`,
            description: 'Find accredited CRNA programs and nurse anesthesia schools. Compare doctoral programs, admission requirements, and tuition costs.',
            alternates: { canonical: `https://medicalcareercenter.org/${profession}/crna/schools` },
        };
    }

    if (subPage === 'how-to-become') {
        return {
            title: `How to Become a CRNA ${currentYear}: Complete Career Guide`,
            description: 'Step-by-step guide to becoming a Certified Registered Nurse Anesthetist. Education requirements, ICU experience, doctoral programs, and certification process.',
            alternates: { canonical: `https://medicalcareercenter.org/${profession}/crna/how-to-become` },
        };
    }

    return {
        title: `CRNA (Nurse Anesthetist) Career Guide ${currentYear}: Salary, Schools & Requirements`,
        description: 'Everything you need to know about becoming a CRNA. Average salary: $200,000+. Learn about CRNA schools, requirements, and the path to this elite nursing specialty.',
        alternates: { canonical: `https://medicalcareercenter.org/${profession}/crna` },
    };
}

export default async function CRNAPage({ params }: PageProps) {
    const { profession, path } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const subPage = path?.[0];

    // Only show for RN
    if (profession !== 'registered-nurse') {
        notFound();
    }

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: { professionName: true }
    });

    if (!careerGuide) notFound();

    // Build breadcrumb - last item should not have href
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
    ];

    if (subPage && CRNA_SUBPAGE_TYPES.includes(subPage)) {
        breadcrumbItems.push({ label: 'CRNA', href: `/${profession}/crna` });
        const subPageTitles: Record<string, string> = {
            'salary': 'Salary',
            'schools': 'Schools',
            'how-to-become': 'How to Become'
        };
        breadcrumbItems.push({ label: subPageTitles[subPage] });
    } else {
        breadcrumbItems.push({ label: 'CRNA (Nurse Anesthetist)' });
    }


    // CRNA sub-page content
    if (subPage === 'salary') {
        // Fetch CRNA salary data from database
        const crnaSalaryData = await prisma.salaryData.findFirst({
            where: {
                careerKeyword: 'nurse-anesthetists',
                location: { state: '', city: '' }, // National data
                year: 2024
            }
        });

        // Fetch top-paying states
        const topStates = await prisma.salaryData.findMany({
            where: {
                careerKeyword: 'nurse-anesthetists',
                location: { city: '', state: { not: '' } },
                year: 2024
            },
            include: { location: true },
            orderBy: { annualMedian: 'desc' },
            take: 10
        });

        const avgSalary = crnaSalaryData?.annualMean || 203090;
        const medianSalary = crnaSalaryData?.annualMedian || 202470;
        const hourlyMedian = crnaSalaryData?.hourlyMedian || 97.64;
        const salary10th = crnaSalaryData?.annual10th || 171200;
        const salary90th = crnaSalaryData?.annual90th || 239200;

        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    CRNA Salary: How Much Do Nurse Anesthetists Make?
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    CRNAs are among the highest-paid nursing professionals in healthcare
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Average Salary</p>
                            <p className="text-3xl font-bold text-green-600">
                                ${avgSalary.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">per year (BLS 2024)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Salary Range</p>
                            <p className="text-2xl font-bold">
                                ${Math.round(salary10th / 1000)}K - ${Math.round(salary90th / 1000)}K+
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">10th to 90th percentile</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Hourly Rate</p>
                            <p className="text-2xl font-bold">${hourlyMedian.toFixed(2)}/hr</p>
                            <p className="text-sm text-muted-foreground mt-1">median hourly</p>
                        </CardContent>
                    </Card>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Top-Paying States for CRNAs</h2>
                    <p className="text-muted-foreground mb-6">
                        CRNA salaries vary significantly by state, with differences driven by cost of living,
                        demand, and practice authority laws. Here are the highest-paying states:
                    </p>
                    <div className="space-y-3">
                        {topStates.slice(0, 10).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <span className="font-medium">{item.location?.stateName || item.location?.state}</span>
                                    {item.employmentCount && (
                                        <span className="text-sm text-muted-foreground ml-2">
                                            ({item.employmentCount.toLocaleString()} employed)
                                        </span>
                                    )}
                                </div>
                                <span className="text-green-600 font-bold">
                                    ${item.annualMedian?.toLocaleString() || 'N/A'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <Card className="mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-3">Salary by Experience Level</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Entry-Level (0-2 years)</span>
                                <span className="font-semibold">$170,000 - $185,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Mid-Career (3-7 years)</span>
                                <span className="font-semibold">$190,000 - $210,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Experienced (8-15 years)</span>
                                <span className="font-semibold">$210,000 - $230,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Senior (15+ years)</span>
                                <span className="font-semibold">$230,000 - $250,000+</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Factors Affecting CRNA Salary</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: 'Geographic Location', desc: 'Urban vs. rural, state practice laws, cost of living adjustments' },
                            { title: 'Work Setting', desc: 'Hospital vs. ambulatory surgery center vs. private practice' },
                            { title: 'Call Requirements', desc: 'Weekend, night, and on-call differentials ($2-5/hr extra)' },
                            { title: 'Certifications', desc: 'CCRN, specialty certifications increase earning potential' },
                            { title: 'Practice Authority', desc: 'Independent practice states may offer higher salaries' },
                            { title: 'Employer Type', desc: 'Academic medical centers, private practices, locum tenens' },
                        ].map((item, idx) => (
                            <Card key={idx}>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <div className="flex gap-4">
                    <Button asChild>
                        <Link href={`/${profession}/crna`}>CRNA Career Guide <ArrowRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}/crna/schools`}>Find CRNA Schools</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}/salary`}>RN Salary Comparison</Link>
                    </Button>
                </div>
            </main>
        );
    }

    if (subPage === 'schools') {
        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />

                <article className="prose prose-slate dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-semibold
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                    prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                    mb-12">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => {
                                const href = props.href || '';
                                if (href.startsWith('http')) {
                                    return <a href={href} target="_blank" rel="noopener noreferrer">{props.children}</a>;
                                }
                                return <Link href={href}>{props.children}</Link>;
                            }
                        }}
                    >
                        {CRNA_SCHOOLS_CONTENT}
                    </ReactMarkdown>
                </article>
            </main>
        );
    }

    if (subPage === 'how-to-become') {
        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />

                <article className="prose prose-slate dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-semibold
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                    prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                    prose-table:my-6
                    prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:font-semibold
                    prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
                    mb-12">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => {
                                const href = props.href || '';
                                if (href.startsWith('http')) {
                                    return <a href={href} target="_blank" rel="noopener noreferrer">{props.children}</a>;
                                }
                                return <Link href={href}>{props.children}</Link>;
                            }
                        }}
                    >
                        {CRNA_HOWTOBECOME_CONTENT}
                    </ReactMarkdown>
                </article>
            </main>
        );
    }

    // Main CRNA hub page - comprehensive content
    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* CRNA Resources Navigation */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-lg">CRNA Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Link
                            href={`/${profession}/crna/how-to-become`}
                            className="p-4 rounded-lg border hover:bg-muted transition-colors text-center"
                        >
                            <GraduationCap className="w-5 h-5 mx-auto mb-2" />
                            <p className="font-medium text-sm">How to Become</p>
                        </Link>
                        <Link
                            href={`/${profession}/crna/salary`}
                            className="p-4 rounded-lg border hover:bg-muted transition-colors text-center"
                        >
                            <DollarSign className="w-5 h-5 mx-auto mb-2" />
                            <p className="font-medium text-sm">Salary Data</p>
                        </Link>
                        <Link
                            href={`/${profession}/crna/schools`}
                            className="p-4 rounded-lg border hover:bg-muted transition-colors text-center"
                        >
                            <Award className="w-5 h-5 mx-auto mb-2" />
                            <p className="font-medium text-sm">CRNA Schools</p>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <article className="prose prose-slate dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-semibold
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-table:my-6
                prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:font-semibold
                prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
                mb-12">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        a: ({ node, ...props }) => {
                            const href = props.href || '';
                            if (href.startsWith('http')) {
                                return <a href={href} target="_blank" rel="noopener noreferrer">{props.children}</a>;
                            }
                            return <Link href={href}>{props.children}</Link>;
                        }
                    }}
                >
                    {CRNA_HUB_CONTENT}
                </ReactMarkdown>
            </article>
        </main>
    );
}
