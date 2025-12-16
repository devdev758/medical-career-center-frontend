import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Cpu, Heart, ArrowRight } from 'lucide-react';
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
        title: `${careerTitle} Skills: Technical & Soft Skills Needed | Medical Career Center`,
        description: `Essential skills for ${careerTitle.toLowerCase()}s. Learn about technical skills, soft skills, and technologies you need to succeed in this healthcare career.`,
        alternates: { canonical: `https://medicalcareercenter.org/${profession}/skills` },
    };
}

export default async function SkillsPage({ params }: PageProps) {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: {
            professionName: true,
            technicalSkills: true,
            softSkills: true,
            technologies: true,
            skillsContent: true,
        }
    });

    if (!careerGuide) notFound();

    const technicalSkills = (careerGuide.technicalSkills as string[]) || [];
    const softSkills = (careerGuide.softSkills as string[]) || [];
    const technologies = (careerGuide.technologies as string[]) || [];

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={[
                { label: 'Home', href: '/' },
                { label: careerGuide.professionName, href: `/${profession}` },
                { label: 'Skills' }
            ]} className="mb-6" />

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {careerTitle} Skills
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
                Essential skills needed for a successful {careerTitle.toLowerCase()} career
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Technical Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {technicalSkills.map((skill, idx) => (
                                <Badge key={idx} variant="default">{skill}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-primary" />
                            Soft Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {softSkills.map((skill, idx) => (
                                <Badge key={idx} variant="outline">{skill}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {technologies.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Cpu className="w-6 h-6" />
                        Technologies & Tools
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech, idx) => (
                            <Badge key={idx} variant="secondary">{tech}</Badge>
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
                    <Link href={urls.resume} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Resume Tips</p>
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
