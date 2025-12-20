import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, DollarSign, Clock, MapPin, ArrowRight, GraduationCap, Gift, Briefcase } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';
import { getContentYear } from '@/lib/date-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        type?: string[];  // [[...type]] -> can be [], ['free'], ['paid'], ['online']
    };
}

const TRAINING_TYPES = {
    'free': {
        title: 'Free CNA Training',
        description: 'No-cost training programs and scholarships',
        icon: Gift,
        searchVolume: '22,200+'
    },
    'paid': {
        title: 'Paid CNA Training',
        description: 'Jobs that pay for your CNA certification',
        icon: DollarSign,
        searchVolume: '10,000+'
    },
    'online': {
        title: 'Online CNA Training',
        description: 'Flexible online certification programs',
        icon: BookOpen,
        searchVolume: '90,500+'
    },
    'accelerated': {
        title: 'Accelerated CNA Training',
        description: 'Fast-track programs (4-8 weeks)',
        icon: Clock,
        searchVolume: '2,900+'
    },
};

// US State codes for location navigation
const US_STATE_CODES = [
    'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
    'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
    'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
    'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
    'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, type } = await params;
    const trainingType = type?.[0];
    const trainingMeta = trainingType && TRAINING_TYPES[trainingType as keyof typeof TRAINING_TYPES];

    const currentYear = getContentYear();
    let title, description, urlPath;

    if (trainingMeta) {
        title = `${trainingMeta.title} Programs ${currentYear} | CNA Certification`;
        description = `Find ${trainingMeta.title.toLowerCase()} programs near you. ${trainingMeta.description}. Start your CNA career today.`;
        urlPath = `/${profession}/training/${trainingType}`;
    } else {
        title = `CNA Training Programs ${currentYear}: Classes & Certification`;
        description = `Find CNA training programs near you. Compare free, paid, online, and accelerated options. Get certified in 4-12 weeks.`;
        urlPath = `/${profession}/training`;
    }

    return {
        title,
        description,
        alternates: { canonical: `https://medicalcareercenter.org${urlPath}` },
    };
}

export default async function TrainingPage({ params }: PageProps) {
    const { profession, type } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);

    const trainingType = type?.[0];
    const trainingMeta = trainingType && TRAINING_TYPES[trainingType as keyof typeof TRAINING_TYPES];

    // Only show for CNA
    if (profession !== 'cna') {
        notFound();
    }

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: { professionName: true }
    });

    if (!careerGuide) notFound();

    // Get states for location navigation
    const states = await prisma.location.findMany({
        where: { city: '' },
        select: { state: true, stateName: true },
        take: 20
    });

    // Build breadcrumb
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
    ];

    if (trainingMeta) {
        breadcrumbItems.push({ label: 'Training', href: `/${profession}/training` });
        breadcrumbItems.push({ label: trainingMeta.title });
    } else {
        breadcrumbItems.push({ label: 'Training' });
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {trainingMeta ? trainingMeta.title : 'CNA Training Programs'}
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                    {trainingMeta ? trainingMeta.description : 'Find certified nursing assistant training programs and start your healthcare career'}
                </p>
            </div>

            {/* Training Type Navigation */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-lg">Browse by Training Type</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                        {Object.entries(TRAINING_TYPES).map(([slug, meta]) => {
                            const Icon = meta.icon;
                            const isActive = trainingType === slug;
                            return (
                                <Link
                                    key={slug}
                                    href={`/${profession}/training/${slug}`}
                                    className={`p-4 rounded-lg border transition-colors ${isActive
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 mb-2 ${isActive ? '' : 'text-primary'}`} />
                                    <h3 className="font-semibold text-sm mb-1">{meta.title.replace('CNA ', '')}</h3>
                                    <p className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                        {meta.searchVolume} searches
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                    {trainingType && (
                        <div className="mt-4 pt-4 border-t">
                            <Link href={`/${profession}/training`} className="text-sm text-primary hover:underline">
                                ← View all training options
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Training Overview */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">CNA Training Requirements</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                            <p className="text-2xl font-bold">75-180</p>
                            <p className="text-sm text-muted-foreground">Training Hours Required</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                            <p className="text-2xl font-bold">16-40</p>
                            <p className="text-sm text-muted-foreground">Clinical Hours</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <GraduationCap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                            <p className="text-2xl font-bold">4-12</p>
                            <p className="text-sm text-muted-foreground">Weeks to Complete</p>
                        </CardContent>
                    </Card>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                    CNA training programs typically include both classroom instruction and hands-on clinical experience.
                    Training hours vary by state, with most requiring 75-180 total hours. After completing training,
                    you'll need to pass a state competency exam to become certified.
                </p>
            </section>

            {/* Training Type Specific Content */}
            {trainingType === 'free' && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">How to Get Free CNA Training</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: 'Nursing Homes', desc: 'Many nursing facilities offer free training in exchange for a work commitment' },
                            { title: 'Community Colleges', desc: 'Some offer free programs through workforce development grants' },
                            { title: 'Red Cross', desc: 'Offers training programs with scholarship opportunities' },
                            { title: 'Hospitals', desc: 'Some hospital systems train CNAs for free with employment agreements' },
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
            )}

            {trainingType === 'paid' && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Jobs That Pay for CNA Training</h2>
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Briefcase className="w-8 h-8 text-green-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-2">Earn While You Learn</h3>
                                    <p className="text-muted-foreground">
                                        Many healthcare employers offer paid CNA training where you get paid while you learn.
                                        In exchange, you typically commit to working for them for 6-12 months after certification.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Button asChild>
                        <Link href={urls.jobs}>
                            Browse Paid Training CNA Jobs <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </section>
            )}

            {/* Browse by Location */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Find Training Near You
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {states.map((loc) => (
                            <Link
                                key={loc.state}
                                href={`/${profession}/schools/${loc.state.toLowerCase()}`}
                                className="px-3 py-1.5 rounded-full border text-sm hover:bg-muted transition-colors"
                            >
                                {loc.stateName || loc.state}
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
                <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-4">
                        Explore CNA programs and launch your healthcare career
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild>
                            <Link href={urls.schools}>
                                Find Schools <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={`/${profession}/practice-test`}>Practice Test</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Related Resources */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More CNA Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                    <Link href={`/${profession}/practice-test`} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Practice Test</p>
                    </Link>
                    <Link href={`/${profession}/registry`} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">CNA Registry</p>
                    </Link>
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
