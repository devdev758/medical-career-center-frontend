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
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Helper to parse currency/number
function parseNumber(val: any) {
    if (!val || val === '*' || val === '#') return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
}

async function importData() {
    console.log("Starting Optimized BLS Data Import...");

    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {});

    // 1. Collect all unique locations and salary records in memory
    // (36k records is small enough for memory ~10MB)
    const locationsMap = new Map(); // key: slug, value: { city, state, stateName }
    const salaryRecords = [];

    let rowCount = 0;

    for await (const worksheet of workbook) {
        console.log(`Reading worksheet: ${worksheet.name}`);

        let headers: any[] = [];

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

            // Parse Location
            const areaType = String(rowObj['AREA_TYPE']);
            const areaTitle = rowObj['AREA_TITLE'];
            const primState = rowObj['PRIM_STATE'];

            let city = "";
            let state = "";
            let stateName = "";
            let locationSlug = "";
            let isNational = false;

            if (areaType === '1') {
                isNational = true;
            } else if (areaType === '2') {
                state = primState;
                stateName = areaTitle;
                locationSlug = slugify(stateName);
            } else if (areaType === '4') {
                const parts = areaTitle.split(',');
                if (parts.length >= 2) {
                    city = parts[0].trim();
                    state = primState;
                    stateName = primState;
                    locationSlug = slugify(`${city}-${state}`);
                } else {
                    city = areaTitle;
                    state = primState;
                    locationSlug = slugify(`${city}-${state}`);
                }
            } else {
                continue;
            }

            if (!isNational) {
                if (!locationsMap.has(locationSlug)) {
                    locationsMap.set(locationSlug, { city, state, stateName, slug: locationSlug });
                }
            }

            // Prepare Salary Record (without locationId yet)
            const careerTitle = rowObj['OCC_TITLE'];
            const careerKeyword = slugify(careerTitle);

            salaryRecords.push({
                careerKeyword,
                locationSlug: isNational ? null : locationSlug, // Temporary field to link later
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
            });
        }
        break; // Only first sheet
    }

    console.log(`Parsed ${salaryRecords.length} salary records.`);
    console.log(`Found ${locationsMap.size} unique locations.`);

    // 2. Batch Insert Locations
    console.log("Upserting Locations (this may take a moment)...");
    // We use createMany with skipDuplicates for speed. 
    // If we need to update existing locations, we'd need upsert, but for initial import createMany is best.
    // However, Prisma createMany skipDuplicates is only supported on some DBs. Postgres supports it.

    const locationsToInsert = Array.from(locationsMap.values());
    const LOCATION_BATCH_SIZE = 1000;

    for (let i = 0; i < locationsToInsert.length; i += LOCATION_BATCH_SIZE) {
        const batch = locationsToInsert.slice(i, i + LOCATION_BATCH_SIZE);
        await prisma.location.createMany({
            data: batch,
            skipDuplicates: true
        });
        console.log(`Inserted locations batch ${i / LOCATION_BATCH_SIZE + 1}`);
    }

    // 3. Fetch All Locations to Map Slugs to IDs
    console.log("Fetching all locations for mapping...");
    const allLocations = await prisma.location.findMany({
        select: { id: true, slug: true }
    });

    const slugToId = new Map();
    allLocations.forEach((loc: any) => slugToId.set(loc.slug, loc.id));

    // 4. Map Salary Records to Location IDs
    console.log("Mapping salary records...");
    const finalSalaryRecords = salaryRecords.map(record => {
        const { locationSlug, ...rest } = record;
        let locationId = null;

        if (locationSlug) {
            locationId = slugToId.get(locationSlug);
            if (!locationId) {
                // Should not happen if insert worked
                // console.warn(`Location ID not found for slug: ${locationSlug}`);
                return null;
            }
        }

        return {
            ...rest,
            locationId
        };
    }).filter(r => r !== null);

    // 5. Batch Insert Salary Data
    console.log(`Inserting ${finalSalaryRecords.length} salary records...`);
    const SALARY_BATCH_SIZE = 2000;

    for (let i = 0; i < finalSalaryRecords.length; i += SALARY_BATCH_SIZE) {
        const batch = finalSalaryRecords.slice(i, i + SALARY_BATCH_SIZE);
        await prisma.salaryData.createMany({
            data: batch,
            skipDuplicates: true
        });
        console.log(`Inserted salary batch ${i / SALARY_BATCH_SIZE + 1}`);
    }

    console.log("Import Completed Successfully!");
}

importData()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
