import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('=== COUNT API STARTED ===');

        // Test database connection first
        console.log('Testing database connection...');
        const testQuery = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('Database connection OK:', testQuery);

        // Get all unique career keywords
        console.log('Fetching careers...');
        const careers = await prisma.salaryData.findMany({
            select: {
                careerKeyword: true
            },
            distinct: ['careerKeyword'],
            where: {
                year: 2024
            }
        });
        console.log('Careers fetched:', careers.length);

        // Count data by type
        console.log('Counting national data...');
        const nationalData = await prisma.salaryData.count({
            where: {
                locationId: null,
                year: 2024
            }
        });
        console.log('National count:', nationalData);

        console.log('Counting state data...');
        const stateData = await prisma.salaryData.count({
            where: {
                locationId: { not: null },
                location: { city: "" },
                year: 2024
            }
        });
        console.log('State count:', stateData);

        console.log('Counting city data...');
        const cityData = await prisma.salaryData.count({
            where: {
                locationId: { not: null },
                location: { NOT: { city: "" } },
                year: 2024
            }
        });
        console.log('City count:', cityData);

        const totalPages = nationalData + stateData + cityData;

        const result = {
            summary: {
                totalProfessions: careers.length,
                totalPages,
                nationalPages: nationalData,
                statePages: stateData,
                cityPages: cityData,
                estimatedDiskSpace: `${Math.round(totalPages * 10 / 1024)} MB`,
                estimatedGenerationTime: `${Math.round(totalPages / 100)} seconds`
            },
            professions: careers.map(c => c.careerKeyword)
        };

        console.log('=== COUNT API SUCCESS ===');
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('=== COUNT API ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        return NextResponse.json({
            error: 'Failed to count pages',
            message: error.message,
            type: error.constructor.name
        }, { status: 500 });
    }
}
