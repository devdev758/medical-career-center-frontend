const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkProgress() {
    const totalSalaryRecords = await prisma.salaryData.count();
    const totalLocations = await prisma.location.count();

    // Check specifically for Registered Nurses
    const rnCount = await prisma.salaryData.count({
        where: { careerKeyword: "registered-nurses" }
    });

    // Check specifically for California
    const caCount = await prisma.salaryData.count({
        where: {
            location: {
                state: "CA"
            }
        }
    });

    console.log(`Total Salary Records: ${totalSalaryRecords}`);
    console.log(`Total Locations: ${totalLocations}`);
    console.log(`Registered Nurses Records: ${rnCount}`);
    console.log(`California Records: ${caCount}`);
}

checkProgress()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
