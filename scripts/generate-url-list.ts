import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();
const BASE_URL = 'https://beta.medicalcareercenter.org';

async function generateURLList() {
    console.log('📊 Generating URL list...\n');

    // Get all salary data with locations
    const allData = await prisma.salaryData.findMany({
        include: {
            location: true
        },
        orderBy: [
            { careerKeyword: 'asc' }
        ]
    });

    console.log(`Found ${allData.length} total salary records\n`);

    const urls: any[] = [];

    for (const record of allData) {
        let url = `${BASE_URL}/${record.careerKeyword}-salary`;
        let type = 'National';
        let state = '';
        let city = '';
        let profession = record.careerKeyword;

        if (record.location) {
            state = record.location.state;
            city = record.location.city;

            if (city) {
                // City page
                const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                url = `${BASE_URL}/${record.careerKeyword}-salary/${state.toLowerCase()}/${citySlug}`;
                type = 'City';
            } else {
                // State page
                url = `${BASE_URL}/${record.careerKeyword}-salary/${state.toLowerCase()}`;
                type = 'State';
            }
        }

        urls.push({
            'Type': type,
            'Profession': profession,
            'State': state || 'USA',
            'City': city || '',
            'URL': url,
            'Median Salary': record.annualMedian ? `$${record.annualMedian.toLocaleString()}` : 'N/A'
        });
    }

    console.log(`Generated ${urls.length} URLs\n`);

    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new();

    // Sheet 1: All URLs
    const allSheet = XLSX.utils.json_to_sheet(urls);
    XLSX.utils.book_append_sheet(workbook, allSheet, 'All URLs');

    // Sheet 2: National URLs
    const nationalUrls = urls.filter(u => u.Type === 'National');
    const nationalSheet = XLSX.utils.json_to_sheet(nationalUrls);
    XLSX.utils.book_append_sheet(workbook, nationalSheet, 'National');

    // Sheet 3: State URLs
    const stateUrls = urls.filter(u => u.Type === 'State');
    const stateSheet = XLSX.utils.json_to_sheet(stateUrls);
    XLSX.utils.book_append_sheet(workbook, stateSheet, 'State');

    // Sheet 4: City URLs
    const cityUrls = urls.filter(u => u.Type === 'City');
    const citySheet = XLSX.utils.json_to_sheet(cityUrls);
    XLSX.utils.book_append_sheet(workbook, citySheet, 'City');

    // Create sheets by state
    const states = [...new Set(urls.filter(u => u.State !== 'USA').map(u => u.State))].sort();

    for (const state of states) {
        const stateData = urls.filter(u => u.State === state);
        const sheet = XLSX.utils.json_to_sheet(stateData);
        XLSX.utils.book_append_sheet(workbook, sheet, state);
    }

    // Save to Desktop
    const outputPath = '/Users/shirish/Desktop/salary-page-urls.xlsx';
    XLSX.writeFile(workbook, outputPath);

    console.log(`✅ Excel file created: ${outputPath}\n`);
    console.log('Summary:');
    console.log(`  National URLs: ${nationalUrls.length}`);
    console.log(`  State URLs: ${stateUrls.length}`);
    console.log(`  City URLs: ${cityUrls.length}`);
    console.log(`  Total URLs: ${urls.length}`);
    console.log(`  States covered: ${states.length}`);

    await prisma.$disconnect();
}

generateURLList();
