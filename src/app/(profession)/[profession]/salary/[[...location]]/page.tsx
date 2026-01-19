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

    // Fix: Use state top city for narrative if on state page
    const topCitySource = (state && stateCities.length > 0) ? stateCities[0] : (topCitiesNational.length > 0 ? topCitiesNational[0] : undefined);
    const topCityForNarrative = topCitySource ? { name: topCitySource.city, salary: topCitySource.median } : undefined;

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

    // Top Stats for Hero Cards
    const formalName = getProfessionFormalName(profession);
    const topStateObj = allStates.length > 0 ? { name: allStates[0].stateName, salary: allStates[0].median } : undefined;
    let topCityObj = topCitiesNational.length > 0 ? { name: topCitiesNational[0].city, salary: topCitiesNational[0].median } : undefined;

    // If on a State page, use the top city in that state
    if (state && stateCities.length > 0) {
        topCityObj = { name: stateCities[0].city, salary: stateCities[0].median };
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Page Header (Sub-Hero) */}
            <div className="border-b border-border/50 pb-8">
                <h1 className="text-3xl font-heading font-bold mb-4 text-foreground">
                    {careerTitle} Salary Analysis
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Comprehensive salary data for {careerTitle}s in {locationName}. Analyze earnings by percentile, compare with national averages, and identify top-paying locations.
                </p>
            </div>

            {/* Main Interactive Chart */}
            <div className="h-[400px] w-full p-4 bg-card rounded-2xl border border-border/50 shadow-sm">
                <SalaryChart data={salaryData} professionName={careerTitle} />
            </div>

            {/* Key Insights Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Narrative Card */}
                <article className="prose prose-slate dark:prose-invert max-w-none bg-muted/30 p-8 rounded-2xl border border-border/50">
                    <div dangerouslySetInnerHTML={{ __html: narrative.intro.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </article>

                {/* State vs National Card */}
                {state && vsNational !== undefined && !city && (
                    <div className={`p-8 rounded-2xl border ${vsNational.isPositive ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900' : 'bg-orange-50/50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-900'}`}>
                        <h3 className="text-xl font-bold mb-4 font-heading">Performance vs National</h3>
                        <p className="text-lg leading-relaxed">
                            The average salary in <strong>{locationData?.stateName}</strong> is
                            <strong className="mx-1"> {formatCurrency(salaryData.annualMedian || 0)}</strong>.
                            It is <strong className={`${vsNational.isPositive ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                {Math.abs(vsNational.percent).toFixed(1)}% {vsNational.isPositive ? 'higher' : 'lower'}
                            </strong> than the national average.
                        </p>
                    </div>
                )}
            </div>

            {/* Comparison / Leaderboard */}
            <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
                {state ? (
                    <CityComparisonTable
                        cities={stateCities}
                        baselineMedian={salaryData.annualMedian || 0}
                        profession={profession}
                        stateCode={state}
                        limit={10}
                        title={`Top Paying Cities in ${locationData?.stateName}`}
                    />
                ) : (
                    <StateComparisonTable
                        states={allStates}
                        nationalMedian={nationalData?.annualMedian || 0}
                        profession={profession}
                        limit={10}
                    />
                )}
            </div>

            {/* Factors Grid */}
            <div className="bg-muted/30 rounded-2xl border border-border/50 p-8">
                <h2 className="text-2xl font-bold mb-6 font-heading text-foreground">{factorsContent.title}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {factorsContent.factors.map((factor: string, i: number) => (
                        <div key={i} className="p-4 bg-background rounded-xl border border-border/50 text-sm">
                            <div dangerouslySetInnerHTML={{ __html: factor.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Related/Footer Sections */}
            <div className="space-y-12 pt-8 border-t border-border/50">
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
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </div>
    );
}
