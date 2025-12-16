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

    const currentYear = new Date().getFullYear();

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
                            <p className="text-3xl font-bold text-green-600">$203,090</p>
                            <p className="text-sm text-muted-foreground mt-1">per year</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Salary Range</p>
                            <p className="text-2xl font-bold">$160,000 - $250,000+</p>
                            <p className="text-sm text-muted-foreground mt-1">depending on location</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Hourly Rate</p>
                            <p className="text-2xl font-bold">$97.64/hr</p>
                            <p className="text-sm text-muted-foreground mt-1">median hourly</p>
                        </CardContent>
                    </Card>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Top-Paying States for CRNAs</h2>
                    <div className="space-y-3">
                        {[
                            { state: 'California', salary: '$246,500' },
                            { state: 'Oregon', salary: '$234,750' },
                            { state: 'Wyoming', salary: '$223,030' },
                            { state: 'Wisconsin', salary: '$220,600' },
                            { state: 'Montana', salary: '$218,120' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <span className="font-medium">{item.state}</span>
                                <span className="text-green-600 font-bold">{item.salary}</span>
                            </div>
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
                </div>
            </main>
        );
    }

    if (subPage === 'schools') {
        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    CRNA Schools & Nurse Anesthesia Programs
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Find accredited CRNA programs to start your anesthesia career
                </p>

                <Card className="mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">Program Requirements</h3>
                        <p className="text-muted-foreground">
                            CRNA programs now require a doctoral degree (DNAP or DNP). Programs typically take 3-4 years and require
                            1+ year of ICU experience as an RN for admission.
                        </p>
                    </CardContent>
                </Card>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">What to Look for in a CRNA Program</h2>
                    <ul className="space-y-3">
                        {[
                            'COA (Council on Accreditation) accreditation',
                            'High NCE pass rate (>90%)',
                            'Diverse clinical rotation sites',
                            'Strong faculty-to-student ratio',
                            'Clinical hours (1,800+ required)',
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">✓</span>
                                <span className="text-muted-foreground">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="flex gap-4">
                    <Button asChild>
                        <Link href={`/${profession}/crna/how-to-become`}>How to Become a CRNA <ArrowRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}/crna/salary`}>CRNA Salary Data</Link>
                    </Button>
                </div>
            </main>
        );
    }

    if (subPage === 'how-to-become') {
        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    How to Become a CRNA: Step-by-Step Guide
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    The complete path to becoming a Certified Registered Nurse Anesthetist
                </p>

                <section className="mb-12">
                    <div className="space-y-6">
                        {[
                            { step: 1, title: 'Earn Your BSN', desc: 'Complete a Bachelor of Science in Nursing from an accredited program', time: '4 years' },
                            { step: 2, title: 'Pass the NCLEX-RN', desc: 'Obtain your RN license by passing the national licensure exam', time: '2-3 months prep' },
                            { step: 3, title: 'Gain ICU Experience', desc: 'Work in an intensive care unit as a registered nurse', time: '1-2 years minimum' },
                            { step: 4, title: 'Apply to CRNA Programs', desc: 'Apply to COA-accredited nurse anesthesia doctoral programs', time: '6-12 months' },
                            { step: 5, title: 'Complete Doctoral Program', desc: 'Earn your DNAP or DNP in nurse anesthesia', time: '3-4 years' },
                            { step: 6, title: 'Pass the NCE', desc: 'Pass the National Certification Examination', time: '2-3 months prep' },
                        ].map((item) => (
                            <Card key={item.step}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                            {item.step}
                                        </span>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                                <Badge variant="outline">{item.time}</Badge>
                                            </div>
                                            <p className="text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 mb-8">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Total Time to Become a CRNA</p>
                        <p className="text-3xl font-bold">7-10 Years</p>
                        <p className="text-sm text-muted-foreground mt-1">from starting BSN to certification</p>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button asChild>
                        <Link href={`/${profession}/crna/schools`}>Find CRNA Schools <ArrowRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}/crna/salary`}>CRNA Salary Data</Link>
                    </Button>
                </div>
            </main>
        );
    }

    // Main CRNA hub page
    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Stethoscope className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        CRNA (Nurse Anesthetist)
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                    Certified Registered Nurse Anesthetist - One of the highest-paying and most prestigious nursing specialties
                </p>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
                <Card>
                    <CardContent className="p-4 text-center">
                        <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <p className="text-sm text-muted-foreground">Avg. Salary</p>
                        <p className="text-xl font-bold">$203,090</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-muted-foreground">Job Growth</p>
                        <p className="text-xl font-bold">45%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm text-muted-foreground">Education</p>
                        <p className="text-xl font-bold">Doctoral</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Award className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                        <p className="text-sm text-muted-foreground">ICU Required</p>
                        <p className="text-xl font-bold">1+ Years</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Navigation */}
            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Explore CRNA Topics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link href={`/${profession}/crna/how-to-become`} className="p-4 rounded-lg border hover:bg-muted transition-colors">
                            <GraduationCap className="w-6 h-6 mb-2 text-primary" />
                            <h3 className="font-semibold">How to Become a CRNA</h3>
                            <p className="text-sm text-muted-foreground">Step-by-step career guide</p>
                        </Link>
                        <Link href={`/${profession}/crna/salary`} className="p-4 rounded-lg border hover:bg-muted transition-colors">
                            <DollarSign className="w-6 h-6 mb-2 text-primary" />
                            <h3 className="font-semibold">CRNA Salary</h3>
                            <p className="text-sm text-muted-foreground">Salary by state & experience</p>
                        </Link>
                        <Link href={`/${profession}/crna/schools`} className="p-4 rounded-lg border hover:bg-muted transition-colors">
                            <GraduationCap className="w-6 h-6 mb-2 text-primary" />
                            <h3 className="font-semibold">CRNA Schools</h3>
                            <p className="text-sm text-muted-foreground">Find accredited programs</p>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Overview */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">What is a CRNA?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                    A Certified Registered Nurse Anesthetist (CRNA) is an advanced practice registered nurse (APRN) who
                    specializes in administering anesthesia. CRNAs provide the same anesthesia services as physician
                    anesthesiologists, including general anesthesia, regional anesthesia, and sedation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    CRNAs are the primary anesthesia providers in rural America and work in every setting where anesthesia
                    is delivered: hospitals, surgical centers, dental offices, pain clinics, and more.
                </p>
            </section>

            {/* Why Become a CRNA */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Why Become a CRNA?</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { title: 'Highest Paying Nursing Specialty', desc: 'Average salary over $200,000' },
                        { title: 'Autonomous Practice', desc: 'Full practice authority in many states' },
                        { title: 'High Demand', desc: '45% projected job growth' },
                        { title: 'Diverse Work Settings', desc: 'Hospitals, surgery centers, offices' },
                        { title: 'Work-Life Balance', desc: 'Flexible scheduling options' },
                        { title: 'Prestige', desc: 'Elite advanced practice specialty' },
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

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Ready to Start Your CRNA Journey?
                    </h2>
                    <p className="text-blue-100 mb-6">
                        Learn exactly what it takes to become a nurse anesthetist
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary">
                            <Link href={`/${profession}/crna/how-to-become`}>
                                View Career Path
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                            <Link href={urls.jobs}>
                                Browse RN Jobs
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
