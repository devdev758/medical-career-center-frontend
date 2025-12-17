import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "@/lib/content-generator";
import { InternalLinks } from "@/components/salary/InternalLinks";
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForBreadcrumb, getProfessionUrls } from '@/lib/url-utils';
import { calculatePercentChange } from '@/lib/salary-utils';

// New enhanced components
import { SalaryHeroStats } from '@/components/salary/SalaryHeroStats';
import { WageDistributionChart } from '@/components/salary/WageDistributionChart';
import { StateComparisonTable } from '@/components/salary/StateComparisonTable';
import { CityComparisonTable } from '@/components/salary/CityComparisonTable';
import { IndustryBreakdown } from '@/components/salary/IndustryBreakdown';
import { LocationInsightCard } from '@/components/salary/LocationInsightCard';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
        location?: string[];
    };
}

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
        openGraph: { title, description, type: 'website' },
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

    // Fetch salary data based on location level
    let salaryData;
    let locationData: { city?: string; state?: string; stateName?: string } | null = null;

    if (city && state) {
        const cityName = formatLocationName(city);
        const stateAbbr = state.toUpperCase();
        const cityLocation = await prisma.location.findFirst({
            where: { city: cityName, state: stateAbbr }
        });
        if (cityLocation) {
            salaryData = await prisma.salaryData.findFirst({
                where: { careerKeyword: dbSlug, locationId: cityLocation.id, year: 2024 },
                include: { location: true }
            });
            locationData = { city: cityLocation.city, state: cityLocation.state, stateName: cityLocation.stateName };
        }
    } else if (state) {
        const stateAbbr = state.toUpperCase();
        salaryData = await prisma.salaryData.findFirst({
            where: { careerKeyword: dbSlug, location: { state: stateAbbr, city: "" }, year: 2024 },
            include: { location: true }
        });
        if (salaryData?.location) {
            locationData = { state: salaryData.location.state, stateName: salaryData.location.stateName };
        }
    } else {
        salaryData = await prisma.salaryData.findFirst({
            where: { careerKeyword: dbSlug, locationId: null, year: 2024 }
        });
    }

    if (!salaryData) return notFound();

    // Fetch national data for comparison
    const nationalData = await prisma.salaryData.findFirst({
        where: { careerKeyword: dbSlug, locationId: null, year: 2024 }
    });

    // Calculate vs national comparison
    const vsNational = nationalData?.annualMedian && salaryData.annualMedian
        ? calculatePercentChange(salaryData.annualMedian, nationalData.annualMedian)
        : undefined;

    // Fetch state data for state/city pages comparison
    let stateData;
    if (city && state) {
        stateData = await prisma.salaryData.findFirst({
            where: { careerKeyword: dbSlug, location: { state: state.toUpperCase(), city: "" }, year: 2024 }
        });
    }

    // Fetch all states for national page
    let allStates: { state: string; stateName: string; median: number; employment: number; jobsPer1000: number | null; locationQuotient: number | null }[] = [];
    if (!state && !city) {
        const stateRecords = await prisma.salaryData.findMany({
            where: { careerKeyword: dbSlug, location: { city: "" }, year: 2024 },
            include: { location: true },
            orderBy: { annualMedian: 'desc' }
        });
        allStates = stateRecords
            .filter(s => s.location && s.annualMedian)
            .map(s => ({
                state: s.location!.state,
                stateName: s.location!.stateName,
                median: s.annualMedian!,
                employment: s.employmentCount || 0,
                jobsPer1000: s.jobsPer1000,
                locationQuotient: s.locationQuotient,
            }));
    }

    // Fetch cities for state page
    let stateCities: { city: string; state: string; median: number; employment: number; jobsPer1000: number | null; locationQuotient: number | null }[] = [];
    if (state && !city) {
        const cityRecords = await prisma.salaryData.findMany({
            where: {
                careerKeyword: dbSlug,
                location: { state: state.toUpperCase(), city: { not: "" } },
                year: 2024
            },
            include: { location: true },
            orderBy: { annualMedian: 'desc' }
        });
        stateCities = cityRecords
            .filter(c => c.location && c.annualMedian)
            .map(c => ({
                city: c.location!.city,
                state: c.location!.state,
                median: c.annualMedian!,
                employment: c.employmentCount || 0,
                jobsPer1000: c.jobsPer1000,
                locationQuotient: c.locationQuotient,
            }));
    }

    // Fetch top cities nationally for national page
    let topCitiesNational: { city: string; state: string; median: number; employment: number; jobsPer1000: number | null; locationQuotient: number | null }[] = [];
    if (!state && !city) {
        const cityRecords = await prisma.salaryData.findMany({
            where: {
                careerKeyword: dbSlug,
                location: { city: { not: "" } },
                year: 2024,
                annualMedian: { not: null }
            },
            include: { location: true },
            orderBy: { annualMedian: 'desc' },
            take: 20
        });
        topCitiesNational = cityRecords
            .filter(c => c.location && c.annualMedian)
            .map(c => ({
                city: c.location!.city,
                state: c.location!.state,
                median: c.annualMedian!,
                employment: c.employmentCount || 0,
                jobsPer1000: c.jobsPer1000,
                locationQuotient: c.locationQuotient,
            }));
    }

    // Fetch industry data for national page
    let industries: { naicsCode: string; naicsTitle: string; employment: number; meanAnnual: number | null }[] = [];
    if (!state && !city) {
        const industryRecords = await prisma.industryEmployment.findMany({
            where: { careerKeyword: dbSlug, year: 2024, employment: { not: null } },
            orderBy: { employment: 'desc' },
            take: 10
        });
        industries = industryRecords.map(i => ({
            naicsCode: i.naicsCode,
            naicsTitle: i.naicsTitle,
            employment: i.employment || 0,
            meanAnnual: i.meanAnnual,
        }));
    }

    // Location name for display
    let locationName = "United States";
    if (locationData?.city) {
        locationName = `${locationData.city}, ${locationData.stateName}`;
    } else if (locationData?.stateName) {
        locationName = locationData.stateName;
    }

    const narrative = generateWageNarrative(salaryData, careerTitle, locationName);
    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
    const careerDescription = getCareerDescription(dbSlug);

    // Breadcrumbs
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: '/' },
        { label: careerTitle, href: `/${profession}` },
    ];

    if (state && city) {
        breadcrumbItems.push({ label: 'Salary', href: `/${profession}/salary` });
        breadcrumbItems.push({ label: state.toUpperCase(), href: `/${profession}/salary/${state}` });
        breadcrumbItems.push({ label: formatLocationName(city) });
    } else if (state) {
        breadcrumbItems.push({ label: 'Salary', href: `/${profession}/salary` });
        breadcrumbItems.push({ label: state.toUpperCase() });
    } else {
        breadcrumbItems.push({ label: 'Salary' });
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* Hero Stats Section */}
            <SalaryHeroStats
                professionName={careerTitle}
                medianSalary={salaryData.annualMedian || 0}
                employment={salaryData.employmentCount || 0}
                topPercentile={salaryData.annual90th || undefined}
                hourlyRate={salaryData.hourlyMedian || undefined}
                location={locationData || undefined}
                vsNational={state ? vsNational : undefined}
                jobsPer1000={salaryData.jobsPer1000}
                locationQuotient={salaryData.locationQuotient}
            />

            <Separator className="my-8" />

            {/* Wage Distribution Chart */}
            <section className="mb-12">
                <WageDistributionChart
                    data={salaryData}
                    showHourly={true}
                />
            </section>

            {/* Location Insight for state/city pages */}
            {(state || city) && (salaryData.locationQuotient || salaryData.jobsPer1000) && (
                <section className="mb-12">
                    <LocationInsightCard
                        locationQuotient={salaryData.locationQuotient}
                        jobsPer1000={salaryData.jobsPer1000}
                        stateName={locationData?.stateName}
                        professionName={careerTitle}
                    />
                </section>
            )}

            {/* Industry Breakdown - National page only */}
            {!state && !city && industries.length > 0 && (
                <section className="mb-12">
                    <IndustryBreakdown
                        industries={industries}
                        professionName={careerTitle}
                        totalEmployment={salaryData.employmentCount || undefined}
                    />
                </section>
            )}

            <Separator className="my-8" />

            {/* State Comparison Table - National page */}
            {!state && !city && allStates.length > 0 && (
                <section className="mb-12">
                    <StateComparisonTable
                        states={allStates}
                        nationalMedian={nationalData?.annualMedian || salaryData.annualMedian || 0}
                        profession={profession}
                        limit={10}
                    />
                </section>
            )}

            {/* City Comparison Table - State page */}
            {state && !city && stateCities.length > 0 && (
                <section className="mb-12">
                    <CityComparisonTable
                        cities={stateCities}
                        baselineMedian={salaryData.annualMedian || 0}
                        profession={profession}
                        stateCode={state}
                        limit={10}
                        title={`Top Paying Cities in ${locationData?.stateName || state.toUpperCase()}`}
                    />
                </section>
            )}

            {/* Top Cities National - National page */}
            {!state && !city && topCitiesNational.length > 0 && (
                <section className="mb-12">
                    <CityComparisonTable
                        cities={topCitiesNational}
                        baselineMedian={nationalData?.annualMedian || salaryData.annualMedian || 0}
                        profession={profession}
                        limit={10}
                        title="Highest Paying Cities"
                    />
                </section>
            )}

            <Separator className="my-8" />

            {/* Narrative Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-4">{careerTitle} Salary in {locationName} – Overview</h2>
                <p className="text-lg mb-4">{narrative.overview}</p>

                <ul className="space-y-2 text-lg">
                    {narrative.distribution.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">Wage Distribution: How Do Salaries Vary?</h2>
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
