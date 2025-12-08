import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "@/lib/content-generator";

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

export const metadata = {
    title: "Registered Nurses Salary in California (2025 Guide)",
    description: "How much does a Registered Nurse make in California? View average salary, hourly pay, and wage distribution for 2025.",
};

export default async function Page() {
    const salaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: "registered-nurses",
            location: { slug: "california" },
            year: 2024
        },
        include: { location: true }
    });

    if (!salaryData) {
        return notFound();
    }

    const careerTitle = "Registered Nurse";
    const locationName = "California";
    const narrative = generateWageNarrative(salaryData, careerTitle, locationName);
    const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
    const careerDescription = getCareerDescription("registered-nurses");

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Home
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
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

                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">What is a {careerTitle}?</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {careerDescription}
                        </p>
                    </section>

                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">How much does a {careerTitle} make in {locationName}?</h2>
                        <p className="text-lg leading-relaxed mb-4">
                            <MarkdownText>{narrative.intro}</MarkdownText>
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
                                        <MarkdownText>{narrative.starting}</MarkdownText>
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
                                        <MarkdownText>{narrative.experienced}</MarkdownText>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <p className="text-lg leading-relaxed">
                            <MarkdownText>{narrative.median}</MarkdownText>
                        </p>
                    </section>

                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">Factors Affecting {careerTitle} Salary</h2>
                        <ul className="space-y-2">
                            <li><strong>Experience:</strong> Senior roles with 5+ years of experience command significantly higher wages.</li>
                            <li><strong>Location:</strong> Salaries vary by state and city due to cost of living differences.</li>
                            <li><strong>Education:</strong> Advanced certifications and degrees can lead to higher pay bands.</li>
                            <li><strong>Employer Type:</strong> Hospitals, private clinics, and government agencies offer different compensation packages.</li>
                        </ul>
                    </section>

                    <Card className="bg-primary text-primary-foreground">
                        <CardContent className="p-8 text-center space-y-4">
                            <h3 className="text-2xl font-bold">Looking for a {careerTitle} Job in {locationName}?</h3>
                            <p className="text-primary-foreground/90 max-w-xl mx-auto">
                                We have open positions available right now. Browse listings and apply today.
                            </p>
                            <Button size="lg" variant="secondary" asChild className="mt-4">
                                <Link href="/registered-nurses-jobs/california">
                                    View {careerTitle} Jobs
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
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
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </main>
    );
}
