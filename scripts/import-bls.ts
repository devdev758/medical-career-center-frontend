const { PrismaClient } = require("@prisma/client");
const ExcelJS = require('exceljs');
const path = require('path');

const prisma = new PrismaClient();
const filePath = path.join(__dirname, '../prisma/data/bls_data.xlsx');

// Helper to slugify text
function slugify(text: any) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// Helper to parse currency/number (BLS uses '*' or '#' for missing data)
function parseNumber(val: any) {
    if (!val || val === '*' || val === '#') return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
}

async function importData() {
    console.log("Starting BLS Data Import...");

    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {});

    let rowCount = 0;
    let headers: any[] = [];
    let batchLocations = [];
    let batchSalaries = [];
    const BATCH_SIZE = 500; // Process in batches

    // Cache locations to avoid repeated DB lookups/inserts for same location
    // Map<slug, locationId>
    const locationCache = new Map();

    // Pre-load existing locations if any (optional, but good for re-runs)
    // For now, we'll rely on upsert or just cache what we create in this run.

    for await (const worksheet of workbook) {
        console.log(`Processing worksheet: ${worksheet.name}`);

        for await (const row of worksheet) {
            rowCount++;
            const values = row.values;
            const rowData = Array.isArray(values) ? values.slice(1) : values;

            if (rowCount === 1) {
                headers = rowData;
                continue;
            }

            const rowObj: any = {};
            headers.forEach((header: any, index: any) => {
                rowObj[header] = rowData[index];
            });

            // Filter for Medical/Health (29-xxxx, 31-xxxx)
            const occCode = rowObj['OCC_CODE'];
            if (!occCode || (!String(occCode).startsWith('29-') && !String(occCode).startsWith('31-'))) {
                continue;
            }

            // 1. Handle Location
            const areaType = String(rowObj['AREA_TYPE']);
            const areaTitle = rowObj['AREA_TITLE'];
            const primState = rowObj['PRIM_STATE'];

            let locationId = null;
            let city = "";
            let state = "";
            let stateName = "";
            let locationSlug = "";

            if (areaType === '1') {
                // National - locationId stays null
            } else if (areaType === '2') {
                // State Level
                // AREA_TITLE is usually the state name (e.g., "Alabama")
                // PRIM_STATE is "AL"
                city = "";
                state = primState;
                stateName = areaTitle;
                locationSlug = slugify(stateName);
            } else if (areaType === '4') {
                // Metropolitan Area (City level)
                // AREA_TITLE e.g., "Birmingham-Hoover, AL"
                // We need to parse this.
                // Usually "City Name, StateCode"
                // Sometimes multi-state: "New York-Newark-Jersey City, NY-NJ-PA"
                // For simplicity, we'll take the primary state.

                const parts = areaTitle.split(',');
                if (parts.length >= 2) {
                    // Take the first part as city name (might contain dashes)
                    city = parts[0].trim();
                    // State might be complex, use PRIM_STATE for consistency
                    state = primState;
                    // State Name - we don't have it easily for MSA, maybe map later or leave empty/duplicate code
                    stateName = primState; // Placeholder
                    locationSlug = slugify(`${city}-${state}`);
                } else {
                    // Fallback
                    city = areaTitle;
                    state = primState;
                    locationSlug = slugify(`${city}-${state}`);
                }
            } else {
                // Skip other area types for now (e.g., non-metro areas)
                continue;
            }

            // Create/Get Location if not National
            if (areaType !== '1') {
                if (!locationCache.has(locationSlug)) {
                    // Upsert Location
                    try {
                        const loc = await prisma.location.upsert({
                            where: { city_state: { city, state } },
                            update: {},
                            create: {
                                city,
                                state,
                                stateName: stateName || state, // Fallback
                                slug: locationSlug
                            }
                        });
                        locationCache.set(locationSlug, loc.id);
                        locationId = loc.id;
                    } catch (e: any) {
                        console.error(`Error upserting location ${locationSlug}:`, e.message);
                        continue; // Skip this row if location fails
                    }
                } else {
                    locationId = locationCache.get(locationSlug);
                }
            }

            // 2. Prepare Salary Data
            const careerTitle = rowObj['OCC_TITLE'];
            const careerKeyword = slugify(careerTitle); // This will be our URL slug for career

            const salaryRecord = {
                careerKeyword,
                locationId,
                year: 2024,
                source: "BLS",
                employmentCount: parseNumber(rowObj['TOT_EMP']),
                hourly10th: parseNumber(rowObj['H_PCT10']),
                hourly25th: parseNumber(rowObj['H_PCT25']),
                hourlyMedian: parseNumber(rowObj['H_MEDIAN']),
                hourly75th: parseNumber(rowObj['H_PCT75']),
                hourly90th: parseNumber(rowObj['H_PCT90']),
                annual10th: parseNumber(rowObj['A_PCT10']),
                annual25th: parseNumber(rowObj['A_PCT25']),
                annualMedian: parseNumber(rowObj['A_MEDIAN']),
                annual75th: parseNumber(rowObj['A_PCT75']),
                annual90th: parseNumber(rowObj['A_PCT90']),
            };

            // Upsert Salary Data
            // We do this one by one or batch? Upsert is safer one by one to handle conflicts.
            // Given 36k rows, one by one might take a few minutes, which is fine for a seed script.
            try {
                await prisma.salaryData.upsert({
                    where: {
                        careerKeyword_locationId_year: {
                            careerKeyword,
                            locationId: locationId, // Prisma handles null correctly in where input?
                            // Wait, earlier we had issues with null in unique constraint in seed script?
                            // Let's verify. If locationId is null, we need to handle it.
                            // Actually, for National data (locationId=null), we might need to be careful.
                            // Let's try.
                            year: 2024
                        }
                    },
                    update: salaryRecord,
                    create: salaryRecord
                });
            } catch (e) {
                // If unique constraint fails on null, try findFirst logic or just skip
                // console.error(`Error upserting salary for ${careerKeyword}:`, e.message);

                // Fallback for National data if upsert fails on null
                if (locationId === null) {
                    const existing = await prisma.salaryData.findFirst({
                        where: { careerKeyword, locationId: null, year: 2024 }
                    });
                    if (existing) {
                        await prisma.salaryData.update({
                            where: { id: existing.id },
                            data: salaryRecord
                        });
                    } else {
                        // Remove locationId if null to avoid Prisma error if it prefers omission
                        const { locationId, ...rest } = salaryRecord;
                        await prisma.salaryData.create({
                            data: locationId ? salaryRecord : rest
                        });
                    }
                }
            }

            if (rowCount % 1000 === 0) {
                console.log(`Processed ${rowCount} rows...`);
            }
        }
        break; // Only first sheet
    }

    console.log("Import completed!");
}

importData()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
