import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, CheckCircle, AlertTriangle, Briefcase, DollarSign } from 'lucide-react';
import { Breadcrumb, getProfessionBreadcrumbs } from '@/components/ui/breadcrumb';
import { SpokeNavigation } from '@/components/profession/SpokeNavigation';
import { RelatedProfessions } from '@/components/profession/RelatedProfessions';
import { CrossPageLinks } from '@/components/profession/CrossPageLinks';

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
        title: `${careerTitle} Resume Examples & Templates 2025: Get Hired Faster`,
        description: `Professional ${careerTitle.toLowerCase()} resume examples and templates. Keywords to include, common mistakes to avoid, and ATS optimization tips.`,
        alternates: {
            canonical: `https://medicalcareercenter.org/${profession}-resume`
        },
    };
}

export default async function ResumePage({ searchParams }: PageProps) {
    const profession = searchParams.profession || 'registered-nurses';
    const careerTitle = formatCareerTitle(profession);

    const resumeKeywords = [
        "Patient care", "Clinical skills", "Medical terminology", "Healthcare protocols",
        "Electronic health records (EHR)", "HIPAA compliance", "Team collaboration",
        "Critical thinking", "Time management", "Communication skills"
    ];

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: careerTitle, href: `/${profession}` },
                    { label: 'Resume Examples' }
                ]}
                className="mb-6"
            />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {careerTitle} Resume Examples & Templates
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Professional resume examples, templates, and expert tips to help you create a standout resume and land more interviews.
                </p>
            </div>

            <SpokeNavigation profession={profession} currentSpoke="resume" />

            <div className="grid md:grid-cols-3 gap-6 my-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Entry-Level Resume</CardTitle>
                        <Badge variant="secondary">0-2 years experience</Badge>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Perfect for recent graduates and those new to the field. Emphasizes education, clinical rotations, and transferable skills.
                        </p>
                        <div className="bg-muted p-4 rounded-lg text-sm mb-4">
                            <p className="font-semibold mb-2">Key Sections:</p>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Education & Certifications</li>
                                <li>• Clinical Experience</li>
                                <li>• Relevant Skills</li>
                                <li>• Volunteer Work</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Mid-Career Resume</CardTitle>
                        <Badge variant="secondary">3-7 years experience</Badge>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Highlights professional achievements, specialized skills, and career progression.
                        </p>
                        <div className="bg-muted p-4 rounded-lg text-sm mb-4">
                            <p className="font-semibold mb-2">Key Sections:</p>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Professional Summary</li>
                                <li>• Work Experience</li>
                                <li>• Specializations</li>
                                <li>• Achievements</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Senior-Level Resume</CardTitle>
                        <Badge variant="secondary">8+ years experience</Badge>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Showcases leadership experience, advanced certifications, and significant contributions to the field.
                        </p>
                        <div className="bg-muted p-4 rounded-lg text-sm mb-4">
                            <p className="font-semibold mb-2">Key Sections:</p>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Executive Summary</li>
                                <li>• Leadership Experience</li>
                                <li>• Publications & Presentations</li>
                                <li>• Professional Affiliations</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Resume Best Practices
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3 text-green-600">✓ Do This:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Use action verbs (managed, implemented, coordinated)</li>
                                <li>• Quantify achievements with numbers and percentages</li>
                                <li>• Tailor resume to each job posting</li>
                                <li>• Keep it to 1-2 pages maximum</li>
                                <li>• Use a clean, professional format</li>
                                <li>• Include relevant keywords from job description</li>
                                <li>• Proofread carefully for errors</li>
                                <li>• Use consistent formatting throughout</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 text-red-600">✗ Avoid This:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Using generic objective statements</li>
                                <li>• Including irrelevant work experience</li>
                                <li>• Listing duties instead of achievements</li>
                                <li>• Using unprofessional email addresses</li>
                                <li>• Including personal information (age, photo, marital status)</li>
                                <li>• Using fancy fonts or colors</li>
                                <li>• Leaving unexplained employment gaps</li>
                                <li>• Making it longer than necessary</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Keywords to Include</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Include these industry-specific keywords to pass Applicant Tracking Systems (ATS) and catch recruiters' attention:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {resumeKeywords.map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="text-sm">
                                {keyword}
                            </Badge>
                        ))}
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mt-6">
                        <p className="text-sm font-semibold mb-2">ATS Optimization Tips:</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Use standard section headings (Experience, Education, Skills)</li>
                            <li>• Avoid tables, text boxes, and graphics</li>
                            <li>• Save as .docx or PDF format</li>
                            <li>• Include both acronyms and full terms (RN and Registered Nurse)</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Cover Letter Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            A strong cover letter complements your resume and gives you a chance to explain why you're the perfect fit.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Structure:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Opening: State the position and how you found it</li>
                                    <li>• Body: Highlight 2-3 key qualifications</li>
                                    <li>• Closing: Express enthusiasm and request interview</li>
                                    <li>• Keep it to one page</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Content Tips:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Address hiring manager by name if possible</li>
                                    <li>• Show knowledge of the organization</li>
                                    <li>• Explain gaps or career changes</li>
                                    <li>• Match your skills to their needs</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Ready to Apply?</h2>
                <p className="text-muted-foreground mb-6">
                    Browse current {careerTitle.toLowerCase()} job openings and prepare for your interview.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={`/${profession}-jobs`}>
                            <Briefcase className="w-4 h-4 mr-2" />
                            Browse Jobs
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}-interview-questions`}>
                            Interview Prep
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${profession}-salary`}>
                            <DollarSign className="w-4 h-4 mr-2" />
                            Salary Data
                        </Link>
                    </Button>
                </div>
            </div>


            {/* Related Professions */}
            <RelatedProfessions 
                profession={profession}
                currentPageType="resume"
                maxItems={6}
                className="mb-12"
            />

            {/* Cross-Page Links */}
            <CrossPageLinks
                profession={profession}
                currentPage="resume"
                className="mb-12"
            />

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
