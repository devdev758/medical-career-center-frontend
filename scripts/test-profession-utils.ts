/**
 * Test profession utilities and BLS keyword mapping
 * 
 * Usage: npx tsx scripts/test-profession-utils.ts
 */

import { getBLSKeywords, getProfession, getEnabledSpokes, getProfessionDisplayName } from '../src/lib/profession-utils';
import { prisma } from '../src/lib/prisma';

async function testProfessionUtils() {
    console.log('🧪 Testing Profession Utilities\n');

    // Test 1: Get profession by slug
    console.log('Test 1: getProfession()');
    const rn = await getProfession('registered-nurse');
    const lpn = await getProfession('lpn');
    const cna = await getProfession('cna');
    console.log(`  ✓ RN: ${rn?.displayName} (Tier ${rn?.tier})`);
    console.log(`  ✓ LPN: ${lpn?.displayName} (Tier ${lpn?.tier})`);
    console.log(`  ✓ CNA: ${cna?.displayName} (Tier ${cna?.tier})\n`);

    // Test 2: Get BLS keywords
    console.log('Test 2: getBLSKeywords()');
    const rnKeywords = await getBLSKeywords('registered-nurse');
    const lpnKeywords = await getBLSKeywords('lpn');
    const cnaKeywords = await getBLSKeywords('cna');
    console.log(`  RN keywords: [${rnKeywords.join(', ')}]`);
    console.log(`  LPN keywords: [${lpnKeywords.join(', ')}]`);
    console.log(`  CNA keywords: [${cnaKeywords.join(', ')}]\n`);

    // Test 3: Verify salary data exists for these keywords
    console.log('Test 3: Verify BLS keywords map to salary data');
    for (const keyword of rnKeywords) {
        const salaryData = await prisma.salaryData.findFirst({
            where: { careerKeyword: keyword, locationId: null, year: 2024 }
        });
        if (salaryData) {
            console.log(`  ✓ Found salary data for "${keyword}": $${salaryData.annualMedian?.toLocaleString()}`);
        } else {
            console.log(`  ✗ NO salary data for "${keyword}"`);
        }
    }
    console.log('');

    // Test 4: Get enabled spokes by tier
    console.log('Test 4: getEnabledSpokes() by tier');
    const tier1Spokes = await getEnabledSpokes('registered-nurse'); // Tier 1
    const tier2Spokes = await getEnabledSpokes('nurse-anesthetist'); // Tier 2
    const tier3Spokes = await getEnabledSpokes('surgeon'); // Tier 3
    console.log(`  Tier 1 (RN): ${tier1Spokes.length} spokes`);
    console.log(`  Tier 2 (CRNA): ${tier2Spokes.length} spokes`);
    console.log(`  Tier 3 (Surgeon): ${tier3Spokes.length} spokes\n`);

    // Test 5: Display names
    console.log('Test 5: getProfessionDisplayName()');
    const names = await Promise.all([
        getProfessionDisplayName('registered-nurse'),
        getProfessionDisplayName('lpn'),
        getProfessionDisplayName('cna'),
        getProfessionDisplayName('nurse-practitioner'),
    ]);
    names.forEach(name => console.log(`  ✓ ${name}`));
    console.log('');

    // Test 6: Query with multiple BLS keywords (consolidated data)
    console.log('Test 6: Query salary data using multiple BLS keywords');
    const lpnData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: { in: lpnKeywords },
            locationId: null,
            year: 2024
        },
        orderBy: { employmentCount: 'desc' } // Prefer keyword with more data
    });
    if (lpnData) {
        console.log(`  ✓ LPN Salary: $${lpnData.annualMedian?.toLocaleString()}`);
        console.log(`  ✓ Employment: ${lpnData.employmentCount?.toLocaleString()}`);
        console.log(`  ✓ Keyword used: "${lpnData.careerKeyword}"\n`);
    } else {
        console.log(`  ✗ No LPN salary data found\n`);
    }

    console.log('✅ All tests complete!\n');
}

testProfessionUtils()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
