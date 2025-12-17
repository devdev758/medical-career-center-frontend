import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from '@/lib/content-generator';

// Helper to format career title from slug
function formatCareerTitle(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper to format location name from slug
function formatLocationName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Generate HTML for salary page
async function generateSalaryPageHTML(profession: string, location?: string) {
    try {
        // Fetch salary data
        const salaryData = location
            ? await prisma.salaryData.findFirst({
                where: {
                    careerKeyword: profession,
                    location: { slug: location },
                    year: 2024
                },
                include: { location: true }
            })
            : await prisma.salaryData.findFirst({
                where: {
                    careerKeyword: profession,
                    locationId: null,
                    year: 2024
                }
            });

        if (!salaryData) {
            return null;
        }

        const careerTitle = formatCareerTitle(profession);

        // Get location name
        let locationName = "United States";
        if (location && salaryData.locationId) {
            // Fetch location separately to avoid type issues
            const locationData = await prisma.location.findUnique({
                where: { id: salaryData.locationId }
            });
            locationName = locationData?.stateName || formatLocationName(location);
        }

        const narrative = generateWageNarrative(salaryData, careerTitle, locationName);
        const faqSchema = generateFAQSchema(careerTitle, locationName, salaryData);
        const careerDescription = getCareerDescription(profession);

        // Get national average for comparison (if state page)
        let comparisonText = "";
        if (location) {
            const nationalData = await prisma.salaryData.findFirst({
                where: {
                    careerKeyword: profession,
                    locationId: null,
                    year: 2024
                }
            });

            comparisonText = nationalData
                ? salaryData.annualMedian && nationalData.annualMedian && salaryData.annualMedian > nationalData.annualMedian
                    ? `Above the national average of ${formatCurrency(nationalData.annualMedian)}.`
                    : `Compared to the national average of ${formatCurrency(nationalData.annualMedian || 0)}.`
                : "";
        }

        // Generate HTML (server-side rendered)
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${careerTitle} Salary in ${locationName} (2025 Guide)</title>
    <meta name="description" content="How much does a ${careerTitle} make in ${locationName}? View average salary, hourly pay, and wage distribution for 2025.">
    <link rel="stylesheet" href="/_next/static/css/app/layout.css">
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body>
    <div class="container mx-auto py-10 px-4 max-w-5xl">
        <div class="mb-6">
            <a href="/" class="inline-flex items-center text-sm text-primary hover:underline">
                ← Back to Home
            </a>
        </div>

        <article class="prose prose-lg dark:prose-invert max-w-none">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                How much does a ${careerTitle} make in ${locationName}?
            </h1>

            <p class="text-xl leading-relaxed">
                According to data from the Bureau of Labor Statistics, the median annual salary for ${careerTitle.toLowerCase()}s in ${locationName} is <strong>${formatCurrency(salaryData.annualMedian || 0)}</strong>. ${comparisonText}
            </p>

            ${salaryData.employmentCount ? `
            <p class="text-lg">
                With <strong>${salaryData.employmentCount.toLocaleString()}</strong> employed ${careerTitle.toLowerCase()}s ${location ? 'in the state' : 'nationwide'}, this occupation plays a vital role in ${locationName}'s healthcare system.
            </p>
            ` : ''}

            <div class="grid md:grid-cols-3 gap-6 my-8 not-prose">
                <div class="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 bg-primary/10 rounded-full">💰</div>
                        <p class="text-sm text-muted-foreground font-medium">Median Annual</p>
                    </div>
                    <p class="text-3xl font-bold text-primary">${formatCurrency(salaryData.annualMedian || 0)}</p>
                    <p class="text-sm text-muted-foreground mt-1">$${salaryData.hourlyMedian?.toFixed(2) || "N/A"}/hour</p>
                </div>

                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 bg-green-100 rounded-full">📈</div>
                        <p class="text-sm text-muted-foreground font-medium">Top 10%</p>
                    </div>
                    <p class="text-3xl font-bold text-green-700">${formatCurrency(salaryData.annual90th || 0)}</p>
                    <p class="text-sm text-muted-foreground mt-1">$${salaryData.hourly90th?.toFixed(2) || "N/A"}/hour</p>
                </div>

                <div class="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 bg-orange-100 rounded-full">⏰</div>
                        <p class="text-sm text-muted-foreground font-medium">Starting (10th %)</p>
                    </div>
                    <p class="text-3xl font-bold text-orange-700">${formatCurrency(salaryData.annual10th || 0)}</p>
                    <p class="text-sm text-muted-foreground mt-1">$${salaryData.hourly10th?.toFixed(2) || "N/A"}/hour</p>
                </div>
            </div>

            <hr class="my-8">

            <h2 class="text-3xl font-bold mb-4">${careerTitle} Salary in ${locationName} – Overview</h2>
            <div class="whitespace-pre-line text-lg mb-4">${narrative.intro}</div>

            <p class="text-lg mt-6">Let's dive deeper into the wage distribution:</p>

            <hr class="my-8">

            <h2 class="text-3xl font-bold mb-4">Wage Distribution: How Do Salaries Vary Among ${careerTitle}s in ${locationName}?</h2>

            <div class="space-y-4 text-lg">
                <p><strong>Starting Out:</strong> ${narrative.wageBreakdown.starting}</p>
                <p><strong>Early Career:</strong> ${narrative.wageBreakdown.earlyCareer}</p>
                <p><strong>Most Common:</strong> ${narrative.wageBreakdown.median}</p>
                <p><strong>Experienced:</strong> ${narrative.wageBreakdown.experienced}</p>
                <p><strong>Top Earners:</strong> ${narrative.wageBreakdown.topEarners}</p>
            </div>

            <hr class="my-8">

            <h2 class="text-3xl font-bold mb-4">What is a ${careerTitle}?</h2>
            <p class="text-lg">${careerDescription}</p>

            <hr class="my-8">

            <div class="bg-primary text-white rounded-lg p-8 text-center my-12">
                <h3 class="text-2xl font-bold mb-4">Looking for a ${careerTitle} Job${location ? ` in ${locationName}` : ''}?</h3>
                <p class="mb-6">We have open positions available right now. Browse listings and apply today.</p>
                <a href="/${profession}-jobs${location ? `/${location}` : ''}" class="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                    View ${careerTitle} Jobs
                </a>
            </div>
        </article>
    </div>
</body>
</html>
        `;

        return html;
    } catch (error) {
        console.error('Error generating salary page:', error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    // Get parameters from headers (passed by middleware)
    const profession = request.headers.get('x-salary-profession');
    const location = request.headers.get('x-salary-location');

    console.log('[API] Received:', { profession, location });

    if (!profession) {
        return new NextResponse('Profession required', { status: 400 });
    }

    const html = await generateSalaryPageHTML(profession, location || undefined);

    if (!html) {
        return new NextResponse('Page not found', { status: 404 });
    }

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
