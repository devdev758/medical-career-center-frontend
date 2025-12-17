/**
 * BLS Data Sync Script
 * 
 * Fetches wage and employment data from the BLS API and saves to the database.
 * 
 * Usage:
 *   npx tsx scripts/bls-data-sync.ts --professions=registered-nurse,nursing-assistants --states=national,ca,tx
 *   npx tsx scripts/bls-data-sync.ts --all-professions --all-states
 */

import { PrismaClient } from '@prisma/client';
import {
    getWageDataForProfession,
    getAllProfessionSlugs,
    getAllStateCodes,
    WageData,
    PROFESSION_SOC_CODES,
    STATE_FIPS_CODES,
} from '../src/lib/bls-api';

const prisma = new PrismaClient();

// Rate limiting: delay between API calls
const REQUEST_DELAY_MS = 1500;

// Parse command line arguments
function parseArgs(): { professions: string[]; states: string[] } {
    const args = process.argv.slice(2);
    let professions: string[] = [];
    let states: string[] = [];

    for (const arg of args) {
        if (arg === '--all-professions') {
            professions = getAllProfessionSlugs();
        } else if (arg === '--all-states') {
            states = ['national', ...getAllStateCodes()];
        } else if (arg.startsWith('--professions=')) {
            professions = arg.replace('--professions=', '').split(',');
        } else if (arg.startsWith('--states=')) {
            states = arg.replace('--states=', '').split(',');
        }
    }

    // Defaults
    if (professions.length === 0) {
        professions = ['registered-nurse', 'nursing-assistants', 'licensed-practical-nurse'];
    }
    if (states.length === 0) {
        states = ['national'];
    }

    return { professions, states };
}

/**
 * Get or create a Location record for a state
 */
async function getOrCreateLocation(stateCode: string): Promise<string | null> {
    if (stateCode === 'national') {
        return null; // National data has no locationId
    }

    const stateUpper = stateCode.toUpperCase();

    // State names mapping
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
    };

    const stateName = stateNames[stateUpper] || stateUpper;

    // Find or create state-level location (city = empty string)
    let location = await prisma.location.findFirst({
        where: {
            state: stateUpper,
            city: '',
        },
    });

    if (!location) {
        location = await prisma.location.create({
            data: {
                state: stateUpper,
                stateName: stateName,
                city: '',
                slug: stateCode.toLowerCase(),
            },
        });
        console.log(`  Created location: ${stateName} (${stateUpper})`);
    }

    return location.id;
}

/**
 * Save wage data to the database
 */
async function saveWageData(wageData: WageData[]): Promise<number> {
    let savedCount = 0;

    for (const data of wageData) {
        try {
            const locationId = await getOrCreateLocation(data.stateCode);

            // For national data (null locationId), we can't use the compound unique constraint
            // So we need to use findFirst + create/update pattern
            const existing = await prisma.salaryData.findFirst({
                where: {
                    careerKeyword: data.professionSlug,
                    locationId: locationId,
                    year: data.year,
                },
            });

            const salaryFields = {
                hourlyMean: data.hourlyMean,
                hourlyMedian: data.hourlyMedian,
                hourly10th: data.hourly10th,
                hourly25th: data.hourly25th,
                hourly75th: data.hourly75th,
                hourly90th: data.hourly90th,
                annualMean: data.annualMean,
                annualMedian: data.annualMedian,
                annual10th: data.annual10th,
                annual25th: data.annual25th,
                annual75th: data.annual75th,
                annual90th: data.annual90th,
                employmentCount: data.employment,
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
                        careerKeyword: data.professionSlug,
                        locationId: locationId,
                        year: data.year,
                        ...salaryFields,
                    },
                });
            }

            savedCount++;
        } catch (error) {
            console.error(`  Failed to save data for ${data.professionSlug} in ${data.stateCode}:`, error);
        }
    }

    return savedCount;
}

/**
 * Main sync function
 */
async function syncBLSData(professions: string[], states: string[]): Promise<void> {
    console.log('=== BLS Data Sync Started ===');
    console.log(`Professions: ${professions.join(', ')}`);
    console.log(`States: ${states.join(', ')}`);
    console.log(`Total API calls: ${professions.length * states.length}`);
    console.log('');

    let totalFetched = 0;
    let totalSaved = 0;
    let totalErrors = 0;

    for (const profession of professions) {
        if (!PROFESSION_SOC_CODES[profession]) {
            console.log(`⚠️ Unknown profession: ${profession}, skipping...`);
            continue;
        }

        console.log(`\n📊 Processing: ${PROFESSION_SOC_CODES[profession].name}`);

        for (const state of states) {
            if (!STATE_FIPS_CODES[state]) {
                console.log(`  ⚠️ Unknown state: ${state}, skipping...`);
                continue;
            }

            try {
                process.stdout.write(`  Fetching ${state}... `);

                const wageData = await getWageDataForProfession(profession, state);
                totalFetched += wageData.length;

                if (wageData.length > 0) {
                    const saved = await saveWageData(wageData);
                    totalSaved += saved;
                    console.log(`✓ ${wageData.length} records (saved: ${saved})`);
                } else {
                    console.log(`⚠️ No data found`);
                }

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
            } catch (error: any) {
                totalErrors++;
                console.log(`✗ Error: ${error.message}`);
            }
        }
    }

    console.log('\n=== Sync Summary ===');
    console.log(`Total fetched: ${totalFetched} records`);
    console.log(`Total saved: ${totalSaved} records`);
    console.log(`Errors: ${totalErrors}`);
}

/**
 * Display current data in database
 */
async function showStats(): Promise<void> {
    const professionCounts = await prisma.salaryData.groupBy({
        by: ['careerKeyword'],
        _count: true,
    });

    console.log('\n=== Current Database Stats ===');
    for (const pc of professionCounts) {
        console.log(`  ${pc.careerKeyword}: ${pc._count} records`);
    }

    const totalLocations = await prisma.location.count({
        where: { city: '' },
    });
    console.log(`\nTotal state locations: ${totalLocations}`);
}

// Main execution
async function main(): Promise<void> {
    const { professions, states } = parseArgs();

    // Check for API key
    if (!process.env.BLS_API_KEY) {
        console.error('⚠️ Warning: BLS_API_KEY not set. API calls may be rate limited.');
        console.error('   Set it in your .env file: BLS_API_KEY=your_key_here');
        console.error('   Register at: https://data.bls.gov/registrationEngine/');
        console.log('');
    }

    try {
        await syncBLSData(professions, states);
        await showStats();
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
