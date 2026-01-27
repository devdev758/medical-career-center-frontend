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
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { urlSlugToDbSlug, formatSlugForBreadcrumb, getProfessionUrls } from '@/lib/url-utils';
import { getStateName } from '@/lib/geographic-data';
import { professionGuides, getCareerGuideDefaults } from '@/lib/career-data';
import { calculatePercentChange } from '@/lib/salary-utils';
import { Search, GraduationCap, BookOpen, FileText } from 'lucide-react';
import { validateProfession, getProfessionDisplayName, getBLSKeywords } from '@/lib/profession-utils';
import { getContentYear } from '@/lib/date-utils';

// New enhanced components
import { SalaryHero } from '@/components/salary/SalaryHero';
import { SalaryChart } from '@/components/salary/SalaryChart';
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
        locationName = `${formatLocationName(city)}, ${getStateName(state) || state.toUpperCase()}`;
    } else if (state) {
        locationName = getStateName(state) || formatLocationName(state);
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
    // Updated Title Format: "How Much Does a [Profession] Make in [State] in 2026"
    const title = `How Much Does a ${formalName} Make in ${locationName} in ${year}`;
    const description = `The average ${formalName} salary in ${locationName} is ${salaryData?.annualMedian ? formatCurrency(salaryData.annualMedian) : 'available inside'}. See the highest paying cities in ${locationName}, wage trends, and job outlook for ${year}.`;

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

    // Validate profession exists
    const isValid = await validateProfession(profession);
    if (!isValid) {
        notFound();
    }

    const blsKeywords = await getBLSKeywords(profession);
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);
    const careerTitle = formatTitleForDisplay(profession);

    const state = location?.[0];
    const city = location?.[1];

    // Fetch salary data based on location level
    let salaryData;
    let locationData: { city?: string; state?: string; stateName?: string } | null = null;
    let availableRelatedSlugs: string[] = [];

    if (city && state) {
        const cityName = formatLocationName(city);
        const stateAbbr = state.toUpperCase();
        const cityLocation = await prisma.location.findFirst({
            where: { city: cityName, state: stateAbbr }
        });
        if (cityLocation) {
            salaryData = await prisma.salaryData.findFirst({
                where: { careerKeyword: { in: blsKeywords }, locationId: cityLocation.id, year: 2024 },
                include: { location: true },
                orderBy: { employmentCount: 'desc' }
            });
            locationData = { city: cityLocation.city, state: cityLocation.state, stateName: cityLocation.stateName };

            // Check availability of related professions for this city
            // Map canonical profession slugs to their BLS keywords for database query
            const relatedProfessions = [
                { canonical: 'registered-nurse', bls: ['registered-nurses', 'registered-nurse'] },
                { canonical: 'nurse-practitioner', bls: ['nurse-practitioners', 'nurse-practitioner'] },
                { canonical: 'medical-assistant', bls: ['medical-assistants', 'medical-assistant'] },
                { canonical: 'surgical-technologist', bls: ['surgical-technologists', 'surgical-technologist'] }
            ].filter(p => p.canonical !== profession);

            const allBlsKeywords = relatedProfessions.flatMap(p => p.bls);

            const relatedAvailability = await prisma.salaryData.findMany({
                where: {
                    locationId: cityLocation.id,
                    careerKeyword: { in: allBlsKeywords },
                    year: 2024
                },
                select: { careerKeyword: true }
            });

            // Map BLS keywords back to canonical slugs for RelatedSalaries component
            const foundBlsKeywords = relatedAvailability.map(d => d.careerKeyword);
            availableRelatedSlugs = relatedProfessions
                .filter(p => p.bls.some(bls => foundBlsKeywords.includes(bls)))
                .map(p => p.canonical);
        }
    } else if (state) {
        const stateAbbr = state.toUpperCase();
        salaryData = await prisma.salaryData.findFirst({
            where: { careerKeyword: { in: blsKeywords }, location: { state: stateAbbr, city: "" }, year: 2024 },
            include: { location: true },
            orderBy: { employmentCount: 'desc' }
        });
        if (salaryData?.location) {
            locationData = { state: salaryData.location.state, stateName: salaryData.location.stateName };
        }
    } else {
        salaryData = await prisma.salaryData.findFirst({
            where: { careerKeyword: { in: blsKeywords }, locationId: null, year: 2024 },
            orderBy: { employmentCount: 'desc' }
        });
    }

    if (!salaryData) return notFound();

    // Fetch national data for comparison
    const nationalData = await prisma.salaryData.findFirst({
        where: { careerKeyword: { in: blsKeywords }, locationId: null, year: 2024 },
        orderBy: { employmentCount: 'desc' }
    });

    // Calculate vs national comparison
    const vsNational = nationalData?.annualMedian && salaryData.annualMedian
        ? calculatePercentChange(salaryData.annualMedian, nationalData.annualMedian)
        : undefined;

    // Fetch state data for state/city pages comparison
    let stateData;
    if (city && state) {
        stateData = await prisma.salaryData.findFirst({
            where: { careerKeyword: { in: blsKeywords }, location: { state: state.toUpperCase(), city: "" }, year: 2024 },
            orderBy: { employmentCount: 'desc' }
        });
    }

    // Fetch all states for national page
    let allStates: { state: string; stateName: string; median: number; employment: number; jobsPer1000: number | null; locationQuotient: number | null }[] = [];
    if (!state && !city) {
        const stateRecords = await prisma.salaryData.findMany({
            where: { careerKeyword: { in: blsKeywords }, location: { city: "" }, year: 2024 },
            include: { location: true },
            orderBy: { annualMedian: 'desc' }
        });

        // Deduplicate by state (BLS keywords can cause duplicates)
        const stateMap = new Map();
        stateRecords.filter(s => s.location && s.annualMedian).forEach(s => {
            if (!stateMap.has(s.location!.state) || s.annualMedian! > stateMap.get(s.location!.state).median) {
                stateMap.set(s.location!.state, {
                    state: s.location!.state,
                    stateName: s.location!.stateName,
                    median: s.annualMedian!,
                    employment: s.employmentCount || 0,
                    jobsPer1000: s.jobsPer1000,
                    locationQuotient: s.locationQuotient,
                });
            }
        });
        allStates = Array.from(stateMap.values());
    }

    // Fetch cities for state page
    let stateCities: { city: string; state: string; median: number; employment: number; jobsPer1000: number | null; locationQuotient: number | null }[] = [];
    if (state && !city) {
        const cityRecords = await prisma.salaryData.findMany({
            where: {
                careerKeyword: { in: blsKeywords },
                location: { state: state.toUpperCase(), city: { not: "" } },
                year: 2024
            },
            include: { location: true },
            orderBy: { annualMedian: 'desc' }
        });

        // Deduplicate by city
        const cityMap = new Map();
        cityRecords.filter(c => c.location && c.annualMedian).forEach(c => {
            const key = `${c.location!.city}-${c.location!.state}`;
            if (!cityMap.has(key) || c.annualMedian! > cityMap.get(key).median) {
                cityMap.set(key, {
                    city: c.location!.city,
                    state: c.location!.state,
                    median: c.annualMedian!,
                    employment: c.employmentCount || 0,
                    jobsPer1000: c.jobsPer1000,
                    locationQuotient: c.locationQuotient,
                });
            }
        });
        stateCities = Array.from(cityMap.values());
    }

    // Fetch top cities nationally for national page
    let topCitiesNational: { city: string; state: string; median: number; employment: number; jobsPer1000: number | null; locationQuotient: number | null }[] = [];
    if (!state && !city) {
        const cityRecords = await prisma.salaryData.findMany({
            where: {
                careerKeyword: { in: blsKeywords },
                location: { city: { not: "" } },
                year: 2024,
                annualMedian: { not: null }
            },
            include: { location: true },
            orderBy: { annualMedian: 'desc' },
            take: 20
        });

        // Deduplicate by city
        const cityMap = new Map();
        cityRecords.filter(c => c.location && c.annualMedian).forEach(c => {
            const key = `${c.location!.city}-${c.location!.state}`;
            if (!cityMap.has(key) || c.annualMedian! > cityMap.get(key).median) {
                cityMap.set(key, {
                    city: c.location!.city,
                    state: c.location!.state,
                    median: c.annualMedian!,
                    employment: c.employmentCount || 0,
                    jobsPer1000: c.jobsPer1000,
                    locationQuotient: c.locationQuotient,
                });
            }
        });
        topCitiesNational = Array.from(cityMap.values()).slice(0, 20);
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
    let topCityName = "San Francisco";

    if (state && stateCities.length > 0) {
        // On state page, use current state and its top city
        topStateName = locationData?.stateName || state.toUpperCase();
        topCityName = stateCities[0].city;
    } else {
        // National page defaults
        if (allStates.length > 0) topStateName = allStates[0].stateName;
        if (topCitiesNational.length > 0) topCityName = topCitiesNational[0].city;
    }

    // Prepare top stats for narrative generation
    const topStateForNarrative = allStates.length > 0 ? { name: allStates[0].stateName, salary: allStates[0].median } : undefined;
    const topCitySource = (state && stateCities.length > 0) ? stateCities[0] : (topCitiesNational.length > 0 ? topCitiesNational[0] : undefined);
    const topCityForNarrative = topCitySource ? { name: topCitySource.city, salary: topCitySource.median } : undefined;

    let narrative;

    if (city && state) {
        // City Page
        const cityRes = generateCitySalaryNarrative(careerTitle, topCityForNarrative);
        narrative = { intro: cityRes.content };
    } else if (state) {
        // State Page
        const stateRes = generateStateSalaryNarrative(careerTitle, topStateForNarrative);
        narrative = { intro: stateRes.content };
    } else {
        // National Page
        // generateWageNarrative(salary, careerTitle, locationName, topStateName, topCityName)
        narrative = generateWageNarrative(
            salaryData,
            careerTitle,
            locationName,
            topStateName,
            topCityName
        );
    }

    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
    const factorsContent = generateFactorsAffectingSalary(careerTitle);
    const salaryByState = allStates; // Ensure salaryByState is defined, assuming it refers to allStates for the table

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

    // Top Stats for Hero Cards
    const formalName = getProfessionFormalName(profession);
    const topStateObj = allStates.length > 0 ? { name: allStates[0].stateName, salary: allStates[0].median } : undefined;
    let topCityObj = topCitiesNational.length > 0 ? { name: topCitiesNational[0].city, salary: topCitiesNational[0].median } : undefined;

    // If on a State page, use the top city in that state
    if (state && stateCities.length > 0) {
        topCityObj = { name: stateCities[0].city, salary: stateCities[0].median };
    }

    const contentYear = getContentYear();

    return (
        <div className="animate-in fade-in duration-500">
            {/* Page Header */}
            <section className="mb-10">
                <h1 className="text-3xl font-bold mb-4 text-[#003554]">
                    How Much Does a {careerTitle} Make in {locationName} in {contentYear}
                </h1>
                <p className="text-lg text-[#4A5568] leading-relaxed">
                    Comprehensive salary data for {careerTitle}s in {locationName}. Analyze earnings by percentile, compare with national averages, and identify top-paying locations.
                </p>
            </section>

            {/* Main Interactive Chart */}
            <section className="mb-12">
                <div className="h-[450px]">
                    <SalaryChart data={salaryData} professionName={careerTitle} />
                </div>
            </section>

            {/* Salary Narrative */}
            <section className="mb-12">
                <article className="prose prose-lg max-w-none 
                    prose-h2:text-2xl prose-h2:font-bold prose-h2:text-[#003554] prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[#006494]/10
                    prose-p:text-[#4A5568] prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:text-[#003554] prose-strong:font-semibold">
                    <div dangerouslySetInnerHTML={{ __html: narrative.intro }} />
                </article>
            </section>

            {/* State vs National Comparison (for state pages only) */}
            {state && vsNational !== undefined && !city && (
                <section className="mb-12">
                    <div className={`p-6 rounded-xl ${vsNational.isPositive ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                        <h2 className="text-xl font-bold mb-3 text-[#003554]">Performance vs National Average</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            The average salary in <strong>{locationData?.stateName}</strong> is
                            <strong className={vsNational.isPositive ? ' text-green-700' : ' text-orange-700'}> {Math.abs(vsNational.percent).toFixed(1)}% {vsNational.isPositive ? 'higher' : 'lower'} </strong>
                            than the national average.
                        </p>
                    </div>
                </section>
            )}

            {/* State-by-State Breakdown (National page only) */}
            {!city && !state && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-[#003554] pb-2 border-b border-[#006494]/10">
                        Salary by State
                    </h2>
                    <StateComparisonTable
                        states={allStates}
                        nationalMedian={nationalData?.annualMedian || 0}
                        profession={profession}
                        limit={10}
                    />
                </section>
            )}

            {/* Top 10 Paying Cities (National page) */}
            {!city && !state && topCitiesNational.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-[#003554] pb-2 border-b border-[#006494]/10">
                        Top 10 Paying Cities
                    </h2>
                    <CityComparisonTable
                        cities={topCitiesNational}
                        baselineMedian={nationalData?.annualMedian || 0}
                        profession={profession}
                        limit={10}
                        title=""
                    />
                </section>
            )}

            {/* Cities in State (State page only) */}
            {state && !city && stateCities.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-[#003554] pb-2 border-b border-[#006494]/10">
                        Top Paying Cities in {locationData?.stateName}
                    </h2>
                    <CityComparisonTable
                        cities={stateCities}
                        baselineMedian={salaryData.annualMedian || 0}
                        profession={profession}
                        stateCode={state}
                        limit={10}
                        title=""
                    />
                </section>
            )}

            {/* Factors Affecting Salary - Prose Style */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-[#003554] pb-2 border-b border-[#006494]/10">
                    {factorsContent.title}
                </h2>
                <div className="space-y-4">
                    {factorsContent.factors.map((factor: string, i: number) => (
                        <p key={i} className="text-[#4A5568] leading-relaxed">
                            <span dangerouslySetInnerHTML={{ __html: factor.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#003554]">$1</strong>') }} />
                        </p>
                    ))}
                </div>
            </section>

            {/* Related Links */}
            <section className="pt-8 border-t border-[#006494]/10 space-y-8">
                <InternalLinks
                    profession={dbSlug}
                    state={state}
                    city={city}
                />
                <RelatedSalaries
                    currentProfession={dbSlug}
                    state={state}
                    city={city}
                    availableSlugs={availableRelatedSlugs}
                />
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </div>
    );
}
