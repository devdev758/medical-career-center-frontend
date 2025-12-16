import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: { profession: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession } = await params;
    const careerTitle = formatSlugForDisplay(profession);

    return {
        title: `${careerTitle} Career Path & Advancement Opportunities | Medical Career Center`,
        description: `Explore ${careerTitle.toLowerCase()} career paths from entry-level to advanced practice. Learn about specializations, advancement opportunities, and salary progression.`,
        alternates: { canonical: `https://medicalcareercenter.org/${profession}/career-path` },
    };
}

export default async function CareerPathPage({ params }: PageProps) {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: {
            professionName: true,
            careerLadder: true,
            emergingSpecializations: true,
            projections: true,
            growthRate: true,
            careerPathContent: true,
        }
    });

    if (!careerGuide) notFound();

    const careerLadder = (careerGuide.careerLadder as any[]) || [];
    const emergingSpecs = (careerGuide.emergingSpecializations as string[]) || [];

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={[
                { label: 'Home', href: '/' },
                { label: careerGuide.professionName, href: `/${profession}` },
                { label: 'Career Path' }
            ]} className="mb-6" />

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {careerTitle} Career Path
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
                Explore advancement opportunities and career progression
            </p>

            {/* Job Outlook */}
            {careerGuide.growthRate && (
                <Card className="mb-8 bg-purple-50 dark:bg-purple-950/20 border-purple-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                            <span className="text-lg font-semibold">Growth Rate: {careerGuide.growthRate}</span>
                        </div>
                        {careerGuide.projections && (
                            <p className="text-muted-foreground">{careerGuide.projections}</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Career Ladder */}
            {careerLadder.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Career Ladder</h2>
                    <div className="space-y-4">
                        {careerLadder.map((level: any, idx: number) => (
                            <Card key={idx}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge>{level.level}</Badge>
                                        <h3 className="font-semibold">{level.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{level.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Emerging Specializations */}
            {emergingSpecs.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Emerging Specializations</h2>
                    <ul className="space-y-2">
                        {emergingSpecs.map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">→</span>
                                <span className="text-muted-foreground">{spec}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.specializations} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Specializations</p>
                    </Link>
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Browse Jobs</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
