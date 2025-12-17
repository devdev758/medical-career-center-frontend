/**
 * Fast BLS City/MSA Data Import
 * 
 * Optimized for speed using:
 * - Batch inserts with createMany
 * - MSA name parsing to extract cities
 * - Progress tracking
 * 
 * Usage:
 *   npx tsx scripts/import-bls-cities.ts
 */

import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

// Excel file path
const EXCEL_PATH = path.join(__dirname, '../prisma/data/bls_data.xlsx');

// All 88 healthcare SOC codes
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

interface ExcelRow {
    AREA: string;
    AREA_TITLE: string;
    AREA_TYPE: string;
    PRIM_STATE: string;
    NAICS: string;
    NAICS_TITLE: string;
    OCC_CODE: string;
    OCC_TITLE: string;
    O_GROUP: string;
    TOT_EMP: number;
    EMP_PRSE: number;
    JOBS_1000?: number;
    LOC_QUOTIENT?: number;
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
 * Parse MSA name to extract cities
 * Examples:
 * - "Abilene, TX" -> [{ city: "Abilene", state: "TX" }]
 * - "Los Angeles-Long Beach-Anaheim, CA" -> [{ city: "Los Angeles", state: "CA" }, { city: "Long Beach", state: "CA" }, { city: "Anaheim", state: "CA" }]
 * - "Chicago-Naperville-Elgin, IL-IN-WI" -> [{ city: "Chicago", state: "IL" }, { city: "Naperville", state: "IL" }, { city: "Elgin", state: "IL" }]
 */
function parseMSAName(msaTitle: string, primaryState: string): { city: string; state: string; msaName: string }[] {
    const results: { city: string; state: string; msaName: string }[] = [];

    // Try to extract state from the MSA title first
    // Format: "City1-City2-City3, ST" or "City1-City2, ST-ST2-ST3"
    const lastCommaIndex = msaTitle.lastIndexOf(',');
    if (lastCommaIndex === -1) {
        // No state in title, use primary state
        const cities = msaTitle.split('-').map(c => c.trim()).filter(c => c);
        cities.forEach(city => {
            if (city && !city.match(/^[A-Z]{2}$/)) { // Not a state abbreviation
                results.push({ city, state: primaryState, msaName: msaTitle });
            }
        });
        return results;
    }

    const citiesPart = msaTitle.substring(0, lastCommaIndex).trim();
    const statesPart = msaTitle.substring(lastCommaIndex + 1).trim();

    // Parse cities (separated by - or /)
    const cities = citiesPart.split(/[-\/]/).map(c => c.trim()).filter(c => c && c.length > 1);

    // Parse states (could be single like "CA" or multiple like "IL-IN-WI")
    const states = statesPart.split('-').map(s => s.trim()).filter(s => s.match(/^[A-Z]{2}$/));
    const primaryStateFromMSA = states[0] || primaryState;

    // Create city entries - use primary state for all cities
    cities.forEach(city => {
        // Skip if it looks like a state abbreviation
        if (!city.match(/^[A-Z]{2}$/) && city.length > 2) {
            results.push({
                city,
                state: primaryStateFromMSA,
                msaName: msaTitle
            });
        }
    });

    return results;
}

/**
 * Create slug from city and state
 */
function createCitySlug(city: string, state: string): string {
    return `${city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${state.toLowerCase()}`;
}

/**
 * Step 1: Extract and create all city locations
 */
async function createCityLocations(data: ExcelRow[]): Promise<Map<string, string>> {
    console.log('\n📍 Step 1: Creating city locations...');

    // Extract unique MSA areas
    const msaRows = data.filter(row =>
        (row.AREA_TYPE === '4' || row.AREA_TYPE === '6') && // MSA or Nonmetro
        row.NAICS === '000000' // Cross-industry only
    );

    // Get unique MSA titles
    const uniqueMSAs = new Map<string, { title: string; state: string }>();
    msaRows.forEach(row => {
        if (!uniqueMSAs.has(row.AREA)) {
            uniqueMSAs.set(row.AREA, { title: row.AREA_TITLE, state: row.PRIM_STATE });
        }
    });

    console.log(`  Found ${uniqueMSAs.size} unique MSA/nonmetro areas`);

    // Parse all cities from MSAs
    const allCities = new Map<string, { city: string; state: string; stateName: string; msaName: string }>();

    const stateNames: Record<string, string> = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
        'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'DC': 'District of Columbia',
        'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois',
        'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana',
        'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota',
        'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
        'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
        'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon',
        'PA': 'Pennsylvania', 'PR': 'Puerto Rico', 'RI': 'Rhode Island', 'SC': 'South Carolina',
        'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
        'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
        'GU': 'Guam', 'VI': 'Virgin Islands',
    };

    uniqueMSAs.forEach(({ title, state }) => {
        const cities = parseMSAName(title, state);
        cities.forEach(({ city, state: cityState, msaName }) => {
            const key = `${city}|${cityState}`;
            if (!allCities.has(key)) {
                allCities.set(key, {
                    city,
                    state: cityState,
                    stateName: stateNames[cityState] || cityState,
                    msaName
                });
            }
        });
    });

    console.log(`  Extracted ${allCities.size} unique cities from MSAs`);

    // Batch create locations
    const locationMap = new Map<string, string>(); // slug -> locationId
    const locationsToCreate: { city: string; state: string; stateName: string; slug: string }[] = [];

    allCities.forEach(({ city, state, stateName }) => {
        const slug = createCitySlug(city, state);
        locationsToCreate.push({ city, state, stateName, slug });
    });

    // Use skipDuplicates for batch insert
    console.log(`  Creating ${locationsToCreate.length} location records in batch...`);

    // Create in batches of 500
    const BATCH_SIZE = 500;
    for (let i = 0; i < locationsToCreate.length; i += BATCH_SIZE) {
        const batch = locationsToCreate.slice(i, i + BATCH_SIZE);
        await prisma.location.createMany({
            data: batch,
            skipDuplicates: true,
        });
        process.stdout.write(`\r  Created ${Math.min(i + BATCH_SIZE, locationsToCreate.length)}/${locationsToCreate.length} locations`);
    }
    console.log('');

    // Fetch all locations to build the map
    const allLocations = await prisma.location.findMany({
        where: { city: { not: '' } }
    });
    allLocations.forEach(loc => {
        const key = `${loc.city}|${loc.state}`;
        locationMap.set(key, loc.id);
    });

    console.log(`  ✓ Created ${locationMap.size} city locations`);
    return locationMap;
}

/**
 * Step 2: Import salary data for all cities
 */
async function importCitySalaryData(
    data: ExcelRow[],
    locationMap: Map<string, string>
): Promise<number> {
    console.log('\n💰 Step 2: Importing city salary data...');

    // Filter for MSA/nonmetro salary data
    const salaryRows = data.filter(row =>
        (row.AREA_TYPE === '4' || row.AREA_TYPE === '6') &&
        row.NAICS === '000000' &&
        HEALTHCARE_SOC_CODES[row.OCC_CODE] &&
        row.O_GROUP === 'detailed'
    );

    console.log(`  Found ${salaryRows.length} MSA salary records to process`);

    // Build salary records, expanding MSAs to individual cities
    const salaryRecords: any[] = [];
    const processedKeys = new Set<string>();

    salaryRows.forEach(row => {
        const careerKeyword = HEALTHCARE_SOC_CODES[row.OCC_CODE];
        const cities = parseMSAName(row.AREA_TITLE, row.PRIM_STATE);

        cities.forEach(({ city, state, msaName }) => {
            const locationKey = `${city}|${state}`;
            const locationId = locationMap.get(locationKey);

            if (!locationId) return;

            // Avoid duplicates
            const recordKey = `${careerKeyword}|${locationId}|2024`;
            if (processedKeys.has(recordKey)) return;
            processedKeys.add(recordKey);

            salaryRecords.push({
                careerKeyword,
                locationId,
                year: 2024,
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
            });
        });
    });

    console.log(`  Prepared ${salaryRecords.length} salary records for batch insert`);

    // Batch insert with skipDuplicates
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < salaryRecords.length; i += BATCH_SIZE) {
        const batch = salaryRecords.slice(i, i + BATCH_SIZE);
        try {
            const result = await prisma.salaryData.createMany({
                data: batch,
                skipDuplicates: true,
            });
            inserted += result.count;
        } catch (error) {
            console.error(`  Batch error at ${i}:`, error);
        }
        process.stdout.write(`\r  Inserted ${Math.min(i + BATCH_SIZE, salaryRecords.length)}/${salaryRecords.length} records`);
    }
    console.log('');

    console.log(`  ✓ Inserted ${inserted} salary records`);
    return inserted;
}

/**
 * Main import function
 */
async function main(): Promise<void> {
    console.log('=== Fast BLS City/MSA Data Import ===');
    console.log(`File: ${EXCEL_PATH}`);
    console.log('Using batch inserts for speed\n');

    const startTime = Date.now();

    // Read Excel file
    console.log('📖 Reading Excel file...');
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames.find(s => s.includes('May 2024') || s.includes('data')) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);
    console.log(`  Sheet: ${sheetName}, Total rows: ${data.length}`);

    // Step 1: Create city locations
    const locationMap = await createCityLocations(data);

    // Step 2: Import salary data
    const salaryCount = await importCitySalaryData(data, locationMap);

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    // Summary
    console.log('\n=== Import Summary ===');
    console.log(`City locations created: ${locationMap.size}`);
    console.log(`Salary records inserted: ${salaryCount}`);
    console.log(`Duration: ${duration} minutes`);

    // Verify
    const totalLocations = await prisma.location.count();
    const totalSalary = await prisma.salaryData.count();
    console.log(`\nDatabase totals:`);
    console.log(`  Locations: ${totalLocations}`);
    console.log(`  Salary records: ${totalSalary}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
