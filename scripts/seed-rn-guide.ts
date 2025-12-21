const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedRNCareerGuide() {
    console.log('🏥 Seeding Registered Nurse Career Guide...');

    const rnGuideData = {
        professionSlug: 'registered-nurses',
        professionName: 'Registered Nurse',

        // Overview Section
        overview: `Registered nurses form the backbone of healthcare delivery in the United States, providing essential patient care across hospitals, clinics, long-term care facilities, and community health settings. With over 3.2 million practicing RNs nationwide, nursing represents one of the largest and most respected healthcare professions.

The nursing profession offers a unique combination of clinical expertise, patient advocacy, and career flexibility that few other healthcare roles can match. Whether you're drawn to the fast-paced environment of emergency care, the specialized knowledge required in critical care units, or the patient education focus of community health nursing, the RN credential opens doors to diverse career opportunities.`,

        keyStats: {
            jobGrowth: '6%',
            medianSalary: '$81,220',
            jobOpenings: '194,500',
            totalEmployed: '3.2M'
        },

        // What Does an RN Do?
        rolesDescription: `Registered nurses assess patient conditions, administer medications and treatments, coordinate care with physicians and other healthcare professionals, and educate patients and families about health management. The scope of practice varies by specialty and setting, but core responsibilities remain consistent across the profession.

RNs conduct comprehensive physical assessments, monitor vital signs, and evaluate changes in patient conditions. This involves using clinical judgment to identify subtle changes that may indicate complications or improvement. In acute care settings, nurses may assess patients every 2-4 hours, documenting findings in electronic health records and communicating concerns to physicians.

Administering medications safely represents a critical nursing responsibility. RNs verify medication orders, calculate dosages, prepare and administer medications through various routes (oral, intravenous, intramuscular, subcutaneous), and monitor patients for therapeutic effects and adverse reactions.

Nurses serve as the central point of communication among healthcare team members. They coordinate with physicians, physical therapists, social workers, and other specialists to ensure comprehensive patient care. This includes scheduling procedures, arranging consultations, and facilitating discharge planning.`,

        dailyTasks: [
            'Conduct comprehensive physical assessments and monitor vital signs',
            'Administer medications through various routes and monitor for adverse reactions',
            'Coordinate care with physicians, therapists, and other healthcare professionals',
            'Educate patients and families about disease management and lifestyle modifications',
            'Document assessments, interventions, and patient responses in electronic health records',
            'Perform technical procedures (IV insertion, wound care, catheterization)',
            'Respond to emergencies and changes in patient conditions',
            'Advocate for patient needs and ensure quality care delivery'
        ],

        specializations: [
            {
                name: 'Critical Care/ICU',
                description: 'Caring for critically ill patients requiring intensive monitoring and advanced support'
            },
            {
                name: 'Emergency Nursing',
                description: 'Providing rapid assessment and treatment in emergency departments'
            },
            {
                name: 'Pediatric Nursing',
                description: 'Specializing in care for infants, children, and adolescents'
            },
            {
                name: 'Oncology Nursing',
                description: 'Caring for cancer patients through treatment and recovery'
            },
            {
                name: 'Operating Room/Surgical',
                description: 'Assisting in surgical procedures and perioperative care'
            },
            {
                name: 'Labor & Delivery',
                description: 'Supporting mothers through childbirth and postpartum care'
            }
        ],

        workEnvironments: [
            'Hospitals (60% of RNs) - Acute care, emergency departments, ICU, surgical units',
            'Ambulatory Care (18%) - Physician offices, outpatient clinics, same-day surgery',
            'Long-term Care (7%) - Nursing homes, assisted living, rehabilitation centers',
            'Home Healthcare (6%) - Providing care in patients\' homes',
            'Schools and Public Health (5%) - School nursing, community health programs',
            'Other Settings (4%) - Insurance companies, pharmaceutical firms, research institutions'
        ],

        // Salary Information - Condensed with link
        salaryOverview: `The median annual salary for registered nurses is $81,220 according to the Bureau of Labor Statistics (May 2023). Entry-level positions typically start at $61,250, while experienced RNs can earn $129,400 or more. Salary varies significantly by location, specialty, and experience level. California offers the highest average salaries at $133,340, while metropolitan areas like San Francisco pay over $165,000 annually. Most positions include comprehensive benefits such as health insurance, retirement plans, shift differentials (10-25% premium), and generous paid time off. Visit our salary guide for detailed compensation data by state and city.`,

        topPayingStates: [
            { state: 'California', salary: '$133,340' },
            { state: 'Hawaii', salary: '$106,530' },
            { state: 'Oregon', salary: '$98,630' },
            { state: 'District of Columbia', salary: '$98,540' },
            { state: 'Alaska', salary: '$96,990' }
        ],

        nationalAverage: '$81,220',
        entryLevelRange: '$61,000 - $75,000',
        experiencedRange: '$95,000 - $130,000+',

        benefits: [
            'Health Insurance',
            '401(k) or 403(b) Retirement Plans with matching',
            'Paid Time Off (typically 3-4 weeks annually)',
            'Shift Differentials (10-25% premium for evening/night/weekend)',
            'Tuition Reimbursement',
            'Sign-on Bonuses ($5,000-$20,000 in high-demand areas)',
            'Relocation Assistance',
            'Continuing Education Stipends',
            'Professional Development Opportunities'
        ],

        // Education & Certification
        educationPath: `Three primary educational routes lead to RN licensure: Associate Degree in Nursing (ADN) takes 2-3 years and costs $6,000-$40,000, offering faster entry but many hospitals now prefer BSN degrees. Bachelor of Science in Nursing (BSN) requires 4 years and costs $40,000-$100,000+ but provides better career opportunities and preparation for graduate education. Direct-Entry Master's programs (2-3 years, $50,000-$120,000) are designed for individuals with bachelor's degrees in other fields.

All nursing programs combine classroom instruction with clinical practice, totaling 500-1,000 supervised hours. Core curriculum includes anatomy, physiology, pharmacology, pathophysiology, and specialized nursing theory across medical-surgical, maternal-child, pediatric, psychiatric, and community health nursing. When selecting a program, verify accreditation through the Commission on Collegiate Nursing Education (CCNE) or Accreditation Commission for Education in Nursing (ACEN).`,

        requiredDegrees: [
            {
                degree: 'Associate Degree in Nursing (ADN)',
                description: '2-3 years at community colleges. Cost: $6,000-$40,000. Faster entry but may require BSN for advancement.'
            },
            {
                degree: 'Bachelor of Science in Nursing (BSN)',
                description: '4 years at colleges/universities. Cost: $40,000-$100,000+. Preferred by most employers, better advancement opportunities.'
            },
            {
                degree: 'Direct-Entry Master\'s (for career changers)',
                description: '2-3 years for those with bachelor\'s in other fields. Cost: $50,000-$120,000. Accelerated path to advanced degree.'
            }
        ],

        certifications: [
            {
                name: 'NCLEX-RN (Required for all RNs)',
                issuer: 'National Council of State Boards of Nursing',
                description: 'Computerized adaptive test with 75-145 questions. 85% first-time pass rate for U.S.-educated candidates. $200 exam fee plus state licensing fees.'
            },
            {
                name: 'Critical Care Registered Nurse (CCRN)',
                issuer: 'American Association of Critical-Care Nurses',
                description: 'Specialty certification for ICU/critical care nurses'
            },
            {
                name: 'Certified Emergency Nurse (CEN)',
                issuer: 'Board of Certification for Emergency Nursing',
                description: 'Specialty certification for emergency department nurses'
            },
            {
                name: 'Oncology Certified Nurse (OCN)',
                issuer: 'Oncology Nursing Certification Corporation',
                description: 'Certification for nurses specializing in cancer care'
            }
        ],

        timeline: '2-4 years for education, plus 4-8 weeks for NCLEX preparation',
        accreditedPrograms: 'When selecting a program, verify accreditation through the Commission on Collegiate Nursing Education (CCNE) or Accreditation Commission for Education in Nursing (ACEN). Check program NCLEX pass rates and clinical partnership hospitals.',

        // Skills Section - Condensed
        technicalSkills: [
            'Physical assessment and vital signs monitoring',
            'Medication administration (IV, IM, subcutaneous, oral)',
            'Intravenous catheter insertion and management',
            'Wound care and dressing changes',
            'Electronic Health Record (EHR) proficiency',
            'Medical equipment operation',
            'Specimen collection and lab coordination',
            'CPR and emergency response'
        ],

        softSkills: [
            'Critical thinking and clinical judgment',
            'Clear verbal and written communication',
            'Emotional intelligence and empathy',
            'Time management and prioritization',
            'Adaptability to changing situations',
            'Teamwork and collaboration',
            'Attention to detail',
            'Stress management and resilience'
        ],

        technologies: [
            'Electronic Health Record (EHR) systems (Epic, Cerner)',
            'Medication dispensing systems (Pyxis, Omnicell)',
            'Patient monitoring equipment',
            'Infusion pumps and medical devices',
            'Telehealth platforms',
            'Clinical documentation software'
        ],

        // Job Outlook
        growthRate: '6% (2022-2032)',
        projections: `The Bureau of Labor Statistics projects registered nursing employment will grow 6% from 2022 to 2032, adding approximately 194,500 new positions. This growth stems from an aging population requiring more healthcare services, increased prevalence of chronic conditions, emphasis on preventive care, retirement of experienced nurses, and expansion of healthcare facilities.

Nursing demand varies by region, with higher needs in rural and underserved areas, Southern and Western states with growing populations, and regions experiencing healthcare facility expansion. Geographic flexibility provides excellent career mobility.`,

        emergingSpecializations: [
            'Telehealth and remote patient monitoring',
            'Geriatric care and aging population management',
            'Informatics and healthcare technology',
            'Care coordination and patient navigation',
            'Population health management',
            'Genomics and precision medicine'
        ],

        careerLadder: [
            {
                level: 'Entry Level',
                title: 'Staff Nurse / Bedside RN',
                description: 'Direct patient care in assigned unit. Focus on skill development and time management.'
            },
            {
                level: 'Mid-Level',
                title: 'Charge Nurse / Senior RN',
                description: 'Leads shift operations, mentors new nurses, manages patient assignments. 3-5 years experience.'
            },
            {
                level: 'Advanced',
                title: 'Clinical Nurse Specialist / Nurse Manager',
                description: 'Unit leadership, quality improvement, staff development. May require MSN degree.'
            },
            {
                level: 'Leadership',
                title: 'Director of Nursing / Chief Nursing Officer',
                description: 'Executive-level leadership, strategic planning, organizational management.'
            }
        ],

        // Schools & Programs - Condensed
        schoolsOverview: `Thousands of accredited nursing programs exist nationwide, offered through community colleges (ADN), universities (BSN), and accelerated programs for career changers. When selecting a school, prioritize CCNE or ACEN accreditation, strong NCLEX pass rates (above 85%), quality clinical partnerships, and reasonable cost-to-debt ratios. Many programs offer online coursework combined with local clinical placements. Financial aid options include federal loans, nursing scholarships, employer tuition assistance, and loan forgiveness programs for underserved areas.`,

        topSchools: [
            {
                name: 'Johns Hopkins University',
                location: 'Baltimore, MD',
                programType: 'BSN, MSN, DNP'
            },
            {
                name: 'University of Pennsylvania',
                location: 'Philadelphia, PA',
                programType: 'BSN, MSN, DNP, PhD'
            },
            {
                name: 'Duke University',
                location: 'Durham, NC',
                programType: 'BSN, MSN, DNP'
            },
            {
                name: 'University of Washington',
                location: 'Seattle, WA',
                programType: 'BSN, MN, DNP, PhD'
            },
            {
                name: 'Emory University',
                location: 'Atlanta, GA',
                programType: 'BSN, MSN, DNP, PhD'
            }
        ],

        programTypes: [
            {
                type: 'Traditional ADN/BSN',
                description: '2-4 year programs for students without nursing background'
            },
            {
                type: 'Accelerated BSN',
                description: '12-18 month intensive programs for those with bachelor\'s degrees'
            },
            {
                type: 'RN-to-BSN',
                description: 'Bridge programs for ADN-prepared nurses to earn BSN'
            },
            {
                type: 'Direct-Entry MSN',
                description: '2-3 year programs combining BSN and MSN for career changers'
            }
        ],

        financialAid: 'Federal student loans, Pell Grants, nursing scholarships from organizations like the National Student Nurses Association, employer tuition reimbursement programs, and loan forgiveness through programs like NURSE Corps for service in underserved areas.',

        // Licensing - Condensed
        licensingOverview: `All states require passing the NCLEX-RN examination and obtaining state licensure. The NCLEX is a computerized adaptive test administered by Pearson VUE, with 75-145 questions and a 5-hour time limit. First-time pass rates average 85% for U.S.-educated candidates. State licensure requirements include criminal background checks, proof of nursing education, and application fees ($100-$300). Many states participate in the Nurse Licensure Compact (NLC), allowing multi-state practice with a single license.`,

        stateRequirements: {
            general: 'All states require NCLEX-RN passage, criminal background check, and proof of nursing education. Requirements vary by state.',
            compact: 'Enhanced Nurse Licensure Compact (eNLC) allows practice in 40+ compact states with single license',
            renewal: 'License renewal every 2-3 years with continuing education requirements varying by state'
        },

        examInfo: [
            {
                examName: 'NCLEX-RN',
                description: 'National licensure exam. 75-145 adaptive questions covering safe/effective care, health promotion, psychosocial integrity, and physiological integrity. Cost: $200 plus state fees.'
            },
            {
                examName: 'State Jurisprudence Exam (varies)',
                description: 'Some states require additional exam on state-specific nursing laws and regulations'
            }
        ],

        renewalProcess: 'License renewal every 2-3 years (varies by state) requiring continuing education hours (typically 20-40 hours per renewal period). Some states require specific courses in areas like infection control or pain management.',

        // Job Market - Condensed
        jobMarketOverview: `High demand across all regions with particularly strong needs in rural areas, Southern and Western states, and specialty areas like critical care, emergency, and operating room nursing. New graduates are encouraged to start in medical-surgical nursing to build foundational skills before specializing. Many hospitals offer new graduate residency programs providing structured orientation and mentorship. Travel nursing and per diem opportunities provide flexibility and premium pay.`,

        featuredEmployers: [
            'Major Hospital Systems (Mayo Clinic, Cleveland Clinic, Johns Hopkins)',
            'Veterans Health Administration',
            'Kaiser Permanente',
            'HCA Healthcare',
            'Community Health Systems',
            'Academic Medical Centers',
            'Outpatient Surgery Centers',
            'Home Health Agencies'
        ],

        // Interview & Resume - Condensed
        interviewTips: `Common interview questions focus on your nursing philosophy, examples of handling difficult patients or conflicts, prioritization scenarios, and questions about your clinical experience. Use the STAR method (Situation, Task, Action, Result) when answering behavioral questions. Emphasize your clinical skills, ability to work in teams, commitment to patient safety, and willingness to continue learning. Dress professionally and arrive 10-15 minutes early. Prepare questions about orientation programs, staffing ratios, and professional development opportunities.`,

        resumeKeywords: [
            'Patient Care',
            'Medication Administration',
            'Electronic Health Records (EHR)',
            'NCLEX-RN Licensed',
            'Clinical Assessment',
            'Patient Education',
            'Care Coordination',
            'Interdisciplinary Collaboration',
            'BLS/ACLS Certified',
            'Quality Improvement',
            'Evidence-Based Practice',
            'Critical Thinking'
        ],

        portfolioTips: 'Maintain a professional portfolio including copies of licenses and certifications, letters of recommendation, performance evaluations, examples of care plans or quality improvement projects, and documentation of continuing education.',

        // AI-Generated Content Fields (for full article display)
        fullContent: null,  // Will be generated from sections above
        interviewContent: null,  // Link to dedicated interview page
        certificationContent: null,  // Part of main guide
        skillsContent: null,  // Link to dedicated skills page
        specializationsContent: null,  // Part of main guide
        careerPathContent: null,  // Part of career ladder section
        workLifeBalanceContent: null,  // Link to dedicated page
        resumeContent: null,  // Brief tips with link to dedicated page

        // SEO & Meta
        metaTitle: 'Registered Nurse Career Guide, Salary & Jobs (2026)',
        metaDescription: 'Complete Registered Nurse career resource. Explore education pathways, schools, NCLEX licensing, salary data by state, job opportunities, specializations, and career advancement. Find programs, browse jobs, and plan your nursing career.',
        slug: 'how-to-become',
        published: true
    };

    const result = await prisma.careerGuide.upsert({
        where: { professionSlug: 'registered-nurses' },
        update: rnGuideData,
        create: rnGuideData
    });

    console.log('✅ RN Career Guide seeded successfully!');
    return result;
}

// Run if executed directly
if (require.main === module) {
    seedRNCareerGuide()
        .catch(console.error)
        .finally(() => prisma.$disconnect());
}

module.exports = { seedRNCareerGuide };
