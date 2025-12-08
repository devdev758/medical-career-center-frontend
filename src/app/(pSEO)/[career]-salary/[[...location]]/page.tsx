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
    try {
        if (!career) {
            console.error("getData: career param is missing");
            return { salaryData: null, locationName: "", locationType: "", careerTitle: "", relatedLocations: [], careerKeyword: "" };
        }

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
            return { salaryData: null, locationName, locationType, careerTitle: formatCareerTitle(careerKeyword), careerKeyword, relatedLocations: [] };
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
    } catch (error) {
        console.error("Error in getData:", error);
        throw error; // Re-throw to be caught by error boundary
    }
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
    console.log("SalaryPage: Rendering started", params);
    try {
        const { career, location } = params;

        console.log("SalaryPage: calling getData");
        const { salaryData, locationName, locationType, careerTitle, relatedLocations, careerKeyword } = await getData(career, location);
        console.log("SalaryPage: getData returned", { locationName, hasSalaryData: !!salaryData });

        if (!salaryData) {
            console.log("SalaryPage: No salary data, returning notFound");
            return notFound();
        }

        console.log("SalaryPage: Generating narrative");
        const narrative = generateWageNarrative(salaryData, careerTitle, locationName);

        console.log("SalaryPage: Generating FAQ");
        const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);

        console.log("SalaryPage: Getting career description");
        const careerDescription = getCareerDescription(careerKeyword);

        console.log("SalaryPage: Rendering JSX");
        return (
            <main className="container mx-auto py-10 px-4">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Hero Section */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                {careerTitle} Salary in <span className="text-primary">{locationName}</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Updated for 2025 • Data from Bureau of Labor Statistics
                            </p>

                            <div className="flex flex-wrap gap-4 mt-6">
                                <Card className="bg-primary/5 border-primary/20">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <DollarSign className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">Average Annual</p>
                                            <p className="text-2xl font-bold text-primary">
                                                {formatCurrency(salaryData.annualMedian || 0)}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-primary/5 border-primary/20">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <Clock className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">Average Hourly</p>
                                            <p className="text-2xl font-bold text-primary">
                                                ${salaryData.hourlyMedian?.toFixed(2) || "N/A"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <Separator />

                        {/* What is Section */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold mb-4">What is a {careerTitle}?</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {careerDescription}
                            </p>
                        </section>

                        {/* Narrative Salary Section */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold mb-4">How much does a {careerTitle} make in {locationName}?</h2>
                            <p className="text-lg leading-relaxed mb-4">
                                <ReactMarkdown>{narrative.intro}</ReactMarkdown>
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Starting Salary</CardTitle>
                                        <CardDescription>10th Percentile</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Entry-level positions start around:
                                        </p>
                                        <p className="font-medium">
                                            <ReactMarkdown>{narrative.starting}</ReactMarkdown>
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Experienced Salary</CardTitle>
                                        <CardDescription>90th Percentile</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Top earners can make up to:
                                        </p>
                                        <p className="font-medium">
                                            <ReactMarkdown>{narrative.experienced}</ReactMarkdown>
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <p className="text-lg leading-relaxed">
                                <ReactMarkdown>{narrative.median}</ReactMarkdown>
                            </p>
                        </section>

                        {/* Factors Section */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold mb-4">Factors Affecting {careerTitle} Salary</h2>
                            <ul className="space-y-2">
                                <li><strong>Experience:</strong> Senior roles with 5+ years of experience command significantly higher wages.</li>
                                <li><strong>Location:</strong> Salaries vary by state and city due to cost of living differences.</li>
                                <li><strong>Education:</strong> Advanced certifications and degrees can lead to higher pay bands.</li>
                                <li><strong>Employer Type:</strong> Hospitals, private clinics, and government agencies offer different compensation packages.</li>
                            </ul>
                        </section>

                        {/* Job CTA */}
                        <Card className="bg-primary text-primary-foreground">
                            <CardContent className="p-8 text-center space-y-4">
                                <h3 className="text-2xl font-bold">Looking for a {careerTitle} Job in {locationName}?</h3>
                                <p className="text-primary-foreground/90 max-w-xl mx-auto">
                                    We have open positions available right now. Browse listings and apply today.
                                </p>
                                <Button size="lg" variant="secondary" asChild className="mt-4">
                                    <Link href={`/${careerKeyword}-jobs${location ? '/' + location.join('/') : ''}`}>
                                        View {careerTitle} Jobs
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Median Annual</span>
                                    <span className="font-bold text-foreground">{formatCurrency(salaryData.annualMedian || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Median Hourly</span>
                                    <span className="font-bold text-foreground">${salaryData.hourlyMedian?.toFixed(2) || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Employment</span>
                                    <span className="font-bold">{salaryData.employmentCount?.toLocaleString() || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-muted-foreground">Data Source</span>
                                    <span className="font-bold">BLS (May 2024)</span>
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
                                        {relatedLocations.map((loc: any) => (
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

                        {/* Related Careers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Related Careers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    <Link href="/registered-nurses-salary" className="text-sm hover:underline text-primary">
                                        Registered Nurses Salary
                                    </Link>
                                    <Link href="/nurse-practitioners-salary" className="text-sm hover:underline text-primary">
                                        Nurse Practitioners Salary
                                    </Link>
                                    <Link href="/physician-assistants-salary" className="text-sm hover:underline text-primary">
                                        Physician Assistants Salary
                                    </Link>
                                    <Link href="/dental-hygienists-salary" className="text-sm hover:underline text-primary">
                                        Dental Hygienists Salary
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* JSON-LD Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            </main>
        );
    } catch (e) {
        console.error("CRITICAL ERROR IN SALARY PAGE RENDER:", e);
        throw e;
    }
}
