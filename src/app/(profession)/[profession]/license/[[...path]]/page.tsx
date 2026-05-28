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
import { urlSlugToDbSlug, formatSlugForBreadcrumb, getProfessionUrls } from '@/lib/url-utils';
import { validateProfession, getProfessionDisplayName } from '@/lib/profession-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RN_LICENSE_CONTENT } from '@/lib/rn-license-content';
import { getContentYear } from '@/lib/date-utils';
import {
    NCLEXOverviewCard,
    NCLEXPassRatesCard,
    CompactStatesGrid,
    EndorsementChecklist,
    RenewalFrequencyCards,
    CompactComparisonTable,
    LicenseStepsTimeline
} from '@/components/content/LicenseVisuals';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        path?: string[];  // [[...path]] -> can be [], ['compact'], ['renewal'], ['lookup'], ['lookup', 'ca'], etc.
    };
}

// Helper to get dynamically formatted license type meta
function getLicenseTypeMeta(slug: string, careerTitle: string) {
    const metas: Record<string, { title: string; description: string; icon: any }> = {
        'compact': {
            title: 'Nurse Licensure Compact',
            description: `Complete guide to the Nurse Licensure Compact (NLC) and multistate practice for ${careerTitle}s.`,
            icon: Shield,
        },
        'renewal': {
            title: 'License Renewal',
            description: `How to renew your ${careerTitle} license or certification online, CEU requirements, and deadlines.`,
            icon: RefreshCw,
        },
        'lookup': {
            title: 'License Lookup',
            description: `Verify ${careerTitle} licenses, lookup registry status, and contact state boards of nursing.`,
            icon: Search,
        },
        'reciprocity': {
            title: 'Reciprocity & Endorsement',
            description: `How to transfer your ${careerTitle} license or certification to another state by reciprocity or endorsement.`,
            icon: MapPin,
        },
        'continuing-education': {
            title: 'Continuing Education',
            description: `Continuing education (CEU) requirements, approved courses, and free contact hours for ${careerTitle}s.`,
            icon: BookOpen,
        },
    };
    return metas[slug] || null;
}

function getAvailableLicenseTypes(profession: string) {
    const list = ['renewal', 'lookup', 'reciprocity', 'continuing-education'];
    if (['registered-nurse', 'licensed-practical-nurse'].includes(profession)) {
        list.unshift('compact');
    }
    return list;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, path } = await params;
    const careerTitle = formatSlugForBreadcrumb(profession);

    const firstParam = path?.[0];
    const availableTypes = getAvailableLicenseTypes(profession);
    const isLicenseType = firstParam && availableTypes.includes(firstParam);
    const licenseTypeMeta = isLicenseType ? getLicenseTypeMeta(firstParam, careerTitle) : null;

    const currentYear = getContentYear();
    let title, description, urlPath;

    if (licenseTypeMeta) {
        title = `${careerTitle} ${licenseTypeMeta.title} Guide ${currentYear} | Medical Career Center`;
        description = licenseTypeMeta.description;
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

// Map section headings to visual components to insert after them
function getVisualAfterSection(sectionText: string): React.ReactNode | null {
    if (sectionText.includes('## NCLEX-RN Exam')) {
        return (
            <>
                <NCLEXOverviewCard key="nclex-overview" />
                <NCLEXPassRatesCard key="nclex-pass" />
            </>
        );
    }
    if (sectionText.includes('## Nurse Licensure Compact')) {
        return <CompactStatesGrid key="compact-states" />;
    }
    if (sectionText.includes('## Licensure by Endorsement')) {
        return <EndorsementChecklist key="endorsement" />;
    }
    if (sectionText.includes('## RN License Renewal')) {
        return <RenewalFrequencyCards key="renewal" />;
    }
    if (sectionText.includes('## Compact vs. Single-State')) {
        return <CompactComparisonTable key="comparison" />;
    }
    if (sectionText.includes('## Next Steps')) {
        return <LicenseStepsTimeline key="steps" />;
    }
    return null;
}

// Sections where the markdown lists are redundant because the component covers it all
function shouldTrimSection(sectionText: string): string {
    // For NCLEX section: keep intro paragraph, remove detailed bullet lists
    if (sectionText.includes('## NCLEX-RN Exam')) {
        const overviewStart = sectionText.indexOf('### NCLEX-RN Overview');
        const howToRegisterStart = sectionText.indexOf('### How to Register for NCLEX');
        const retakingStart = sectionText.indexOf('**Retaking NCLEX**:');
        
        let cleaned = sectionText.substring(0, overviewStart); // Keep intro
        if (howToRegisterStart > 0) {
            const howToRegisterEnd = retakingStart > 0 ? retakingStart : sectionText.length;
            cleaned += '\n\n' + sectionText.substring(howToRegisterStart, howToRegisterEnd);
        }
        if (retakingStart > 0) {
            cleaned += '\n\n' + sectionText.substring(retakingStart);
        }
        return cleaned;
    }
    // For Compact section: keep intro + how it works, remove long state lists
    if (sectionText.includes('## Nurse Licensure Compact')) {
        const statesListStart = sectionText.indexOf('### NLC Compact States');
        const howItWorksStart = sectionText.indexOf('### How the NLC Works');
        if (statesListStart > 0 && howItWorksStart > 0) {
            // Keep intro, skip state list, keep from "How the NLC Works" onward
            return sectionText.substring(0, statesListStart) + sectionText.substring(howItWorksStart);
        }
    }
    // For Renewal section: keep intro and CE requirements, remove only frequency bullet lists (which card covers)
    if (sectionText.includes('## RN License Renewal')) {
        const freqStart = sectionText.indexOf('### Renewal Frequency');
        const ceStart = sectionText.indexOf('### Continuing Education');
        
        let cleaned = sectionText.substring(0, freqStart); // Keep intro
        if (ceStart > 0) {
            cleaned += '\n\n' + sectionText.substring(ceStart); // Keep CE requirements onward
        }
        return cleaned;
    }
    // For Compact vs Single-State: keep intro, remove table (component replaces it)
    if (sectionText.includes('## Compact vs. Single-State')) {
        const tableStart = sectionText.indexOf('| Feature');
        if (tableStart > 0) {
            return sectionText.substring(0, tableStart);
        }
    }
    // For Endorsement: keep intro, remove the checklist
    if (sectionText.includes('## Licensure by Endorsement')) {
        const reqStart = sectionText.indexOf('### Endorsement Requirements');
        const nursysStart = sectionText.indexOf('### Nursys.com');
        if (reqStart > 0 && nursysStart > 0) {
            return sectionText.substring(0, reqStart) + sectionText.substring(nursysStart);
        }
    }
    // For Next Steps: remove numbered list (component replaces it)
    if (sectionText.includes('## Next Steps')) {
        const listStart = sectionText.indexOf('1. **Determine');
        if (listStart > 0) {
            return sectionText.substring(0, listStart);
        }
    }
    return sectionText;
}

function getSubpageContent(slug: string): string {
    // Split by ## headings
    const sections = RN_LICENSE_CONTENT.split(/(?=^## )/m);
    
    if (slug === 'compact') {
        const compactSection = sections.find(s => s.startsWith('## Nurse Licensure Compact')) || '';
        const comparisonSection = sections.find(s => s.startsWith('## Compact vs. Single-State')) || '';
        return `${compactSection}\n\n${comparisonSection}`;
    }
    if (slug === 'reciprocity') {
        return sections.find(s => s.startsWith('## Licensure by Endorsement')) || '';
    }
    if (slug === 'lookup') {
        return sections.find(s => s.startsWith('## State-Specific Requirements')) || '';
    }
    if (slug === 'renewal') {
        const renewalSection = sections.find(s => s.startsWith('## RN License Renewal')) || '';
        const ceIndex = renewalSection.indexOf('### Continuing Education');
        if (ceIndex > 0) {
            return renewalSection.substring(0, ceIndex);
        }
        return renewalSection;
    }
    if (slug === 'continuing-education') {
        const renewalSection = sections.find(s => s.startsWith('## RN License Renewal')) || '';
        const ceIndex = renewalSection.indexOf('### Continuing Education');
        if (ceIndex > 0) {
            return '## Continuing Education (CE) Requirements\n\n' + renewalSection.substring(ceIndex).replace('### Continuing Education (CE) Requirements', '');
        }
        return '';
    }
    return '';
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
    const availableTypes = getAvailableLicenseTypes(profession);
    const isLicenseType = firstParam && availableTypes.includes(firstParam);

    // Thrown 404 for invalid sub-paths
    if (firstParam && !isLicenseType) {
        notFound();
    }

    const licenseTypeMeta = isLicenseType ? getLicenseTypeMeta(firstParam, careerTitle) : null;

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

    const stateReqs = (careerGuide?.stateRequirements as Record<string, any>) || {};
    const examInfo = (careerGuide?.examInfo as any[]) || [];
    const certifications = (careerGuide?.certifications as any[]) || [];
    const showLicenseNav = ['registered-nurse', 'cna', 'licensed-practical-nurse'].includes(profession);

    // Build breadcrumb items
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide?.professionName || displayName, href: `/${profession}` },
    ];

    if (isLicenseType && licenseTypeMeta) {
        breadcrumbItems.push({ label: 'License', href: `/${profession}/license` });
        breadcrumbItems.push({ label: licenseTypeMeta.title });
    } else {
        breadcrumbItems.push({ label: 'License & Certification' });
    }

    // Markdown link component
    const mdComponents = {
        a: ({ node, ...props }: any) => {
            const href = props.href || '';
            if (href.startsWith('http')) {
                return <a href={href} target="_blank" rel="noopener noreferrer">{props.children}</a>;
            }
            return <Link href={href}>{props.children}</Link>;
        }
    };

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

            {/* License Type Navigation */}
            {showLicenseNav && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg">License Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {availableTypes.map((slug) => {
                                const meta = getLicenseTypeMeta(slug, careerTitle);
                                if (!meta) return null;
                                const Icon = meta.icon;
                                const isActive = firstParam === slug;
                                return (
                                    <Link
                                        key={slug}
                                        href={`/${profession}/license/${slug}`}
                                        className={`p-4 rounded-lg border transition-colors text-center flex flex-col justify-between h-28 ${isActive
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'hover:bg-muted border-border'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mx-auto mb-2" />
                                        <p className="font-medium text-xs leading-snug">{meta.title.replace('Nurse Licensure ', '')}</p>
                                    </Link>
                                );
                            })}
                        </div>
                        {isLicenseType && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <Link href={`/${profession}/license`} className="text-sm text-primary hover:underline flex items-center gap-1">
                                    ← View complete {careerTitle} license guide
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Comprehensive License Guide for RN (Main Page) */}
            {!isLicenseType && profession === 'registered-nurse' && (() => {
                const sections = RN_LICENSE_CONTENT.split(/(?=^## )/m).filter(s => s.trim());

                return (
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
                        {sections.map((section, i) => {
                            const trimmed = shouldTrimSection(section);
                            const visual = getVisualAfterSection(section);
                            return (
                                <div key={i}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                        {trimmed}
                                    </ReactMarkdown>
                                    {visual}
                                </div>
                            );
                        })}
                    </article>
                );
            })()}

            {/* RN Subpage Content */}
            {isLicenseType && profession === 'registered-nurse' && (() => {
                const content = getSubpageContent(firstParam);
                const sections = content.split(/(?=^## )/m).filter(s => s.trim());

                return (
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
                        {sections.map((section, i) => {
                            const trimmed = shouldTrimSection(section);
                            const visual = getVisualAfterSection(section);
                            return (
                                <div key={i}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                        {trimmed}
                                    </ReactMarkdown>
                                    {visual}
                                </div>
                            );
                        })}
                    </article>
                );
            })()}

            {/* Overview - fallback for non-RN (Main Page) */}
            {!isLicenseType && profession !== 'registered-nurse' && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Licensing Overview</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        {careerGuide?.licensingOverview || `Licensing requirements for ${careerTitle}s vary by state. Most states require completion of an approved training program and passing a competency exam.`}
                    </p>
                </section>
            )}

            {/* Non-RN Subpage Content: Renewal */}
            {isLicenseType && firstParam === 'renewal' && profession !== 'registered-nurse' && (
                <section className="mb-12 prose prose-slate dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold mb-4">License Renewal Process</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        {careerGuide?.renewalProcess || `Most states require renewal every 1-2 years. Check with your state registry or board for local continuing education (CE) requirements, practice hours, and renewal fees.`}
                    </p>
                </section>
            )}

            {/* Non-RN Subpage Content: Lookup */}
            {isLicenseType && firstParam === 'lookup' && profession !== 'registered-nurse' && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">State Registry Verification</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        Verify certification status and find direct links to verify credentials with state-level boards and registries.
                    </p>
                    {Object.keys(stateReqs).length > 0 ? (
                        <div className="space-y-4">
                            {Object.entries(stateReqs).map(([state, req]: [string, any]) => (
                                <Card key={state} className="border-border">
                                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground mb-1">{state}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{req.details}</p>
                                        </div>
                                        <Badge variant={req.required ? "default" : "secondary"} className="self-start sm:self-center shrink-0">
                                            {req.required ? "License Required" : "No License Required"}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Detailed state requirement data is not available. Please visit the corresponding state department of health or licensing board.</p>
                    )}
                </section>
            )}

            {/* Non-RN Subpage Content: Reciprocity */}
            {isLicenseType && firstParam === 'reciprocity' && profession !== 'registered-nurse' && (
                <section className="mb-12 prose prose-slate dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold mb-4">License Reciprocity & Transfer</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        Transferring your {careerTitle} credentials to a new state typically involves applying for reciprocity or endorsement. General requirements include:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>Holding an active, unencumbered license or certificate in your current home state.</li>
                        <li>Submitting an application and background check to the new state board or health department.</li>
                        <li>Providing official verification of your current license (some registries do this electronically).</li>
                        <li>Verifying recent work experience (usually 1,000+ hours in the past 2 years).</li>
                    </ul>
                    {careerGuide?.licensingOverview && (
                        <div className="mt-6 p-5 bg-muted/30 border rounded-xl">
                            <h3 className="text-lg font-bold mb-2">Licensing Overview Notes</h3>
                            <p className="text-sm leading-relaxed">{careerGuide.licensingOverview}</p>
                        </div>
                    )}
                </section>
            )}

            {/* Non-RN Subpage Content: Continuing Education */}
            {isLicenseType && firstParam === 'continuing-education' && profession !== 'registered-nurse' && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Continuing Education & Certifications</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        Fulfilling continuing education requirements is crucial for renewal. Many boards require specific topics such as infection control, documentation, and patient rights.
                    </p>
                    {certifications.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            {certifications.map((cert: any, idx: number) => (
                                <Card key={idx} className="border-border">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-3 gap-2">
                                            <h3 className="font-bold text-lg text-foreground">{cert.name}</h3>
                                            <Badge variant="outline" className="shrink-0">{cert.issuer}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Please consult your local licensing authority for courses and contact hours approved in your state.</p>
                    )}
                </section>
            )}

            {/* Certification Exams (Main Page only) */}
            {examInfo.length > 0 && !isLicenseType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Certification Exams</h2>
                    <div className="space-y-4">
                        {examInfo.map((exam: any, idx: number) => (
                            <Card key={idx} className="border-border">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg text-foreground mb-2">{exam.examName}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{exam.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Professional Certifications (Main Page only) */}
            {certifications.length > 0 && !isLicenseType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Professional Certifications</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {certifications.map((cert: any, idx: number) => (
                            <Card key={idx} className="border-border">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-lg text-foreground">{cert.name}</h3>
                                        <Badge variant="outline">{cert.issuer}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* State Requirements (Main Page only) */}
            {Object.keys(stateReqs).length > 0 && !isLicenseType && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">State-Specific Requirements</h2>
                    <div className="space-y-3">
                        {Object.entries(stateReqs).slice(0, 6).map(([state, req]: [string, any]) => (
                            <Card key={state} className="border-border">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">{state}</h4>
                                        <Badge variant={req.required ? "default" : "secondary"}>
                                            {req.required ? "License Required" : "No License Required"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{req.details}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
