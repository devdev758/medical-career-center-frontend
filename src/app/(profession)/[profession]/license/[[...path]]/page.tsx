import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Award,
    Shield,
    RefreshCw,
    Search,
    BookOpen,
    MapPin,
    Clock,
    ArrowRight
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { urlSlugToDbSlug, formatSlugForBreadcrumb, getProfessionUrls } from '@/lib/url-utils';
import { validateProfession, getProfessionDisplayName } from '@/lib/profession-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RN_LICENSE_CONTENT } from '@/lib/rn-license-content';
import { getContentYear } from '@/lib/date-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        path?: string[];  // [[...path]] -> can be [], ['compact'], ['renewal'], ['lookup'], ['lookup', 'ca'], etc.
    };
}

// License type slugs
const LICENSE_TYPE_SLUGS = ['compact', 'renewal', 'lookup', 'reciprocity', 'continuing-education'];

const LICENSE_TYPE_META: Record<string, { title: string; description: string; icon: any }> = {
    'compact': {
        title: 'Nurse Licensure Compact',
        description: 'Practice in multiple states with one license',
        icon: Shield,
    },
    'renewal': {
        title: 'License Renewal',
        description: 'How to renew your CNA certification online',
        icon: RefreshCw,
    },
    'lookup': {
        title: 'License Lookup',
        description: 'Verify CNA certifications and check license status by state',
        icon: Search,
    },
    'reciprocity': {
        title: 'Reciprocity',
        description: 'Transfer your CNA certification to another state',
        icon: MapPin,
    },
    'continuing-education': {
        title: 'Continuing Education',
        description: 'CEU requirements and approved courses',
        icon: BookOpen,
    },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, path } = await params;
    const careerTitle = formatSlugForBreadcrumb(profession);

    const firstParam = path?.[0];
    const isLicenseType = firstParam && LICENSE_TYPE_SLUGS.includes(firstParam);
    const licenseTypeMeta = isLicenseType ? LICENSE_TYPE_META[firstParam] : null;

    const currentYear = getContentYear();
    let title, description, urlPath;

    if (licenseTypeMeta) {
        title = `${careerTitle} ${licenseTypeMeta.title} ${currentYear} | Medical Career Center`;
        description = `${licenseTypeMeta.description} for ${careerTitle.toLowerCase()}s. Complete guide to ${licenseTypeMeta.title.toLowerCase()} requirements, process, and resources.`;
        urlPath = `/${profession}/license/${firstParam}`;
    } else {
        title = `${careerTitle} License & Certification Guide ${currentYear} | Medical Career Center`;
        description = `Everything you need to know about ${careerTitle.toLowerCase()} licensing. State requirements, compact license, renewal, and certification information.`;
        urlPath = `/${profession}/license`;
    }

    return {
        title,
        description,
        alternates: { canonical: `https://medicalcareercenter.org${urlPath}` },
        openGraph: { title, description, type: 'website' },
        robots: { index: true, follow: true },
    };
}

export default async function LicensePage({ params }: PageProps) {
    const { profession, path } = await params;

    // Validate profession
    const isValid = await validateProfession(profession);
    if (!isValid) {
        notFound();
    }

    const displayName = await getProfessionDisplayName(profession);
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForBreadcrumb(profession);

    const firstParam = path?.[0];
    const isLicenseType = firstParam && LICENSE_TYPE_SLUGS.includes(firstParam);
    const licenseTypeMeta = isLicenseType ? LICENSE_TYPE_META[firstParam] : null;

    // Fetch career guide for license data
    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: {
            professionName: true,
            licensingOverview: true,
            stateRequirements: true,
            examInfo: true,
            renewalProcess: true,
            certifications: true,
        }
    });

    // Career guide is optional - pages work without it

    const stateReqs = (careerGuide.stateRequirements as Record<string, any>) || {};
    const examInfo = (careerGuide.examInfo as any[]) || [];
    const certifications = (careerGuide.certifications as any[]) || [];
    // Show license navigation for main professions
    const showLicenseNav = ['registered-nurse', 'cna', 'licensed-practical-nurse'].includes(profession);

    // Build breadcrumb items
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
    ];

    if (isLicenseType && licenseTypeMeta) {
        breadcrumbItems.push({ label: 'License', href: `/${profession}/license` });
        breadcrumbItems.push({ label: licenseTypeMeta.title });
    } else {
        breadcrumbItems.push({ label: 'License & Certification' });
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {licenseTypeMeta
                        ? `${careerTitle} ${licenseTypeMeta.title}`
                        : `${careerTitle} License & Certification`}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {licenseTypeMeta
                        ? licenseTypeMeta.description
                        : 'Everything you need to know about licensing and certification'}
                </p>
            </div>

            <QuickNavigation profession={profession} currentPath="license" />

            {/* License Type Navigation */}
            {showLicenseNav && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg">License Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(LICENSE_TYPE_META).map(([slug, meta]) => {
                                const Icon = meta.icon;
                                const isActive = firstParam === slug;
                                return (
                                    <Link
                                        key={slug}
                                        href={`/${profession}/license/${slug}`}
                                        className={`p-4 rounded-lg border transition-colors text-center ${isActive
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mx-auto mb-2" />
                                        <p className="font-medium text-sm">{meta.title.replace('Nurse Licensure ', '')}</p>
                                    </Link>
                                );
                            })}
                        </div>
                        {isLicenseType && (
                            <div className="mt-4 pt-4 border-t">
                                <Link href={`/${profession}/license`} className="text-sm text-primary hover:underline">
                                    ← View license overview
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Comprehensive License Guide for RN */}
            {!isLicenseType && profession === 'registered-nurse' && (
                <article className="prose prose-slate dark:prose-invert max-w-none mb-12
                    prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-semibold
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                    prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                    prose-table:my-6 prose-table:border-collapse
                    prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:font-semibold prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700
                    prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
                    prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded">
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
                        {RN_LICENSE_CONTENT}
                    </ReactMarkdown>
                </article>
            )}

            {/* Overview - fallback for non-RN */}
            {!isLicenseType && profession !== 'registered-nurse' && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Licensing Overview</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        {careerGuide.licensingOverview}
                    </p>
                </section>
            )}

            {/* Compact License Content (for RN) */}
            {firstParam === 'compact' && ['registered-nurse', 'licensed-practical-nurse'].includes(profession) && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Nurse Licensure Compact (NLC)</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        The Nurse Licensure Compact allows registered nurses to practice in multiple states with a single license.
                        As of 2024, 41 states have enacted compact legislation, making it easier than ever to work across state lines.
                    </p>
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 mb-6">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-3">Compact Nursing License Benefits</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">✓</span>
                                    Practice in all compact states with one license
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">✓</span>
                                    No additional state license applications needed
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">✓</span>
                                    Ideal for travel nurses and telehealth positions
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">✓</span>
                                    Save time and money on licensing fees
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* Renewal Content */}
            {firstParam === 'renewal' && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">License Renewal Process</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        {careerGuide.renewalProcess || 'Most states require nursing license renewal every 1-2 years. Requirements typically include completing continuing education hours and paying a renewal fee.'}
                    </p>
                </section>
            )}

            {/* Certification Exams */}
            {examInfo.length > 0 && !isLicenseType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Certification Exams</h2>
                    <div className="space-y-4">
                        {examInfo.map((exam: any, idx: number) => (
                            <Card key={idx}>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">{exam.examName}</h3>
                                    <p className="text-sm text-muted-foreground">{exam.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Professional Certifications */}
            {certifications.length > 0 && !isLicenseType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Professional Certifications</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {certifications.map((cert: any, idx: number) => (
                            <Card key={idx}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold">{cert.name}</h3>
                                        <Badge variant="outline">{cert.issuer}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* State Requirements */}
            {Object.keys(stateReqs).length > 0 && !isLicenseType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">State-Specific Requirements</h2>
                    <div className="space-y-3">
                        {Object.entries(stateReqs).slice(0, 6).map(([state, req]: [string, any]) => (
                            <Card key={state}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">{state}</h4>
                                        <Badge variant={req.required ? "default" : "secondary"}>
                                            {req.required ? "License Required" : "No License Required"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{req.details}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Navigation */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.schools} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Find Schools</p>
                    </Link>
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Browse Jobs</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
