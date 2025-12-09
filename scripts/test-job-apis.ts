/**
 * Proof of Concept: Job Aggregation API Testing
 * 
 * Testing multiple job APIs to find the best fit:
 * 1. Adzuna API (free, no approval required)
 * 2. Arbeitnow API (free, no API key needed)
 * 3. Fallback: Direct scraping if needed
 */

import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// ============================================
// 1. ADZUNA API TEST
// ============================================
async function testAdzunaAPI() {
    console.log('\n🔍 Testing Adzuna API...\n');

    // Register at: https://developer.adzuna.com/
    const APP_ID = process.env.ADZUNA_APP_ID || 'YOUR_APP_ID';
    const APP_KEY = process.env.ADZUNA_APP_KEY || 'YOUR_APP_KEY';

    const params = {
        app_id: APP_ID,
        app_key: APP_KEY,
        results_per_page: 10,
        what: 'registered nurse',
        where: 'San Francisco, CA',
        country: 'us'
    };

    try {
        const response = await axios.get(
            `https://api.adzuna.com/v1/api/jobs/us/search/1`,
            { params }
        );

        console.log(`✅ Adzuna API Success!`);
        console.log(`Total results: ${response.data.count}`);
        console.log(`\nSample Job:`);

        if (response.data.results && response.data.results.length > 0) {
            const job = response.data.results[0];
            console.log(JSON.stringify({
                title: job.title,
                company: job.company.display_name,
                location: job.location.display_name,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                description: job.description?.substring(0, 200) + '...',
                url: job.redirect_url,
                created: job.created
            }, null, 2));

            return {
                success: true,
                api: 'Adzuna',
                jobCount: response.data.count,
                sampleJob: job
            };
        }
    } catch (error: any) {
        console.error(`❌ Adzuna API Error: ${error.message}`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        }
        return { success: false, api: 'Adzuna', error: error.message };
    }
}

// ============================================
// 2. ARBEITNOW API TEST (No API key needed!)
// ============================================
async function testArbeitnowAPI() {
    console.log('\n🔍 Testing Arbeitnow API...\n');

    try {
        const response = await axios.get(
            'https://www.arbeitnow.com/api/job-board-api',
            {
                params: {
                    search: 'nurse',
                    location: 'remote'
                }
            }
        );

        console.log(`✅ Arbeitnow API Success!`);
        console.log(`Total results: ${response.data.data?.length || 0}`);

        if (response.data.data && response.data.data.length > 0) {
            const job = response.data.data[0];
            console.log(`\nSample Job:`);
            console.log(JSON.stringify({
                title: job.title,
                company: job.company_name,
                location: job.location,
                job_types: job.job_types,
                url: job.url,
                created_at: job.created_at
            }, null, 2));

            return {
                success: true,
                api: 'Arbeitnow',
                jobCount: response.data.data.length,
                sampleJob: job
            };
        }
    } catch (error: any) {
        console.error(`❌ Arbeitnow API Error: ${error.message}`);
        return { success: false, api: 'Arbeitnow', error: error.message };
    }
}

// ============================================
// 3. USAJOBS API TEST (Government jobs)
// ============================================
async function testUSAJobsAPI() {
    console.log('\n🔍 Testing USAJobs API...\n');

    // Register at: https://developer.usajobs.gov/
    const API_KEY = process.env.USAJOBS_API_KEY || 'YOUR_API_KEY';
    const USER_AGENT = process.env.USAJOBS_USER_AGENT || 'your.email@example.com';

    try {
        const response = await axios.get(
            'https://data.usajobs.gov/api/search',
            {
                params: {
                    Keyword: 'registered nurse',
                    LocationName: 'San Francisco, California',
                    ResultsPerPage: 10
                },
                headers: {
                    'Host': 'data.usajobs.gov',
                    'User-Agent': USER_AGENT,
                    'Authorization-Key': API_KEY
                }
            }
        );

        console.log(`✅ USAJobs API Success!`);
        console.log(`Total results: ${response.data.SearchResult?.SearchResultCount || 0}`);

        if (response.data.SearchResult?.SearchResultItems?.length > 0) {
            const job = response.data.SearchResult.SearchResultItems[0].MatchedObjectDescriptor;
            console.log(`\nSample Job:`);
            console.log(JSON.stringify({
                title: job.PositionTitle,
                organization: job.OrganizationName,
                location: job.PositionLocationDisplay,
                salary_min: job.PositionRemuneration?.[0]?.MinimumRange,
                salary_max: job.PositionRemuneration?.[0]?.MaximumRange,
                url: job.PositionURI
            }, null, 2));

            return {
                success: true,
                api: 'USAJobs',
                jobCount: response.data.SearchResult.SearchResultCount,
                sampleJob: job
            };
        }
    } catch (error: any) {
        console.error(`❌ USAJobs API Error: ${error.message}`);
        return { success: false, api: 'USAJobs', error: error.message };
    }
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
    console.log('🚀 Job API Testing Suite\n');
    console.log('Testing multiple job aggregation APIs...\n');
    console.log('='.repeat(50));

    const results = [];

    // Test all APIs
    results.push(await testAdzunaAPI());
    results.push(await testArbeitnowAPI());
    results.push(await testUSAJobsAPI());

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 SUMMARY\n');

    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        const count = result.jobCount || 0;
        console.log(`${status} ${result.api}: ${result.success ? `${count} jobs found` : result.error}`);
    });

    // Recommendation
    console.log('\n💡 RECOMMENDATION\n');
    const successfulAPIs = results.filter(r => r.success);

    if (successfulAPIs.length > 0) {
        console.log(`Use ${successfulAPIs[0].api} as primary source`);
        if (successfulAPIs.length > 1) {
            console.log(`Use ${successfulAPIs.slice(1).map(r => r.api).join(', ')} as backup sources`);
        }
    } else {
        console.log('⚠️  No APIs working - consider web scraping or manual job entry');
    }

    console.log('\n' + '='.repeat(50));
}

// Run tests
runAllTests().catch(console.error);
