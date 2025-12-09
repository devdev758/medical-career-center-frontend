import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { parseMSA, generateCityStateCombinations, isMSA } from '../src/lib/msa-parser';

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

function toNumber(value: any): number | null {
    if (value === null || value === undefined || value === '' || value === '#' || value === '**' || value === '*') {
        return null;
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
}

async function importCleanSalaryData() {
    console.log('📊 Reading Excel file...\n');

    const workbook = XLSX.readFile(EXCEL_PATH);
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    // Filter for clean data only
    const cleanData = data.filter((row: any) =>
        (row.AREA_TYPE === '1' || row.AREA_TYPE === '2' || row.AREA_TYPE === '4') && // National, States, Cities
        row.O_GROUP === 'detailed' &&  // Specific occupations only
        row.NAICS === '000000'  // Cross-industry aggregate only
    );

    console.log(`✅ Found ${cleanData.length} clean salary records to import\n`);

    // Group by area type for reporting
    const byAreaType = {
        '1': cleanData.filter(r => r.AREA_TYPE === '1').length,
        '2': cleanData.filter(r => r.AREA_TYPE === '2').length,
        '4': cleanData.filter(r => r.AREA_TYPE === '4').length
    };

    console.log('Breakdown by area type:');
    console.log(`  National (Type 1): ${byAreaType['1']} records`);
    console.log(`  States (Type 2): ${byAreaType['2']} records`);
    console.log(`  Cities/MSAs (Type 4): ${byAreaType['4']} records\n`);

    let nationalCreated = 0;
    let statesCreated = 0;
    let citiesCreated = 0;
    let msaSplit = 0;
    let errors = 0;

    for (const row of cleanData) {
        try {
            const careerSlug = createSlug(row.OCC_TITLE);

            // National data (AREA_TYPE = 1)
            if (row.AREA_TYPE === '1') {
                await prisma.salaryData.create({
                    data: {
                        source: 'BLS',
                        careerKeyword: careerSlug,
                        locationId: null,
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
                nationalCreated++;
            }

            // State data (AREA_TYPE = 2)
            else if (row.AREA_TYPE === '2') {
                const stateAbbr = row.PRIM_STATE;
                const stateName = row.AREA_TITLE;

                // Find or create state location
                const location = await prisma.location.upsert({
                    where: {
                        city_state: {
                            city: '',
                            state: stateAbbr
                        }
                    },
                    update: {},
                    create: {
                        city: '',
                        state: stateAbbr,
                        stateName: stateName,
                        slug: createSlug(stateName)
                    }
                });

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
                statesCreated++;
            }

            // City/MSA data (AREA_TYPE = 4)
            else if (row.AREA_TYPE === '4') {
                const areaTitle = row.AREA_TITLE;

                // Check if it's an MSA (multiple cities)
                if (isMSA(areaTitle)) {
                    const msa = parseMSA(areaTitle);
                    const combinations = generateCityStateCombinations(msa);

                    // Create entry for each city-state combination
                    for (const { city, state } of combinations) {
                        const location = await prisma.location.upsert({
                            where: {
                                city_state: { city, state }
                            },
                            update: {},
                            create: {
                                city,
                                state,
                                stateName: state, // Will use abbreviation for now
                                slug: createSlug(`${city}-${state}`)
                            }
                        });

                        // Check if salary data already exists
                        const existing = await prisma.salaryData.findUnique({
                            where: {
                                careerKeyword_locationId_year: {
                                    careerKeyword: careerSlug,
                                    locationId: location.id,
                                    year: 2024
                                }
                            }
                        });

                        if (!existing) {
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
                            citiesCreated++;
                        }
                    }

                    msaSplit++;
                } else {
                    // Single city (not an MSA)
                    const parts = areaTitle.split(',').map((p: string) => p.trim());
                    const cityName = parts[0];
                    const stateAbbr = parts[parts.length - 1].split('-')[0].trim();

                    const location = await prisma.location.upsert({
                        where: {
                            city_state: { city: cityName, state: stateAbbr }
                        },
                        update: {},
                        create: {
                            city: cityName,
                            state: stateAbbr,
                            stateName: stateAbbr,
                            slug: createSlug(`${cityName}-${stateAbbr}`)
                        }
                    });

                    const existing = await prisma.salaryData.findUnique({
                        where: {
                            careerKeyword_locationId_year: {
                                careerKeyword: careerSlug,
                                locationId: location.id,
                                year: 2024
                            }
                        }
                    });

                    if (!existing) {
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
                        citiesCreated++;
                    }
                }
            }

            // Progress reporting
            const total = nationalCreated + statesCreated + citiesCreated;
            if (total % 500 === 0) {
                console.log(`✅ Imported ${total} salary records (${msaSplit} MSAs split)...`);
            }

        } catch (error: any) {
            errors++;
            if (errors < 10) {
                console.error(`❌ Error importing ${row.AREA_TITLE} - ${row.OCC_TITLE}:`, error.message);
            }
        }
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`   National pages: ${nationalCreated}`);
    console.log(`   State pages: ${statesCreated}`);
    console.log(`   City pages: ${citiesCreated}`);
    console.log(`   MSAs split: ${msaSplit}`);
    console.log(`   Errors: ${errors}`);
}

importCleanSalaryData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
