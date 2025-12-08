const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../prisma/data/bls_data.xlsx');

console.log(`Reading file from: ${filePath}`);

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Total rows: ${data.length}`);

    if (data.length > 0) {
        console.log('Columns detected:', Object.keys(data[0]));
    }

    // Filter for Medical/Health (29-xxxx and 31-xxxx)
    // 29-0000 Healthcare Practitioners and Technical Occupations
    // 31-0000 Healthcare Support Occupations
    const medicalData = data.filter((row: any) => {
        const occCode = row['OCC_CODE'];
        return occCode && (occCode.startsWith('29-') || occCode.startsWith('31-'));
    });

    console.log(`Medical/Health rows found: ${medicalData.length}`);

    if (medicalData.length > 0) {
        console.log('\nSample Medical Row:');
        console.log(JSON.stringify(medicalData[0], null, 2));

        // Analyze unique location types if available
        // Usually BLS has AREA_TYPE or similar
        const areaTypes = new Set(medicalData.map((row: any) => row['AREA_TYPE']));
        console.log('\nArea Types found:', Array.from(areaTypes));

        // Analyze unique states
        const states = new Set(medicalData.map((row: any) => row['PRIM_STATE']));
        console.log('States found count:', states.size);
    }

} catch (error) {
    console.error('Error reading file:', error);
}
