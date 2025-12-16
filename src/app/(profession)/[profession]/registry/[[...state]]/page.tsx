import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, ExternalLink, ArrowRight, Shield } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForDisplay, getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        state?: string[];  // [[...state]] -> can be [], ['california'], ['texas'], etc.
    };
}

// US States for registry pages
const US_STATES: Record<string, { name: string; abbr: string; registryUrl?: string }> = {
    'alabama': { name: 'Alabama', abbr: 'AL' },
    'alaska': { name: 'Alaska', abbr: 'AK' },
    'arizona': { name: 'Arizona', abbr: 'AZ' },
    'arkansas': { name: 'Arkansas', abbr: 'AR' },
    'california': { name: 'California', abbr: 'CA', registryUrl: 'https://www.cdph.ca.gov/CNATP' },
    'colorado': { name: 'Colorado', abbr: 'CO' },
    'connecticut': { name: 'Connecticut', abbr: 'CT' },
    'delaware': { name: 'Delaware', abbr: 'DE' },
    'florida': { name: 'Florida', abbr: 'FL' },
    'georgia': { name: 'Georgia', abbr: 'GA' },
    'hawaii': { name: 'Hawaii', abbr: 'HI' },
    'idaho': { name: 'Idaho', abbr: 'ID' },
    'illinois': { name: 'Illinois', abbr: 'IL' },
    'indiana': { name: 'Indiana', abbr: 'IN' },
    'iowa': { name: 'Iowa', abbr: 'IA' },
    'kansas': { name: 'Kansas', abbr: 'KS' },
    'kentucky': { name: 'Kentucky', abbr: 'KY' },
    'louisiana': { name: 'Louisiana', abbr: 'LA' },
    'maine': { name: 'Maine', abbr: 'ME' },
    'maryland': { name: 'Maryland', abbr: 'MD' },
    'massachusetts': { name: 'Massachusetts', abbr: 'MA' },
    'michigan': { name: 'Michigan', abbr: 'MI' },
    'minnesota': { name: 'Minnesota', abbr: 'MN' },
    'mississippi': { name: 'Mississippi', abbr: 'MS' },
    'missouri': { name: 'Missouri', abbr: 'MO' },
    'montana': { name: 'Montana', abbr: 'MT' },
    'nebraska': { name: 'Nebraska', abbr: 'NE' },
    'nevada': { name: 'Nevada', abbr: 'NV' },
    'new-hampshire': { name: 'New Hampshire', abbr: 'NH' },
    'new-jersey': { name: 'New Jersey', abbr: 'NJ' },
    'new-mexico': { name: 'New Mexico', abbr: 'NM' },
    'new-york': { name: 'New York', abbr: 'NY' },
    'north-carolina': { name: 'North Carolina', abbr: 'NC' },
    'north-dakota': { name: 'North Dakota', abbr: 'ND' },
    'ohio': { name: 'Ohio', abbr: 'OH' },
    'oklahoma': { name: 'Oklahoma', abbr: 'OK' },
    'oregon': { name: 'Oregon', abbr: 'OR' },
    'pennsylvania': { name: 'Pennsylvania', abbr: 'PA' },
    'rhode-island': { name: 'Rhode Island', abbr: 'RI' },
    'south-carolina': { name: 'South Carolina', abbr: 'SC' },
    'south-dakota': { name: 'South Dakota', abbr: 'SD' },
    'tennessee': { name: 'Tennessee', abbr: 'TN' },
    'texas': { name: 'Texas', abbr: 'TX' },
    'utah': { name: 'Utah', abbr: 'UT' },
    'vermont': { name: 'Vermont', abbr: 'VT' },
    'virginia': { name: 'Virginia', abbr: 'VA' },
    'washington': { name: 'Washington', abbr: 'WA' },
    'west-virginia': { name: 'West Virginia', abbr: 'WV' },
    'wisconsin': { name: 'Wisconsin', abbr: 'WI' },
    'wyoming': { name: 'Wyoming', abbr: 'WY' },
    'district-of-columbia': { name: 'District of Columbia', abbr: 'DC' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, state } = await params;
    const careerTitle = formatSlugForDisplay(profession);
    const stateSlug = state?.[0];
    const stateInfo = stateSlug ? US_STATES[stateSlug] : null;

    const currentYear = new Date().getFullYear();
    let title, description, urlPath;

    if (stateInfo) {
        title = `${stateInfo.name} CNA Registry ${currentYear}: License Verification & Lookup`;
        description = `Search the ${stateInfo.name} CNA Registry to verify nursing assistant certifications. Find license numbers, expiration dates, and certification status.`;
        urlPath = `/${profession}/registry/${stateSlug}`;
    } else {
        title = `CNA Registry by State ${currentYear}: Nurse Aide Certification Lookup`;
        description = `Find your state's CNA registry to verify nursing assistant certifications. Search license status, renewal dates, and certification requirements by state.`;
        urlPath = `/${profession}/registry`;
    }

    return {
        title,
        description,
        alternates: { canonical: `https://medicalcareercenter.org${urlPath}` },
    };
}

export default async function RegistryPage({ params }: PageProps) {
    const { profession, state } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForDisplay(profession);

    const stateSlug = state?.[0];
    const stateInfo = stateSlug ? US_STATES[stateSlug] : null;

    // Only show for CNA
    if (profession !== 'cna') {
        notFound();
    }

    const careerGuide = await prisma.careerGuide.findUnique({
        where: { professionSlug: dbSlug },
        select: { professionName: true }
    });

    if (!careerGuide) notFound();

    // Build breadcrumb
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerGuide.professionName, href: `/${profession}` },
    ];

    if (stateInfo) {
        breadcrumbItems.push({ label: 'Registry', href: `/${profession}/registry` });
        breadcrumbItems.push({ label: stateInfo.name });
    } else {
        breadcrumbItems.push({ label: 'Registry' });
    }

    // State-specific page
    if (stateInfo) {
        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />

                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        {stateInfo.name} CNA Registry
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Verify CNA certifications and lookup license status in {stateInfo.name}
                    </p>
                </div>

                {/* Registry Info Card */}
                <Card className="mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2">{stateInfo.name} Nurse Aide Registry</h3>
                                <p className="text-muted-foreground mb-4">
                                    The {stateInfo.name} CNA Registry maintains records of all certified nursing assistants
                                    in the state. Use this registry to verify certification status, check for disciplinary actions,
                                    and confirm training completion dates.
                                </p>
                                {stateInfo.registryUrl && (
                                    <Button asChild>
                                        <Link href={stateInfo.registryUrl} target="_blank">
                                            Visit Official Registry <ExternalLink className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* What You Can Find */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">What You Can Find in the {stateInfo.name} CNA Registry</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: 'Certification Status', desc: 'Active, expired, or revoked status' },
                            { title: 'Certification Number', desc: 'Official CNA license number' },
                            { title: 'Expiration Date', desc: 'When certification needs renewal' },
                            { title: 'Training Program', desc: 'Where the CNA was trained' },
                            { title: 'Disciplinary Actions', desc: 'Any findings of abuse or neglect' },
                            { title: 'Employment Eligibility', desc: 'Whether CNA can work in facilities' },
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

                {/* Related Resources */}
                <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-4">Related {stateInfo.name} CNA Resources</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link href={`${urls.jobs}/${stateInfo.abbr.toLowerCase()}`} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                            <p className="font-medium text-sm">{stateInfo.name} Jobs</p>
                        </Link>
                        <Link href={`${urls.salary}/${stateInfo.abbr.toLowerCase()}`} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                            <p className="font-medium text-sm">{stateInfo.name} Salary</p>
                        </Link>
                        <Link href={`${urls.schools}/${stateInfo.abbr.toLowerCase()}`} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                            <p className="font-medium text-sm">{stateInfo.name} Schools</p>
                        </Link>
                        <Link href={urls.license} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                            <p className="font-medium text-sm">License Info</p>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Main registry hub page
    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Search className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        CNA Registry by State
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                    Find and verify CNA certifications through official state nurse aide registries
                </p>
            </div>

            {/* What is a CNA Registry */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-3">What is a CNA Registry?</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Each state maintains a Nurse Aide Registry as required by federal law. This registry contains
                        information about all certified nursing assistants who have completed an approved training program
                        and passed the competency evaluation. Employers must verify that CNAs are in good standing before hiring.
                    </p>
                </CardContent>
            </Card>

            {/* Browse by State */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Select Your State</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(US_STATES).map(([slug, info]) => (
                        <Link
                            key={slug}
                            href={`/${profession}/registry/${slug}`}
                            className="p-4 rounded-lg border hover:bg-muted hover:border-primary transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{info.name}</span>
                                <Badge variant="outline" className="text-xs">{info.abbr}</Badge>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Popular Searches */}
            <Card className="mb-8 bg-green-50 dark:bg-green-950/20 border-green-200">
                <CardHeader>
                    <CardTitle className="text-lg">Popular Registry Searches</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {['georgia', 'ohio', 'texas', 'california', 'north-carolina', 'minnesota', 'florida'].map(slug => (
                            <Link
                                key={slug}
                                href={`/${profession}/registry/${slug}`}
                                className="px-4 py-2 rounded-full bg-white dark:bg-background border hover:border-primary transition-colors"
                            >
                                {US_STATES[slug].name} Registry
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Related Resources */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More CNA Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.license} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">License Info</p>
                    </Link>
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">How to Become</p>
                    </Link>
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">CNA Jobs</p>
                    </Link>
                    <Link href={urls.salary} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Salary Data</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
