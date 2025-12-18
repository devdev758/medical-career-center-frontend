import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight, Stethoscope } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SPECIALTY_CONTENT_MAP } from '@/lib/specializations';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        specialty?: string[];  // [[...specialty]] for individual specialty pages
    };
}

// RN specialty data
const RN_SPECIALTIES = [
    { slug: 'icu', name: 'ICU Nurse', description: 'Critical care nursing in intensive care units', salary: '$85,000 - $115,000' },
    { slug: 'emergency-room', name: 'ER Nurse', description: 'Emergency department nursing', salary: '$75,000 - $105,000' },
    { slug: 'pediatric', name: 'Pediatric Nurse', description: 'Caring for infants and children', salary: '$70,000 - $95,000' },
    { slug: 'oncology', name: 'Oncology Nurse', description: 'Cancer care and chemotherapy administration', salary: '$80,000 - $105,000' },
    { slug: 'neonatal', name: 'NICU Nurse', description: 'Neonatal intensive care', salary: '$75,000 - $100,000' },
    { slug: 'labor-delivery', name: 'Labor & Delivery Nurse', description: 'Childbirth and obstetric care', salary: '$70,000 - $95,000' },
    { slug: 'operating-room', name: 'OR Nurse', description: 'Perioperative and surgical nursing', salary: '$80,000 - $110,000' },
    { slug: 'cardiac', name: 'Cardiac Nurse', description: 'Cardiovascular care and telemetry', salary: '$75,000 - $100,000' },
    { slug: 'aesthetic', name: 'Aesthetic Nurse', description: 'Cosmetic procedures and aesthetics', salary: '$70,000 - $110,000' },
    { slug: 'psychiatric', name: 'Psychiatric Nurse', description: 'Mental health nursing', salary: '$70,000 - $95,000' },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, specialty } = await params;
    const careerTitle = formatSlugForDisplay(profession);
    const specialtySlug = specialty?.[0];

    if (specialtySlug) {
        const spec = RN_SPECIALTIES.find(s => s.slug === specialtySlug);
        if (spec) {
            return {
                title: `${spec.name} Career Guide: Salary, Requirements & How to Become One`,
                description: `Everything you need to know about becoming a ${spec.name.toLowerCase()}. ${spec.description}. Average salary: ${spec.salary}.`,
                alternates: { canonical: `https://medicalcareercenter.org/${profession}/specializations/${specialtySlug}` },
            };
        }
    }

    return {
        title: `${careerTitle} Specializations: Career Paths & Specialty Areas | Medical Career Center`,
        description: `Explore ${careerTitle.toLowerCase()} specializations including ICU, ER, pediatrics, oncology, and more. Compare salaries and requirements for each specialty.`,
        alternates: { canonical: `https://medicalcareercenter.org/${profession}/specializations` },
    };
}

export default async function SpecializationsPage({ params }: PageProps) {
    const { profession, specialty } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);
    const specialtySlug = specialty?.[0];

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: {
            professionName: true,
            specializations: true,
            specializationsContent: true,
        }
    });

    if (!careerGuide) notFound();

    const dbSpecializations = (careerGuide.specializations as any[]) || [];
    const isRegisteredNurse = profession === 'registered-nurse';

    // Use RN specialties for RN, otherwise use DB data
    const specializations = isRegisteredNurse ? RN_SPECIALTIES : dbSpecializations.map((s: any) => ({
        slug: s.name.toLowerCase().replace(/\s+/g, '-'),
        name: s.name,
        description: s.description,
        salary: 'Varies by experience',
    }));

    // If viewing a specific specialty
    const selectedSpecialty = specialtySlug ? specializations.find((s: any) => s.slug === specialtySlug) : null;

    // Build breadcrumb - last item should not have href
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
    ];

    if (selectedSpecialty) {
        breadcrumbItems.push({ label: 'Specializations', href: `/${profession}/specializations` });
        breadcrumbItems.push({ label: selectedSpecialty.name });
    } else {
        breadcrumbItems.push({ label: 'Specializations' });
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {selectedSpecialty ? (
                // Individual specialty page with full content
                <>
                    <Breadcrumb items={breadcrumbItems} className="mb-6" />

                    {SPECIALTY_CONTENT_MAP[specialtySlug!] ? (
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
                                {SPECIALTY_CONTENT_MAP[specialtySlug!]}
                            </ReactMarkdown>

                            <div className="flex gap-4 mt-12 not-prose">
                                <Button asChild>
                                    <Link href={urls.jobs}>
                                        Find {selectedSpecialty.name} Jobs <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={`/${profession}/specializations`}>
                                        View All Specializations
                                    </Link>
                                </Button>
                            </div>
                        </article>
                    ) : (
                        // Fallback for specialties without detailed content
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                {selectedSpecialty.name}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                {selectedSpecialty.description}
                            </p>

                            <Card className="mb-8 bg-green-50 dark:bg-green-950/20 border-green-200">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">Salary Range</h3>
                                    <p className="text-2xl font-bold text-green-600">{selectedSpecialty.salary}</p>
                                </CardContent>
                            </Card>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-4">About {selectedSpecialty.name}s</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {selectedSpecialty.name}s are registered nurses who specialize in {selectedSpecialty.description.toLowerCase()}.
                                    This specialty typically requires additional training, certifications, and clinical experience beyond the standard RN education.
                                </p>
                            </section>

                            <div className="flex gap-4">
                                <Button asChild>
                                    <Link href={urls.jobs}>
                                        Find {selectedSpecialty.name} Jobs <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={`/${profession}/specializations`}>
                                        View All Specializations
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </>
            ) : (
                // Specializations overview page
                <>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        {careerTitle} Specializations
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Explore nursing specialty areas and career paths
                    </p>

                    {/* CRNA Highlight for RN */}
                    {isRegisteredNurse && (
                        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Stethoscope className="w-6 h-6 text-blue-600" />
                                            <h3 className="text-lg font-semibold">CRNA (Nurse Anesthetist)</h3>
                                        </div>
                                        <p className="text-muted-foreground mb-2">
                                            The highest-paying nursing specialty with an average salary of $200,000+
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            One of the most searched nursing specialties with 165K+ monthly searches
                                        </p>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/${profession}/crna`}>
                                            Learn More <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* All Specializations */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {specializations.map((spec: any) => (
                            <Card key={spec.slug} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <Link href={`/${profession}/specializations/${spec.slug}`}>
                                        <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                                            {spec.name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-muted-foreground mb-3">{spec.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-green-600">{spec.salary}</span>
                                        <Link href={`/${profession}/specializations/${spec.slug}`} className="text-sm text-primary hover:underline">
                                            Learn more →
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                    <Link href={urls.schools} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Find Schools</p>
                    </Link>
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Browse Jobs</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
