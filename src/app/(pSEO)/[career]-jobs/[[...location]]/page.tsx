import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Building2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
        .replace("-jobs", "") // Remove -jobs suffix if present in slug param (it won't be, route is [career]-jobs)
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

async function getJobData(career: string, locationSlugs?: string[]) {
    const careerKeyword = career.replace("-jobs", ""); // e.g. "registered-nurses"

    let locationFilter: any = {};
    let locationName = "United States";
    let locationType = "NATIONAL";

    if (locationSlugs && locationSlugs.length > 0) {
        if (locationSlugs.length === 1) {
            // State level
            const stateSlug = locationSlugs[0];
            const loc = await prisma.location.findFirst({ where: { slug: stateSlug } });
            if (loc) {
                locationName = loc.stateName;
                locationType = "STATE";
                // Filter jobs by state code or name match?
                // Our job location is a string "City, State".
                // Simple contains search for now.
                locationFilter = {
                    location: { contains: loc.state } // e.g. "CA"
                };
            }
        } else if (locationSlugs.length === 2) {
            // City level
            const citySlug = locationSlugs[1];
            const loc = await prisma.location.findFirst({ where: { slug: citySlug } });
            if (loc) {
                locationName = `${loc.city}, ${loc.state}`;
                locationType = "CITY";
                locationFilter = {
                    location: { contains: loc.city } // e.g. "Los Angeles"
                };
            }
        }
    }

    // Fetch Jobs
    // Match careerKeyword AND location
    const jobs = await prisma.job.findMany({
        where: {
            careerKeyword: careerKeyword,
            ...locationFilter
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return { jobs, locationName, locationType, careerTitle: formatCareerTitle(careerKeyword) };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { career, location } = params;
    const { locationName, careerTitle } = await getJobData(career, location);

    return {
        title: `${careerTitle} Jobs in ${locationName} (Hiring Now)`,
        description: `Browse ${careerTitle} jobs in ${locationName}. Apply to the latest openings and find your next career opportunity.`,
    };
}

export default async function JobPage({ params }: PageProps) {
    const { career, location } = params;
    const { jobs, locationName, locationType, careerTitle } = await getJobData(career, location);
    const careerKeyword = career.replace("-jobs", "");

    return (
        <main className="container mx-auto py-10 px-4">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href={`/${careerKeyword}-salary${location ? '/' + location.join('/') : ''}`}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    View Salary Data for {careerTitle}
                </Link>
            </div>

            {/* Header */}
            <div className="mb-10 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                    {careerTitle} Jobs in <span className="text-primary">{locationName}</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{jobs.length}</span> open positions.
                </p>
            </div>

            {/* Job List */}
            <div className="grid gap-6 max-w-4xl mx-auto">
                {jobs.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                            <p className="text-muted-foreground">
                                We couldn't find any active listings for {careerTitle} in {locationName} right now.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    jobs.map((job: any) => (
                        <Card key={job.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <CardTitle className="text-xl mb-1">
                                            <Link href={job.externalUrl || `/jobs/${job.slug}`} className="hover:underline" target={job.externalUrl ? "_blank" : "_self"}>
                                                {job.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            {job.companyName || "Confidential"}
                                            <span className="text-muted-foreground">•</span>
                                            <MapPin className="w-4 h-4" />
                                            {job.location || locationName}
                                        </CardDescription>
                                    </div>
                                    {job.source !== "INTERNAL" && (
                                        <Badge variant="secondary" className="text-xs">
                                            {job.source === "PARTNER_FEED" ? "Partner" : job.source}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {job.description}
                                </p>
                                {job.salary && (
                                    <div className="mt-4 font-medium text-sm">
                                        {job.salary}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href={job.externalUrl || `/jobs/${job.slug}`} target={job.externalUrl ? "_blank" : "_self"}>
                                        {job.externalUrl ? (
                                            <>
                                                Apply on Partner Site <ExternalLink className="w-4 h-4 ml-2" />
                                            </>
                                        ) : (
                                            "Apply Now"
                                        )}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            {/* Lead Gen / Alert CTA */}
            <div className="mt-16 bg-muted/50 rounded-xl p-8 text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Get Notified for New Jobs</h2>
                <p className="text-muted-foreground mb-6">
                    Don't miss out. Get the latest {careerTitle} jobs in {locationName} sent to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button>Subscribe</Button>
                </div>
            </div>
        </main>
    );
}
