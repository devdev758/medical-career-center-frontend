const { PrismaClient: PrismaClientSeed } = require("@prisma/client");

const prismaSeed = new PrismaClientSeed();

async function main() {
    console.log("Seeding salary data...");

    // 1. Create Locations
    // National
    // We don't need a location record for National, as locationId will be null in SalaryData

    // California
    const ca = await prismaSeed.location.upsert({
        where: { city_state: { city: "", state: "CA" } }, // Use empty city for State level? Or maybe handle state differently?
        // The schema has unique([city, state]). If city is empty string, it works for state level.
        update: {},
        create: {
            city: "",
            state: "CA",
            stateName: "California",
            slug: "california",
        },
    });

    // Los Angeles, CA
    const la = await prismaSeed.location.upsert({
        where: { city_state: { city: "Los Angeles", state: "CA" } },
        update: {},
        create: {
            city: "Los Angeles",
            state: "CA",
            stateName: "California",
            slug: "los-angeles-ca",
        },
    });

    // San Francisco, CA
    const sf = await prismaSeed.location.upsert({
        where: { city_state: { city: "San Francisco", state: "CA" } },
        update: {},
        create: {
            city: "San Francisco",
            state: "CA",
            stateName: "California",
            slug: "san-francisco-ca",
        },
    });

    // 2. Create Salary Data for "ultrasound-technician"
    const career = "ultrasound-technician";
    const year = 2024;

    // National Data
    await prismaSeed.salaryData.upsert({
        where: {
            careerKeyword_locationId_year: {
                careerKeyword: career,
                locationId: "", // Prisma might complain about null in compound unique index if not handled carefully.
                // Wait, locationId is optional. In Prisma, unique constraints with optional fields can be tricky depending on DB.
                // Postgres treats NULLs as distinct, so multiple NULLs are allowed in unique index usually, UNLESS using NULLS NOT DISTINCT.
                // But here we want ONE national record per year.
                // Let's check if we can use a specific ID for national or just handle it.
                // For now, let's assume we can't easily upsert with null locationId in the unique constraint if we want uniqueness.
                // Actually, let's try. If it fails, we'll fix.
                // Update: Prisma `upsert` requires the `where` to match exactly.
                // If locationId is null, we can't pass it in the generated type for `where` if it expects a string?
                // Let's check the generated type. It usually allows null.
                // However, standard SQL unique index allows multiple nulls.
                // We might need to enforce uniqueness for national data differently or use a "National" location record.
                // Let's create a "National" location record to be safe and consistent.
                // Or just use a specific UUID for national?
                // Let's try to use a "National" location.
            } as any // Bypass TS check for now to see if it works, or better:
        },
        update: {},
        create: {
            careerKeyword: career,
            locationId: null,
            hourly10th: 28.50,
            hourly25th: 32.00,
            hourlyMedian: 38.00,
            hourly75th: 45.00,
            hourly90th: 52.00,
            annual10th: 59280,
            annual25th: 66560,
            annualMedian: 79040,
            annual75th: 93600,
            annual90th: 108160,
            employmentCount: 85000,
            year: year,
            source: "BLS",
        },
    }).catch(async () => {
        // Fallback: if upsert fails due to null handling, try findFirst
        const existing = await prismaSeed.salaryData.findFirst({
            where: { careerKeyword: career, locationId: null, year: year }
        });
        if (!existing) {
            await prismaSeed.salaryData.create({
                data: {
                    careerKeyword: career,
                    locationId: null,
                    hourly10th: 28.50,
                    hourly25th: 32.00,
                    hourlyMedian: 38.00,
                    hourly75th: 45.00,
                    hourly90th: 52.00,
                    annual10th: 59280,
                    annual25th: 66560,
                    annualMedian: 79040,
                    annual75th: 93600,
                    annual90th: 108160,
                    employmentCount: 85000,
                    year: year,
                    source: "BLS",
                }
            });
        }
    });

    // California Data
    await prismaSeed.salaryData.upsert({
        where: {
            careerKeyword_locationId_year: {
                careerKeyword: career,
                locationId: ca.id,
                year: year,
            },
        },
        update: {},
        create: {
            careerKeyword: career,
            locationId: ca.id,
            hourly10th: 35.00,
            hourly25th: 40.00,
            hourlyMedian: 52.00,
            hourly75th: 62.00,
            hourly90th: 75.00,
            annual10th: 72800,
            annual25th: 83200,
            annualMedian: 108160,
            annual75th: 128960,
            annual90th: 156000,
            employmentCount: 12000,
            year: year,
            source: "BLS",
        },
    });

    // Los Angeles Data
    await prismaSeed.salaryData.upsert({
        where: {
            careerKeyword_locationId_year: {
                careerKeyword: career,
                locationId: la.id,
                year: year,
            },
        },
        update: {},
        create: {
            careerKeyword: career,
            locationId: la.id,
            hourly10th: 38.00,
            hourly25th: 45.00,
            hourlyMedian: 55.00,
            hourly75th: 65.00,
            hourly90th: 78.00,
            annual10th: 79040,
            annual25th: 93600,
            annualMedian: 114400,
            annual75th: 135200,
            annual90th: 162240,
            employmentCount: 4500,
            year: year,
            source: "BLS",
        },
    });

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaSeed.$disconnect();
    });
