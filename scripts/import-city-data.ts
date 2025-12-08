import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const EXCEL_PATH = '/Users/shirish/Downloads/all_data_M_2024.xlsx';

function createSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Convert Excel value to number or null
function toNumber(value: any): number | null {
    if (value === null || value === undefined || value === '' || value === '#' || value === '**' || value === '*') {
        return null;
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
}

async function importCityData() {
    console.log('📊 Reading Excel file...\n');

    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    // Filter for city-level data (AREA_TYPE = 4) and detailed occupations
    const cityData = data.filter((row: any) =>
        row.AREA_TYPE === '4' &&
        row.O_GROUP === 'detailed'
    );

    console.log(`✅ Found ${cityData.length} city-level salary records\n`);

    let locationsCreated = 0;
    let salariesCreated = 0;
    let salariesSkipped = 0;
    let errors = 0;

    for (const row of cityData) {
        try {
            // Parse city and state from AREA_TITLE (e.g., "San Francisco, CA")
            const areaTitle = row.AREA_TITLE;
            const parts = areaTitle.split(',').map((p: string) => p.trim());

            let cityName = '';
            let stateAbbr = '';

            if (parts.length >= 2) {
                cityName = parts[0];
                stateAbbr = parts[parts.length - 1].split('-')[0].trim(); // Handle "PA-NJ" cases
            } else {
                continue;
            }

            const citySlug = createSlug(cityName);
            const careerSlug = createSlug(row.OCC_TITLE);

            // Create or find location using upsert
            const existingLocation = await prisma.location.findUnique({
                where: {
                    city_state: {
                        city: cityName,
                        state: stateAbbr
                    }
                }
            });

            if (!existingLocation) {
                locationsCreated++;
            }

            const location = await prisma.location.upsert({
                where: {
                    city_state: {
                        city: cityName,
                        state: stateAbbr
                    }
                },
                update: {},
                create: {
                    slug: citySlug,
                    city: cityName,
                    state: stateAbbr,
                    stateName: stateAbbr
                }
            });

            // Check if salary data already exists
            const existingSalary = await prisma.salaryData.findUnique({
                where: {
                    careerKeyword_locationId_year: {
                        careerKeyword: careerSlug,
                        locationId: location.id,
                        year: 2024
                    }
                }
            });

            if (existingSalary) {
                salariesSkipped++;
                continue;
            }

            // Create salary data with proper null handling
            await prisma.salaryData.create({
                data: {
                    source: 'BLS',
                    careerKeyword: careerSlug,
                    locationId: location.id,
                    hourly10th: toNumber(row.H_PCT10),
                    hourly25th: toNumber(row.H_PCT25),
                    hourlyMedian: toNumber(row.H_MEDIAN),
                    hourly75th: toNumber(row.H_PCT75),
                    hourly90th: toNumber(row.H_PCT90),
                    annual10th: toNumber(row.A_PCT10),
                    annual25th: toNumber(row.A_PCT25),
                    annualMedian: toNumber(row.A_MEDIAN),
                    annual75th: toNumber(row.A_PCT75),
                    annual90th: toNumber(row.A_PCT90),
                    employmentCount: toNumber(row.TOT_EMP),
                    year: 2024
                }
            });

            salariesCreated++;

            if (salariesCreated % 500 === 0) {
                console.log(`✅ Imported ${salariesCreated} city salary records (${salariesSkipped} skipped)...`);
            }
        } catch (error: any) {
            errors++;
            if (errors < 10) {
                console.error(`❌ Error importing ${row.AREA_TITLE} - ${row.OCC_TITLE}:`, error.message);
            }
        }
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`   Locations created: ${locationsCreated}`);
    console.log(`   Salary records created: ${salariesCreated}`);
    console.log(`   Salary records skipped (duplicates): ${salariesSkipped}`);
    console.log(`   Errors: ${errors}`);
}

importCityData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
