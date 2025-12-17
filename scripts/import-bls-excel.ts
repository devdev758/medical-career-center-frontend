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

// SOC codes for ALL healthcare professions in the BLS Excel file (88 total)
const HEALTHCARE_SOC_CODES: Record<string, string> = {
    '29-1011': 'chiropractors',
    '29-1021': 'dentists-general',
    '29-1022': 'oral-and-maxillofacial-surgeons',
    '29-1023': 'orthodontists',
    '29-1024': 'prosthodontists',
    '29-1029': 'dentists-all-other-specialists',
    '29-1031': 'dietitians-and-nutritionists',
    '29-1041': 'optometrists',
    '29-1051': 'pharmacists',
    '29-1071': 'physician-assistants',
    '29-1081': 'podiatrists',
    '29-1122': 'occupational-therapists',
    '29-1123': 'physical-therapists',
    '29-1124': 'radiation-therapists',
    '29-1125': 'recreational-therapists',
    '29-1126': 'respiratory-therapists',
    '29-1127': 'speech-language-pathologists',
    '29-1128': 'exercise-physiologists',
    '29-1129': 'therapists-all-other',
    '29-1131': 'veterinarians',
    '29-1141': 'registered-nurses',
    '29-1151': 'nurse-anesthetists',
    '29-1161': 'nurse-midwives',
    '29-1171': 'nurse-practitioners',
    '29-1181': 'audiologists',
    '29-1211': 'anesthesiologists',
    '29-1212': 'cardiologists',
    '29-1213': 'dermatologists',
    '29-1214': 'emergency-medicine-physicians',
    '29-1215': 'family-medicine-physicians',
    '29-1216': 'general-internal-medicine-physicians',
    '29-1217': 'neurologists',
    '29-1218': 'obstetricians-and-gynecologists',
    '29-1221': 'pediatricians-general',
    '29-1222': 'physicians-pathologists',
    '29-1223': 'psychiatrists',
    '29-1224': 'radiologists',
    '29-1229': 'physicians-all-other',
    '29-1241': 'ophthalmologists-except-pediatric',
    '29-1242': 'orthopedic-surgeons-except-pediatric',
    '29-1243': 'pediatric-surgeons',
    '29-1249': 'surgeons-all-other',
    '29-1291': 'acupuncturists',
    '29-1292': 'dental-hygienists',
    '29-1299': 'healthcare-diagnosing-or-treating-practitioners-all-other',
    '29-2010': 'clinical-laboratory-technologists-and-technicians',
    '29-2031': 'cardiovascular-technologists-and-technicians',
    '29-2032': 'diagnostic-medical-sonographers',
    '29-2033': 'nuclear-medicine-technologists',
    '29-2034': 'radiologic-technologists-and-technicians',
    '29-2035': 'magnetic-resonance-imaging-technologists',
    '29-2036': 'medical-dosimetrists',
    '29-2042': 'emergency-medical-technicians',
    '29-2043': 'paramedics',
    '29-2051': 'dietetic-technicians',
    '29-2052': 'pharmacy-technicians',
    '29-2053': 'psychiatric-technicians',
    '29-2055': 'surgical-technologists',
    '29-2056': 'veterinary-technologists-and-technicians',
    '29-2057': 'ophthalmic-medical-technicians',
    '29-2061': 'licensed-practical-and-licensed-vocational-nurses',
    '29-2072': 'medical-records-specialists',
    '29-2081': 'opticians-dispensing',
    '29-2091': 'orthotists-and-prosthetists',
    '29-2092': 'hearing-aid-specialists',
    '29-2099': 'health-technologists-and-technicians-all-other',
    '29-9021': 'health-information-technologists-and-medical-registrars',
    '29-9091': 'athletic-trainers',
    '29-9092': 'genetic-counselors',
    '29-9093': 'surgical-assistants',
    '29-9099': 'healthcare-practitioners-and-technical-workers-all-other',
    '31-1120': 'home-health-and-personal-care-aides',
    '31-1131': 'nursing-assistants',
    '31-1132': 'orderlies',
    '31-1133': 'psychiatric-aides',
    '31-2011': 'occupational-therapy-assistants',
    '31-2012': 'occupational-therapy-aides',
    '31-2021': 'physical-therapist-assistants',
    '31-2022': 'physical-therapist-aides',
    '31-9011': 'massage-therapists',
    '31-9091': 'dental-assistants',
    '31-9092': 'medical-assistants',
    '31-9093': 'medical-equipment-preparers',
    '31-9094': 'medical-transcriptionists',
    '31-9095': 'pharmacy-aides',
    '31-9096': 'veterinary-assistants-and-laboratory-animal-caretakers',
    '31-9097': 'phlebotomists',
    '31-9099': 'healthcare-support-workers-all-other',
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
