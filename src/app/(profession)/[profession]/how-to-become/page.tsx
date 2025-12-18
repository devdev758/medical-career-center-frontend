import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { DollarSign, GraduationCap, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getProfessionUrls, urlSlugToDbSlug } from '@/lib/url-utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

// Function to generate content with live BLS data
function generateRNContent(salaryData: {
    median: string;
    entry: string;
    experienced: string;
    topStates: Array<{ state: string; salary: string; stateCode: string }>;
    topCities: Array<{ city: string; state: string; salary: string; citySlug: string; stateCode: string }>;
    totalEmployment?: number;
}) {
    return `
# How to Become a Registered Nurse: Complete Career Guide 2026

Registered nurses form the backbone of healthcare delivery in the United States, providing essential patient care across hospitals, clinics, long-term care facilities, and community health settings. With over ${salaryData.totalEmployment ? (salaryData.totalEmployment / 1000000).toFixed(1) + ' million' : '3.2 million'} practicing RNs nationwide, nursing represents one of the largest and most respected healthcare professions.

The nursing profession offers a unique combination of clinical expertise, patient advocacy, and career flexibility that few other healthcare roles can match. Whether you're drawn to the fast-paced environment of emergency care, the specialized knowledge required in critical care units, or the patient education focus of community health nursing, the RN credential opens doors to diverse career opportunities.

## What Does a Registered Nurse Do?

Registered nurses assess patient conditions, administer medications and treatments, coordinate care with physicians and other healthcare professionals, and educate patients and families about health management. The scope of practice varies by specialty and setting, but core responsibilities remain consistent across the profession.

### Patient Assessment and Monitoring

RNs conduct comprehensive physical assessments, monitor vital signs, and evaluate changes in patient conditions. This involves using clinical judgment to identify subtle changes that may indicate complications or improvement. In acute care settings, nurses may assess patients every 2-4 hours, documenting findings in electronic health records and communicating concerns to physicians.

### Medication Administration

Administering medications safely represents a critical nursing responsibility. RNs verify medication orders, calculate dosages, prepare and administer medications through various routes (oral, intravenous, intramuscular, subcutaneous), and monitor patients for therapeutic effects and adverse reactions. This requires detailed knowledge of pharmacology and potential drug interactions.

### Care Coordination

Nurses serve as the central point of communication among healthcare team members. They coordinate with physicians, physical therapists, social workers, and other specialists to ensure comprehensive patient care. This includes scheduling procedures, arranging consultations, and facilitating discharge planning.

### Patient and Family Education

Teaching patients and families about disease management, medication regimens, and lifestyle modifications forms an essential component of nursing practice. RNs develop individualized education plans, assess learning needs, and evaluate comprehension to promote better health outcomes.

### Documentation

Accurate, timely documentation ensures continuity of care and meets legal and regulatory requirements. Nurses document assessments, interventions, patient responses, and communication with other providers in electronic health record systems.

### Work Environment

Registered nurses work in diverse settings:

- **Hospitals (60% of RNs)**: Acute care, emergency departments, intensive care units, surgical units, and specialty departments
- **Ambulatory Care (18%)**: Physician offices, outpatient clinics, and same-day surgery centers
- **Long-term Care (7%)**: Nursing homes, assisted living facilities, and rehabilitation centers
- **Home Healthcare (6%)**: Providing care in patients' homes
- **Schools and Public Health (5%)**: School nursing, community health programs, and public health departments
- **Other Settings (4%)**: Insurance companies, pharmaceutical companies, research institutions, and educational facilities

Most hospital nurses work 12-hour shifts, typically three days per week, which allows for extended time off between shifts. Clinic and office-based nurses generally work standard business hours. The profession requires physical stamina, as nurses spend most of their shifts on their feet and may need to assist with patient mobility.

## Education and Training Requirements

### Educational Pathways

Three primary educational routes lead to RN licensure:

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

### Curriculum Components

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

Students complete supervised clinical experiences in various healthcare settings, typically totaling 500-1,000 hours depending on the program. These rotations provide hands-on experience with patient care under the guidance of experienced nurse preceptors.

### Licensure Requirements

**NCLEX-RN Examination**

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

Many states participate in the [Nurse Licensure Compact (NLC)](https://www.ncsbn.org/nurse-licensure-compact.htm), which allows nurses to practice in multiple states with a single license.

## Essential Skills for Success

### Technical Skills

**Clinical Assessment**

The ability to conduct thorough physical assessments and recognize abnormal findings develops through education and experience. Skilled nurses can detect subtle changes in patient conditions that may indicate complications.

**Medication Administration**

Safe medication practices require attention to detail, knowledge of pharmacology, and adherence to the "five rights" (right patient, medication, dose, route, and time). Nurses must also recognize potential adverse effects and drug interactions.

**Technical Procedures**

RNs perform various procedures including:
- Intravenous catheter insertion and management
- Wound care and dressing changes
- Urinary catheterization
- Nasogastric tube insertion
- Blood glucose monitoring
- Specimen collection

**Technology Proficiency**

Modern nursing requires comfort with electronic health records, medication dispensing systems, patient monitoring equipment, and telehealth platforms.

### Soft Skills

**Critical Thinking**

Nurses constantly analyze patient data, prioritize care needs, and make clinical decisions. This requires the ability to synthesize information from multiple sources and anticipate potential complications.

**Communication**

Effective communication with patients, families, and healthcare team members is essential. This includes active listening, clear verbal and written communication, and the ability to explain complex medical information in understandable terms.

**Emotional Intelligence**

Working with patients during vulnerable moments requires empathy, compassion, and the ability to manage one's own emotional responses. Nurses must balance professional boundaries with genuine caring.

**Time Management**

Managing multiple patients with competing needs demands strong organizational skills and the ability to prioritize effectively. Nurses must balance routine care with responding to emergencies and unexpected situations.

**Adaptability**

Healthcare environments change rapidly. Successful nurses adapt to new technologies, evolving best practices, and unexpected situations while maintaining quality patient care.

## Career Outlook and Job Market

### Employment Projections

The [Bureau of Labor Statistics](https://www.bls.gov/ooh/healthcare/registered-nurses.htm) projects registered nursing employment will grow 6% from 2022 to 2032, adding approximately 194,500 new positions. This growth stems from:

- Aging population requiring more healthcare services
- Increased prevalence of chronic conditions
- Emphasis on preventive care
- Retirement of experienced nurses
- Expansion of healthcare facilities

Browse current [registered nurse job openings](/registered-nurse/jobs) nationwide, or explore opportunities in high-demand markets like [Texas](/registered-nurse/jobs/tx), [California](/registered-nurse/jobs/ca), or [Florida](/registered-nurse/jobs/fl).

### Geographic Demand

Nursing demand varies by region, with higher needs in:
- Rural and underserved areas
- Southern and Western states with growing populations
- Areas with aging populations
- Regions experiencing healthcare facility expansion

### Specialization Opportunities

Experienced RNs can pursue specialized certifications through the [American Nurses Credentialing Center (ANCC)](https://www.nursingworld.org/ancc/) in areas such as:
- Critical care (CCRN)
- Emergency nursing (CEN)
- Oncology (OCN)
- Pediatrics (CPN)
- Operating room (CNOR)
- Cardiac care (CMC)

Specialization typically requires 1-2 years of experience in the specialty area and passing a certification examination.

## Salary and Compensation

### National Salary Data

According to the [Bureau of Labor Statistics](https://www.bls.gov/oes/current/oes291141.htm) (May 2023 data):
- **Median Annual Salary**: ${salaryData.median}
- **Entry Level (10th percentile)**: ${salaryData.entry}
- **Experienced (90th percentile)**: ${salaryData.experienced}

Explore detailed [registered nurse salary data](/registered-nurse/salary) by state and city to understand earning potential in your area.

### Salary by Experience Level

**New Graduate (0-2 years)**
- Average: $60,000-$75,000
- Varies significantly by location and setting

**Mid-Career (3-7 years)**
- Average: $75,000-$95,000
- Opportunities for shift differentials and specialty pay

**Experienced (8-15 years)**
- Average: $85,000-$110,000
- Leadership roles and specializations increase earning potential

**Senior/Advanced (15+ years)**
- Average: $95,000-$130,000+
- May include management positions or advanced practice roles

### Geographic Salary Variations

**Highest-Paying States** (median annual salary):
${salaryData.topStates.map((s, i) => `${i + 1}. [${s.state}](/registered-nurse/salary/${s.stateCode.toLowerCase()}): ${s.salary}`).join('\n')}

**Highest-Paying Metropolitan Areas**:
${salaryData.topCities.map((c, i) => `${i + 1}. [${c.city}, ${c.state}](/registered-nurse/salary/${c.stateCode.toLowerCase()}/${c.citySlug}): ${c.salary}`).join('\n')}

### Additional Compensation

Many nursing positions offer:
- Shift differentials (evening, night, weekend: 10-25% premium)
- Sign-on bonuses ($5,000-$20,000 for high-demand areas)
- Relocation assistance
- Tuition reimbursement
- Retirement benefits (403(b) or 401(k) matching)
- Health insurance
- Paid time off (typically 3-4 weeks annually)

## Getting Started: Your Action Plan

### Step 1: Research and Self-Assessment (1-3 months)

**Evaluate Your Fit**
- Shadow a registered nurse for a day
- Volunteer at a hospital or healthcare facility
- Talk to practicing nurses about their experiences
- Assess your comfort with bodily fluids, blood, and medical procedures
- Consider your ability to work irregular hours

**Research Programs**
- Compare ADN vs. BSN programs in your area using our [nursing schools directory](/registered-nurse/schools)
- Review admission requirements and prerequisites
- Calculate total costs and explore financial aid options
- Check program accreditation ([CCNE](https://www.aacnnursing.org/ccne-accreditation) or [ACEN](https://www.acenursing.org/))
- Review NCLEX pass rates for programs you're considering

### Step 2: Complete Prerequisites (6-12 months)

Most nursing programs require:
- Anatomy and physiology I and II (with labs)
- Microbiology (with lab)
- Chemistry
- English composition
- Psychology
- Statistics or college algebra

Maintain a strong GPA (typically 3.0 or higher) as nursing programs are competitive.

### Step 3: Apply to Nursing Programs (3-6 months before start)

**Application Components**:
- Transcripts from all colleges attended
- Letters of recommendation (2-3)
- Personal statement explaining your interest in nursing
- Resume highlighting relevant experience
- Entrance examination scores (TEAS or HESI, depending on program)

**Timeline**: Apply 6-12 months before your intended start date, as many programs have limited seats and competitive admissions.

### Step 4: Complete Nursing Education (2-4 years)

**Maximize Your Learning**:
- Take advantage of simulation lab opportunities
- Seek diverse clinical experiences
- Join student nursing organizations like the [National Student Nurses' Association (NSNA)](https://www.nsna.org/)
- Develop relationships with faculty mentors
- Maintain strong academic performance

### Step 5: Prepare for NCLEX-RN (2-3 months before graduation)

**Study Strategies**:
- Use NCLEX review books and question banks
- Consider a review course (Kaplan, UWorld, Hurst)
- Form study groups with classmates
- Practice test-taking strategies
- Schedule your exam for 4-6 weeks after graduation through [Pearson VUE](https://home.pearsonvue.com/nclex)

### Step 6: Launch Your Career

**Job Search**:
- Apply for new graduate residency programs (highly recommended)
- Network with clinical instructors and preceptors
- Attend job fairs and recruitment events
- Browse [registered nurse job openings](/registered-nurse/jobs) in your preferred location
- Consider your preferred specialty and setting
- Be open to starting in medical-surgical nursing to build foundational skills

**First Year Expectations**:
- Expect a learning curve as you transition from student to professional
- Seek mentorship from experienced nurses
- Focus on developing time management and prioritization skills
- Be patient with yourself as you gain confidence
- Review our [interview preparation guide](/registered-nurse/interview) to ace your job interviews

## Conclusion

Becoming a registered nurse requires significant dedication, but the profession offers rewarding career opportunities with strong job security, competitive compensation, and the ability to make a meaningful difference in people's lives. The path involves rigorous education, licensure requirements, and ongoing professional development, but for those committed to healthcare and patient care, nursing provides a fulfilling and stable career.

The nursing profession continues to evolve with advancing technology, changing healthcare delivery models, and expanding scopes of practice. Those entering the field now will have opportunities to shape the future of healthcare while building diverse, flexible careers that can adapt to their changing interests and life circumstances.

Whether you're a recent high school graduate, a career changer, or someone returning to the workforce, nursing offers accessible pathways to enter the profession and clear routes for advancement. With careful planning, dedication to your education, and commitment to lifelong learning, you can build a successful and satisfying career as a registered nurse.
`;
}

export default async function RegisteredNurseCareerGuide({ params }: PageProps) {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);

    // Fetch live BLS salary data for registered nurses
    const nationalData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: dbSlug,
            locationId: null,
            year: 2024
        }
    });

    // Fetch top paying states
    const topStatesData = await prisma.salaryData.findMany({
        where: {
            careerKeyword: dbSlug,
            location: { city: '' },
            year: 2024
        },
        include: { location: true },
        orderBy: { annualMedian: 'desc' },
        take: 5
    });

    // Fetch top paying cities
    const topCitiesData = await prisma.salaryData.findMany({
        where: {
            careerKeyword: dbSlug,
            location: { city: { not: '' } },
            year: 2024
        },
        include: { location: true },
        orderBy: { annualMedian: 'desc' },
        take: 5
    });

    // Prepare salary data for content generation
    const salaryData = {
        median: nationalData?.annualMedian ? `$${Math.round(nationalData.annualMedian).toLocaleString()}` : '$93,600',
        entry: nationalData?.annual10th ? `$${Math.round(nationalData.annual10th).toLocaleString()}` : '$63,000',
        experienced: nationalData?.annual90th ? `$${Math.round(nationalData.annual90th).toLocaleString()}` : '$129,000',
        totalEmployment: nationalData?.totalEmployment || undefined,
        topStates: topStatesData.map(s => ({
            state: s.location?.stateName || s.location?.state || '',
            salary: `$${Math.round(s.annualMedian || 0).toLocaleString()}`,
            stateCode: s.location?.state || ''
        })),
        topCities: topCitiesData.map(c => ({
            city: c.location?.city || '',
            state: c.location?.state || '',
            salary: `$${Math.round(c.annualMedian || 0).toLocaleString()}`,
            citySlug: c.location?.slug?.split('/').pop() || '',
            stateCode: c.location?.state || ''
        }))
    };

    // Generate content with live data
    const content = generateRNContent(salaryData);

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            {/* Breadcrumbs */}
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Registered Nurse', href: '/registered-nurse' },
                    { label: 'Career Guide' }
                ]}
                className="mb-6"
            />

            {/* Quick Stats - Visual Element */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-muted-foreground mb-1">Median Salary</p>
                    <p className="text-xl font-bold">{salaryData.median}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-muted-foreground mb-1">Job Growth</p>
                    <p className="text-xl font-bold">6%</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <Briefcase className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-muted-foreground mb-1">New Jobs</p>
                    <p className="text-xl font-bold">194,500</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <GraduationCap className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm text-muted-foreground mb-1">Total RNs</p>
                    <p className="text-xl font-bold">{salaryData.totalEmployment ? `${(salaryData.totalEmployment / 1000000).toFixed(1)}M` : '3.2M'}</p>
                </div>
            </div>

            {/* Main Article Content with Markdown Rendering */}
            <article className="prose prose-slate dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        a: ({ node, ...props }) => {
                            const href = props.href || '';
                            // External links
                            if (href.startsWith('http')) {
                                return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{props.children}</a>;
                            }
                            // Internal links
                            return <Link href={href} className="text-blue-600 dark:text-blue-400 hover:underline">{props.children}</Link>;
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>

            {/* CTA Section - Visual Element */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <DollarSign className="w-8 h-8 mb-4 text-blue-600" />
                        <h3 className="font-bold text-lg mb-2">View Salary Data</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Explore detailed salary breakdown by state and city
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.salary}>
                                View Salaries <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                        <Briefcase className="w-8 h-8 mb-4 text-green-600" />
                        <h3 className="font-bold text-lg mb-2">Find RN Jobs</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Browse thousands of nursing positions nationwide
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.jobs}>
                                Search Jobs <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-6">
                        <GraduationCap className="w-8 h-8 mb-4 text-purple-600" />
                        <h3 className="font-bold text-lg mb-2">Find Programs</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Explore accredited nursing schools in your area
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.schools || '/registered-nurse/schools'}>
                                Find Schools <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
