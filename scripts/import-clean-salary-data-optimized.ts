import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { parseMSA, generateCityStateCombinations, isMSA } from '../src/lib/msa-parser';

const prisma = new PrismaClient();
const EXCEL_PATH = '/Users/shirish/Downloads/all_data_M_2024.xlsx';
const BATCH_SIZE = 100;

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

async function importCleanSalaryDataOptimized() {
    console.log('📊 Reading Excel file...\n');

    const workbook = XLSX.readFile(EXCEL_PATH);
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    // Filter for clean data only
    const cleanData = data.filter((row: any) =>
        (row.AREA_TYPE === '1' || row.AREA_TYPE === '2' || row.AREA_TYPE === '4') &&
        row.O_GROUP === 'detailed' &&
        row.NAICS === '000000'
    );

    console.log(`✅ Found ${cleanData.length} clean salary records to import\n`);

    // Check what's already imported
    const existingNational = await prisma.salaryData.count({ where: { locationId: null } });
    const existingState = await prisma.salaryData.count({ where: { location: { city: '' } } });
    const existingCity = await prisma.salaryData.count({ where: { location: { city: { not: '' } } } });

    console.log('Already imported:');
    console.log(`  National: ${existingNational}`);
    console.log(`  State: ${existingState}`);
    console.log(`  City: ${existingCity}\n`);

    // Pre-load all existing salary data to avoid duplicate checks
    console.log('Loading existing salary data for duplicate prevention...');
    const existingSalaries = await prisma.salaryData.findMany({
        select: {
            careerKeyword: true,
            locationId: true,
            year: true
        }
    });

    const existingSet = new Set(
        existingSalaries.map(s => `${s.careerKeyword}|${s.locationId}|${s.year}`)
    );
    console.log(`✅ Loaded ${existingSet.size} existing records\n`);

    // Pre-load all locations
    console.log('Loading existing locations...');
    const existingLocations = await prisma.location.findMany();
    const locationMap = new Map(
        existingLocations.map(loc => [`${loc.city}|${loc.state}`, loc])
    );
    console.log(`✅ Loaded ${locationMap.size} existing locations\n`);

    let nationalCreated = 0;
    let statesCreated = 0;
    let citiesCreated = 0;
    let msaSplit = 0;
    let skipped = 0;

    // Batch arrays
    let locationBatch: any[] = [];
    let salaryBatch: any[] = [];

    async function flushBatches() {
        if (locationBatch.length > 0) {
            // Create locations in batch
            for (const loc of locationBatch) {
                try {
                    const created = await prisma.location.upsert({
                        where: { city_state: { city: loc.city, state: loc.state } },
                        update: {},
                        create: loc
                    });
                    locationMap.set(`${loc.city}|${loc.state}`, created);
                } catch (error) {
                    // Location might already exist, that's ok
                }
            }
            locationBatch = [];
        }

        if (salaryBatch.length > 0) {
            // Create salary data in batch
            await prisma.salaryData.createMany({
                data: salaryBatch,
                skipDuplicates: true
            });
            salaryBatch = [];
        }
    }

    for (let i = 0; i < cleanData.length; i++) {
        const row = cleanData[i];
        const careerSlug = createSlug(row.OCC_TITLE);

        try {
            // National data (AREA_TYPE = 1)
            if (row.AREA_TYPE === '1') {
                const key = `${careerSlug}|null|2024`;
                if (!existingSet.has(key)) {
                    salaryBatch.push({
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
                    });
                    existingSet.add(key);
                    nationalCreated++;
                } else {
                    skipped++;
                }
            }

            // State data (AREA_TYPE = 2)
            else if (row.AREA_TYPE === '2') {
                const stateAbbr = row.PRIM_STATE;
                const stateName = row.AREA_TITLE;
                const locKey = `|${stateAbbr}`;

                let location = locationMap.get(locKey);
                if (!location) {
                    locationBatch.push({
                        city: '',
                        state: stateAbbr,
                        stateName: stateName,
                        slug: createSlug(stateName)
                    });

                    // Flush if batch is full
                    if (locationBatch.length >= BATCH_SIZE) {
                        await flushBatches();
                    }

                    // Get the location we just created
                    location = await prisma.location.findUnique({
                        where: { city_state: { city: '', state: stateAbbr } }
                    });
                }

                if (location) {
                    const key = `${careerSlug}|${location.id}|2024`;
                    if (!existingSet.has(key)) {
                        salaryBatch.push({
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
                        });
                        existingSet.add(key);
                        statesCreated++;
                    } else {
                        skipped++;
                    }
                }
            }

            // City/MSA data (AREA_TYPE = 4)
            else if (row.AREA_TYPE === '4') {
                const areaTitle = row.AREA_TITLE;
                let cityStatePairs: Array<{ city: string; state: string }> = [];

                if (isMSA(areaTitle)) {
                    const msa = parseMSA(areaTitle);
                    cityStatePairs = generateCityStateCombinations(msa);
                    msaSplit++;
                } else {
                    const parts = areaTitle.split(',').map((p: string) => p.trim());
                    const cityName = parts[0];
                    const stateAbbr = parts[parts.length - 1].split('-')[0].trim();
                    cityStatePairs = [{ city: cityName, state: stateAbbr }];
                }

                for (const { city, state } of cityStatePairs) {
                    const locKey = `${city}|${state}`;
                    let location = locationMap.get(locKey);

                    if (!location) {
                        locationBatch.push({
                            city,
                            state,
                            stateName: state,
                            slug: createSlug(`${city}-${state}`)
                        });

                        if (locationBatch.length >= BATCH_SIZE) {
                            await flushBatches();
                        }

                        location = await prisma.location.findUnique({
                            where: { city_state: { city, state } }
                        });
                    }

                    if (location) {
                        const key = `${careerSlug}|${location.id}|2024`;
                        if (!existingSet.has(key)) {
                            salaryBatch.push({
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
                            });
                            existingSet.add(key);
                            citiesCreated++;
                        } else {
                            skipped++;
                        }
                    }
                }
            }

            // Flush batches periodically
            if (salaryBatch.length >= BATCH_SIZE) {
                await flushBatches();

                const total = nationalCreated + statesCreated + citiesCreated;
                if (total % 500 === 0) {
                    console.log(`✅ Imported ${total} new records (${skipped} skipped, ${msaSplit} MSAs split)...`);
                }
            }

        } catch (error: any) {
            console.error(`❌ Error importing ${row.AREA_TITLE} - ${row.OCC_TITLE}:`, error.message);
        }
    }

    // Flush remaining batches
    await flushBatches();

    console.log(`\n🎉 Import complete!`);
    console.log(`   National pages: ${nationalCreated} new`);
    console.log(`   State pages: ${statesCreated} new`);
    console.log(`   City pages: ${citiesCreated} new`);
    console.log(`   MSAs split: ${msaSplit}`);
    console.log(`   Skipped (already exists): ${skipped}`);
}

importCleanSalaryDataOptimized()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
