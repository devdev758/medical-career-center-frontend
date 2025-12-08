const ExcelJS = require('exceljs');
const path = require('path');

const filePath = path.join(__dirname, '../prisma/data/bls_data.xlsx');

async function analyze() {
    console.log(`Reading file stream from: ${filePath}`);

    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {});

    let rowCount = 0;
    let medicalCount = 0;
    let headers = [];
    let sampleRow = null;
    let uniqueStates = new Set();

    for await (const worksheet of workbook) {
        console.log(`Processing worksheet: ${worksheet.name}`);

        for await (const row of worksheet) {
            rowCount++;

            // Get values (ExcelJS rows are 1-based, values array has empty 0 index usually)
            // row.values is [empty, col1, col2, ...]
            const values = row.values;
            // Remove first empty element if present (ExcelJS quirk)
            const rowData = Array.isArray(values) ? values.slice(1) : values;

            if (rowCount === 1) {
                headers = rowData;
                console.log('Headers detected:', headers);
                continue;
            }

            // Map row to object
            const rowObj: any = {};
            headers.forEach((header: any, index: any) => {
                rowObj[header] = rowData[index];
            });

            // Check for Medical codes (29-xxxx, 31-xxxx)
            // Assuming OCC_CODE is one of the headers. Let's find index.
            // But we already mapped to object.

            const occCode = rowObj['OCC_CODE'];
            if (occCode && (String(occCode).startsWith('29-') || String(occCode).startsWith('31-'))) {
                medicalCount++;
                if (!sampleRow) {
                    sampleRow = rowObj;
                }
                if (rowObj['PRIM_STATE']) {
                    uniqueStates.add(rowObj['PRIM_STATE']);
                }
            }

            if (rowCount % 10000 === 0) {
                console.log(`Processed ${rowCount} rows...`);
            }
        }

        // Only process first sheet
        break;
    }

    console.log(`\nAnalysis Complete:`);
    console.log(`Total Rows: ${rowCount}`);
    console.log(`Medical/Health Rows (29-*, 31-*): ${medicalCount}`);
    console.log(`Unique States found: ${uniqueStates.size}`);

    if (sampleRow) {
        console.log('\nSample Medical Row:');
        console.log(JSON.stringify(sampleRow, null, 2));
    }
}

analyze().catch(console.error);
