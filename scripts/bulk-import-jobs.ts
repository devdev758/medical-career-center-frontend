/**
 * Bulk Job Import Script - Adzuna API
 * 
 * Strategy: Import jobs for all 88 professions across top states
 * to maximize 5-day trial period
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID!;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY!;
const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs/us/search/1';

// Top 88 healthcare professions (matching our salary data)
const PROFESSIONS = [
    { keyword: 'registered-nurses', search: 'registered nurse' },
    { keyword: 'nurse-practitioners', search: 'nurse practitioner' },
    { keyword: 'licensed-practical-and-licensed-vocational-nurses', search: 'licensed practical nurse' },
    { keyword: 'nursing-assistants', search: 'nursing assistant' },
    { keyword: 'physician-assistants', search: 'physician assistant' },
    { keyword: 'physicians-and-surgeons', search: 'physician' },
    { keyword: 'dentists-general', search: 'dentist' },
    { keyword: 'dental-hygienists', search: 'dental hygienist' },
    { keyword: 'dental-assistants', search: 'dental assistant' },
    { keyword: 'pharmacists', search: 'pharmacist' },
    { keyword: 'pharmacy-technicians', search: 'pharmacy technician' },
    { keyword: 'physical-therapists', search: 'physical therapist' },
    { keyword: 'occupational-therapists', search: 'occupational therapist' },
    { keyword: 'speech-language-pathologists', search: 'speech language pathologist' },
    { keyword: 'respiratory-therapists', search: 'respiratory therapist' },
    { keyword: 'radiologic-technologists-and-technicians', search: 'radiologic technologist' },
    { keyword: 'diagnostic-medical-sonographers', search: 'ultrasound technician' },
    { keyword: 'medical-assistants', search: 'medical assistant' },
    { keyword: 'phlebotomists', search: 'phlebotomist' },
    { keyword: 'clinical-laboratory-technologists-and-technicians', search: 'lab technician' },
    { keyword: 'emergency-medical-technicians', search: 'EMT' },
    { keyword: 'paramedics', search: 'paramedic' },
    { keyword: 'surgical-technologists', search: 'surgical technologist' },
    { keyword: 'medical-records-specialists', search: 'medical records specialist' },
    { keyword: 'health-information-technicians', search: 'health information technician' },
];

// Top 15 states by healthcare employment
const TOP_STATES = [
    'California', 'Texas', 'Florida', 'New York', 'Pennsylvania',
    'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan',
    'New Jersey', 'Virginia', 'Washington', 'Massachusetts', 'Arizona'
];

interface AdzunaJob {
    id: string;
    title: string;
    description: string;
    company: { display_name: string };
    location: { display_name: string; area: string[] };
    salary_min?: number;
    salary_max?: number;
    contract_time?: string;
    created: string;
    redirect_url: string;
}

interface ImportStats {
    totalFetched: number;
    totalImported: number;
    totalSkipped: number;
    apiCalls: number;
    errors: number;
}

const stats: ImportStats = {
    totalFetched: 0,
    totalImported: 0,
    totalSkipped: 0,
    apiCalls: 0,
    errors: 0
};

/**
 * Fetch jobs from Adzuna
 */
async function fetchJobs(
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

        const response = await axios.get(ADZUNA_BASE_URL, { params });
        stats.apiCalls++;
        stats.totalFetched += response.data.results.length;

        return response.data.results;
    } catch (error: any) {
        stats.errors++;
        console.error(`   ❌ API Error: ${error.message}`);
        return [];
    }
}

/**
 * Create slug
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
 * Format salary
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
 * Import jobs to database
 */
async function importJobs(jobs: AdzunaJob[], careerKeyword: string): Promise<void> {
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

            stats.totalImported++;
        } catch (error: any) {
            stats.totalSkipped++;
        }
    }
}

/**
 * Progress display
 */
function displayProgress(current: number, total: number, label: string) {
    const percentage = ((current / total) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(current / total * 30)) + '░'.repeat(30 - Math.floor(current / total * 30));
    process.stdout.write(`\r${bar} ${percentage}% | ${label}`);
}

/**
 * Main bulk import
 */
async function main() {
    console.log('🚀 Bulk Job Import - Adzuna API\n');
    console.log('='.repeat(60));
    console.log(`Professions: ${PROFESSIONS.length}`);
    console.log(`States: ${TOP_STATES.length}`);
    console.log(`Estimated API calls: ${PROFESSIONS.length * (TOP_STATES.length + 1)}`);
    console.log(`Jobs per call: 25`);
    console.log(`Estimated total jobs: ${PROFESSIONS.length * (TOP_STATES.length + 1) * 25}`);
    console.log('='.repeat(60));
    console.log('\n⏳ Starting import...\n');

    const totalTasks = PROFESSIONS.length * (TOP_STATES.length + 1);
    let currentTask = 0;

    for (const profession of PROFESSIONS) {
        console.log(`\n📋 ${profession.keyword.toUpperCase()}`);

        // 1. Import national jobs
        currentTask++;
        displayProgress(currentTask, totalTasks, `National ${profession.search}`);
        const nationalJobs = await fetchJobs(profession.search, undefined, 25);
        if (nationalJobs.length > 0) {
            await importJobs(nationalJobs, profession.keyword);
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting

        // 2. Import state jobs
        for (const state of TOP_STATES) {
            currentTask++;
            displayProgress(currentTask, totalTasks, `${state} ${profession.search}`);
            const stateJobs = await fetchJobs(profession.search, state, 25);
            if (stateJobs.length > 0) {
                await importJobs(stateJobs, profession.keyword);
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        }
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('\n📊 IMPORT COMPLETE!\n');
    console.log(`API Calls Made: ${stats.apiCalls}`);
    console.log(`Jobs Fetched: ${stats.totalFetched}`);
    console.log(`Jobs Imported: ${stats.totalImported}`);
    console.log(`Jobs Skipped: ${stats.totalSkipped}`);
    console.log(`Errors: ${stats.errors}`);
    console.log('\n' + '='.repeat(60));

    await prisma.$disconnect();
}

main().catch(console.error);
