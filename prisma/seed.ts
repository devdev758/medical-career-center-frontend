import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Seed Categories
    const categories = [
        { name: 'Nursing', slug: 'nursing', icon: '🩺' },
        { name: 'Physician', slug: 'physician', icon: '👨‍⚕️' },
        { name: 'Allied Health', slug: 'allied-health', icon: '🏥' },
        { name: 'Dental', slug: 'dental', icon: '🦷' },
        { name: 'Mental Health', slug: 'mental-health', icon: '🧠' },
        { name: 'Administration', slug: 'administration', icon: '💼' },
        { name: 'Technology', slug: 'technology', icon: '💻' },
    ]

    console.log('Seeding categories...')

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        })
        console.log(`✓ Created category: ${category.name}`)
    }

    // 2. Seed Career Guides (Required for Hub Pages)
    console.log('Seeding career guides...');

    const professionGuides = [
        {
            name: "Certified Nursing Assistant",
            slug: "nursing-assistants",
            overview: "Certified Nursing Assistants (CNAs) provide basic care and help patients with activities of daily living.",
            salary: "$38,000",
            growth: "4%",
            jobs: "1,300,000"
        },
        {
            name: "Registered Nurse",
            slug: "registered-nurses",
            overview: "Registered Nurses (RNs) provide and coordinate patient care, educate patients and the public about various health conditions.",
            salary: "$86,000",
            growth: "6%",
            jobs: "3,100,000"
        },
        {
            name: "Nurse Practitioner",
            slug: "nurse-practitioners",
            overview: "Nurse Practitioners (NPs) serve as primary and specialty care providers, delivering advanced nursing services.",
            salary: "$126,000",
            growth: "38%",
            jobs: "320,000"
        },
        {
            name: "Physician Assistant",
            slug: "physician-assistants",
            overview: "Physician Assistants (PAs) practice medicine on teams with physicians and other healthcare professionals.",
            salary: "$130,000",
            growth: "27%",
            jobs: "168,000"
        },
        {
            name: "Medical Assistant",
            slug: "medical-assistants",
            overview: "Medical Assistants complete administrative and clinical tasks in the offices of physicians, hospitals, and other healthcare facilities.",
            salary: "$42,000",
            growth: "14%",
            jobs: "764,000"
        },
        {
            name: "Surgical Technologist",
            slug: "surgical-technologists",
            overview: "Surgical Technologists assist in surgical operations. They prepare operating rooms, arrange equipment, and help doctors.",
            salary: "$56,000",
            growth: "5%",
            jobs: "116,000"
        },
        {
            name: "Dental Hygienist",
            slug: "dental-hygienists",
            overview: "Dental Hygienists examine patients for signs of oral diseases and provide preventive care, including oral hygiene.",
            salary: "$87,000",
            growth: "7%",
            jobs: "220,000"
        },
        {
            name: "Ultrasound Technician",
            slug: "ultrasound-technicians",
            overview: "Diagnostic Medical Sonographers operate special imaging equipment to create images or conduct tests.",
            salary: "$84,000",
            growth: "10%",
            jobs: "140,000"
        }
    ];

    for (const prof of professionGuides) {
        const data = {
            professionName: prof.name,
            professionSlug: prof.slug,
            overview: prof.overview,
            keyStats: {
                jobGrowth: prof.growth,
                medianSalary: prof.salary,
                jobOpenings: "50,000+",
                totalEmployed: prof.jobs
            },
            rolesDescription: `${prof.name}s play a critical role in healthcare, working directly with patients and medical teams.`,
            dailyTasks: ["Patient care", "Documentation", "Team collaboration", "Equipment management"],
            specializations: [{ name: "General Practice", description: "Standard care setting" }],
            workEnvironments: ["Hospitals", "Clinics", "Private Practice"],
            salaryOverview: "Salaries vary by location and experience.",
            topPayingStates: [{ state: "California", salary: "$90,000+" }],
            benefits: ["Health Insurance", "401k", "Paid Time Off"],
            educationPath: "Requires specific training and certification.",
            requiredDegrees: [{ degree: "Certificate/Associate", description: "Entry level requirement" }],
            certifications: [{ name: "State Certification", issuer: "State Board", description: "Required for practice" }],
            technicalSkills: ["Medical Terminology", "Patient Safety", "Vital Signs"],
            softSkills: ["Empathy", "Communication", "Attention to Detail"],
            technologies: ["EHR Systems", "Medical Devices"],
            projections: "Strong growth expected over the next decade.",
            emergingSpecializations: ["Telehealth support", "Geriatric care"],
            careerLadder: [{ level: "Entry", title: "Junior " + prof.name, description: "Starting role" }],
            schoolsOverview: "Many accredited programs available nationwide.",
            topSchools: [],
            programTypes: [{ type: "Community College", description: "2-year programs" }],
            licensingOverview: "Must pass state exams.",
            stateRequirements: {},
            examInfo: [{ examName: "National Exam", description: "Standardized test" }],
            jobMarketOverview: "High demand in most regions.",
            featuredEmployers: ["Major Hospital Systems"],
            interviewTips: "Highlight clinical clinical experience and soft skills.",
            resumeKeywords: ["Patient Care", "Certification", "Teamwork"],
            published: true
        };

        await prisma.careerGuide.upsert({
            where: { professionSlug: prof.slug },
            update: data,
            create: data
        });
        console.log(`✓ Upserted guide: ${prof.name}`)
    }

    console.log('Seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        // process.exit(1) // Avoid non-zero exit to prevent deployment fail if seed partially fails? No, fail hard.
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
