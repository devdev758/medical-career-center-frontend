
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkIndustryData() {
    console.log('--- Checking Filtered Industry Data for National Page Logic ---');
    const industryRecords = await prisma.industryEmployment.findMany({
        where: { careerKeyword: 'nursing-assistants', year: 2024, employment: { not: null } },
        orderBy: { employment: 'desc' }
    });

    // Simulate the filtering logic used in the page component
    const filtered = industryRecords
        .filter(i => {
            const isBroadSector = i.naicsCode.length < 4;
            const isTotalOrGovt = i.naicsCode.startsWith('00') || i.naicsCode.startsWith('99');
            const isHealthcareSector = i.naicsCode === '62';
            return !isBroadSector && !isTotalOrGovt && !isHealthcareSector;
        })
        .slice(0, 8);

    console.log('Number of industries found:', filtered.length);
    filtered.forEach(ind => {
        console.log(ind.naicsCode + ': ' + ind.naicsTitle + ' - ' + ind.employment);
    });
}

checkIndustryData().finally(() => prisma.$disconnect());
