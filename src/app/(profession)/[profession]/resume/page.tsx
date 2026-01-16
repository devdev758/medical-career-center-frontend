import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { getProfessionUrls } from '@/lib/url-utils';
import { validateProfession, getProfessionDisplayName } from '@/lib/profession-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RN_RESUME_GUIDE_CONTENT } from '@/lib/resume-content';

interface PageProps {
    params: Promise<{ profession: string; path?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession } = await params;
    const isValid = await validateProfession(profession);
    if (!isValid) return { title: 'Not Found' };
    
    const displayName = await getProfessionDisplayName(profession);
    return {
        title: `${displayName} Resume Guide & Examples`,
        description: `Professional resume guide and examples for ${displayName} professionals.`,
        alternates: { canonical: `https://medicalcareercenter.org/${profession}/resume` },
    };
}

export default async function ResumePage({ params }: PageProps) {
    const { profession } = await params;
    const isValid = await validateProfession(profession);
    if (!isValid) notFound();

    const displayName = await getProfessionDisplayName(profession);
    const urls = getProfessionUrls(profession);

    // Placeholder for non-RN professions
    if (profession !== 'registered-nurse') {
        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={[
                    { label: 'Home', href: '/' },
                    { label: displayName, href: `/${profession}` },
                    { label: 'Resume Guide' }
                ]} className="mb-6" />
                
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayName} Resume Guide</h1>
                    <p className="text-xl text-muted-foreground">Professional resume resources coming soon</p>
                </div>

                <QuickNavigation profession={profession} />

                <Card className="mt-8">
                    <CardContent className="pt-8">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{displayName} Resume Resources</h2>
                                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                    Comprehensive resume guides, templates, and examples for {displayName} professionals are coming soon.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button asChild>
                                    <Link href={urls.salary}>
                                        View Salary Data
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={urls.jobs}>
                                        Browse Jobs
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={urls.schools}>
                                        Find Programs
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // Full RN content
    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={[
                { label: 'Home', href: '/' },
                { label: displayName, href: `/${profession}` },
                { label: 'Resume Guide' }
            ]} className="mb-6" />
            
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Registered Nurse Resume Guide</h1>
                <p className="text-xl text-muted-foreground">Expert tips to create a standout nursing resume</p>
            </div>

            <QuickNavigation profession={profession} />

            <article className="prose prose-lg dark:prose-invert max-w-none mt-8">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {RN_RESUME_GUIDE_CONTENT}
                </ReactMarkdown>
            </article>
        </main>
    );
}
