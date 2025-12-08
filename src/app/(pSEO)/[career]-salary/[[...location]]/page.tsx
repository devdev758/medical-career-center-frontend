import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, TrendingUp, DollarSign, BookOpen, HelpCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "@/lib/content-generator";

// Simple Markdown renderer for bold text
const MarkdownText = ({ children }: { children: string }) => {
    if (!children) return null;
    const parts = children.split(/(\*\*.*?\*\*)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
        </>
    );
};

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
            return { salaryData: null, locationName: "", locationType: "", careerTitle: "", relatedLocations: [], careerKeyword: "", error: "Missing career param" };
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
            return { salaryData: null, locationName, locationType, careerTitle: formatCareerTitle(careerKeyword), careerKeyword, relatedLocations: [], error: "No salary data found" };
        }

        // Fetch Related Locations (e.g. other cities in state, or other states)
        let relatedLocations: any[] = [];
        try {
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
        } catch (e) {
            console.error("Error fetching related locations:", e);
            // Ignore related locations error
        }

        return { salaryData, locationName, locationType, careerTitle: formatCareerTitle(careerKeyword), relatedLocations, careerKeyword, error: null };
    } catch (error) {
        console.error("Error in getData:", error);
        return {
            salaryData: null,
            locationName: "Error",
            locationType: "ERROR",
            careerTitle: "Error",
            relatedLocations: [],
            careerKeyword: "",
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const { career, location } = params;
        const data = await getData(career, location);

        if (data.error || !data.salaryData) {
            return {
                title: "Salary Data Unavailable",
                description: "Salary data is currently unavailable."
            };
        }

        const { locationName, careerTitle } = data;
        return {
            title: `${careerTitle} Salary in ${locationName} (2025 Guide)`,
            description: `How much does a ${careerTitle} make in ${locationName}? View average salary, hourly pay, and wage distribution for 2025.`,
        };
    } catch (e) {
        console.error("Error in generateMetadata:", e);
        return {
            title: "Salary Guide",
            description: "Medical career salary guide."
        };
    }
}

export default async function SalaryPage({ params }: PageProps) {
    console.log("SalaryPage: Rendering started", params);
    const { career, location } = params;

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold">Debug Mode</h1>
            <p>Career: {career}</p>
            <p>Location: {location?.join(", ") || "None"}</p>
            <p>Time: {new Date().toISOString()}</p>
        </main>
    );
}
