import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const EXCEL_PATH = '/Users/shirish/Downloads/all_data_M_2024.xlsx';

async function examineExcel() {
    console.log('📊 Reading Excel file...\n');

    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    console.log(`✅ Found ${data.length} rows\n`);

    // Show first row to understand structure
    console.log('📋 Column names:');
    if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
            console.log(`   - ${key}`);
        });
    }

    console.log('\n📝 Sample row:');
    console.log(JSON.stringify(data[0], null, 2));

    // Count unique professions
    const professions = new Set(data.map((row: any) => row.OCC_TITLE || row.occupation || row.career));
    console.log(`\n✅ Unique professions: ${professions.size}`);

    // Count unique areas
    const areas = new Set(data.map((row: any) => row.AREA_TITLE || row.area || row.location));
    console.log(`✅ Unique areas: ${areas.size}`);

    // Show some profession examples
    console.log('\n📌 Sample professions:');
    Array.from(professions).slice(0, 10).forEach(p => console.log(`   - ${p}`));

    // Show some area examples
    console.log('\n📌 Sample areas:');
    Array.from(areas).slice(0, 10).forEach(a => console.log(`   - ${a}`));
}

examineExcel().catch(console.error);
