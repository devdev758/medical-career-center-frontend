/**
 * Seed 55 Professions from Master List CSV
 * 
 * This script populates the Profession table with our approved 55 professions,
 * including BLS keyword mappings and tier allocations.
 * 
 * Usage: npx tsx scripts/seed-professions.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Master profession data from CSV analysis
const PROFESSIONS = [
    { rank: 1, soc: '29-1141', blsKeywords: ['registered-nurses', 'registered-nurse'], slug: 'registered-nurse', name: 'Registered Nurse', tier: 1 },
    { rank: 2, soc: '31-1131', blsKeywords: ['nursing-assistants'], slug: 'cna', name: 'Certified Nursing Assistant', tier: 1 },
    { rank: 3, soc: '31-9092', blsKeywords: ['medical-assistants', 'medical-assistant'], slug: 'medical-assistant', name: 'Medical Assistant', tier: 1 },
    { rank: 4, soc: '29-1171', blsKeywords: ['nurse-practitioners', 'nurse-practitioner'], slug: 'nurse-practitioner', name: 'Nurse Practitioner', tier: 1 },
    { rank: 5, soc: '29-2061', blsKeywords: ['licensed-practical-and-licensed-vocational-nurses', 'licensed-practical-nurse'], slug: 'lpn', name: 'Licensed Practical Nurse', tier: 1 },
    { rank: 6, soc: '29-1123', blsKeywords: ['physical-therapists', 'physical-therapist'], slug: 'physical-therapist', name: 'Physical Therapist', tier: 1 },
    { rank: 7, soc: '29-1071', blsKeywords: ['physician-assistants', 'physician-assistant'], slug: 'physician-assistant', name: 'Physician Assistant', tier: 1 },
    { rank: 8, soc: '29-1051', blsKeywords: ['pharmacists', 'pharmacist'], slug: 'pharmacist', name: 'Pharmacist', tier: 1 },
    { rank: 9, soc: '29-1292', blsKeywords: ['dental-hygienists', 'dental-hygienist'], slug: 'dental-hygienist', name: 'Dental Hygienist', tier: 1 },
    { rank: 10, soc: '29-1122', blsKeywords: ['occupational-therapists', 'occupational-therapist'], slug: 'occupational-therapist', name: 'Occupational Therapist', tier: 1 },
    { rank: 11, soc: '29-1126', blsKeywords: ['respiratory-therapists', 'respiratory-therapist'], slug: 'respiratory-therapist', name: 'Respiratory Therapist', tier: 1 },
    { rank: 12, soc: '31-9091', blsKeywords: ['dental-assistants', 'dental-assistant'], slug: 'dental-assistant', name: 'Dental Assistant', tier: 1 },
    { rank: 13, soc: '31-9097', blsKeywords: ['phlebotomists', 'phlebotomist'], slug: 'phlebotomist', name: 'Phlebotomist', tier: 1 },
    { rank: 14, soc: '29-2055', blsKeywords: ['surgical-technologists', 'surgical-technologist'], slug: 'surgical-technologist', name: 'Surgical Technologist', tier: 1 },
    { rank: 15, soc: '29-2052', blsKeywords: ['pharmacy-technicians', 'pharmacy-technician'], slug: 'pharmacy-technician', name: 'Pharmacy Technician', tier: 1 },
    { rank: 16, soc: '29-2034', blsKeywords: ['radiologic-technologists-and-technicians', 'radiologic-technologist'], slug: 'radiologic-technologist', name: 'Radiologic Technologist', tier: 1 },
    { rank: 17, soc: '29-2042', blsKeywords: ['emergency-medical-technicians'], slug: 'emt', name: 'Emergency Medical Technician', tier: 1 },
    { rank: 18, soc: '29-2043', blsKeywords: ['paramedics'], slug: 'paramedic', name: 'Paramedic', tier: 1 },
    { rank: 19, soc: '29-2032', blsKeywords: ['diagnostic-medical-sonographers', 'ultrasound-technician'], slug: 'ultrasound-technician', name: 'Ultrasound Technician', tier: 1 },
    { rank: 20, soc: '29-1127', blsKeywords: ['speech-language-pathologists'], slug: 'speech-language-pathologist', name: 'Speech-Language Pathologist', tier: 1 },

    // Tier 2
    { rank: 21, soc: '29-1151', blsKeywords: ['nurse-anesthetists'], slug: 'nurse-anesthetist', name: 'Nurse Anesthetist (CRNA)', tier: 2 },
    { rank: 22, soc: '29-1021', blsKeywords: ['dentists-general'], slug: 'dentist', name: 'Dentist', tier: 2 },
    { rank: 23, soc: '29-1131', blsKeywords: ['veterinarians', 'veterinarian'], slug: 'veterinarian', name: 'Veterinarian', tier: 2 },
    { rank: 24, soc: '31-9011', blsKeywords: ['massage-therapists'], slug: 'massage-therapist', name: 'Massage Therapist', tier: 2 },
    { rank: 25, soc: '29-2035', blsKeywords: ['magnetic-resonance-imaging-technologists'], slug: 'mri-technologist', name: 'MRI Technologist', tier: 2 },
    { rank: 26, soc: '31-2021', blsKeywords: ['physical-therapist-assistants'], slug: 'physical-therapist-assistant', name: 'Physical Therapist Assistant', tier: 2 },
    { rank: 27, soc: '29-2056', blsKeywords: ['veterinary-technologists-and-technicians'], slug: 'veterinary-technician', name: 'Veterinary Technician', tier: 2 },
    { rank: 28, soc: '29-1011', blsKeywords: ['chiropractors'], slug: 'chiropractor', name: 'Chiropractor', tier: 2 },
    { rank: 29, soc: '31-2011', blsKeywords: ['occupational-therapy-assistants'], slug: 'occupational-therapy-assistant', name: 'Occupational Therapy Assistant', tier: 2 },
    { rank: 30, soc: '29-2010', blsKeywords: ['clinical-laboratory-technologists-and-technicians'], slug: 'medical-laboratory-technician', name: 'Medical Laboratory Technician', tier: 2 },
    { rank: 31, soc: '29-1041', blsKeywords: ['optometrists'], slug: 'optometrist', name: 'Optometrist', tier: 2 },
    { rank: 32, soc: '29-1181', blsKeywords: ['audiologists'], slug: 'audiologist', name: 'Audiologist', tier: 2 },
    { rank: 33, soc: '29-1031', blsKeywords: ['dietitians-and-nutritionists'], slug: 'dietitian', name: 'Dietitian', tier: 2 },
    { rank: 34, soc: '29-1215', blsKeywords: ['family-medicine-physicians', 'family-medicine-physician'], slug: 'family-medicine-physician', name: 'Family Medicine Physician', tier: 2 },
    { rank: 35, soc: '29-1221', blsKeywords: ['pediatricians-general', 'pediatrician'], slug: 'pediatrician', name: 'Pediatrician', tier: 2 },
    { rank: 36, soc: '29-9091', blsKeywords: ['athletic-trainers'], slug: 'athletic-trainer', name: 'Athletic Trainer', tier: 2 },
    { rank: 37, soc: '29-1213', blsKeywords: ['dermatologists', 'dermatologist'], slug: 'dermatologist', name: 'Dermatologist', tier: 2 },
    { rank: 38, soc: '31-1120', blsKeywords: ['home-health-and-personal-care-aides'], slug: 'home-health-aide', name: 'Home Health Aide', tier: 2 },
    { rank: 39, soc: '29-1161', blsKeywords: ['nurse-midwives'], slug: 'nurse-midwife', name: 'Nurse Midwife', tier: 2 },
    { rank: 40, soc: '29-2031', blsKeywords: ['cardiovascular-technologists-and-technicians'], slug: 'cardiovascular-technologist', name: 'Cardiovascular Technologist', tier: 2 },

    // Tier 3
    { rank: 41, soc: '29-1249', blsKeywords: ['surgeons-all-other', 'surgeon'], slug: 'surgeon', name: 'Surgeon', tier: 3 },
    { rank: 42, soc: '29-1211', blsKeywords: ['anesthesiologists', 'anesthesiologist'], slug: 'anesthesiologist', name: 'Anesthesiologist', tier: 3 },
    { rank: 43, soc: '29-1212', blsKeywords: ['cardiologists', 'cardiologist'], slug: 'cardiologist', name: 'Cardiologist', tier: 3 },
    { rank: 44, soc: '29-1081', blsKeywords: ['podiatrists', 'podiatrist'], slug: 'podiatrist', name: 'Podiatrist', tier: 3 },
    { rank: 45, soc: '29-1223', blsKeywords: ['psychiatrists', 'psychiatrist'], slug: 'psychiatrist', name: 'Psychiatrist', tier: 3 },
    { rank: 46, soc: '29-1241', blsKeywords: ['ophthalmologists-except-pediatric', 'ophthalmologist'], slug: 'ophthalmologist', name: 'Ophthalmologist', tier: 3 },
    { rank: 47, soc: '29-1217', blsKeywords: ['neurologists', 'neurologist'], slug: 'neurologist', name: 'Neurologist', tier: 3 },
    { rank: 48, soc: '29-1218', blsKeywords: ['obstetricians-and-gynecologists', 'obstetrician-gynecologist'], slug: 'obgyn', name: 'OB-GYN', tier: 3 },
    { rank: 49, soc: '29-1224', blsKeywords: ['radiologists'], slug: 'radiologist', name: 'Radiologist', tier: 3 },
    { rank: 50, soc: '29-1124', blsKeywords: ['radiation-therapists'], slug: 'radiation-therapist', name: 'Radiation Therapist', tier: 3 },
    { rank: 51, soc: '29-2033', blsKeywords: ['nuclear-medicine-technologists'], slug: 'nuclear-medicine-technologist', name: 'Nuclear Medicine Technologist', tier: 3 },
    { rank: 52, soc: '29-1128', blsKeywords: ['exercise-physiologists'], slug: 'exercise-physiologist', name: 'Exercise Physiologist', tier: 3 },
    { rank: 53, soc: '29-9092', blsKeywords: ['genetic-counselors'], slug: 'genetic-counselor', name: 'Genetic Counselor', tier: 3 },
    { rank: 54, soc: '29-2091', blsKeywords: ['orthotists-and-prosthetists'], slug: 'orthotist-prosthetist', name: 'Orthotist & Prosthetist', tier: 3 },
    { rank: 55, soc: '29-2092', blsKeywords: ['hearing-aid-specialists'], slug: 'hearing-aid-specialist', name: 'Hearing Aid Specialist', tier: 3 },
];

async function main() {
    console.log('🌱 Seeding 55 Professions...\n');

    let created = 0;
    let updated = 0;

    for (const prof of PROFESSIONS) {
        try {
            const existing = await prisma.profession.findUnique({
                where: { slug: prof.slug }
            });

            if (existing) {
                await prisma.profession.update({
                    where: { slug: prof.slug },
                    data: {
                        displayName: prof.name,
                        socCode: prof.soc,
                        blsKeywords: prof.blsKeywords,
                        tier: prof.tier,
                        rank: prof.rank,
                    }
                });
                updated++;
                console.log(`  ✓ Updated: ${prof.name} (${prof.slug})`);
            } else {
                await prisma.profession.create({
                    data: {
                        slug: prof.slug,
                        displayName: prof.name,
                        socCode: prof.soc,
                        blsKeywords: prof.blsKeywords,
                        tier: prof.tier,
                        rank: prof.rank,
                    }
                });
                created++;
                console.log(`  + Created: ${prof.name} (${prof.slug})`);
            }
        } catch (error) {
            console.error(`  ✗ Failed: ${prof.name}:`, error);
        }
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Total: ${PROFESSIONS.length}`);

    // Show tier breakdown
    const tier1 = PROFESSIONS.filter(p => p.tier === 1).length;
    const tier2 = PROFESSIONS.filter(p => p.tier === 2).length;
    const tier3 = PROFESSIONS.filter(p => p.tier === 3).length;
    console.log(`\n📊 Tier Breakdown:`);
    console.log(`   Tier 1 (11 spokes): ${tier1}`);
    console.log(`   Tier 2 (7 spokes): ${tier2}`);
    console.log(`   Tier 3 (4 spokes): ${tier3}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
