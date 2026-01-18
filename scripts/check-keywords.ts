import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Get all unique career keywords in DB
    const allKeywords = await prisma.salaryData.findMany({
        where: { locationId: null },
        distinct: ['careerKeyword'],
        select: { careerKeyword: true, annualMedian: true },
        orderBy: { careerKeyword: 'asc' }
    });

    console.log('All career keywords in salary database:\n');
    for (const kw of allKeywords) {
        console.log(`  ${kw.careerKeyword}: $${Math.round(kw.annualMedian || 0).toLocaleString()}`);
    }
    console.log(`\nTotal: ${allKeywords.length} keywords`);
}

main().finally(() => prisma.$disconnect());
