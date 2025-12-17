/**
 * BLS Excel Data Import Script
 * 
 * Imports comprehensive wage and employment data from the BLS Excel file.
 * Includes: location quotient, jobs per 1000, industry breakdowns, all percentiles.
 * 
 * Usage:
 *   npx tsx scripts/import-bls-excel.ts
 *   npx tsx scripts/import-bls-excel.ts --dry-run
 */

import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

// Excel file path
const EXCEL_PATH = path.join(__dirname, '../prisma/data/bls_data.xlsx');

// SOC codes for healthcare professions we want to import
const HEALTHCARE_SOC_CODES: Record<string, string> = {
    '29-1141': 'registered-nurse',
    '31-1131': 'nursing-assistants',
    '29-2061': 'licensed-practical-nurse',
    '29-1171': 'nurse-practitioner',
    '29-1071': 'physician-assistant',
    '29-1123': 'physical-therapist',
    '29-1122': 'occupational-therapist',
    '29-1126': 'respiratory-therapist',
    '31-9092': 'medical-assistant',
    '29-1292': 'dental-hygienist',
    '31-9091': 'dental-assistant',
    '29-2052': 'pharmacy-technician',
    '31-9097': 'phlebotomist',
    '29-2040': 'emt-paramedic',
    '29-2055': 'surgical-technologist',
    '29-2034': 'radiologic-technologist',
    '29-2032': 'ultrasound-technician',
    '29-1211': 'anesthesiologist',
    '29-1215': 'family-medicine-physician',
    '29-1216': 'general-internal-medicine-physician',
    '29-1217': 'obstetrician-gynecologist',
    '29-1218': 'pediatrician',
    '29-1221': 'psychiatrist',
    '29-1223': 'surgeon',
    '29-1224': 'dermatologist',
    '29-1241': 'ophthalmologist',
    '29-1242': 'neurologist',
    '29-1243': 'cardiologist',
    '29-1051': 'pharmacist',
    '29-1291': 'acupuncturist',
    '29-1081': 'podiatrist',
    '29-1131': 'veterinarian',
};

// State name to code mapping
const STATE_NAMES: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'District of Columbia': 'DC',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL',
    'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA',
    'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN',
    'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR',
    'Pennsylvania': 'PA', 'Puerto Rico': 'PR', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
};

interface ExcelRow {
    AREA: string;
    AREA_TITLE: string;
    AREA_TYPE: string;
    PRIM_STATE: string;
    NAICS: string;
    NAICS_TITLE: string;
    I_GROUP: string;
    OWN_CODE: string;
    OCC_CODE: string;
    OCC_TITLE: string;
    O_GROUP: string;
    TOT_EMP: number;
    EMP_PRSE: number;
    JOBS_1000?: number;
    LOC_QUOTIENT?: number;
    PCT_TOTAL?: number;
    PCT_RPT?: number;
    H_MEAN: number;
    A_MEAN: number;
    MEAN_PRSE: number;
    H_PCT10: number;
    H_PCT25: number;
    H_MEDIAN: number;
    H_PCT75: number;
    H_PCT90: number;
    A_PCT10: number;
    A_PCT25: number;
    A_MEDIAN: number;
    A_PCT75: number;
    A_PCT90: number;
}

/**
 * Parse BLS value - converts '#', '*', and empty strings to null
 * BLS uses these symbols for suppressed or unavailable data
 */
function parseBLSValue(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'string') {
        if (value === '#' || value === '*' || value.includes('#') || value.includes('*')) {
            return null;
        }
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    }
    if (typeof value === 'number') {
        return isNaN(value) ? null : value;
    }
    return null;
}

function parseBLSInt(value: any): number | null {
    const parsed = parseBLSValue(value);
    return parsed !== null ? Math.round(parsed) : null;
}

/**
 * Get or create a Location record for a state
 */
async function getOrCreateLocation(stateCode: string, stateName: string): Promise<string | null> {
    if (stateCode === 'US') {
        return null; // National data has no locationId
    }

    // Find or create state-level location
    let location = await prisma.location.findFirst({
        where: {
            state: stateCode,
            city: '',
        },
    });

    if (!location) {
        location = await prisma.location.create({
            data: {
                state: stateCode,
                stateName: stateName,
                city: '',
                slug: stateCode.toLowerCase(),
            },
        });
        console.log(`  Created location: ${stateName} (${stateCode})`);
    }

    return location.id;
}

/**
 * Import salary data (national and state level)
 */
async function importSalaryData(data: ExcelRow[], dryRun: boolean): Promise<number> {
    let count = 0;

    // Filter for cross-industry data only (NAICS = '000000')
    // And only healthcare professions
    // And only national (AREA_TYPE = '1') or state (AREA_TYPE = '2') level
    const salaryRows = data.filter(row =>
        row.NAICS === '000000' &&
        HEALTHCARE_SOC_CODES[row.OCC_CODE] &&
        (row.AREA_TYPE === '1' || row.AREA_TYPE === '2') &&
        row.O_GROUP === 'detailed'
    );

    console.log(`\n📊 Importing ${salaryRows.length} salary records...`);

    for (const row of salaryRows) {
        const careerKeyword = HEALTHCARE_SOC_CODES[row.OCC_CODE];
        const stateCode = row.PRIM_STATE;
        const stateName = row.AREA_TITLE;

        if (dryRun) {
            console.log(`  [DRY RUN] ${careerKeyword} - ${stateName}: $${row.A_MEDIAN?.toLocaleString()}`);
            count++;
            continue;
        }

        try {
            const locationId = await getOrCreateLocation(stateCode, stateName);

            // Find existing record
            const existing = await prisma.salaryData.findFirst({
                where: {
                    careerKeyword,
                    locationId,
                    year: 2024,
                },
            });

            const salaryFields = {
                hourlyMean: parseBLSValue(row.H_MEAN),
                hourlyMedian: parseBLSValue(row.H_MEDIAN),
                hourly10th: parseBLSValue(row.H_PCT10),
                hourly25th: parseBLSValue(row.H_PCT25),
                hourly75th: parseBLSValue(row.H_PCT75),
                hourly90th: parseBLSValue(row.H_PCT90),
                annualMean: parseBLSValue(row.A_MEAN),
                annualMedian: parseBLSValue(row.A_MEDIAN),
                annual10th: parseBLSValue(row.A_PCT10),
                annual25th: parseBLSValue(row.A_PCT25),
                annual75th: parseBLSValue(row.A_PCT75),
                annual90th: parseBLSValue(row.A_PCT90),
                employmentCount: parseBLSInt(row.TOT_EMP),
                jobsPer1000: parseBLSValue(row.JOBS_1000),
                locationQuotient: parseBLSValue(row.LOC_QUOTIENT),
                meanErrorMargin: parseBLSValue(row.MEAN_PRSE),
                empErrorMargin: parseBLSValue(row.EMP_PRSE),
                source: 'BLS',
            };

            if (existing) {
                await prisma.salaryData.update({
                    where: { id: existing.id },
                    data: salaryFields,
                });
            } else {
                await prisma.salaryData.create({
                    data: {
                        careerKeyword,
                        locationId,
                        year: 2024,
                        ...salaryFields,
                    },
                });
            }

            count++;
        } catch (error) {
            console.error(`  Failed: ${careerKeyword} in ${stateName}:`, error);
        }
    }

    return count;
}

/**
 * Import industry employment breakdown
 */
async function importIndustryData(data: ExcelRow[], dryRun: boolean): Promise<number> {
    let count = 0;

    // Filter for national industry data (not cross-industry)
    // And only healthcare professions
    const industryRows = data.filter(row =>
        row.AREA === '99' &&
        row.NAICS !== '000000' &&
        HEALTHCARE_SOC_CODES[row.OCC_CODE] &&
        row.O_GROUP === 'detailed' &&
        row.I_GROUP !== 'cross-industry'
    );

    console.log(`\n🏭 Importing ${industryRows.length} industry breakdown records...`);

    for (const row of industryRows) {
        const careerKeyword = HEALTHCARE_SOC_CODES[row.OCC_CODE];

        if (dryRun) {
            console.log(`  [DRY RUN] ${careerKeyword} - ${row.NAICS_TITLE}: ${row.TOT_EMP?.toLocaleString()} employed`);
            count++;
            continue;
        }

        try {
            // Upsert industry employment
            await prisma.industryEmployment.upsert({
                where: {
                    careerKeyword_naicsCode_year: {
                        careerKeyword,
                        naicsCode: row.NAICS,
                        year: 2024,
                    },
                },
                update: {
                    naicsTitle: row.NAICS_TITLE,
                    employment: parseBLSInt(row.TOT_EMP),
                    meanAnnual: parseBLSValue(row.A_MEAN),
                    medianAnnual: parseBLSValue(row.A_MEDIAN),
                    meanHourly: parseBLSValue(row.H_MEAN),
                    pctOfTotal: parseBLSValue(row.PCT_TOTAL),
                },
                create: {
                    careerKeyword,
                    naicsCode: row.NAICS,
                    naicsTitle: row.NAICS_TITLE,
                    employment: parseBLSInt(row.TOT_EMP),
                    meanAnnual: parseBLSValue(row.A_MEAN),
                    medianAnnual: parseBLSValue(row.A_MEDIAN),
                    meanHourly: parseBLSValue(row.H_MEAN),
                    pctOfTotal: parseBLSValue(row.PCT_TOTAL),
                    year: 2024,
                },
            });

            count++;
        } catch (error) {
            console.error(`  Failed: ${careerKeyword} in ${row.NAICS_TITLE}:`, error);
        }
    }

    return count;
}

/**
 * Main import function
 */
async function main(): Promise<void> {
    const dryRun = process.argv.includes('--dry-run');

    console.log('=== BLS Excel Data Import ===');
    console.log(`File: ${EXCEL_PATH}`);
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log('');

    // Read Excel file
    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames.find(s => s.includes('May 2024') || s.includes('data')) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`Sheet: ${sheetName}`);
    console.log(`Total rows: ${data.length}`);
    console.log(`Healthcare SOC codes: ${Object.keys(HEALTHCARE_SOC_CODES).length}`);

    // Import salary data
    const salaryCount = await importSalaryData(data, dryRun);
    console.log(`\n✓ Imported ${salaryCount} salary records`);

    // Import industry data
    const industryCount = await importIndustryData(data, dryRun);
    console.log(`✓ Imported ${industryCount} industry records`);

    // Show summary
    console.log('\n=== Import Summary ===');
    console.log(`Salary records: ${salaryCount}`);
    console.log(`Industry records: ${industryCount}`);

    if (!dryRun) {
        // Show sample data
        const sample = await prisma.salaryData.findFirst({
            where: { careerKeyword: 'registered-nurse', locationId: null },
        });
        if (sample) {
            console.log('\nSample (RN National):');
            console.log(`  Median Annual: $${sample.annualMedian?.toLocaleString()}`);
            console.log(`  Total Employed: ${sample.employmentCount?.toLocaleString()}`);
            console.log(`  Location Quotient: ${sample.locationQuotient || 'N/A'}`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
