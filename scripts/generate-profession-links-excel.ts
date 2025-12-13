/**
 * Generate Excel file with all profession links
 */

import * as fs from 'fs';
import * as XLSX from 'xlsx';

// Read professions list
const professionsData = fs.readFileSync('professions-list.json', 'utf-8');
const professions: string[] = JSON.parse(professionsData);

// Base URL for the site
const baseUrl = 'https://medicalcareercenter.org';

// Generate data for Excel
const data = professions.map(slug => {
    const name = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        'Profession Name': name,
        'Profession Slug': slug,
        'Profession Hub': `${baseUrl}/${slug}`,
        'Career Guide': `${baseUrl}/how-to-become-${slug}`,
        'Salary Page': `${baseUrl}/${slug}-salary`,
        'Jobs Page': `${baseUrl}/${slug}-jobs`,
    };
});

// Create worksheet
const ws = XLSX.utils.json_to_sheet(data);

// Create workbook
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Profession Links');

// Auto-size columns for better readability
const cols = [
    { wch: 40 }, // Profession Name
    { wch: 35 }, // Profession Slug
    { wch: 60 }, // Profession Hub
    { wch: 70 }, // Career Guide
    { wch: 60 }, // Salary Page
    { wch: 60 }  // Jobs Page
];
ws['!cols'] = cols;

// Write file
XLSX.writeFile(wb, 'profession-links.xlsx');

console.log(`✅ Created profession-links.xlsx with ${data.length} professions`);
console.log('\nColumns:');
console.log('  1. Profession Name - Human-readable name');
console.log('  2. Profession Slug - URL-friendly identifier');
console.log('  3. Profession Hub - Main landing page');
console.log('  4. Career Guide - How to become guide');
console.log('  5. Salary Page - Salary information');
console.log('  6. Jobs Page - Job listings');
