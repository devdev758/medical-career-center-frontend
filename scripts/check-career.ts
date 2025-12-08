const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkCareer() {
    const career = "registered-nurses";

    const count = await prisma.salaryData.count({
        where: { careerKeyword: career }
    });

    console.log(`Records for ${career}: ${count}`);

    const samples = await prisma.salaryData.findMany({
        where: { careerKeyword: career },
        take: 5,
        include: { location: true }
    });

    samples.forEach((s: any) => {
        const loc = s.location ? `${s.location.city}, ${s.location.state}` : "National";
        console.log(`${loc}: $${s.annualMedian}`);
    });
}

checkCareer()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
