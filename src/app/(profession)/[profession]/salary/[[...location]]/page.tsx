import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
    generateWageNarrative,
    generateFAQSchema,
    getCareerDescription,
    formatCurrency,
    generateFactorsAffectingSalary,
    generateStateSalaryNarrative,
    generateCitySalaryNarrative,
    generateIndustrySalaryNarrative,
    getProfessionFormalName
} from "@/lib/content-generator";
import { InternalLinks } from "@/components/salary/InternalLinks";
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { urlSlugToDbSlug, formatSlugForBreadcrumb, getProfessionUrls } from '@/lib/url-utils';
import { calculatePercentChange } from '@/lib/salary-utils';
import { Search, GraduationCap, BookOpen, FileText } from 'lucide-react';

// New enhanced components
import { SalaryHeroStats } from '@/components/salary/SalaryHeroStats';
import { WageDistributionChart } from '@/components/salary/WageDistributionChart';
import { StateComparisonTable } from '@/components/salary/StateComparisonTable';
import { CityComparisonTable } from '@/components/salary/CityComparisonTable';
import { IndustryBreakdown } from '@/components/salary/IndustryBreakdown';
import { LocationInsightCard } from '@/components/salary/LocationInsightCard';
import { RelatedSalaries } from '@/components/salary/RelatedSalaries';

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

// Helper for CNA capitalization in Titles
function formatTitleForDisplay(slug: string): string {
    if (slug.includes('nursing-assistant') || slug.includes('cna')) return "CNA";
    return formatSlugForBreadcrumb(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { profession, location } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    // Use Formal Name for Title ("Certified Nursing Assistant" vs "CNA")
    const formalName = getProfessionFormalName(profession);

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

    const year = 2026;
    // User Requested Title Format: "How much does a Certified Nursing Assistant make?"
    const title = `How Much Does a ${formalName} Make in ${locationName}? (${year} Salary Guide)`;
    const description = `The average ${formalName} salary in ${locationName} is ${salaryData?.annualMedian ? formatCurrency(salaryData.annualMedian) : 'available inside'}. View detailed pay rates by experience, city, and state for ${year}.`;

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
    const careerTitle = formatTitleForDisplay(profession);

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

    // Fetch industry data with filtering
    let industries: { naicsCode: string; naicsTitle: string; employment: number; meanAnnual: number | null }[] = [];
    if (!state && !city) {
        const industryRecords = await prisma.industryEmployment.findMany({
            where: {
                careerKeyword: dbSlug,
                year: 2024,
                employment: { not: null }
            },
            orderBy: { employment: 'desc' }
        });

        industries = industryRecords
            .filter((i: any) => {
                const isBroadSector = i.naicsCode.length < 4;
                const isTotalOrGovt = i.naicsCode.startsWith('00') || i.naicsCode.startsWith('99');
                const isHealthcareSector = i.naicsCode === '62';
                return !isBroadSector && !isTotalOrGovt && !isHealthcareSector;
            })
            .slice(0, 8)
            .map((i: any) => ({
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

    // Top performers for Narrative Generation
    let topStateName = "California";
    if (allStates.length > 0) {
        topStateName = allStates[0].stateName;
    }

    let topCityName = "San Francisco";
    if (topCitiesNational.length > 0) {
        topCityName = topCitiesNational[0].city;
    }

    // Generate Content Narratives
    const narrative = generateWageNarrative(
        salaryData,
        careerTitle,
        locationName,
        topStateName,
        topCityName
    );

    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);

    // New Content Generators
    const factorsContent = generateFactorsAffectingSalary(careerTitle);

    const topStateForNarrative = allStates.length > 0 ? { name: allStates[0].stateName, salary: allStates[0].median } : undefined;
    const stateNarrative = generateStateSalaryNarrative(careerTitle, topStateForNarrative);

    const topCityForNarrative = topCitiesNational.length > 0 ? { name: topCitiesNational[0].city, salary: topCitiesNational[0].median } : undefined;
    const cityNarrative = generateCitySalaryNarrative(careerTitle, topCityForNarrative);

    const topIndustry = industries.length > 0
        ? { name: industries[0].naicsTitle, salary: industries[0].meanAnnual || 0, employment: industries[0].employment }
        : undefined;
    const industryNarrative = generateIndustrySalaryNarrative(careerTitle, topIndustry);

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

            {/* Narrative Overview (Story) */}
            <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <div
                    className="whitespace-pre-line text-lg text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: narrative.intro.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
            </article>

            {/* Wage Distribution Chart */}
            <section className="mb-12">
                <WageDistributionChart
                    data={salaryData}
                    showHourly={true}
                />
            </section>

            {/* Factors Affecting Salary Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <h2 className="text-3xl font-bold mb-4">{factorsContent.title}</h2>
                <p className="text-lg">{factorsContent.content}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {factorsContent.factors.map((factor: string, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div dangerouslySetInnerHTML={{ __html: factor.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                    ))}
                </div>
            </article>

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

            {/* State Comparison Section - National page */}
            {!state && !city && allStates.length > 0 && (
                <section className="mb-12">
                    <article className="prose prose-lg dark:prose-invert max-w-none mb-6">
                        <div dangerouslySetInnerHTML={{ __html: stateNarrative.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </article>
                    <StateComparisonTable
                        states={allStates}
                        nationalMedian={nationalData?.annualMedian || salaryData.annualMedian || 0}
                        profession={profession}
                        limit={10}
                    />
                </section>
            )}

            {/* City Comparison Section - State page or National */}
            {((!state && !city && topCitiesNational.length > 0) || (state && !city && stateCities.length > 0)) && (
                <section className="mb-12">
                    <article className="prose prose-lg dark:prose-invert max-w-none mb-6">
                        <div dangerouslySetInnerHTML={{ __html: cityNarrative.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </article>

                    {state ? (
                        <CityComparisonTable
                            cities={stateCities}
                            baselineMedian={salaryData.annualMedian || 0}
                            profession={profession}
                            stateCode={state}
                            limit={20}
                            title={`Top Paying Cities in ${locationData?.stateName || state.toUpperCase()}`}
                        />
                    ) : (
                        <CityComparisonTable
                            cities={topCitiesNational}
                            baselineMedian={nationalData?.annualMedian || salaryData.annualMedian || 0}
                            profession={profession}
                            limit={20}
                            title="Highest Paying Cities"
                        />
                    )}
                </section>
            )}

            {/* Industry Breakdown - National page only */}
            {!state && !city && industries.length > 0 && (
                <section className="mb-12">
                    <article className="prose prose-lg dark:prose-invert max-w-none mb-6">
                        <div dangerouslySetInnerHTML={{ __html: industryNarrative.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </article>
                    <IndustryBreakdown
                        industries={industries}
                        professionName={careerTitle}
                        totalEmployment={salaryData.employmentCount || undefined}
                    />
                </section>
            )}

            <Separator className="my-8" />

            {/* Related Salaries Section */}
            <section className="mb-12">
                <RelatedSalaries currentProfession={dbSlug} />
            </section>

            {/* Visual CTAs for Resources */}
            <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Explore {careerTitle} Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href={urls.jobs} className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg text-white">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Search className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <div className="mb-4 bg-white/20 w-fit p-3 rounded-xl backdrop-blur-sm">
                                <Search className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Browse Jobs</h4>
                            <p className="text-blue-100 mb-4 text-sm">Find {careerTitle} positions near you with competitive salaries.</p>
                            <span className="inline-flex items-center font-semibold text-sm bg-white text-blue-600 px-4 py-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                                Search Now
                            </span>
                        </div>
                    </Link>

                    <Link href={urls.schools} className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 shadow-lg text-white">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <GraduationCap className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <div className="mb-4 bg-white/20 w-fit p-3 rounded-xl backdrop-blur-sm">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Find Schools</h4>
                            <p className="text-indigo-100 mb-4 text-sm">Discover top-rated programs to launch your career.</p>
                            <span className="inline-flex items-center font-semibold text-sm bg-white text-indigo-600 px-4 py-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                Begin Search
                            </span>
                        </div>
                    </Link>

                    <Link href={urls.howToBecome} className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-lg text-white">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <div className="mb-4 bg-white/20 w-fit p-3 rounded-xl backdrop-blur-sm">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Career Guide</h4>
                            <p className="text-purple-100 mb-4 text-sm">Step-by-step guide to becoming a {careerTitle}.</p>
                            <span className="inline-flex items-center font-semibold text-sm bg-white text-purple-600 px-4 py-2 rounded-lg group-hover:bg-purple-50 transition-colors">
                                Read Guide
                            </span>
                        </div>
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
