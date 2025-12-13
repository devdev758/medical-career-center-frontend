import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "@/lib/content-generator";
import { InternalLinks } from "@/components/salary/InternalLinks";
import { Breadcrumb, getProfessionBreadcrumbs } from '@/components/ui/breadcrumb';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        profession?: string;
        location?: string;
        city?: string;
    };
}

// Helper to format career title from slug
function formatCareerTitle(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper to format location name from slug
function formatLocationName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default async function SalaryPage({ searchParams }: PageProps) {
    const { profession, location, city } = searchParams;

    if (!profession) {
        return notFound();
    }

    // Determine query based on what's provided
    let salaryData;

    if (city && location) {
        // City-level page: find location by city name and state abbreviation
        const cityName = formatLocationName(city);
        const stateAbbr = location.toUpperCase(); // URL has state abbreviation (e.g., "ca" → "CA")

        const cityLocation = await prisma.location.findFirst({
            where: {
                city: cityName,
                state: stateAbbr
            }
        });

        if (cityLocation) {
            salaryData = await prisma.salaryData.findFirst({
                where: {
                    careerKeyword: profession,
                    locationId: cityLocation.id,
                    year: 2024
                },
                include: { location: true }
            });
        }
    } else if (location) {
        // State-level page: location is state abbreviation (e.g., "ca")
        const stateAbbr = location.toUpperCase();

        salaryData = await prisma.salaryData.findFirst({
            where: {
                careerKeyword: profession,
                location: {
                    state: stateAbbr,
                    city: ""
                },
                year: 2024
            },
            include: { location: true }
        });
    } else {
        // National page
        salaryData = await prisma.salaryData.findFirst({
            where: {
                careerKeyword: profession,
                locationId: null,
                year: 2024
            }
        });
    }

    if (!salaryData) {
        return notFound();
    }

    const careerTitle = formatCareerTitle(profession);

    // Get location name
    let locationName = "United States";
    if (city || location) {
        if (salaryData.locationId) {
            const locationData = await prisma.location.findUnique({
                where: { id: salaryData.locationId }
            });
            if (locationData) {
                locationName = locationData.city
                    ? `${locationData.city}, ${locationData.stateName}`
                    : locationData.stateName || formatLocationName(location || '');
            }
        } else if (location) {
            locationName = formatLocationName(location);
        }
    }

    const narrative = generateWageNarrative(salaryData, careerTitle, locationName);
    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
    const careerDescription = getCareerDescription(profession);

    // Get national average for comparison (if state page)
    let comparisonText = "";
    if (location) {
        const nationalData = await prisma.salaryData.findFirst({
            where: {
                careerKeyword: profession,
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

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb
                items={getProfessionBreadcrumbs(profession, careerTitle, 'salary')}
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
                        With <strong>{salaryData.employmentCount.toLocaleString()}</strong> employed {careerTitle.toLowerCase()}s {location ? 'in the state' : 'nationwide'}, this occupation plays a vital role in {locationName}'s healthcare system.
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

            {/* Internal Linking Section */}
            <InternalLinks
                profession={profession}
                state={location}
                city={city}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </main >
    );
}
