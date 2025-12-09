/**
 * Adzuna Job Import Script
 * Fetches healthcare jobs from Adzuna API and stores in database
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID!;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY!;
const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs/us/search/1';

interface AdzunaJob {
    id: string;
    title: string;
    description: string;
    company: {
        display_name: string;
    };
    location: {
        display_name: string;
        area: string[];
    };
    salary_min?: number;
    salary_max?: number;
    contract_time?: string;
    created: string;
    redirect_url: string;
    category?: {
        label: string;
        tag: string;
    };
}

interface AdzunaResponse {
    results: AdzunaJob[];
    count: number;
    mean?: number;
}

/**
 * Fetch jobs from Adzuna API
 */
async function fetchJobsFromAdzuna(
    profession: string,
    location?: string,
    resultsPerPage: number = 25
): Promise<AdzunaJob[]> {
    try {
        const params: any = {
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_APP_KEY,
            results_per_page: resultsPerPage,
            what: profession
        };

        if (location) {
            params.where = location;
        }

        const response = await axios.get<AdzunaResponse>(ADZUNA_BASE_URL, { params });

        console.log(`✅ Found ${response.data.count} ${profession} jobs${location ? ` in ${location}` : ' nationwide'}`);
        console.log(`   Retrieved ${response.data.results.length} jobs`);

        return response.data.results;
    } catch (error: any) {
        console.error(`❌ Error fetching jobs: ${error.message}`);
        return [];
    }
}

/**
 * Create URL-friendly slug
 */
function createSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Parse location from Adzuna area array
 */
function parseLocation(area: string[]): { city?: string; state?: string } {
    // area format: ["US", "California", "Orange County", "Tustin"]
    if (area.length >= 2) {
        return {
            state: area[1], // California
            city: area.length >= 4 ? area[3] : undefined // Tustin
        };
    }
    return {};
}

/**
 * Format salary range
 */
function formatSalary(min?: number, max?: number): string | null {
    if (!min && !max) return null;

    if (min && max && min !== max) {
        return `$${Math.round(min).toLocaleString()} - $${Math.round(max).toLocaleString()}`;
    }

    const salary = min || max || 0;
    return `$${Math.round(salary).toLocaleString()}`;
}

/**
 * Import jobs into database
 */
async function importJobs(
    jobs: AdzunaJob[],
    careerKeyword: string
): Promise<{ imported: number; skipped: number }> {
    let imported = 0;
    let skipped = 0;

    for (const job of jobs) {
        try {
            const { city, state } = parseLocation(job.location.area);
            const salary = formatSalary(job.salary_min, job.salary_max);

            // Create unique slug
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
                    location: job.location.display_name,
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
                    location: job.location.display_name,
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

            imported++;
        } catch (error: any) {
            console.error(`   ⚠️  Skipped job ${job.id}: ${error.message}`);
            skipped++;
        }
    }

    return { imported, skipped };
}

/**
 * Main import function
 */
async function main() {
    console.log('🚀 Adzuna Job Import Script\n');
    console.log('='.repeat(50));

    // Test with a few professions and locations
    const testCases = [
        { profession: 'registered nurse', location: 'California', keyword: 'registered-nurses' },
        { profession: 'nurse practitioner', location: 'California', keyword: 'nurse-practitioners' },
        { profession: 'phlebotomist', location: 'Texas', keyword: 'phlebotomists' },
        { profession: 'dental hygienist', location: 'New York', keyword: 'dental-hygienists' },
    ];

    let totalImported = 0;
    let totalSkipped = 0;

    for (const testCase of testCases) {
        console.log(`\n📥 Fetching ${testCase.profession} jobs in ${testCase.location}...`);

        const jobs = await fetchJobsFromAdzuna(testCase.profession, testCase.location, 25);

        if (jobs.length > 0) {
            console.log(`💾 Importing ${jobs.length} jobs...`);
            const { imported, skipped } = await importJobs(jobs, testCase.keyword);
            totalImported += imported;
            totalSkipped += skipped;
            console.log(`   ✅ Imported: ${imported}, Skipped: ${skipped}`);
        }

        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n📊 IMPORT SUMMARY\n');
    console.log(`Total imported: ${totalImported}`);
    console.log(`Total skipped: ${totalSkipped}`);
    console.log(`\n✅ Import complete!`);

    await prisma.$disconnect();
}

main().catch(console.error);
