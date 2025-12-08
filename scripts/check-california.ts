const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkCalifornia() {
    const career = "registered-nurses";
    const stateSlug = "california";

    console.log(`Checking data for ${career} in ${stateSlug}...`);

    const loc = await prisma.location.findFirst({
        where: { slug: stateSlug }
    });

    if (!loc) {
        console.log("Location 'california' NOT found in DB.");
        return;
    }
    console.log(`Location found: ${loc.stateName} (${loc.id})`);

    const salary = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: career,
            locationId: loc.id
        }
    });

    if (salary) {
        console.log(`Salary Data FOUND: $${salary.annualMedian}`);
    } else {
        console.log("Salary Data NOT found for this location.");
    }
}

checkCalifornia()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
