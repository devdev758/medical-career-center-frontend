const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Sample External Jobs Data (Simulating a feed)
const EXTERNAL_JOBS = [
    {
        externalId: "ext-001",
        title: "Travel Registered Nurse - ICU",
        companyName: "HealthTrust Workforce Solutions",
        location: "Los Angeles, CA",
        description: "We are seeking a dedicated Registered Nurse for an ICU position...",
        salary: "$2,500 - $3,200 / week",
        externalUrl: "https://example.com/job/1",
        source: "PARTNER_FEED",
        careerKeyword: "registered-nurses"
    },
    {
        externalId: "ext-002",
        title: "Ultrasound Technologist",
        companyName: "RadNet",
        location: "San Francisco, CA",
        description: "Perform diagnostic sonographic examinations...",
        salary: "$55 - $70 / hour",
        externalUrl: "https://example.com/job/2",
        source: "PARTNER_FEED",
        careerKeyword: "ultrasound-technician"
    },
    {
        externalId: "ext-003",
        title: "Dental Hygienist",
        companyName: "Smile Brands",
        location: "Austin, TX",
        description: "Provide oral hygiene care to patients...",
        salary: "$45 - $55 / hour",
        externalUrl: "https://example.com/job/3",
        source: "PARTNER_FEED",
        careerKeyword: "dental-hygienists"
    }
];

async function ingestJobs() {
    console.log("Starting Job Ingestion...");

    for (const job of EXTERNAL_JOBS) {
        console.log(`Processing: ${job.title}`);

        // Upsert Job
        await prisma.job.upsert({
            where: {
                source_externalId: {
                    source: job.source,
                    externalId: job.externalId
                }
            },
            update: {
                title: job.title,
                description: job.description,
                location: job.location,
                salary: job.salary,
                companyName: job.companyName,
                externalUrl: job.externalUrl,
                careerKeyword: job.careerKeyword,
                // Ensure slug is unique if we generate it, or use externalId in slug
                slug: `${job.careerKeyword}-${job.externalId}`
            },
            create: {
                title: job.title,
                description: job.description,
                location: job.location,
                salary: job.salary,
                companyName: job.companyName,
                externalUrl: job.externalUrl,
                source: job.source,
                externalId: job.externalId,
                careerKeyword: job.careerKeyword,
                slug: `${job.careerKeyword}-${job.externalId}`,
                type: "FULL_TIME", // Default
                remote: false
            }
        });
    }

    console.log("Ingestion Complete.");
}

ingestJobs()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
