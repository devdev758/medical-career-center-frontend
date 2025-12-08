import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, TrendingUp, DollarSign, BookOpen, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "@/lib/content-generator";

// Force dynamic rendering
export const revalidate = 3600;

interface PageProps {
    params: {
        career: string;
        location?: string[];
    };
}

// Helper to format career slug to title
const formatCareerTitle = (slug: string) => {
    return slug
        .replace("-salary", "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

async function getData(career: string, locationSlugs?: string[]) {
    const careerKeyword = career.replace("-salary", ""); // e.g. "registered-nurses"

    let locationId = null;
    let locationName = "United States";
    let locationType = "NATIONAL";

    if (locationSlugs && locationSlugs.length > 0) {
        if (locationSlugs.length === 1) {
            // State level
            const stateSlug = locationSlugs[0];
            const loc = await prisma.location.findFirst({ where: { slug: stateSlug } });
            if (loc) {
                locationId = loc.id;
                locationName = loc.stateName;
                locationType = "STATE";
            }
        } else if (locationSlugs.length === 2) {
            // City level
            const citySlug = locationSlugs[1];
            const loc = await prisma.location.findFirst({ where: { slug: citySlug } });
            if (loc) {
                locationId = loc.id;
                locationName = `${loc.city}, ${loc.state}`;
                locationType = "CITY";
            }
        }
    }

    // Fetch Salary Data
    const salaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: careerKeyword,
            locationId: locationId,
            year: 2024
        },
        include: { location: true }
    });

    if (!salaryData) {
        // Fallback or 404? For pSEO, maybe show national data with a note?
        // For now, let's return null and handle in UI
        return { salaryData: null, locationName, locationType, careerTitle: formatCareerTitle(careerKeyword), careerKeyword };
    }

    // Fetch Related Locations (e.g. other cities in state, or other states)
    let relatedLocations: any[] = [];
    if (locationType === "NATIONAL") {
        // Get top paying states (mock or real query if we had sorting)
        // For now just get random states
        relatedLocations = await prisma.location.findMany({
            where: { city: "" }, // States
            take: 6
        });
    } else if (locationType === "STATE" && locationId) {
        // Get cities in this state
        const currentState = await prisma.location.findUnique({ where: { id: locationId } });
        if (currentState) {
            relatedLocations = await prisma.location.findMany({
                where: { state: currentState.state, NOT: { city: "" } },
                take: 6
            });
        }
    }

    return { salaryData, locationName, locationType, careerTitle: formatCareerTitle(careerKeyword), relatedLocations, careerKeyword };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { career, location } = params;
    const { locationName, careerTitle } = await getData(career, location);

    return {
        title: `${careerTitle} Salary in ${locationName} (2025 Guide)`,
        description: `How much does a ${careerTitle} make in ${locationName}? View average salary, hourly pay, and wage distribution for 2025.`,
    };
}

export default async function SalaryPage({ params }: PageProps) {
    const { career, location } = params;
    const { salaryData, locationName, locationType, careerTitle, relatedLocations, careerKeyword } = await getData(career, location);

    if (!salaryData) {
        return notFound();
    }

    const narrative = generateWageNarrative(salaryData, careerTitle, locationName);
    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
    const careerDescription = getCareerDescription(careerKeyword);

    return (
        <main className="container mx-auto py-10 px-4">
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Breadcrumb */}
            <div className="mb-6">
                {locationType !== "NATIONAL" && (
                    <Link
                        href={`/${career}`}
                        className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to National Data
                    </Link>
                )}
            </div>

            {/* Hero Section */}
            <div className="mb-12 text-center max-w-4xl mx-auto">
                <Badge variant="outline" className="mb-4">{salaryData.year} Data Source: BLS</Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                    {careerTitle} Salary in <span className="text-primary">{locationName}</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                    The average annual salary for a {careerTitle} in {locationName} is <span className="font-bold text-foreground">{formatCurrency(salaryData.annualMedian || 0)}</span>.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href={`/${careerKeyword}-jobs${location ? '/' + location.join('/') : ''}`}>
                            View {careerTitle} Jobs
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                {/* Main Content Column */}
                <div className="md:col-span-2 space-y-10">

                    {/* 1. What is... */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">What is a {careerTitle}?</h2>
                        </div>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {careerDescription}
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* 2. Wage Distribution Narrative */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">How much does a {careerTitle} make?</h2>
                        </div>
                        <Card>
                            <CardContent className="pt-6 space-y-6">
                                <p className="text-lg leading-relaxed">{narrative.intro}</p>

                                <div className="grid gap-4 pl-4 border-l-2 border-primary/20">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Starting Salary</h3>
                                        <p className="text-muted-foreground">{narrative.starting}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Average Salary</h3>
                                        <p className="text-muted-foreground">{narrative.median}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Top Earners</h3>
                                        <p className="text-muted-foreground">{narrative.experienced}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* 3. Factors Affecting Salary */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">Factors Affecting Salary</h2>
                        </div>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="mb-4">Several factors can significantly impact your earning potential as a {careerTitle}:</p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li><strong>Experience:</strong> As shown in the data, experienced professionals can earn significantly more than entry-level staff.</li>
                                    <li><strong>Location:</strong> Cost of living and demand in specific areas (like {locationName}) drive wages up or down.</li>
                                    <li><strong>Certification:</strong> Advanced certifications often lead to higher pay grades.</li>
                                    <li><strong>Shift Differentials:</strong> Working nights, weekends, or on-call can increase total compensation.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">

                    {/* Quick Stats Card */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Annual Median</span>
                                <span className="font-bold text-lg">{formatCurrency(salaryData.annualMedian || 0)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Hourly Median</span>
                                <span className="font-bold text-lg">${salaryData.hourlyMedian?.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Employment</span>
                                <span className="font-bold">{salaryData.employmentCount?.toLocaleString() || "N/A"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Locations */}
                    {relatedLocations.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {locationType === "NATIONAL" ? "Top States" : "Nearby Cities"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {relatedLocations.map(loc => (
                                        <Button key={loc.id} variant="secondary" size="sm" asChild>
                                            <Link href={`/${career}/${loc.slug}`}>
                                                {locationType === "NATIONAL" ? loc.stateName : loc.city}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Job CTA */}
                    <Card className="bg-blue-600 text-white border-none">
                        <CardHeader>
                            <CardTitle className="text-white">Hiring Now?</CardTitle>
                            <CardDescription className="text-blue-100">
                                Find the best {careerTitle} jobs in {locationName}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full" asChild>
                                <Link href={`/${careerKeyword}-jobs${location ? '/' + location.join('/') : ''}`}>
                                    Search Jobs
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </main>
    );
}
