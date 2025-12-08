const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verify() {
    const locationCount = await prisma.location.count();
    const salaryCount = await prisma.salaryData.count();

    console.log(`Locations: ${locationCount}`);
    console.log(`Salary Records: ${salaryCount}`);

    // Check a sample
    const sample = await prisma.salaryData.findFirst({
        include: { location: true }
    });

    if (sample) {
        console.log('Sample Record:', JSON.stringify(sample, null, 2));
    }
}

verify()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
