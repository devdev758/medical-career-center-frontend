const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkJobsIssue() {
    console.log('🔍 Investigating Jobs Issue...\n');

    // Check total jobs
    const totalJobs = await prisma.job.count();
    console.log(`Total jobs in database: ${totalJobs}`);

    // Check RN jobs with different keyword variations
    const rnJobsPlural = await prisma.job.count({
        where: { careerKeyword: 'registered-nurses' }
    });
    console.log(`Jobs with keyword 'registered-nurses': ${rnJobsPlural}`);

    const rnJobsSingular = await prisma.job.count({
        where: { careerKeyword: 'registered-nurse' }
    });
    console.log(`Jobs with keyword 'registered-nurse': ${rnJobsSingular}`);

    // Get distinct career keywords
    const distinctKeywords = await prisma.job.findMany({
        select: { careerKeyword: true },
        distinct: ['careerKeyword'],
        take: 20
    });
    console.log('\nDistinct career keywords found:');
    distinctKeywords.forEach((job: any) => console.log(`  - ${job.careerKeyword}`));

    // Sample jobs to see structure
    const sampleJobs = await prisma.job.findMany({ take: 3 });
    console.log('\nSample job records:');
    sampleJobs.forEach((job: any) => {
        console.log(`  ID: ${job.id}, Keyword: ${job.careerKeyword}, Title: ${job.title}`);
    });
}

checkJobsIssue()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
