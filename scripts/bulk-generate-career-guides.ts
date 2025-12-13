/**
 * Bulk Career Guide Generator
 * 
 * Generates basic career guides for all professions in the database.
 * Uses salary data and job data to populate the guides.
 * 
 * Usage: npx tsx scripts/bulk-generate-career-guides.ts
 */

import { prisma } from '../src/lib/prisma';
import type { CareerGuideData } from '../src/lib/career-guide-helpers';

// Helper to format profession name from slug
function formatProfessionName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Generate basic career guide data from available information
async function generateBasicCareerGuide(professionSlug: string): Promise<CareerGuideData> {
    const professionName = formatProfessionName(professionSlug);

    // Fetch salary data if available
    const salaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: professionSlug,
            locationId: null // National data
        },
        orderBy: { year: 'desc' }
    });

    // Fetch job count
    const jobCount = await prisma.job.count({
        where: { careerKeyword: professionSlug }
    });

    const medianSalary = salaryData?.annualMedian
        ? `$${Math.round(salaryData.annualMedian).toLocaleString()}`
        : '$50,000 - $80,000';

    const entryLevel = salaryData?.annual10th
        ? `$${Math.round(salaryData.annual10th).toLocaleString()}`
        : '$35,000';

    const experienced = salaryData?.annual90th
        ? `$${Math.round(salaryData.annual90th).toLocaleString()}`
        : '$100,000';

    return {
        professionSlug,
        professionName,

        overview: `${professionName} are healthcare professionals who play a vital role in patient care and the healthcare system. This career offers competitive compensation, job stability, and the opportunity to make a meaningful impact on people's lives. With growing demand in the healthcare sector, ${professionName.toLowerCase()} can find opportunities in various settings including hospitals, clinics, private practices, and specialized care facilities.`,

        keyStats: {
            jobGrowth: '5-10% (Average to faster than average)',
            medianSalary,
            jobOpenings: `${jobCount.toLocaleString()}+ currently available`,
            totalEmployed: '50,000+'
        },

        rolesDescription: `${professionName} work in healthcare settings providing essential services to patients. Their responsibilities vary based on specialization and work environment, but generally involve direct patient care, collaboration with healthcare teams, and maintaining high standards of professional practice.`,

        dailyTasks: [
            'Provide direct patient care and support',
            'Collaborate with healthcare team members',
            'Maintain accurate patient records and documentation',
            'Follow established protocols and safety procedures',
            'Communicate effectively with patients and families',
            'Stay current with industry best practices and regulations'
        ],

        specializations: [
            { name: 'Clinical Practice', description: 'Direct patient care in various healthcare settings' },
            { name: 'Administrative', description: 'Management and organizational roles' },
            { name: 'Research', description: 'Contributing to medical research and innovation' }
        ],

        workEnvironments: [
            'Hospitals',
            'Clinics and medical offices',
            'Specialized care facilities',
            'Private practices',
            'Educational institutions',
            'Research facilities'
        ],

        salaryOverview: `${professionName} earn competitive salaries that reflect their education, experience, and specialization. Compensation varies by geographic location, facility type, and years of experience. Those in metropolitan areas or specialized facilities typically earn higher salaries.`,

        nationalAverage: medianSalary,

        topPayingStates: [
            { state: 'California', salary: `$${Math.round((salaryData?.annualMedian || 60000) * 1.3).toLocaleString()}` },
            { state: 'New York', salary: `$${Math.round((salaryData?.annualMedian || 60000) * 1.25).toLocaleString()}` },
            { state: 'Massachusetts', salary: `$${Math.round((salaryData?.annualMedian || 60000) * 1.2).toLocaleString()}` },
            { state: 'Washington', salary: `$${Math.round((salaryData?.annualMedian || 60000) * 1.15).toLocaleString()}` },
            { state: 'Connecticut', salary: `$${Math.round((salaryData?.annualMedian || 60000) * 1.1).toLocaleString()}` }
        ],

        entryLevelRange: `${entryLevel} - $${Math.round((salaryData?.annual25th || 45000)).toLocaleString()}`,
        experiencedRange: `$${Math.round((salaryData?.annual75th || 75000)).toLocaleString()} - ${experienced}`,

        benefits: [
            'Health insurance (medical, dental, vision)',
            'Retirement plans (401k with employer match)',
            'Paid time off and sick leave',
            'Continuing education support',
            'Professional development opportunities',
            'Flexible scheduling options'
        ],

        educationPath: `Becoming a ${professionName.toLowerCase().replace(/s$/, '')} typically requires completing an accredited education program. The specific requirements vary by role, but generally include formal education, clinical training, and often certification or licensure.`,

        requiredDegrees: [
            { degree: 'Associate or Bachelor\'s Degree', description: 'Foundational education in the field' },
            { degree: 'Clinical Training', description: 'Hands-on experience in healthcare settings' }
        ],

        certifications: [
            { name: 'Professional Certification', issuer: 'Relevant Professional Board', description: 'Industry-recognized credential demonstrating competency' }
        ],

        timeline: '2-4 years',

        accreditedPrograms: 'Look for programs accredited by relevant professional bodies. These programs ensure quality education that meets industry standards and prepares you for certification exams.',

        technicalSkills: [
            'Clinical procedures and protocols',
            'Medical terminology',
            'Patient assessment',
            'Documentation and record-keeping',
            'Medical equipment operation',
            'Safety and infection control'
        ],

        softSkills: [
            'Communication',
            'Empathy and compassion',
            'Attention to detail',
            'Problem-solving',
            'Teamwork',
            'Time management',
            'Adaptability'
        ],

        technologies: [
            'Electronic Health Records (EHR)',
            'Medical equipment and devices',
            'Healthcare information systems',
            'Communication platforms'
        ],

        growthRate: '5-10% (2023-2033)',

        projections: `The demand for ${professionName.toLowerCase()} is expected to grow steadily over the next decade, driven by an aging population, advances in medical technology, and expanding healthcare services. Career opportunities exist across various settings and specializations.`,

        emergingSpecializations: [
            'Telehealth and remote care',
            'Specialized patient populations',
            'Advanced technology integration',
            'Preventive care focus'
        ],

        careerLadder: [
            { level: 'Entry', title: `Entry-Level ${professionName}`, description: 'Begin career with foundational skills and supervised practice' },
            { level: 'Mid', title: `Experienced ${professionName}`, description: 'Independent practice with specialized skills' },
            { level: 'Senior', title: `Senior ${professionName}`, description: 'Advanced practice, mentoring, and leadership roles' },
            { level: 'Advanced', title: 'Leadership/Management', description: 'Department oversight, administration, or specialized practice' }
        ],

        schoolsOverview: `Education programs for ${professionName.toLowerCase()} are offered at community colleges, universities, and specialized training institutions. Look for accredited programs with strong clinical components and good job placement rates.`,

        topSchools: [
            { name: 'Major University Programs', location: 'Various Locations', programType: 'Bachelor\'s/Master\'s' },
            { name: 'Community College Programs', location: 'Nationwide', programType: 'Associate Degree' },
            { name: 'Specialized Training Centers', location: 'Various Locations', programType: 'Certificate/Diploma' }
        ],

        programTypes: [
            { type: 'Traditional On-Campus', description: 'Full-time programs with classroom and clinical components' },
            { type: 'Hybrid Programs', description: 'Combination of online coursework and in-person clinical training' },
            { type: 'Accelerated Programs', description: 'Intensive programs for career changers or second-degree students' }
        ],

        financialAid: 'Most programs qualify for federal financial aid. Additionally, many healthcare facilities offer tuition assistance, scholarships, or loan forgiveness programs for students who commit to working for them after graduation.',

        licensingOverview: `Licensing requirements for ${professionName.toLowerCase()} vary by state. Most states require passing a national certification exam and maintaining continuing education credits for license renewal.`,

        stateRequirements: {
            'All States': { required: true, details: 'Most states require professional licensure or certification. Check with your state board for specific requirements.' }
        },

        examInfo: [
            { examName: 'National Certification Exam', description: 'Comprehensive exam covering professional knowledge and skills' }
        ],

        renewalProcess: 'Licenses typically require renewal every 1-3 years with continuing education credits.',

        jobMarketOverview: `The job market for ${professionName.toLowerCase()} is strong with ${jobCount.toLocaleString()}+ current openings nationwide. Opportunities exist in various healthcare settings, from large hospital systems to private practices and specialized facilities.`,

        featuredEmployers: [
            'Major Hospital Systems',
            'Healthcare Networks',
            'Private Practices',
            'Specialized Care Facilities',
            'Academic Medical Centers',
            'Community Health Organizations'
        ],

        interviewTips: `When interviewing for ${professionName.toLowerCase()} positions, emphasize your clinical skills, patient care philosophy, and commitment to professional development. Be prepared to discuss specific scenarios, your approach to teamwork, and how you handle challenging situations. Dress professionally and demonstrate your knowledge of the facility and its patient population.`,

        resumeKeywords: [
            'Patient care',
            'Clinical skills',
            'Healthcare protocols',
            'Team collaboration',
            'EHR proficiency',
            'Professional certification',
            'Quality improvement',
            'Patient safety'
        ],

        portfolioTips: 'Maintain documentation of your certifications, continuing education, clinical experiences, and any special projects or achievements. Letters of recommendation from supervisors and colleagues can strengthen your applications.',

        metaTitle: `How to Become ${professionName}: Career Guide 2025`,
        metaDescription: `Complete guide to becoming ${professionName.toLowerCase()}. Learn about education requirements, salary expectations (${medianSalary} average), certification, and job outlook. Start your healthcare career today.`
    };
}

async function bulkGenerateCareerGuides() {
    console.log('🚀 Starting bulk career guide generation...\n');

    // Get all unique professions
    const salaryProfessions = await prisma.salaryData.findMany({
        select: { careerKeyword: true },
        distinct: ['careerKeyword']
    });

    const jobProfessions = await prisma.job.findMany({
        where: { careerKeyword: { not: null } },
        select: { careerKeyword: true },
        distinct: ['careerKeyword']
    });

    const allProfessions = Array.from(new Set([
        ...salaryProfessions.map(p => p.careerKeyword),
        ...jobProfessions.map(p => p.careerKeyword)
    ])).sort();

    console.log(`Found ${allProfessions.length} unique professions\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const professionSlug of allProfessions) {
        try {
            // Check if career guide already exists
            const existing = await prisma.careerGuide.findUnique({
                where: { professionSlug }
            });

            if (existing) {
                console.log(`⏭️  Skipping ${professionSlug} (already exists)`);
                skipped++;
                continue;
            }

            // Generate career guide data
            const guideData = await generateBasicCareerGuide(professionSlug);

            // Create career guide
            await prisma.careerGuide.create({
                data: {
                    ...guideData,
                    slug: `how-to-become-${professionSlug}`,
                    published: true // Auto-publish
                }
            });

            console.log(`✅ Created career guide for ${guideData.professionName}`);
            created++;

        } catch (error) {
            console.error(`❌ Error creating guide for ${professionSlug}:`, error);
            errors++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Total: ${allProfessions.length}`);

    await prisma.$disconnect();
}

bulkGenerateCareerGuides();
