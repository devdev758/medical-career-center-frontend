import * as XLSX from 'xlsx';

const workbook = XLSX.readFile('/Users/shirish/Downloads/all_data_M_2024.xlsx');
const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

// Find all phlebotomist entries
const phleb = data.filter((row: any) =>
    row.OCC_TITLE && row.OCC_TITLE.toLowerCase().includes('phlebotomist')
);

console.log('Total phlebotomist rows:', phleb.length);
console.log('\nBreakdown by AREA_TYPE and O_GROUP:\n');

const breakdown: Record<string, any> = {};
phleb.forEach((row: any) => {
    const key = `AREA_TYPE ${row.AREA_TYPE} + O_GROUP ${row.O_GROUP}`;
    if (!breakdown[key]) {
        breakdown[key] = { count: 0, sample: row };
    }
    breakdown[key].count++;
});

Object.entries(breakdown).forEach(([key, data]) => {
    console.log(`${key}: ${data.count} rows`);
    console.log(`  Sample: ${data.sample.AREA_TITLE} - ${data.sample.OCC_TITLE}`);
    console.log('');
});

// Show U.S. phlebotomist entries
const usPhlebotomists = phleb.filter((row: any) => row.AREA_TITLE === 'U.S.');
console.log('U.S. Phlebotomist entries:', usPhlebotomists.length);
console.log('\nAll U.S. phlebotomist rows:');
usPhlebotomists.forEach((row: any) => {
    console.log(`  AREA_TYPE ${row.AREA_TYPE}, O_GROUP ${row.O_GROUP}: ${row.OCC_TITLE}`);
});
