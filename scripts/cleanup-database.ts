import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDatabase() {
    console.log('🧹 Starting database cleanup...\n');

    try {
        // Delete all salary data
        console.log('Deleting all salary data...');
        const deletedSalaries = await prisma.salaryData.deleteMany({});
        console.log(`✅ Deleted ${deletedSalaries.count} salary records\n`);

        // Delete city locations (keep state locations)
        console.log('Deleting city locations...');
        const deletedCities = await prisma.location.deleteMany({
            where: {
                city: { not: '' }
            }
        });
        console.log(`✅ Deleted ${deletedCities.count} city location records\n`);

        // Verify cleanup
        const remainingSalaries = await prisma.salaryData.count();
        const remainingCities = await prisma.location.count({ where: { city: { not: '' } } });
        const remainingStates = await prisma.location.count({ where: { city: '' } });

        console.log('📊 Cleanup verification:');
        console.log(`   Remaining salary records: ${remainingSalaries}`);
        console.log(`   Remaining city locations: ${remainingCities}`);
        console.log(`   Remaining state locations: ${remainingStates}`);

        if (remainingSalaries === 0 && remainingCities === 0) {
            console.log('\n✅ Database cleanup successful!');
        } else {
            console.log('\n⚠️  Warning: Some records still remain');
        }

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

cleanupDatabase();
