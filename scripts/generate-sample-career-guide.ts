/**
 * Sample Career Guide Generator
 * 
 * This script generates a sample career guide for Anesthesia Technician
 * to demonstrate the structure and content format.
 * 
 * Usage: npx tsx scripts/generate-sample-career-guide.ts
 */

import { createCareerGuide, type CareerGuideData } from '../src/lib/career-guide-helpers';
import { prisma } from '../src/lib/prisma';

async function generateSampleCareerGuide() {
    console.log('🚀 Generating sample career guide for Anesthesia Technician...\n');

    const careerGuideData: CareerGuideData = {
        professionSlug: 'anesthesia-technicians',
        professionName: 'Anesthesia Technician',

        // Overview
        overview: `Anesthesia technicians are vital healthcare professionals who work alongside anesthesiologists and nurse anesthetists to ensure safe and effective anesthesia delivery during surgical procedures. They prepare and maintain anesthesia equipment, assist with patient monitoring, and help manage the anesthesia workspace. This career offers excellent job stability, competitive salaries, and the opportunity to work in critical care environments where precision and attention to detail can directly impact patient outcomes.`,

        keyStats: {
            jobGrowth: '8% (Faster than average)',
            medianSalary: '$52,000',
            jobOpenings: '2,500+ annually',
            totalEmployed: '45,000+',
        },

        // What Does an Anesthesia Technician Do?
        rolesDescription: `Anesthesia technicians play a crucial role in the operating room by managing anesthesia equipment and supporting the anesthesia care team. They work in fast-paced environments where attention to detail and quick thinking are essential. Their primary responsibility is ensuring all anesthesia equipment is properly functioning, sterile, and ready for use during surgical procedures.`,

        dailyTasks: [
            'Prepare and test anesthesia machines and equipment before procedures',
            'Assist anesthesiologists with patient positioning and monitoring setup',
            'Maintain inventory of anesthesia supplies and medications',
            'Clean, sterilize, and maintain anesthesia equipment',
            'Troubleshoot equipment malfunctions during procedures',
            'Document equipment maintenance and calibration records',
            'Assist with emergency airway management',
            'Stock and organize anesthesia carts and workstations',
        ],

        specializations: [
            {
                name: 'Pediatric Anesthesia',
                description: 'Specialize in equipment and techniques for children and infants',
            },
            {
                name: 'Cardiac Anesthesia',
                description: 'Focus on complex equipment for heart surgery procedures',
            },
            {
                name: 'Neuro Anesthesia',
                description: 'Support brain and spine surgery anesthesia needs',
            },
            {
                name: 'Trauma Anesthesia',
                description: 'Work in emergency departments and trauma centers',
            },
        ],

        workEnvironments: [
            'Hospital operating rooms',
            'Ambulatory surgery centers',
            'Trauma centers',
            'Pain management clinics',
            'Dental surgery centers',
            'Veterinary hospitals',
        ],

        // Salary Information
        salaryOverview: `Anesthesia technicians earn competitive salaries that reflect the specialized nature of their work and the critical role they play in patient safety. Compensation varies based on experience, location, facility type, and certifications held. Those working in major metropolitan areas or specialized surgical centers typically earn higher salaries.`,

        nationalAverage: '$52,000',

        topPayingStates: [
            { state: 'California', salary: '$68,000' },
            { state: 'Massachusetts', salary: '$64,000' },
            { state: 'New York', salary: '$62,000' },
            { state: 'Washington', salary: '$61,000' },
            { state: 'Connecticut', salary: '$60,000' },
        ],

        entryLevelRange: '$38,000 - $45,000',
        experiencedRange: '$55,000 - $75,000',

        benefits: [
            'Health insurance (medical, dental, vision)',
            'Retirement plans (401k with employer match)',
            'Paid time off and sick leave',
            'Continuing education allowances',
            'Shift differentials for nights/weekends',
            'Tuition reimbursement programs',
            'Professional liability insurance',
        ],

        // Education & Certification
        educationPath: `Becoming an anesthesia technician typically requires completing a specialized training program. While some positions accept candidates with a high school diploma and on-the-job training, most employers prefer candidates who have completed a formal anesthesia technology program. These programs combine classroom instruction with hands-on clinical experience in operating rooms.`,

        requiredDegrees: [
            {
                degree: 'Certificate Program',
                description: '6-12 months, covers basic anesthesia equipment and procedures',
            },
            {
                degree: 'Associate Degree',
                description: '2 years, comprehensive training in anesthesia technology',
            },
        ],

        certifications: [
            {
                name: 'Certified Anesthesia Technician (Cer.A.T.)',
                issuer: 'American Society of Anesthesia Technologists and Technicians (ASATT)',
                description: 'Entry-level certification for anesthesia technicians',
            },
            {
                name: 'Certified Anesthesia Technologist (Cer.A.T.T.)',
                issuer: 'ASATT',
                description: 'Advanced certification requiring associate degree',
            },
        ],

        timeline: '1-2 years',

        accreditedPrograms: `Look for programs accredited by the Commission on Accreditation of Allied Health Education Programs (CAAHEP). These programs ensure you receive quality education that meets industry standards and prepares you for certification exams.`,

        // Skills
        technicalSkills: [
            'Anesthesia equipment operation and maintenance',
            'Medical gas systems knowledge',
            'Sterile technique and infection control',
            'Patient monitoring equipment setup',
            'Equipment troubleshooting and repair',
            'Inventory management systems',
            'Electronic medical records (EMR)',
        ],

        softSkills: [
            'Attention to detail',
            'Communication and teamwork',
            'Stress management',
            'Problem-solving',
            'Time management',
            'Adaptability',
            'Patient empathy',
        ],

        technologies: [
            'Anesthesia machines and ventilators',
            'Patient monitoring systems',
            'Infusion pumps',
            'Airway management equipment',
            'Medical gas delivery systems',
            'Ultrasound equipment',
            'Computerized inventory systems',
        ],

        // Job Outlook
        growthRate: '8% (2023-2033)',

        projections: `The demand for anesthesia technicians is expected to grow steadily over the next decade, driven by an aging population requiring more surgical procedures and the expansion of outpatient surgery centers. As healthcare facilities focus on efficiency and patient safety, the role of specialized anesthesia support staff becomes increasingly valuable. Technological advances in anesthesia equipment also create opportunities for technicians with up-to-date technical skills.`,

        emergingSpecializations: [
            'Robotic surgery support',
            'Regional anesthesia techniques',
            'Point-of-care ultrasound',
            'Advanced monitoring technologies',
        ],

        careerLadder: [
            {
                level: 'Entry',
                title: 'Anesthesia Technician I',
                description: 'Basic equipment preparation and maintenance',
            },
            {
                level: 'Mid',
                title: 'Anesthesia Technician II',
                description: 'Advanced procedures and mentoring new staff',
            },
            {
                level: 'Senior',
                title: 'Lead Anesthesia Technician',
                description: 'Supervise team, manage equipment inventory',
            },
            {
                level: 'Advanced',
                title: 'Anesthesia Technology Manager',
                description: 'Department oversight and strategic planning',
            },
        ],

        // Schools & Programs
        schoolsOverview: `Anesthesia technology programs are offered at community colleges, technical schools, and some universities. Look for programs that provide extensive clinical rotations in operating rooms, as hands-on experience is crucial for this career. Many programs also help students prepare for certification exams.`,

        topSchools: [
            {
                name: 'Renton Technical College',
                location: 'Renton, WA',
                programType: 'Associate Degree',
            },
            {
                name: 'Stark State College',
                location: 'North Canton, OH',
                programType: 'Associate Degree',
            },
            {
                name: 'Community College of Allegheny County',
                location: 'Pittsburgh, PA',
                programType: 'Certificate/Associate',
            },
            {
                name: 'Concorde Career College',
                location: 'Multiple Locations',
                programType: 'Certificate',
            },
        ],

        programTypes: [
            {
                type: 'On-Campus',
                description: 'Traditional classroom and clinical training, best for hands-on learning',
            },
            {
                type: 'Hybrid',
                description: 'Online theory with in-person clinical rotations',
            },
        ],

        financialAid: `Most anesthesia technology programs qualify for federal financial aid. Additionally, many hospitals offer tuition reimbursement or scholarship programs for students who commit to working for them after graduation. Check with the American Society of Anesthesia Technologists and Technicians (ASATT) for scholarship opportunities.`,

        // Licensing by State
        licensingOverview: `Unlike some healthcare professions, anesthesia technicians are not required to hold state licenses in most states. However, certification through ASATT is highly recommended and often required by employers. Some states may have specific requirements for working in surgical settings.`,

        stateRequirements: {
            'California': {
                required: false,
                details: 'No state license required, but certification preferred by employers',
            },
            'Texas': {
                required: false,
                details: 'No state license required, certification recommended',
            },
            'Florida': {
                required: false,
                details: 'No state license required, ASATT certification preferred',
            },
            'New York': {
                required: false,
                details: 'No state license required, certification strongly recommended',
            },
        },

        examInfo: [
            {
                examName: 'Cer.A.T. Exam',
                description: '100 multiple-choice questions covering basic anesthesia technology',
            },
            {
                examName: 'Cer.A.T.T. Exam',
                description: 'Advanced exam for technologists with associate degrees',
            },
        ],

        renewalProcess: `ASATT certifications must be renewed every two years through continuing education credits. Technicians need to complete 30 continuing education hours during each renewal period.`,

        // Current Job Opportunities
        jobMarketOverview: `The job market for anesthesia technicians is strong, with opportunities available in hospitals, surgery centers, and specialty clinics across the country. Major medical centers and trauma hospitals typically have the most openings. Entry-level positions are regularly available, and experienced technicians are in high demand.`,

        featuredEmployers: [
            'Mayo Clinic',
            'Cleveland Clinic',
            'Johns Hopkins Hospital',
            'Massachusetts General Hospital',
            'UCSF Medical Center',
            'Surgery Partners (ASC network)',
        ],

        // Interview & Resume Tips
        interviewTips: `When interviewing for anesthesia technician positions, emphasize your attention to detail, ability to work under pressure, and commitment to patient safety. Be prepared to discuss your clinical experience, equipment knowledge, and how you handle emergency situations. Many interviews include scenario-based questions about equipment troubleshooting or emergency responses. Dress professionally and arrive early to demonstrate reliability.`,

        resumeKeywords: [
            'Anesthesia equipment',
            'Sterile technique',
            'Patient monitoring',
            'Equipment maintenance',
            'OR procedures',
            'Medical gas systems',
            'ASATT certified',
            'EMR proficiency',
            'Inventory management',
            'Team collaboration',
        ],

        portfolioTips: `While not always required, maintaining a portfolio of your certifications, continuing education certificates, and letters of recommendation can set you apart. Document any special projects, equipment implementations, or process improvements you've contributed to.`,

        // SEO
        metaTitle: 'How to Become an Anesthesia Technician: Career Guide 2025',
        metaDescription: 'Complete guide to becoming an anesthesia technician. Learn about education requirements, salary expectations ($52K average), certification, and job outlook. Start your healthcare career today.',
    };

    try {
        const careerGuide = await createCareerGuide(careerGuideData);
        console.log('✅ Successfully created career guide!');
        console.log(`   ID: ${careerGuide.id}`);
        console.log(`   Profession: ${careerGuide.professionName}`);
        console.log(`   Slug: ${careerGuide.professionSlug}`);
        console.log(`   Published: ${careerGuide.published}`);
        console.log('\n📝 Career guide created but not published yet.');
        console.log('   Use publishCareerGuide() to make it live.\n');
    } catch (error) {
        console.error('❌ Error creating career guide:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

generateSampleCareerGuide();
