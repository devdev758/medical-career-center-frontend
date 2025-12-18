const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRNCareerGuideFull() {
    console.log('🏥 Seeding Comprehensive RN Career Guide with Full Content...\n');

    // First, get live BLS salary data for registered-nurses
    const blsSalaryData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: 'registered-nurses',
            locationId: null, // National data
            year: 2024
        }
    });

    console.log(blsSalaryData ? `✅ Found BLS data: Median $${blsSalaryData.annualMedian?.toLocaleString()}` : '⚠️  No BLS data found');

    // Get top paying states
    const topStatesData = await prisma.salaryData.findMany({
        where: {
            careerKeyword: 'registered-nurses',
            location: { city: '' }, // State-level only
            year: 2024
        },
        include: { location: true },
        orderBy: { annualMedian: 'desc' },
        take: 5
    });

    console.log(`Found ${topStatesData.length} top paying states`);

    const rnGuideData = {
        professionSlug: 'registered-nurses',
        professionName: 'Registered Nurse',

        // FULL Overview Section - From Pilot Lines 4-7
        overview: `Registered nurses form the backbone of healthcare delivery in the United States, providing essential patient care across hospitals, clinics, long-term care facilities, and community health settings. With over 3.2 million practicing RNs nationwide, nursing represents one of the largest and most respected healthcare professions. 

The nursing profession offers a unique combination of clinical expertise, patient advocacy, and career flexibility that few other healthcare roles can match. Whether you're drawn to the fast-paced environment of emergency care, the specialized knowledge required in critical care units, or the patient education focus of community health nursing, the RN credential opens doors to diverse career opportunities.`,

        keyStats: {
            jobGrowth: '6%',
            medianSalary: blsSalaryData?.annualMedian ? `$${Math.round(blsSalaryData.annualMedian).toLocaleString()}` : '$93,600',
            jobOpenings: '194,500',
            totalEmployed: '3.2M'
        },

        // FULL What Does an RN Do Section - From Pilot Lines 9-42
        rolesDescription: `Registered nurses assess patient conditions, administer medications and treatments, coordinate care with physicians and other healthcare professionals, and educate patients and families about health management. The scope of practice varies by specialty and setting, but core responsibilities remain consistent across the profession.

**Patient Assessment and Monitoring**

RNs conduct comprehensive physical assessments, monitor vital signs, and evaluate changes in patient conditions. This involves using clinical judgment to identify subtle changes that may indicate complications or improvement. In acute care settings, nurses may assess patients every 2-4 hours, documenting findings in electronic health records and communicating concerns to physicians.

**Medication Administration**

Administering medications safely represents a critical nursing responsibility. RNs verify medication orders, calculate dosages, prepare and administer medications through various routes (oral, intravenous, intramuscular, subcutaneous), and monitor patients for therapeutic effects and adverse reactions. This requires detailed knowledge of pharmacology and potential drug interactions.

**Care Coordination**

Nurses serve as the central point of communication among healthcare team members. They coordinate with physicians, physical therapists, social workers, and other specialists to ensure comprehensive patient care. This includes scheduling procedures, arranging consultations, and facilitating discharge planning.

**Patient and Family Education**

Teaching patients and families about disease management, medication regimens, and lifestyle modifications forms an essential component of nursing practice. RNs develop individualized education plans, assess learning needs, and evaluate comprehension to promote better health outcomes.

**Documentation**

Accurate, timely documentation ensures continuity of care and meets legal and regulatory requirements. Nurses document assessments, interventions, patient responses, and communication with other providers in electronic health record systems.`,

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
            'Hospitals (60% of RNs) - Acute care, emergency departments, intensive care units, surgical units, and specialty departments',
            'Ambulatory Care (18%) - Physician offices, outpatient clinics, and same-day surgery centers',
            'Long-term Care (7%) - Nursing homes, assisted living facilities, and rehabilitation centers',
            'Home Healthcare (6%) - Providing care in patients\' homes',
            'Schools and Public Health (5%) - School nursing, community health programs, and public health departments',
            'Other Settings (4%) - Insurance companies, pharmaceutical companies, research institutions, and educational facilities'
        ],

        // FULL Education Section - Pilot Lines 43-96
        educationPath: `Three primary educational routes lead to RN licensure:

**Associate Degree in Nursing (ADN)**
- **Duration**: 2-3 years
- **Setting**: Community colleges and technical schools
- **Cost**: $6,000-$40,000 total
- **Advantages**: Faster entry into the workforce, lower cost
- **Considerations**: Many hospitals now prefer or require BSN degrees; may need to complete BSN later for career advancement

**Bachelor of Science in Nursing (BSN)**
- **Duration**: 4 years
- **Setting**: Colleges and universities
- **Cost**: $40,000-$100,000+ total
- **Advantages**: Better career opportunities, higher starting salaries, preparation for graduate education
- **Considerations**: Longer time commitment, higher cost

**Direct-Entry Master's Programs**
- **Duration**: 2-3 years
- **Setting**: Universities (for individuals with bachelor's degrees in other fields)
- **Cost**: $50,000-$120,000 total
- **Advantages**: Accelerated path for career changers, advanced degree upon completion
- **Considerations**: Intensive programs, significant financial investment

Find [accredited nursing schools](/registered-nurse/schools) in your area, or explore programs in [California](/registered-nurse/schools/ca), [Texas](/registered-nurse/schools/tx), [New York](/registered-nurse/schools/ny), or [Florida](/registered-nurse/schools/fl). When selecting a program, verify accreditation through the [Commission on Collegiate Nursing Education (CCNE)](https://www.aacnnursing.org/ccne-accreditation) or [Accreditation Commission for Education in Nursing (ACEN)](https://www.acenursing.org/).

**Curriculum Components**

Nursing programs combine classroom instruction with clinical practice:

**Foundational Sciences**
- Anatomy and physiology
- Microbiology
- Chemistry
- Nutrition
- Psychology

**Nursing Theory and Practice**
- Fundamentals of nursing care
- Pharmacology
- Pathophysiology
- Health assessment
- Medical-surgical nursing
- Maternal-child health
- Pediatric nursing
- Psychiatric-mental health nursing
- Community health nursing

**Clinical Rotations**
Students complete supervised clinical experiences in various healthcare settings, typically totaling 500-1,000 hours depending on the program. These rotations provide hands-on experience with patient care under the guidance of experienced nurse preceptors.`,

        requiredDegrees: [
            {
                degree: 'Associate Degree in Nursing (ADN)',
                description: '2-3 years at community colleges. Cost: $6,000-$40,000 total. Faster entry but many hospitals prefer BSN.'
            },
            {
                degree: 'Bachelor of Science in Nursing (BSN)',
                description: '4 years at colleges/universities. Cost: $40,000-$100,000+. Preferred by employers, better advancement.'
            },
            {
                degree: 'Direct-Entry Master\'s (MSN)',
                description: '2-3 years for career changers with bachelor\'s degrees. Cost: $50,000-$120,000. Accelerated advanced degree path.'
            }
        ],

        // FULL Licensing Section - Pilot Lines 98-115
        certifications: [
            {
                name: 'NCLEX-RN (Required for all RNs)',
                issuer: 'National Council of State Boards of Nursing',
                description: 'Computerized adaptive test with 75-145 questions assessing knowledge across nursing practice areas. Approximately 85% first-time pass rate for U.S.-educated candidates. Cost: $200 examination fee plus state licensing fees ($100-$300).'
            },
            {
                name: 'Critical Care Registered Nurse (CCRN)',
                issuer: 'American Association of Critical-Care Nurses',
                description: 'Specialty certification for ICU/critical care nurses. Requires clinical experience in critical care setting.'
            },
            {
                name: 'Certified Emergency Nurse (CEN)',
                issuer: 'Board of Certification for Emergency Nursing',
                description: 'Specialty certification for emergency department nurses. Demonstrates expertise in emergency care.'
            },
            {
                name: 'Oncology Certified Nurse (OCN)',
                issuer: 'Oncology Nursing Certification Corporation',
                description: 'Certification for nurses specializing in cancer care with minimum experience requirements.'
            }
        ],

        timeline: '2-4 years education + NCLEX preparation',
        accreditedPrograms: 'When selecting a program, verify accreditation through the Commission on Collegiate Nursing Education (CCNE) or Accreditation Commission for Education in Nursing (ACEN). Check program NCLEX pass rates (above 85% is good) and review clinical partnership hospitals to ensure quality hands-on training opportunities.',

        licensingOverview: `**NCLEX-RN Examination**

All states require passing the National Council Licensure Examination for Registered Nurses (NCLEX-RN). This computerized adaptive test assesses knowledge and clinical judgment across nursing practice areas. The exam is administered by [Pearson VUE](https://home.pearsonvue.com/nclex) and regulated by the [National Council of State Boards of Nursing (NCSBN)](https://www.ncsbn.org/).

- **Format**: 75-145 questions (adaptive based on performance)
- **Duration**: Up to 5 hours
- **Pass Rate**: Approximately 85% for first-time U.S.-educated candidates
- **Cost**: $200 examination fee plus state licensing fees

**State Licensure**

After passing the NCLEX-RN, nurses apply for licensure in their state of practice. Requirements vary by state but typically include:
- Criminal background check
- Proof of nursing education
- Application fees ($100-$300)
- Continuing education for license renewal (varies by state)

Many states participate in the [Nurse Licensure Compact (NLC)](https://www.ncsbn.org/nurse-licensure-compact.htm), which allows nurses to practice in multiple states with a single license.`,

        stateRequirements: {
            general: 'All states require NCLEX-RN passage, criminal background check, and proof of nursing education. Specific requirements vary by state.',
            compact: 'Enhanced Nurse Licensure Compact (eNLC) allows practice in 40+ compact states with single license',
            renewal: 'License renewal every 2-3 years (varies by state) with continuing education requirements'
        },

        examInfo: [
            {
                examName: 'NCLEX-RN',
                description: 'National licensure exam with 75-145 adaptive questions covering safe/effective care, health promotion, psychosocial integrity, and physiological integrity. Administered by Pearson VUE.'
            },
            {
                examName: 'State Jurisprudence Exam',
                description: 'Some states require additional exam on state-specific nursing laws and regulations'
            }
        ],

        renewalProcess: 'License renewal every 2-3 years (varies by state) requiring continuing education hours (typically 20-40 hours per renewal period). Some states require specific courses in areas like infection control or pain management.',

        // FULL Skills Section - Pilot Lines 117-154
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

        // FULL Job Outlook - Pilot Lines 156-188
        growthRate: '6% (2022-2032)',
        projections: `The [Bureau of Labor Statistics](https://www.bls.gov/ooh/healthcare/registered-nurses.htm) projects registered nursing employment will grow 6% from 2022 to 2032, adding approximately 194,500 new positions. This growth stems from:

- Aging population requiring more healthcare services
- Increased prevalence of chronic conditions
- Emphasis on preventive care
- Retirement of experienced nurses
- Expansion of healthcare facilities

Browse current [registered nurse job openings](/registered-nurse/jobs) nationwide, or explore opportunities in high-demand markets like [Texas](/registered-nurse/jobs/tx), [California](/registered-nurse/jobs/ca), or [Florida](/registered-nurse/jobs/fl).

**Geographic Demand**

Nursing demand varies by region, with higher needs in:
- Rural and underserved areas
- Southern and Western states with growing populations
- Areas with aging populations
- Regions experiencing healthcare facility expansion

**Specialization Opportunities**

Experienced RNs can pursue specialized certifications through the [American Nurses Credentialing Center (ANCC)](https://www.nursingworld.org/ancc/) in areas such as:
- Critical care (CCRN)
- Emergency nursing (CEN)
- Oncology (OCN)
- Pediatrics (CPN)
- Operating room (CNOR)
- Cardiac care (CMC)

Specialization typically requires 1-2 years of experience in the specialty area and passing a certification examination.`,

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
                level: 'Entry Level (0-2 years)',
                title: 'Staff Nurse / Bedside RN',
                description: 'Direct patient care in assigned unit. Focus on developing clinical skills, time management, and building foundational nursing expertise. Average salary: $60,000-$75,000.'
            },
            {
                level: 'Mid-Career (3-7 years)',
                title: 'Charge Nurse / Senior RN',
                description: 'Leads shift operations, mentors new nurses, manages patient assignments, and serves as clinical resource. Average salary: $75,000-$95,000.'
            },
            {
                level: 'Advanced (8-15 years)',
                title: 'Clinical Nurse Specialist / Nurse Manager',
                description: 'Unit leadership, quality improvement initiatives, staff development. May require MSN degree. Average salary: $85,000-$110,000.'
            },
            {
                level: 'Leadership (15+ years)',
                title: 'Director of Nursing / Chief Nursing Officer',
                description: 'Executive-level leadership, strategic planning, organizational management across departments or facilities. Average salary: $95,000-$130,000+.'
            }
        ],

        // FULL Salary Section with LIVE DATA - Pilot Lines 189-244
        salaryOverview: `According to the [Bureau of Labor Statistics](https://www.bls.gov/oes/current/oes291141.htm) (May 2023 data, latest available):
- **Median Annual Salary**: ${blsSalaryData?.annualMedian ? `$${Math.round(blsSalaryData.annualMedian).toLocaleString()}` : '$93,600'}
- **Entry Level (10th percentile)**: ${blsSalaryData?.annual10th ? `$${Math.round(blsSalaryData.annual10th).toLocaleString()}` : '$63,000'}
- **Experienced (90th percentile)**: ${blsSalaryData?.annual90th ? `$${Math.round(blsSalaryData.annual90th).toLocaleString()}` : '$129,000'}

Explore detailed [registered nurse salary data](/registered-nurse/salary) by state and city to understand earning potential in your area.

**Salary by Experience Level**

**New Graduate (0-2 years)**: Average $60,000-$75,000, varies significantly by location and setting

**Mid-Career (3-7 years)**: Average $75,000-$95,000 with opportunities for shift differentials and specialty pay

**Experienced (8-15 years)**: Average $85,000-$110,000 as leadership roles and specializations increase earning potential

**Senior/Advanced (15+ years)**: Average $95,000-$130,000+ which may include management positions or advanced practice roles

**Additional Compensation**

Many nursing positions offer:
- Shift differentials (evening, night, weekend: 10-25% premium)
- Sign-on bonuses ($5,000-$20,000 for high-demand areas)
- Relocation assistance
- Tuition reimbursement
- Retirement benefits (403(b) or 401(k) matching)
- Health insurance
- Paid time off (typically 3-4 weeks annually)`,

        topPayingStates: topStatesData.map((item: any) => ({
            state: item.location?.stateName || item.location?.state || '',
            salary: `$${Math.round(item.annualMedian || 0).toLocaleString()}`
        })),

        nationalAverage: blsSalaryData?.annualMedian ? `$${Math.round(blsSalaryData.annualMedian).toLocaleString()}` : '$93,600',
        entryLevelRange: blsSalaryData?.annual10th ? `$${Math.round(blsSalaryData.annual10th).toLocaleString()}` : '$60,000 - $75,000',
        experiencedRange: blsSalaryData?.annual90th ? `$${Math.round(blsSalaryData.annual90th).toLocaleString()}+` : '$95,000 - $130,000+',

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

        // Schools Section - Pilot Lines 282-296  
        schoolsOverview: `Thousands of accredited nursing programs exist nationwide. When selecting a school, prioritize:
- **Accreditation**: Verify [CCNE](https://www.aacnnursing.org/ccne-accreditation) or [ACEN](https://www.acenursing.org/) accreditation
- **NCLEX Pass Rates**: Look for programs with above 85% first-time pass rates
- **Clinical Partnerships**: Quality hospital and healthcare facility partnerships for hands-on training
- **Cost vs. Value**: Calculate total cost and potential debt relative to starting salaries

Compare ADN vs. BSN programs in your area using our [nursing schools directory](/registered-nurse/schools). Many programs offer online coursework combined with local clinical placements. Financial aid options include federal loans, nursing scholarships from organizations like the National Student Nurses Association, employer tuition assistance, and loan forgiveness programs for service in underserved areas.`,

        topSchools: [
            { name: 'Johns Hopkins University', location: 'Baltimore, MD', programType: 'BSN, MSN, DNP' },
            { name: 'University of Pennsylvania', location: 'Philadelphia, PA', programType: 'BSN, MSN, DNP, PhD' },
            { name: 'Duke University', location: 'Durham, NC', programType: 'BSN, MSN, DNP' },
            { name: 'University of Washington', location: 'Seattle, WA', programType: 'BSN, MN, DNP, PhD' },
            { name: 'Emory University', location: 'Atlanta, GA', programType: 'BSN, MSN, DNP, PhD' }
        ],

        programTypes: [
            { type: 'Traditional ADN/BSN', description: '2-4 year programs for students without nursing background' },
            { type: 'Accelerated BSN', description: '12-18 month intensive programs for those with bachelor\'s degrees' },
            { type: 'RN-to-BSN', description: 'Bridge programs for ADN-prepared nurses to earn BSN' },
            { type: 'Direct-Entry MSN', description: '2-3 year programs combining BSN and MSN for career changers' }
        ],

        financialAid: 'Federal student loans, Pell Grants, nursing scholarships from organizations like the National Student Nurses Association, employer tuition reimbursement programs, and loan forgiveness through programs like NURSE Corps for service in underserved areas.',

        // Job Market - Pilot Lines 341-346
        jobMarketOverview: `Strong demand exists across all regions with particularly high needs in rural areas, Southern and Western states, and specialty areas like critical care, emergency, and operating room nursing. 

Browse [registered nurse job openings](/registered-nurse/jobs) in your preferred location. New graduates are encouraged to start in medical-surgical nursing to build foundational skills before specializing. Many hospitals offer new graduate residency programs providing structured orientation and mentorship during the transition from student to professional nurse.

Travel nursing and per diem opportunities provide flexibility and premium pay for experienced nurses willing to relocate temporarily or work flexible schedules.`,

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

        // Interview & Resume - Pilot Lines 350-355
        interviewTips: `Common interview questions focus on your nursing philosophy, examples of handling difficult patients or conflicts, prioritization scenarios, and clinical experience. Use the STAR method (Situation, Task, Action, Result) when answering behavioral questions.

Emphasize your clinical skills, ability to work in teams, commitment to patient safety, and willingness to continue learning. Dress professionally and arrive 10-15 minutes early. Prepare questions about orientation programs, nurse-to-patient ratios, and professional development opportunities.

Review our [interview preparation guide](/registered-nurse/interview) to ace your job interviews with practice questions and answer frameworks.`,

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

        portfolioTips: 'Maintain a professional portfolio including copies of licenses and certifications, letters of recommendation, performance evaluations, examples of care plans or quality improvement projects, and documentation of continuing education. Keep both physical and digital versions.',

        // AI-Generated Content Fields
        fullContent: null,
        interviewContent: null,
        certificationContent: null,
        skillsContent: null,
        specializationsContent: null,
        careerPathContent: null,
        workLifeBalanceContent: null,
        resumeContent: null,

        // SEO & Meta - UPDATED FOR 2026
        metaTitle: 'How to Become a Registered Nurse in 2026: Complete Career Guide',
        metaDescription: 'Comprehensive guide to becoming an RN in 2026. Learn about nursing education (ADN vs BSN), NCLEX-RN requirements, current salary data, 6% job growth projections, and career advancement paths. Explore accredited programs and licensing requirements.',
        slug: 'how-to-become',
        published: true
    };

    const result = await prisma.careerGuide.upsert({
        where: { professionSlug: 'registered-nurses' },
        update: rnGuideData,
        create: rnGuideData
    });

    console.log('\n✅ RN Career Guide (FULL VERSION) seeded successfully!');
    console.log(`   - Used live BLS data: ${blsSalaryData ? 'Yes' : 'No (using fallback)'}`);
    console.log(`   - Top paying states: ${topStatesData.length} found`);
    console.log(`   - Internal links: Updated to /registered-nurse/* format`);
    console.log(`   - External links: Preserved (BLS, CCNE, ACEN, etc.)`);
    console.log(`   - Year: Updated to 2026`);

    return result;
}

if (require.main === module) {
    seedRNCareerGuideFull()
        .catch(console.error)
        .finally(() => prisma.$disconnect());
}

module.exports = { seedRNCareerGuideFull };
