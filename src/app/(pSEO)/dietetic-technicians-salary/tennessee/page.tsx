import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "@/lib/content-generator";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Dietetic Technicians Salary in Tennessee (2025 Guide)",
    description: "How much does a Dietetic Technicians make in Tennessee? View average salary, hourly pay, and wage distribution for 2025.",
};

export default async function Page() {
    const salaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: "dietetic-technicians",
            location: { slug: "tennessee" },
            year: 2024
        },
        include: { location: true }
    });

    if (!salaryData) {
        return notFound();
    }

    const careerTitle = "Dietetic Technicians";
    const locationName = "Tennessee";
    const narrative = generateWageNarrative(salaryData, careerTitle, locationName);
    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
    const careerDescription = getCareerDescription("dietetic-technicians");

    // Get national average for comparison
    const nationalData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: "dietetic-technicians",
            locationId: null,
            year: 2024
        }
    });

    const comparisonText = nationalData 
        ? salaryData.annualMedian && nationalData.annualMedian && salaryData.annualMedian > nationalData.annualMedian
            ? `Above the national average of ${formatCurrency(nationalData.annualMedian)}.`
            : `Compared to the national average of ${formatCurrency(nationalData.annualMedian || 0)}.`
        : "";

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
                    According to data from the Bureau of Labor Statistics, the median annual salary for {careerTitle.toLowerCase()}s in {locationName} is <strong>{formatCurrency(salaryData.annualMedian || 0)}</strong>. {comparisonText}
                </p>

                {salaryData.employmentCount && (
                    <p className="text-lg">
                        With <strong>{salaryData.employmentCount.toLocaleString()}</strong> employed {careerTitle.toLowerCase()}s in the state, this occupation plays a vital role in {locationName}'s healthcare system.
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

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">How Many {careerTitle}s Are There in {locationName}?</h2>
                {salaryData.employmentCount && (
                    <p className="text-lg">
                        In {locationName}, there's a sizable community of {careerTitle.toLowerCase()}s. As of the latest data, <strong>{salaryData.employmentCount.toLocaleString()}</strong> of them were employed across the state.
                    </p>
                )}

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">Is {locationName} a Good State for {careerTitle}s?</h2>
                <p className="text-lg">
                    {careerTitle}s in {locationName} earn competitive wages, with a median hourly wage of <strong>${salaryData.hourlyMedian?.toFixed(2) || "N/A"}</strong> per hour. {salaryData.employmentCount && `With ${salaryData.employmentCount.toLocaleString()} employed professionals, there's a strong demand for ${careerTitle.toLowerCase()}s in the state.`}
                </p>

                <Separator className="my-8" />

                <h2 className="text-3xl font-bold mb-4">Factors Affecting {careerTitle} Salary</h2>
                <ul className="space-y-3 text-lg">
                    <li><strong>Experience:</strong> Senior roles with 5+ years of experience command significantly higher wages.</li>
                    <li><strong>Location:</strong> Salaries vary by city due to cost of living differences.</li>
                    <li><strong>Education:</strong> Advanced certifications and degrees can lead to higher pay bands.</li>
                    <li><strong>Employer Type:</strong> Hospitals, private clinics, and government agencies offer different compensation packages.</li>
                    <li><strong>Specialization:</strong> Specialized fields often command premium wages.</li>
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
                        <CardTitle>Related Careers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">Explore similar healthcare careers in {locationName}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-primary text-primary-foreground my-12">
                <CardContent className="p-8 text-center space-y-4">
                    <h3 className="text-2xl font-bold">Looking for a {careerTitle} Job in {locationName}?</h3>
                    <p className="text-primary-foreground/90 max-w-xl mx-auto">
                        We have open positions available right now. Browse listings and apply today.
                    </p>
                    <Button size="lg" variant="secondary" asChild className="mt-4">
                        <Link href="/dietetic-technicians-jobs/tennessee">
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
