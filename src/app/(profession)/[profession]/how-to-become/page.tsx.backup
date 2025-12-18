import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    DollarSign,
    GraduationCap,
    Briefcase,
    TrendingUp,
    MapPin,
    Award,
    BookOpen,
    Users,
    FileText
} from 'lucide-react';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

export default async function CareerGuideArticlePage({ params }: PageProps) {
    const { profession } = await params;
    // Convert URL slug (singular) to DB slug (plural)
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);

    // Fetch career guide using database slug
    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
    });

    if (!careerGuide) {
        notFound();
    }

    // Fetch job count for CTAs
    const jobCount = await prisma.job.count({
        where: { careerKeyword: dbSlug },
    });

    const keyStats = careerGuide.keyStats as any;
    const dailyTasks = careerGuide.dailyTasks as string[];
    const specializations = careerGuide.specializations as Array<{ name: string; description: string }>;
    const workEnvironments = careerGuide.workEnvironments as string[];
    const topPayingStates = careerGuide.topPayingStates as Array<{ state: string; salary: string }>;
    const benefits = careerGuide.benefits as string[];
    const requiredDegrees = careerGuide.requiredDegrees as Array<{ degree: string; description: string }>;
    const certifications = careerGuide.certifications as Array<{ name: string; issuer: string; description: string }>;
    const technicalSkills = careerGuide.technicalSkills as string[];
    const softSkills = careerGuide.softSkills as string[];
    const technologies = careerGuide.technologies as string[];
    const emergingSpecializations = careerGuide.emergingSpecializations as string[];
    const careerLadder = careerGuide.careerLadder as Array<{ level: string; title: string; description: string }>;
    const topSchools = careerGuide.topSchools as Array<{ name: string; location: string; programType: string }>;
    const programTypes = careerGuide.programTypes as Array<{ type: string; description: string }>;
    const stateRequirements = careerGuide.stateRequirements as Record<string, { required: boolean; details: string }>;
    const examInfo = careerGuide.examInfo as Array<{ examName: string; description: string }>;
    const featuredEmployers = careerGuide.featuredEmployers as string[];
    const resumeKeywords = careerGuide.resumeKeywords as string[];

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            {/* Breadcrumbs */}
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerGuide.professionName, href: `/${profession}` },
                    { label: 'Career Guide' }
                ]}
                className="mb-6"
            />

            {/* H1 Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {careerGuide.professionName} Career Guide: Salary, Education & How to Become One in 2025
            </h1>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Median Salary</p>
                    <p className="text-xl font-bold">{keyStats.medianSalary}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Job Growth</p>
                    <p className="text-xl font-bold">{keyStats.jobGrowth}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Open Jobs</p>
                    <p className="text-xl font-bold">{jobCount.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Timeline</p>
                    <p className="text-xl font-bold">{careerGuide.timeline}</p>
                </div>
            </div>

            {/* Overview Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-4">Overview</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {careerGuide.overview}
                </p>
            </section>

            {/* Conversion Element #1 */}
            <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                🎯 Find {careerGuide.professionName} Jobs Near You
                            </h3>
                            <p className="text-muted-foreground">
                                {jobCount.toLocaleString()} open positions available nationwide
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={urls.jobs}>
                                View Jobs
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* What Does [Profession] Do? */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">What Does a {careerGuide.professionName} Do?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {careerGuide.rolesDescription}
                </p>

                <h3 className="text-xl font-semibold mb-4">Daily Tasks & Responsibilities</h3>
                <ul className="space-y-3 mb-8">
                    {dailyTasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <span className="text-primary font-bold mt-1">•</span>
                            <span className="text-muted-foreground">{task}</span>
                        </li>
                    ))}
                </ul>

                {specializations.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Specializations</h3>
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {specializations.map((spec, idx) => (
                                <Card key={idx}>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">{spec.name}</h4>
                                        <p className="text-sm text-muted-foreground">{spec.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                <h3 className="text-xl font-semibold mb-4">Work Environments</h3>
                <div className="flex flex-wrap gap-2">
                    {workEnvironments.map((env, idx) => (
                        <Badge key={idx} variant="secondary">{env}</Badge>
                    ))}
                </div>
            </section>

            {/* Salary Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    {careerGuide.professionName} Salary: Earnings Data
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {careerGuide.salaryOverview}
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">National Average</p>
                            <p className="text-3xl font-bold text-green-600">{careerGuide.nationalAverage}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Entry Level</p>
                            <p className="text-2xl font-bold">{careerGuide.entryLevelRange}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Experienced</p>
                            <p className="text-2xl font-bold">{careerGuide.experiencedRange}</p>
                        </CardContent>
                    </Card>
                </div>

                <h3 className="text-xl font-semibold mb-4">Top-Paying States</h3>
                <div className="grid md:grid-cols-2 gap-3 mb-8">
                    {topPayingStates.map((state, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span className="font-medium">{state.state}</span>
                            <span className="text-green-600 font-bold">{state.salary}</span>
                        </div>
                    ))}
                </div>

                <h3 className="text-xl font-semibold mb-4">Common Benefits</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                    {benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            <span className="text-muted-foreground">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Conversion Element #2 - After Salary */}
            <Card className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                💰 Compare Salaries in Your State
                            </h3>
                            <p className="text-muted-foreground">
                                View detailed salary data by city and experience level
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href={urls.salary}>
                                View Salary Data
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Education & Certification Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                    How to Become a {careerGuide.professionName}: Education & Certification
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {careerGuide.educationPath}
                </p>

                <h3 className="text-xl font-semibold mb-4">Required Degrees/Certifications</h3>
                <div className="space-y-4 mb-8">
                    {requiredDegrees.map((degree, idx) => (
                        <Card key={idx}>
                            <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">{degree.degree}</h4>
                                <p className="text-sm text-muted-foreground">{degree.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {certifications.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Professional Certifications</h3>
                        <div className="space-y-4 mb-8">
                            {certifications.map((cert, idx) => (
                                <Card key={idx}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold">{cert.name}</h4>
                                            <Badge variant="outline">{cert.issuer}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{cert.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {careerGuide.accreditedPrograms && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
                        <h4 className="font-semibold mb-2">Finding Accredited Programs</h4>
                        <p className="text-sm text-muted-foreground">{careerGuide.accreditedPrograms}</p>
                    </div>
                )}
            </section>

            {/* Skills Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Top Skills Needed for {careerGuide.professionName} Careers</h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {technicalSkills.map((skill, idx) => (
                                <Badge key={idx} variant="default">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Soft Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {softSkills.map((skill, idx) => (
                                <Badge key={idx} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Technologies & Tools</h3>
                <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline">{tech}</Badge>
                    ))}
                </div>
            </section>

            {/* Job Outlook Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    Job Outlook: Growth and Advancement Opportunities
                </h2>
                <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg mb-6">
                    <p className="text-lg font-semibold mb-2">Growth Rate: {careerGuide.growthRate}</p>
                    <p className="text-muted-foreground">{careerGuide.projections}</p>
                </div>

                {emergingSpecializations.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Emerging Specializations</h3>
                        <ul className="space-y-2 mb-8">
                            {emergingSpecializations.map((spec, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">→</span>
                                    <span className="text-muted-foreground">{spec}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <h3 className="text-xl font-semibold mb-4">Career Ladder</h3>
                <div className="space-y-4">
                    {careerLadder.map((level, idx) => (
                        <Card key={idx}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge>{level.level}</Badge>
                                    <h4 className="font-semibold">{level.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{level.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Schools & Programs Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Best Schools & Training Programs for {careerGuide.professionName}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {careerGuide.schoolsOverview}
                </p>

                <h3 className="text-xl font-semibold mb-4">Top Programs</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {topSchools.map((school, idx) => (
                        <Card key={idx}>
                            <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">{school.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {school.location}
                                    </span>
                                    <Badge variant="outline" className="text-xs">{school.programType}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <h3 className="text-xl font-semibold mb-4">Program Types</h3>
                <div className="space-y-3 mb-8">
                    {programTypes.map((type, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                            <span className="font-semibold min-w-[120px]">{type.type}:</span>
                            <span className="text-muted-foreground">{type.description}</span>
                        </div>
                    ))}
                </div>

                {careerGuide.financialAid && (
                    <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg">
                        <h4 className="font-semibold mb-2">Financial Aid & Scholarships</h4>
                        <p className="text-sm text-muted-foreground">{careerGuide.financialAid}</p>
                    </div>
                )}
            </section>

            {/* Licensing Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Licensing Requirements by State</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {careerGuide.licensingOverview}
                </p>

                <h3 className="text-xl font-semibold mb-4">State-Specific Requirements</h3>
                <div className="space-y-3 mb-8">
                    {Object.entries(stateRequirements).map(([state, req]) => (
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

                {examInfo.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Certification Exams</h3>
                        <div className="space-y-3 mb-8">
                            {examInfo.map((exam, idx) => (
                                <Card key={idx}>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">{exam.examName}</h4>
                                        <p className="text-sm text-muted-foreground">{exam.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {careerGuide.renewalProcess && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg">
                        <h4 className="font-semibold mb-2">Renewal Process</h4>
                        <p className="text-sm text-muted-foreground">{careerGuide.renewalProcess}</p>
                    </div>
                )}
            </section>

            {/* Current Job Opportunities Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-orange-600" />
                    Current {careerGuide.professionName} Job Opportunities
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {careerGuide.jobMarketOverview}
                </p>

                <h3 className="text-xl font-semibold mb-4">Featured Employers</h3>
                <div className="grid md:grid-cols-3 gap-3 mb-8">
                    {featuredEmployers.map((employer, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg text-center font-medium">
                            {employer}
                        </div>
                    ))}
                </div>

                <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200">
                    <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-semibold mb-2">
                            Apply Now: {jobCount.toLocaleString()}+ {careerGuide.professionName} Roles
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Browse current openings and start your application today
                        </p>
                        <Button asChild size="lg">
                            <Link href={urls.jobs}>
                                View All Jobs →
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>

            {/* Interview & Resume Tips Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-600" />
                    Interview Prep & Resume Tips for {careerGuide.professionName}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {careerGuide.interviewTips}
                </p>

                <h3 className="text-xl font-semibold mb-4">Resume Keywords to Include</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                    {resumeKeywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary">{keyword}</Badge>
                    ))}
                </div>

                {careerGuide.portfolioTips && (
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 p-6 rounded-lg">
                        <h4 className="font-semibold mb-2">Portfolio Tips</h4>
                        <p className="text-sm text-muted-foreground">{careerGuide.portfolioTips}</p>
                    </div>
                )}
            </section>

            {/* Final CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardContent className="p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Launch Your {careerGuide.professionName} Career?
                    </h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Take the next step in your healthcare career journey. Explore jobs, compare salaries, and find the right path for you.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary">
                            <Link href={urls.jobs}>
                                Browse {jobCount.toLocaleString()}+ Jobs
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                            <Link href={urls.salary}>
                                View Salary Data
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Back to Hub */}
            <div className="mt-8 text-center">
                <Link href={`/${profession}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to {careerGuide.professionName} Hub
                </Link>
            </div>
        </main>
    );
}
