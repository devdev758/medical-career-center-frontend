import * as XLSX from 'xlsx';

const EXCEL_PATH = '/Users/shirish/Downloads/all_data_M_2024.xlsx';

console.log('📊 Analyzing BLS Area Types...\n');

const workbook = XLSX.readFile(EXCEL_PATH);
const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

// Group by AREA_TYPE
const byAreaType: Record<string, any> = {};
data.forEach((row: any) => {
    const type = row.AREA_TYPE;
    if (!byAreaType[type]) {
        byAreaType[type] = { count: 0, samples: [], uniqueAreas: new Set() };
    }
    byAreaType[type].count++;
    byAreaType[type].uniqueAreas.add(row.AREA_TITLE);
    if (byAreaType[type].samples.length < 5) {
        byAreaType[type].samples.push({
            area: row.AREA_TITLE,
            occupation: row.OCC_TITLE,
            oGroup: row.O_GROUP
        });
    }
});

console.log('BLS AREA_TYPE Breakdown:\n');
Object.keys(byAreaType).sort().forEach(type => {
    console.log(`═══════════════════════════════════════════`);
    console.log(`AREA_TYPE ${type}`);
    console.log(`═══════════════════════════════════════════`);
    console.log(`Total records: ${byAreaType[type].count}`);
    console.log(`Unique areas: ${byAreaType[type].uniqueAreas.size}`);
    console.log('\nSample entries:');
    byAreaType[type].samples.forEach((s: any) => {
        console.log(`  📍 ${s.area}`);
        console.log(`     Occupation: ${s.occupation} (${s.oGroup})`);
    });
    console.log('');
});

// Analyze O_GROUP
console.log('\n═══════════════════════════════════════════');
console.log('OCCUPATION GROUPS (O_GROUP)');
console.log('═══════════════════════════════════════════\n');

const byOGroup: Record<string, number> = {};
data.forEach((row: any) => {
    const group = row.O_GROUP;
    byOGroup[group] = (byOGroup[group] || 0) + 1;
});

Object.entries(byOGroup).forEach(([group, count]) => {
    console.log(`${group}: ${count} records`);
});

// Check U.S. entries
console.log('\n═══════════════════════════════════════════');
console.log('U.S. NATIONAL DATA ANALYSIS');
console.log('═══════════════════════════════════════════\n');

const usEntries = data.filter((row: any) => row.AREA_TITLE === 'U.S.');
console.log(`Total U.S. entries: ${usEntries.length}`);

const usByOGroup: Record<string, number> = {};
usEntries.forEach((row: any) => {
    const group = row.O_GROUP;
    usByOGroup[group] = (usByOGroup[group] || 0) + 1;
});

console.log('\nU.S. entries by occupation group:');
Object.entries(usByOGroup).forEach(([group, count]) => {
    console.log(`  ${group}: ${count}`);
});

console.log('\nSample U.S. occupations (detailed only):');
usEntries
    .filter((row: any) => row.O_GROUP === 'detailed')
    .slice(0, 10)
    .forEach((row: any) => console.log(`  - ${row.OCC_TITLE}`));
