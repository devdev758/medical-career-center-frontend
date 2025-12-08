import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Get all unique career keywords
        const careers = await prisma.salaryData.findMany({
            select: {
                careerKeyword: true
            },
            distinct: ['careerKeyword'],
            where: {
                year: 2024
            }
        });

        // Count data by type
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

        // Get breakdown by profession
        const breakdown = [];
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

            breakdown.push({
                profession: career.careerKeyword,
                national,
                states,
                cities,
                total: national + states + cities
            });
        }

        const totalPages = nationalData + stateData + cityData;

        return NextResponse.json({
            summary: {
                totalProfessions: careers.length,
                totalPages,
                nationalPages: nationalData,
                statePages: stateData,
                cityPages: cityData,
                estimatedDiskSpace: `${Math.round(totalPages * 10 / 1024)} MB`,
                estimatedGenerationTime: `${Math.round(totalPages / 100)} seconds`
            },
            professions: careers.map(c => c.careerKeyword),
            breakdown
        });

    } catch (error) {
        console.error('Error counting pages:', error);
        return NextResponse.json({ error: 'Failed to count pages' }, { status: 500 });
    }
}
