import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Clock, Calendar, Sun } from 'lucide-react';
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
        title: `${careerTitle} Work-Life Balance: Hours, Schedules & Lifestyle | Medical Career Center`,
        description: `Learn about ${careerTitle.toLowerCase()} work schedules, typical hours, and work-life balance. Understand shift work, flexible schedules, and lifestyle considerations.`,
        alternates: { canonical: `https://medicalcareercenter.org/${profession}/work-life-balance` },
    };
}

export default async function WorkLifeBalancePage({ params }: PageProps) {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: {
            professionName: true,
            workEnvironments: true,
            workLifeBalanceContent: true,
        }
    });

    if (!careerGuide) notFound();

    const workEnvironments = (careerGuide.workEnvironments as string[]) || [];

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={[
                { label: 'Home', href: '/' },
                { label: careerGuide.professionName, href: `/${profession}` },
                { label: 'Work-Life Balance' }
            ]} className="mb-6" />

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {careerTitle} Work-Life Balance
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
                Understanding schedules, hours, and lifestyle as a {careerTitle.toLowerCase()}
            </p>

            {/* Key Considerations */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-6 h-6 text-primary" />
                            <h3 className="font-semibold text-lg">Typical Hours</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Most nurses work 12-hour shifts, with options for day, evening, or night rotations.
                            This usually means working 3 days per week, allowing for extended time off.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Calendar className="w-6 h-6 text-primary" />
                            <h3 className="font-semibold text-lg">Scheduling Flexibility</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Many facilities offer flexible scheduling, self-scheduling, or per-diem options.
                            Part-time, PRN, and travel nursing provide additional flexibility.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Sun className="w-6 h-6 text-primary" />
                            <h3 className="font-semibold text-lg">Remote Options</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Telehealth, case management, and insurance nursing offer work-from-home opportunities.
                            These roles typically have more traditional 9-5 schedules.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Heart className="w-6 h-6 text-primary" />
                            <h3 className="font-semibold text-lg">Self-Care</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Nursing can be physically and emotionally demanding.
                            Prioritizing rest, exercise, and mental health is essential for long-term career success.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Work Environments */}
            {workEnvironments.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Work Environments</h2>
                    <p className="text-muted-foreground mb-4">
                        {careerTitle}s work in various settings, each with different scheduling and lifestyle considerations:
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {workEnvironments.map((env, idx) => (
                            <div key={idx} className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">
                                {env}
                            </div>
                        ))}
                    </div>
                </section>
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
                    <Link href={urls.careerPath} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Path</p>
                    </Link>
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Browse Jobs</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
