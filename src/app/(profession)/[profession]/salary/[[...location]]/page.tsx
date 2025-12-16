import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, TrendingUp, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "@/lib/content-generator";
import { InternalLinks } from "@/components/salary/InternalLinks";
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForBreadcrumb, getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        location?: string[];  // [[...location]] -> can be [], ['ca'], or ['ca', 'los-angeles']
    };
}

// Helper to format location name from slug
function formatLocationName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, location } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const careerTitle = formatSlugForBreadcrumb(profession);

    const state = location?.[0];
    const city = location?.[1];

    let locationName = 'United States';
    if (city && state) {
        locationName = `${formatLocationName(city)}, ${state.toUpperCase()}`;
    } else if (state) {
        locationName = formatLocationName(state);
    }

    // Fetch salary data for meta description
    let salaryData;
    if (city && state) {
        const cityName = formatLocationName(city);
        const stateAbbr = state.toUpperCase();
        const locationRecord = await prisma.location.findFirst({
            where: { city: cityName, state: stateAbbr }
        });
        if (locationRecord) {
            salaryData = await prisma.salaryData.findFirst({
                where: { careerKeyword: dbSlug, locationId: locationRecord.id },
                orderBy: { year: 'desc' }
            });
        }
    } else if (state) {
        const stateAbbr = state.toUpperCase();
        const locationRecord = await prisma.location.findFirst({
            where: { state: stateAbbr, city: '' }
        });
        if (locationRecord) {
            salaryData = await prisma.salaryData.findFirst({
                where: { careerKeyword: dbSlug, locationId: locationRecord.id },
                orderBy: { year: 'desc' }
            });
        }
    } else {
        salaryData = await prisma.salaryData.findFirst({
            where: { careerKeyword: dbSlug, locationId: null },
            orderBy: { year: 'desc' }
        });
    }

    const medianSalary = salaryData?.annualMedian
        ? `$${Math.round(salaryData.annualMedian).toLocaleString()}`
        : '$60,000';

    const currentYear = new Date().getFullYear();
    const title = `${careerTitle} Salary ${currentYear}: Average Pay by State & City | Medical Career Center`;
    const description = `${careerTitle}s earn an average of ${medianSalary} annually in ${locationName}. Explore detailed salary data by experience level, percentiles, and location. Compare top-paying states and cities.`;

    // Build canonical URL
    let urlPath = `/${profession}/salary`;
    if (city && state) {
        urlPath = `/${profession}/salary/${state}/${city}`;
    } else if (state) {
        urlPath = `/${profession}/salary/${state}`;
    }

    return {
        title,
        description,
        alternates: { canonical: `https://medicalcareercenter.org${urlPath}` },
        openGraph: {
            title,
            description,
            type: 'website',
        },
        robots: { index: true, follow: true },
    };
}

export default async function SalaryPage({ params }: PageProps) {
    const { profession, location } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatSlugForBreadcrumb(profession);

    const state = location?.[0];
    const city = location?.[1];

    // Determine query based on what's provided
    let salaryData;

    if (city && state) {
        // City-level page
        const cityName = formatLocationName(city);
        const stateAbbr = state.toUpperCase();

        const cityLocation = await prisma.location.findFirst({
            where: { city: cityName, state: stateAbbr }
        });

        if (cityLocation) {
            salaryData = await prisma.salaryData.findFirst({
                where: {
                    careerKeyword: dbSlug,
                    locationId: cityLocation.id,
                    year: 2024
                },
                include: { location: true }
            });
        }
    } else if (state) {
        // State-level page
        const stateAbbr = state.toUpperCase();

        salaryData = await prisma.salaryData.findFirst({
            where: {
                careerKeyword: dbSlug,
                location: { state: stateAbbr, city: "" },
                year: 2024
            },
            include: { location: true }
        });
    } else {
        // National page
        salaryData = await prisma.salaryData.findFirst({
            where: {
                careerKeyword: dbSlug,
                locationId: null,
                year: 2024
            }
        });
    }

    if (!salaryData) {
        return notFound();
    }

    // Get location name
    let locationName = "United States";
    if (city || state) {
        if (salaryData.locationId) {
            const locationData = await prisma.location.findUnique({
                where: { id: salaryData.locationId }
            });
            if (locationData) {
                locationName = locationData.city
                    ? `${locationData.city}, ${locationData.stateName}`
                    : locationData.stateName || formatLocationName(state || '');
            }
        } else if (state) {
            locationName = formatLocationName(state);
        }
    }

    const narrative = generateWageNarrative(salaryData, careerTitle, locationName);
    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
    const careerDescription = getCareerDescription(dbSlug);

    // Get national average for comparison (if state page)
    let comparisonText = "";
    if (state) {
        const nationalData = await prisma.salaryData.findFirst({
            where: {
                careerKeyword: dbSlug,
                locationId: null,
                year: 2024
            }
        });

        comparisonText = nationalData
            ? salaryData.annualMedian && nationalData.annualMedian && salaryData.annualMedian > nationalData.annualMedian
                ? `Above the national average of ${formatCurrency(nationalData.annualMedian)}.`
                : `Compared to the national average of ${formatCurrency(nationalData.annualMedian || 0)}.`
            : "";
    }

    // Build breadcrumb items - last item should not have href
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerTitle, href: `/${profession}` },
    ];

    if (state && city) {
        // City page - show full path with city at end
        breadcrumbItems.push({ label: 'Salary', href: `/${profession}/salary` });
        breadcrumbItems.push({ label: state.toUpperCase(), href: `/${profession}/salary/${state}` });
        breadcrumbItems.push({ label: formatLocationName(city) });
    } else if (state) {
        // State page - show path with state at end
        breadcrumbItems.push({ label: 'Salary', href: `/${profession}/salary` });
        breadcrumbItems.push({ label: state.toUpperCase() });
    } else {
        // National page - Salary at end
        breadcrumbItems.push({ label: 'Salary' });
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb
                items={breadcrumbItems}
                className="mb-6"
            />

            <article className="prose prose-lg dark:prose-invert max-w-none">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    How much does a {careerTitle} make in {locationName}?
                </h1>

                <p className="text-xl leading-relaxed">
                    According to data from the Bureau of Labor Statistics, the median annual salary for {careerTitle.toLowerCase()}s in {locationName} is <strong>{formatCurrency(salaryData.annualMedian || 0)}</strong>. {comparisonText}
                </p>

                {salaryData.employmentCount && (
                    <p className="text-lg">
                        With <strong>{salaryData.employmentCount.toLocaleString()}</strong> employed {careerTitle.toLowerCase()}s {state ? 'in the state' : 'nationwide'}, this occupation plays a vital role in {locationName}'s healthcare system.
                    </p>
                )}

                <div className="grid md:grid-cols-3 gap-6 my-8 not-prose">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">Median Annual</p>
                            </div>
                            <p className="text-3xl font-bold text-primary">
                                {formatCurrency(salaryData.annualMedian || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                ${salaryData.hourlyMedian?.toFixed(2) || "N/A"}/hour
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">Top 10%</p>
                            </div>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                                {formatCurrency(salaryData.annual90th || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                ${salaryData.hourly90th?.toFixed(2) || "N/A"}/hour
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">Starting (10th %)</p>
                            </div>
                            <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">
                                {formatCurrency(salaryData.annual10th || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                ${salaryData.hourly10th?.toFixed(2) || "N/A"}/hour
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">{careerTitle} Salary in {locationName} – Overview</h2>

                <p className="text-lg mb-4">{narrative.overview}</p>

                <ul className="space-y-2 text-lg">
                    {narrative.distribution.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>

                <p className="text-lg mt-6">Let's dive deeper into the wage distribution:</p>

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">Wage Distribution: How Do Salaries Vary Among {careerTitle}s in {locationName}?</h2>

                <div className="space-y-4 text-lg">
                    <p><strong>Starting Out:</strong> {narrative.wageBreakdown.starting}</p>
                    <p><strong>Early Career:</strong> {narrative.wageBreakdown.earlyCareer}</p>
                    <p><strong>Most Common:</strong> {narrative.wageBreakdown.median}</p>
                    <p><strong>Experienced:</strong> {narrative.wageBreakdown.experienced}</p>
                    <p><strong>Top Earners:</strong> {narrative.wageBreakdown.topEarners}</p>
                </div>

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">What is a {careerTitle}?</h2>
                <p className="text-lg">{careerDescription}</p>
            </article>

            {/* Quick Navigation */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Explore More {careerTitle} Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href={urls.jobs} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Browse Jobs</p>
                    </Link>
                    <Link href={urls.howToBecome} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Career Guide</p>
                    </Link>
                    <Link href={urls.schools} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Find Schools</p>
                    </Link>
                    <Link href={urls.resume} className="p-3 rounded-lg border bg-background hover:bg-primary/5 transition-colors text-center">
                        <p className="font-medium text-sm">Resume Tips</p>
                    </Link>
                </div>
            </div>

            {/* Internal Linking Section */}
            <InternalLinks
                profession={dbSlug}
                state={state}
                city={city}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </main>
    );
}
