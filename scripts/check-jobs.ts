import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.job.count();
    console.log('Total jobs in database:', count);

    // Get count by profession
    const byProfession = await prisma.job.groupBy({
        by: ['careerKeyword'],
        _count: true,
        orderBy: { _count: { careerKeyword: 'desc' } },
        take: 10
    });
    console.log('\nTop 10 professions by job count:');
    for (const row of byProfession) {
        console.log(`  ${row.careerKeyword}: ${row._count}`);
    }
}

main().finally(() => prisma.$disconnect());
