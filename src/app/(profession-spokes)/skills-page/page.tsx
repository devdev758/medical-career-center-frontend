import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, CheckCircle, TrendingUp, BookOpen, DollarSign, Briefcase } from 'lucide-react';
import { Breadcrumb, getProfessionBreadcrumbs } from '@/components/ui/breadcrumb';
import { SpokeNavigation } from '@/components/profession/SpokeNavigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        profession?: string;
    };
}

function formatCareerTitle(slug: string): string {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    return {
        title: `${careerTitle} Skills Guide 2025: Essential & Technical Skills`,
        description: `Essential skills for ${careerTitle.toLowerCase()}s. Technical skills, soft skills, and how to develop them for career success.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}-skills`
        },
    };
}

export default async function SkillsPage({ searchParams }: PageProps) {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerTitle, href: `/${profession}` },
                    { label: 'Skills Guide' }
                ]}
                className="mb-6"
            />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Essential Skills for {careerTitle}s
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Master the technical and soft skills needed to excel in your career and advance to higher positions.
                </p>
            </div>

            <SpokeNavigation profession={profession} currentSpoke="skills" />

            <div className="grid md:grid-cols-2 gap-8 my-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Technical Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Clinical Procedures</strong>
                                    <p className="text-sm text-muted-foreground">Hands-on patient care techniques and protocols</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Medical Equipment</strong>
                                    <p className="text-sm text-muted-foreground">Operation and maintenance of specialized tools</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Electronic Health Records (EHR)</strong>
                                    <p className="text-sm text-muted-foreground">Digital documentation and record management</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Medical Terminology</strong>
                                    <p className="text-sm text-muted-foreground">Professional healthcare vocabulary</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Safety Protocols</strong>
                                    <p className="text-sm text-muted-foreground">HIPAA, infection control, and patient safety</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Soft Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Communication</strong>
                                    <p className="text-sm text-muted-foreground">Clear interaction with patients and team members</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Critical Thinking</strong>
                                    <p className="text-sm text-muted-foreground">Quick decision-making in complex situations</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Empathy & Compassion</strong>
                                    <p className="text-sm text-muted-foreground">Understanding and supporting patient needs</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Time Management</strong>
                                    <p className="text-sm text-muted-foreground">Prioritizing tasks in fast-paced environments</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Teamwork</strong>
                                    <p className="text-sm text-muted-foreground">Collaboration with healthcare professionals</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>How to Develop These Skills</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3">Education & Training</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Formal education programs</li>
                                <li>• Continuing education courses</li>
                                <li>• Professional certifications</li>
                                <li>• Workshops and seminars</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">On-the-Job Experience</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Clinical rotations</li>
                                <li>• Mentorship programs</li>
                                <li>• Cross-training opportunities</li>
                                <li>• Volunteer work</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Self-Directed Learning</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Online courses and webinars</li>
                                <li>• Professional journals</li>
                                <li>• Industry conferences</li>
                                <li>• Peer learning groups</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Ready to Advance Your Skills?</h2>
                <p className="text-muted-foreground mb-6">
                    Explore training programs, certifications, and career opportunities for {careerTitle.toLowerCase()}s.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={`/${profession}-schools`}>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Find Training
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}-certification`}>
                            Certifications
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}-jobs`}>
                            <Briefcase className="w-4 h-4 mr-2" />
                            Browse Jobs
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                <p>
                    <Link href={`/${profession}`} className="text-primary hover:underline">
                        ← Back to {careerTitle} Hub
                    </Link>
                </p>
            </div>
        </main>
    );
}
