
import { PrismaClient } from "@prisma/client";
import { generateWageNarrative, generateFAQSchema, getCareerDescription, formatCurrency } from "../src/lib/content-generator";

const prisma = new PrismaClient();

async function getData(career: string, locationSlugs?: string[]) {
    console.log(`[DEBUG] getData called with career="${career}", locationSlugs=${JSON.stringify(locationSlugs)}`);

    try {
        if (!career) {
            console.error("getData: career param is missing");
            return { salaryData: null, error: "Missing career param" };
        }

        const careerKeyword = career.replace("-salary", "");
        console.log(`[DEBUG] careerKeyword: "${careerKeyword}"`);

        let locationId = null;
        let locationName = "United States";
        let locationType = "NATIONAL";

        if (locationSlugs && locationSlugs.length > 0) {
            if (locationSlugs.length === 1) {
                // State level
                const stateSlug = locationSlugs[0];
                console.log(`[DEBUG] Looking up state slug: "${stateSlug}"`);
                const loc = await prisma.location.findFirst({ where: { slug: stateSlug } });
                if (loc) {
                    console.log(`[DEBUG] Found state: ${loc.stateName} (${loc.id})`);
                    locationId = loc.id;
                    locationName = loc.stateName;
                    locationType = "STATE";
                } else {
                    console.log(`[DEBUG] State not found for slug: "${stateSlug}"`);
                }
            } else if (locationSlugs.length === 2) {
                // City level
                const citySlug = locationSlugs[1];
                console.log(`[DEBUG] Looking up city slug: "${citySlug}"`);
                const loc = await prisma.location.findFirst({ where: { slug: citySlug } });
                if (loc) {
                    console.log(`[DEBUG] Found city: ${loc.city} (${loc.id})`);
                    locationId = loc.id;
                    locationName = `${loc.city}, ${loc.state}`;
                    locationType = "CITY";
                } else {
                    console.log(`[DEBUG] City not found for slug: "${citySlug}"`);
                }
            }
        }

        // Fetch Salary Data
        console.log(`[DEBUG] Fetching SalaryData for keyword="${careerKeyword}", locationId=${locationId}, year=2024`);
        const salaryData = await prisma.salaryData.findFirst({
            where: {
                careerKeyword: careerKeyword,
                locationId: locationId,
                year: 2024
            },
            include: { location: true }
        });

        if (!salaryData) {
            console.log("[DEBUG] No salary data found.");
            return { salaryData: null, error: "No salary data found" };
        }

        console.log("[DEBUG] Salary Data Found:", JSON.stringify(salaryData, null, 2));

        return { salaryData, locationName, locationType, careerKeyword };
    } catch (error) {
        console.error("[DEBUG] Error in getData:", error);
        throw error;
    }
}

async function main() {
    try {
        // Test Case 1: National
        console.log("\n--- TESTING NATIONAL ---");
        await testPage("registered-nurses-salary", []);

        // Test Case 2: California
        console.log("\n--- TESTING CALIFORNIA ---");
        await testPage("registered-nurses-salary", ["california"]);

    } catch (e) {
        console.error("Main Script Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

async function testPage(career: string, location: string[]) {
    const data = await getData(career, location);

    if (data.salaryData) {
        console.log("[DEBUG] Generating Narrative...");
        try {
            const narrative = generateWageNarrative(data.salaryData, "Registered Nurse", data.locationName || "Location");
            console.log("[DEBUG] Narrative Generated Successfully:", narrative);
        } catch (e) {
            console.error("[DEBUG] Narrative Generation FAILED:", e);
        }

        console.log("[DEBUG] Generating FAQ...");
        try {
            const faq = generateFAQSchema("Registered Nurse", data.locationName || "Location", data.salaryData);
            console.log("[DEBUG] FAQ Generated Successfully");
        } catch (e) {
            console.error("[DEBUG] FAQ Generation FAILED:", e);
        }
    }
}

main();
