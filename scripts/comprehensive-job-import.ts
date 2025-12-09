/**
 * Comprehensive Job Import - Fill all salary page gaps
 * Ensures every profession/location with salary data also has jobs
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID!;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY!;
const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs/us/search/1';

// Profession search term mapping
const PROFESSION_SEARCH_TERMS: Record<string, string> = {
    'registered-nurses': 'registered nurse',
    'nurse-practitioners': 'nurse practitioner',
    'licensed-practical-and-licensed-vocational-nurses': 'LPN',
    'nursing-assistants': 'nursing assistant',
    'physician-assistants': 'physician assistant',
    'physicians-and-surgeons': 'physician',
    'dentists-general': 'dentist',
    'dental-hygienists': 'dental hygienist',
    'dental-assistants': 'dental assistant',
    'pharmacists': 'pharmacist',
    'pharmacy-technicians': 'pharmacy technician',
    'physical-therapists': 'physical therapist',
    'occupational-therapists': 'occupational therapist',
    'speech-language-pathologists': 'speech therapist',
    'respiratory-therapists': 'respiratory therapist',
    'radiologic-technologists-and-technicians': 'radiologic technologist',
    'diagnostic-medical-sonographers': 'ultrasound technician',
    'medical-assistants': 'medical assistant',
    'phlebotomists': 'phlebotomist',
    'clinical-laboratory-technologists-and-technicians': 'lab technician',
    'emergency-medical-technicians': 'EMT',
    'paramedics': 'paramedic',
    'surgical-technologists': 'surgical technologist',
    'medical-records-specialists': 'medical records',
    'health-information-technicians': 'health information',
};

interface Stats {
    apiCalls: number;
    jobsFetched: number;
    jobsImported: number;
    errors: number;
}

const stats: Stats = {
    apiCalls: 0,
    jobsFetched: 0,
    jobsImported: 0,
    errors: 0
};

async function fetchJobs(searchTerm: string, location?: string, count: number = 25) {
    try {
        const params: any = {
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_APP_KEY,
            results_per_page: count,
            what: searchTerm
        };

        if (location) {
            params.where = location;
        }

        const response = await axios.get(ADZUNA_BASE_URL, { params });
        stats.apiCalls++;
        stats.jobsFetched += response.data.results.length;

        return response.data.results;
    } catch (error: any) {
        stats.errors++;
        console.error(`   ❌ API Error for ${searchTerm} in ${location || 'national'}: ${error.message}`);
        return [];
    }
}

function createSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function formatSalary(min?: number, max?: number): string | null {
    if (!min && !max) return null;
    if (min && max && min !== max) {
        return `$${Math.round(min).toLocaleString()} - $${Math.round(max).toLocaleString()}`;
    }
    const salary = min || max || 0;
    return `$${Math.round(salary).toLocaleString()}`;
}

function formatLocation(location: any): string {
    // Adzuna location.area format: ["US", "State", "County", "City"]
    // We want: "City, State" or just "State" if no city
    if (location.area && location.area.length >= 2) {
        const state = location.area[1]; // Index 1 is the state
        const city = location.area[location.area.length - 1]; // Last item is usually the city

        // If city is different from state, show "City, State"
        if (city && city !== state) {
            return `${city}, ${state}`;
        }
        return state;
    }
    // Fallback to display_name if area is not available
    return location.display_name;
}

async function importJobs(jobs: any[], careerKeyword: string) {
    for (const job of jobs) {
        try {
            const salary = formatSalary(job.salary_min, job.salary_max);
            const baseSlug = createSlug(`${job.title} ${job.company.display_name} ${job.id}`);

            await prisma.job.upsert({
                where: {
                    source_externalId: {
                        source: 'ADZUNA',
                        externalId: job.id
                    }
                },
                update: {
                    title: job.title,
                    description: job.description,
                    location: formatLocation(job.location),
                    salary: salary,
                    type: job.contract_time === 'full_time' ? 'FULL_TIME' :
                        job.contract_time === 'part_time' ? 'PART_TIME' : 'FULL_TIME',
                    companyName: job.company.display_name,
                    externalUrl: job.redirect_url,
                    careerKeyword: careerKeyword,
                    updatedAt: new Date()
                },
                create: {
                    title: job.title,
                    slug: baseSlug,
                    description: job.description,
                    location: formatLocation(job.location),
                    salary: salary,
                    type: job.contract_time === 'full_time' ? 'FULL_TIME' :
                        job.contract_time === 'part_time' ? 'PART_TIME' : 'FULL_TIME',
                    source: 'ADZUNA',
                    externalId: job.id,
                    externalUrl: job.redirect_url,
                    companyName: job.company.display_name,
                    careerKeyword: careerKeyword
                }
            });

            stats.jobsImported++;
        } catch (error: any) {
            // Skip duplicates silently
        }
    }
}

async function main() {
    console.log('🚀 Comprehensive Job Import - Filling All Gaps\n');
    console.log('='.repeat(60));

    // Get all unique profession/location combinations from salary data
    const salaryData = await prisma.salaryData.findMany({
        select: {
            careerKeyword: true,
            location: {
                select: {
                    state: true,
                    stateName: true,
                    city: true
                }
            },
            // locationType: true // Removed as per instruction
        }
    });

    // Group by profession and location
    const professionLocations = new Map<string, Set<string>>();

    for (const data of salaryData) {
        if (!professionLocations.has(data.careerKeyword)) {
            professionLocations.set(data.careerKeyword, new Set());
        }

        const locations = professionLocations.get(data.careerKeyword)!;

        if (!data.location) {
            // National level
            locations.add('national');
        } else if (data.location.city) {
            // City level
            locations.add(`${data.location.city}, ${data.location.stateName}`);
        } else if (data.location.stateName) {
            // State level
            locations.add(data.location.stateName);
        }
    }

    console.log(`Found ${professionLocations.size} professions`);
    let totalCombinations = 0;
    professionLocations.forEach(locs => totalCombinations += locs.size);
    console.log(`Total profession/location combinations: ${totalCombinations}`);
    console.log('='.repeat(60));
    console.log('\n⏳ Starting import...\n');

    let processed = 0;

    for (const [professionSlug, locations] of professionLocations.entries()) {
        const searchTerm = PROFESSION_SEARCH_TERMS[professionSlug] || professionSlug.replace(/-/g, ' ');

        console.log(`\n📋 ${professionSlug.toUpperCase()}`);
        console.log(`   Locations: ${locations.size}`);

        for (const location of locations) {
            processed++;
            const progress = ((processed / totalCombinations) * 100).toFixed(1);

            // Check if we already have enough jobs
            const existingCount = await prisma.job.count({
                where: {
                    careerKeyword: professionSlug,
                    source: 'ADZUNA',
                    ...(location !== 'national' && {
                        location: {
                            contains: location.split(',')[0], // City or state name
                            mode: 'insensitive' as const
                        }
                    })
                }
            });

            if (existingCount >= 25) {
                process.stdout.write(`\r   ✓ ${location}: ${existingCount} jobs (skipping) [${progress}%]`);
                continue;
            }

            const needed = 25 - existingCount;
            process.stdout.write(`\r   → ${location}: fetching ${needed} jobs... [${progress}%]`);

            const jobs = await fetchJobs(
                searchTerm,
                location === 'national' ? undefined : location,
                needed
            );

            if (jobs.length > 0) {
                await importJobs(jobs, professionSlug);
                process.stdout.write(`\r   ✓ ${location}: +${jobs.length} jobs (total: ${existingCount + jobs.length}) [${progress}%]\n`);
            } else {
                process.stdout.write(`\r   ⚠ ${location}: no jobs found [${progress}%]\n`);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('\n📊 IMPORT COMPLETE!\n');
    console.log(`API Calls Made: ${stats.apiCalls}`);
    console.log(`Jobs Fetched: ${stats.jobsFetched}`);
    console.log(`Jobs Imported: ${stats.jobsImported}`);
    console.log(`Errors: ${stats.errors}`);
    console.log('\n' + '='.repeat(60));

    await prisma.$disconnect();
}

main().catch(console.error);
