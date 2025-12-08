import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countPages() {
    console.log('📊 Counting salary pages to be generated...\n');

    try {
        // Get all unique career keywords
        const careers = await prisma.salaryData.findMany({
            select: {
                careerKeyword: true
            },
            distinct: ['careerKeyword']
        });

        console.log(`✅ Found ${careers.length} unique professions`);
        console.log('Professions:', careers.map(c => c.careerKeyword).join(', '));
        console.log('');

        // Get all locations (states and cities)
        const states = await prisma.location.findMany({
            where: {
                city: ""
            }
        });

        const cities = await prisma.location.findMany({
            where: {
                NOT: {
                    city: ""
                }
            }
        });

        console.log(`✅ Found ${states.length} states`);
        console.log(`✅ Found ${cities.length} cities`);
        console.log('');

        // Count actual salary data combinations
        const nationalData = await prisma.salaryData.count({
            where: {
                locationId: null,
                year: 2024
            }
        });

        const stateData = await prisma.salaryData.count({
            where: {
                locationId: { not: null },
                location: { city: "" },
                year: 2024
            }
        });

        const cityData = await prisma.salaryData.count({
            where: {
                locationId: { not: null },
                location: { NOT: { city: "" } },
                year: 2024
            }
        });

        console.log('📈 Salary Data Available:');
        console.log(`   National pages: ${nationalData} (1 per profession)`);
        console.log(`   State pages: ${stateData} (profession × state combinations)`);
        console.log(`   City pages: ${cityData} (profession × city combinations)`);
        console.log('');

        const totalPages = nationalData + stateData + cityData;

        console.log('🎯 TOTAL PAGES TO GENERATE:');
        console.log(`   ${totalPages.toLocaleString()} salary pages`);
        console.log('');

        // Get breakdown by profession
        console.log('📋 Breakdown by Profession:');
        for (const career of careers) {
            const national = await prisma.salaryData.count({
                where: {
                    careerKeyword: career.careerKeyword,
                    locationId: null,
                    year: 2024
                }
            });

            const states = await prisma.salaryData.count({
                where: {
                    careerKeyword: career.careerKeyword,
                    locationId: { not: null },
                    location: { city: "" },
                    year: 2024
                }
            });

            const cities = await prisma.salaryData.count({
                where: {
                    careerKeyword: career.careerKeyword,
                    locationId: { not: null },
                    location: { NOT: { city: "" } },
                    year: 2024
                }
            });

            const total = national + states + cities;
            console.log(`   ${career.careerKeyword}: ${total} pages (${national} national + ${states} states + ${cities} cities)`);
        }

        console.log('');
        console.log('💾 Estimated Disk Space:');
        console.log(`   ~${Math.round(totalPages * 10 / 1024)} MB (assuming ~10KB per page)`);
        console.log('');
        console.log('⏱️  Estimated Generation Time:');
        console.log(`   ~${Math.round(totalPages / 100)} seconds (at 100 pages/second)`);

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

countPages()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
