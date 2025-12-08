import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "@/lib/content-generator";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Registered Nurses Salary in United States (2025 Guide)",
    description: "How much does a Registered Nurse make in the United States? View average salary, hourly pay, and wage distribution for 2025.",
};

export default async function Page() {
    const salaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: "registered-nurses",
            locationId: null,
            year: 2024
        }
    });

    if (!salaryData) {
        return notFound();
    }

    const careerTitle = "Registered Nurse";
    const locationName = "United States";
    const narrative = generateWageNarrative(salaryData, careerTitle, locationName);
    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
    const careerDescription = getCareerDescription("registered-nurses");

    const relatedStates = await prisma.location.findMany({
        where: { city: "" },
        take: 10,
        orderBy: { stateName: 'asc' }
    });

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Home
                </Link>
            </div>

            <article className="prose prose-lg dark:prose-invert max-w-none">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    How much does a {careerTitle} make in {locationName}?
                </h1>

                <p className="text-xl leading-relaxed">
                    According to data from the Bureau of Labor Statistics, the average annual salary for {careerTitle.toLowerCase()}s in {locationName} is <strong>{formatCurrency(salaryData.annualMean || 0)}</strong>.
                </p>

                {salaryData.employmentCount && (
                    <p className="text-lg">
                        With <strong>{salaryData.employmentCount.toLocaleString()}</strong> employed {careerTitle.toLowerCase()}s nationwide, this occupation plays a vital role in healthcare delivery across the country.
                    </p>
                )}

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">{careerTitle} Salary in {locationName} – Overview</h2>

                <p className="text-lg mb-4">{narrative.overview}</p>

                <ul className="space-y-2 text-lg">
                    {narrative.distribution.map((item, index) => (
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

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">How Many {careerTitle}s Are There in {locationName}?</h2>
                {salaryData.employmentCount && (
                    <p className="text-lg">
                        In {locationName}, there's a substantial community of {careerTitle.toLowerCase()}s. As of the latest data, <strong>{salaryData.employmentCount.toLocaleString()}</strong> of them were employed across the nation.
                    </p>
                )}

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">Factors Affecting {careerTitle} Salary</h2>
                <ul className="space-y-3 text-lg">
                    <li><strong>Experience:</strong> Senior roles with 5+ years of experience command significantly higher wages.</li>
                    <li><strong>Location:</strong> Salaries vary by state and city due to cost of living differences.</li>
                    <li><strong>Education:</strong> Advanced certifications and degrees can lead to higher pay bands.</li>
                    <li><strong>Employer Type:</strong> Hospitals, private clinics, and government agencies offer different compensation packages.</li>
                    <li><strong>Specialization:</strong> Specialized nursing fields like ICU, ER, or surgical nursing often command premium wages.</li>
                </ul>
            </article>

            <Separator className="my-12" />

            <div className="grid md:grid-cols-2 gap-8 my-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            Quick Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Mean Annual</span>
                            <span className="font-bold">{formatCurrency(salaryData.annualMean || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Median Annual</span>
                            <span className="font-bold">{formatCurrency(salaryData.annualMedian || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Median Hourly</span>
                            <span className="font-bold">${salaryData.hourlyMedian?.toFixed(2) || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground">Employment</span>
                            <span className="font-bold">{salaryData.employmentCount?.toLocaleString() || "N/A"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>View by State</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {relatedStates.map((state) => (
                                <Button key={state.id} variant="outline" size="sm" asChild>
                                    <Link href={`/registered-nurses-salary/${state.slug}`}>
                                        {state.stateName}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-primary text-primary-foreground my-12">
                <CardContent className="p-8 text-center space-y-4">
                    <h3 className="text-2xl font-bold">Looking for a {careerTitle} Job?</h3>
                    <p className="text-primary-foreground/90 max-w-xl mx-auto">
                        We have open positions available right now. Browse listings and apply today.
                    </p>
                    <Button size="lg" variant="secondary" asChild className="mt-4">
                        <Link href="/registered-nurses-jobs">
                            View {careerTitle} Jobs
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </main>
    );
}
