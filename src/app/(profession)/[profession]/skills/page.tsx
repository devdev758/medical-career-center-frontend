import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { CheckCircle2, Brain, Heart, Users, Laptop, Award, TrendingUp, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

// Research-based content with proper citations
const RN_SKILLS_CONTENT = `
# Essential Registered Nurse Skills for 2026: Complete Guide

The nursing profession continues to evolve rapidly, with [employment projected to grow 5% from 2024 to 2034](https://www.bls.gov/ooh/healthcare/registered-nurses.htm), creating approximately 189,100 job openings annually according to the Bureau of Labor Statistics. Success as a registered nurse requires mastering both clinical competencies and advanced soft skills that enable you to deliver high-quality patient care in increasingly complex healthcare environments.

This guide outlines the critical skills modern RNs need, based on the [American Association of Colleges of Nursing (AACN) Essentials framework](https://www.aacnnursing.org/aacn-essentials), current healthcare trends, and industry best practices for 2024-2025.

## Core Clinical Competencies

### Patient Assessment and Monitoring

Comprehensive patient assessment forms the foundation of nursing practice. This involves:

**Initial and Ongoing Assessments**: Gathering complete health histories, performing thorough physical examinations, and accurately documenting findings in electronic health records. According to the [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/healthcare/registered-nurses.htm), assessing patients' conditions and recording medical histories represents a primary nursing responsibility across all settings.

**Vital Signs and Monitoring**: Evaluating vital signs (temperature, pulse, respiration, blood pressure, oxygen saturation) and recognizing abnormalities that may indicate changes in patient condition. Early detection of changes enables timely interventions and improved outcomes.

**Recognizing Clinical Changes**: Using clinical judgment to identify subtle changes that may indicate complications or improvement. This requires understanding normal versus abnormal findings and knowing when to escalate concerns to physicians.

**How to Develop This Skill**:
- Practice systematic head-to-toe assessments using consistent frameworks (e.g., body systems approach)
- Study normal ranges for vital signs across different patient populations (pediatric, adult, geriatric)
- Review actual patient cases to develop pattern recognition
- Seek feedback from experienced nurses during clinical rotations
- Use simulation labs to practice assessment techniques

### Medication Administration

Safe medication administration requires meticulous attention to detail and pharmacological knowledge:

**The Five Rights**: Consistently applying the five rights—right patient, right medication, right dose, right route, right time—prevents medication errors, which remain a significant patient safety concern.

**Drug Knowledge**: Understanding medication classes, therapeutic effects, adverse reactions, contraindications, and drug interactions. This enables you to monitor patients appropriately and educate them about their medications.

**Calculation Proficiency**: Accurately calculating medication dosages, especially for high-alert medications like insulin, heparin, and pediatric formulations.

**Administration Routes**: Proficiency in various administration routes including:
- Oral medications (tablets, liquids)
- Intravenous (IV) push and infusion
- Intramuscular (I M) injections
- Subcutaneous injections
- Topical and transdermal applications

**How to Develop This Skill**:
- Master dosage calculation formulas and dimensional analysis
- Study pharmacology systematically by drug classes
- Practice with medication administration simulations
- Always double-check calculations on high-alert medications
- Utilize drug references (e.g., Davis's Drug Guide) to verify information

### Clinical Procedures and Technical Skills

Modern RNs must be proficient in numerous technical procedures:

**Intravenous (IV) Therapy**:
- IV catheter insertion (peripheral and sometimes central line assistance)
- IV fluid and medication administration
- IV site assessment and maintenance
- Recognizing and managing complications (infiltration, phlebitis)

**Wound Care**:
- Assessing wound characteristics (size, depth, drainage, tissue type)
- Performing sterile dressing changes
- Understanding wound healing phases
- Preventing pressure injuries

**Other Essential Procedures**:
- Urinary catheterization (insertion and maintenance)
- Nasogastric tube insertion and management
- Blood glucose monitoring
- Specimen collection (blood, urine, sputum)
- Basic ECG interpretation

**Infection Control**: Strict adherence to infection prevention protocols including hand hygiene, personal protective equipment (PPE) use, and sterile technique is non-negotiable for patient safety.

## Technology and Digital Literacy

Healthcare technology adoption has accelerated dramatically, making digital literacy essential for modern nursing practice.

### Electronic Health Records (EHR)

Proficiency with EHR systems like Epic, Cerner, and Meditech is now mandatory:

**Documentation**: Accurate, timely documentation of assessments, interventions, patient responses, and communication with providers. This serves as both a legal record and communication tool for the healthcare team.

**Information Retrieval**: Quickly accessing patient information including lab results, diagnostic images, medication history, and previous encounters to inform care decisions.

**Clinical Decision Support**: Utilizing built-in alerts, order sets, and clinical pathways to enhance patient safety and evidence-based practice.

### Telehealth and Remote Monitoring

The expansion of telehealth, accelerated by recent years, requires new competencies:

- Conducting virtual patient assessments
- Using remote monitoring devices to track patient data
- Educating patients on telehealth technology use
- Maintaining patient privacy and data security in virtual settings

### Medical Equipment

Operating and troubleshooting various medical devices:
- Patient monitoring systems (telemetry, pulse oximetry)
- Infusion pumps and IV controllers
- Automated medication dispensing systems (Pyxis, Omnicell)
- Ventilators and respiratory equipment (in critical care)

**Data Privacy and Security**: Understanding HIPAA regulations and maintaining patient confidentiality when using electronic systems is crucial in the digital age.

## Critical Thinking and Clinical Judgment

Critical thinking represents one of the most vital nursing skills, enabling you to make sound clinical decisions in complex, often ambiguous situations.

### Clinical Reasoning Process

**Assessment**: Gathering relevant patient data systematically
**Analysis**: Interpreting data to identify actual or potential problems
**Planning**: Developing appropriate interventions based on evidence
**Implementation**: Carrying out the plan of care
**Evaluation**: Assessing patient responses and modifying the plan as needed

This process, often called the nursing process, provides a systematic framework for clinical decision-making.

### Prioritization Skills

Managing multiple patients with competing needs requires the ability to prioritize effectively:

**Maslow's Hierarchy**: Using Maslow's hierarchy of needs (physiological, safety, love/belonging, esteem, self-actualization) to prioritize interventions. Physiological needs (airway, breathing, circulation) take precedence.

**ABC Framework**: Airway, Breathing, Circulation—always assess and address these first in emergency situations.

**Acute vs. Chronic**: Recognizing when acute issues must take priority over chronic condition management.

**How to Develop This Skill**:
- Practice with case scenarios that require prioritization decisions
- Discuss rationales for clinical decisions with experienced nurses
- Review actual patient situations to understand decision-making processes
- Study evidence-based practice guidelines
- Participate in simulation exercises that involve multiple patients

## Communication and Interpersonal Skills

Effective communication is consistently cited as one of the most critical nursing competencies, impacting patient safety, satisfaction, and outcomes.

### Patient and Family Communication

**Therapeutic Communication**: Using techniques like active listening, open-ended questions, reflection, and empathy to build trust and gather information.

**Health Literacy Awareness**: Adapting communication style and complexity based on patients' educational levels and cultural backgrounds. Using teach-back methods to confirm understanding.

**Difficult Conversations**: Navigating sensitive topics like end-of-life care, bad news delivery (in collaboration with physicians), and addressing patient concerns or complaints.

**Patient Education**: Teaching is a core nursing function:
- Explaining disease processes in understandable terms
- Demonstrating procedures (medication administration, wound care)
- Providing written materials and resources
- Verifying comprehension through teach-back

### Team Collaboration

Nurses work within interdisciplinary teams requiring seamless communication:

**SBAR Framework**: Using Situation-Background-Assessment-Recommendation (SBAR) for structured communication with physicians and other providers ensures critical information is conveyed clearly and concisely.

**Handoff Communication**: Providing clear, comprehensive shift reports using standardized formats ensures continuity of care and patient safety.

**Conflict Resolution**: Addressing disagreements professionally and constructively while maintaining focus on patient care.

### Cultural Competence

Providing respectful, individualized care to diverse populations:

- Understanding  how cultural beliefs influence health behaviors and treatment adherence
- Recognizing and addressing unconscious bias
- Using professional interpreters when language barriers exist
- Respecting religious and cultural practices in care planning

The [AACN Essentials framework](https://www.aacnnursing.org/aacn-essentials) emphasizes diversity, equity, and inclusion as core nursing competencies for 2024-2025.

## Emotional Intelligence and Resilience

### Empathy and Compassion

The ability to connect with patients during vulnerable moments:

- Demonstrating genuine concern for patient wellbeing
- Providing emotional support to patients and families
- Maintaining professional boundaries while showing compassion
- Treating all patients with dignity and respect

The "6 Cs" of nursing—Care, Compassion, Competence, Communication, Courage, and Commitment—provide a framework for compassionate practice.

### Stress Management and Self-Care

Nursing is physically and emotionally demanding, making resilience essential:

**Recognizing Burnout Signs**:
- Emotional exhaustion
- Depersonalization
- Reduced personal accomplishment

**Self-Care Strategies**:
- Setting healthy work-life boundaries
- Utilizing employee assistance programs
- Engaging in physical activity and healthy eating
- Building supportive professional relationships
- Practicing mindfulness or other stress-reduction techniques

### Emotional Regulation

Managing your own emotions in high-stress situations:
- Remaining calm during emergencies
- Processing difficult patient outcomes
- Handling criticism or conflict professionally
- Seeking support when needed

## Leadership and Professional Development

### Patient Advocacy

Nurses serve as patient advocates, ensuring patients' rights and needs are met:

- Speaking up when care orders may not be in the patient's best interest
- Facilitating patient involvement in care decisions
- Connecting patients with resources and support services
- Navigating complex healthcare systems on patients' behalf

### Quality Improvement

Contributing to healthcare quality initiatives:

- Identifying opportunities for practice improvement
- Participating in unit-based quality projects
- Understanding and using quality metrics
- Implementing evidence-based practice changes

### Continuing Education

The healthcare field evolves constantly, requiring commitment to lifelong learning:

**Certifications**: Specialty certifications demonstrate expertise and often correlate with higher salaries. Options include:
- Critical Care Registered Nurse (CCRN)
- Certified Emergency Nurse (CEN)
- Oncology Certified Nurse (OCN)
- Pediatric Nursing Certification (CPN)
- Certified Perioperative Nurse (CNOR)

**Professional Development**:
- Attending nursing conferences
- Reading nursing journals
- Participating in online learning modules
- Pursuing advanced degrees (BSN to MSN, DNP)

## Time Management and Organization

Managing multiple patients efficiently requires strong organizational skills:

**Clustering Care**: Grouping tasks to minimize patient room entries while still providing frequent assessments.

**Delegation**: Knowing when and how to appropriately delegate tasks to nursing assistants and other support staff.

**Documentation Efficiency**: Documenting care throughout your shift rather than leaving it all to the end.

**Prioritization Matrix**: Using frameworks like urgent/important matrices to allocate time effectively.

## Emerging Skills for the Future

Healthcare continues to evolve, creating demand for new competencies:

### Informatics and Data Literacy

- Understanding how to leverage data for improved patient outcomes
- Interpreting quality metrics and performance dashboards
- Contributing to system design and optimization

### Population Health Management

- Understanding social determinants of health
- Focus on preventive care and chronic disease management
- Community health awareness

### Artificial Intelligence in Healthcare

- Working alongside AI diagnostic tools
- Understanding AI applications in nursing
- Maintaining human judgment and empathy in technology-enhanced care

### Genomics and Precision Medicine

-Understanding genetic influences on disease and treatment responses
- Interpreting genetic test results (basic level)
- Educating patients about genetic risk factors

## Skills Development Roadmap

### For New Graduates (0-2 Years)

**Focus Areas**:
- Master clinical fundamentals (assessment, medication administration)
- Develop time management and prioritization
- Build confidence in common procedures
- Learn your facility's EHR system thoroughly
- Seek mentorship from experienced nurses

**Professional Activities**:
- Participate in new graduate residency programs
- Join professional nursing organizations
- Attend hospital training sessions
- Practice reflective journaling

### For Mid-Career Nurses (3-7 Years)

**Focus Areas**:
- Pursue specialty certification
- Develop leadership skills (charge nurse, preceptor)
- Contribute to unit quality improvement projects
- Mentor new nurses
- Expand clinical expertise in chosen specialty

**Professional Activities**:
- Lead or participate in unit-based committees
- Pursue BSN if you hold an ADN
- Present at nursing conferences
- Begin advanced practice education if interested

### For Senior Nurses (8+ Years)

**Focus Areas**:
- Leadership roles (manager, clinical nurse specialist)
- System-level quality improvement
- Policy development and advocacy
- Advanced practice roles (NP, CRNA, CNM)
- Education and research

**Professional Activities**:
- Pursue graduate degrees (MSN, DNP)
- Publish in nursing journals
- Serve on professional organization boards
- Mentor nursing students and new graduates

## How to Showcase Your Skills

### Resume and Applications

**Use Action Verbs**: "Assessed," "Administered," "Coordinated," "Educated," "Monitored"

**Quantify Achievements**: "Managed care for 6-8 patients per shift," "Achieved 95% patient satisfaction scores"

**Highlight Certifications**: BLS, ACLS, specialty certifications prominently listed

**Include Technology**: Mention specific EHR systems (Epic, Cerner) and medical equipment experience

### Interviews

**Use STAR Method**: Situation, Task, Action, Result when answering behavioral questions

**Prepare Examples**: Have specific stories demonstrating each key skill

**Ask Quality Questions**: Inquire about orientation programs, nurse-to-patient ratios, professional development opportunities

For detailed interview preparation, see our [RN Interview Guide](/registered-nurse/interview).

## Conclusion

Success as a registered nurse requires a blend of clinical competencies, technological proficiency, critical thinking abilities, and interpersonal skills. While the foundational nursing skills remain constant, digital literacy, cultural competence, and emotional resilience have become increasingly important in modern healthcare.

The skills outlined in this guide reflect current industry standards based on:
- The [Bureau of Labor Statistics Occupational Outlook](https://www.bls.gov/ooh/healthcare/registered-nurses.htm)
- [AACN Essentials framework for nursing education](https://www.aacnnursing.org/aacn-essentials)
- Current healthcare trends and emerging technologies

Focus on continuous learning and skill development throughout your career. Healthcare evolves rapidly, and the most successful nurses are those who embrace lifelong learning and adapt to changing practice environments.

## Next Steps

Ready to advance your nursing career?

- **Explore Salaries**: See how skills and certifications impact earning potential with our [detailed salary data](/registered-nurse/salary)
- **Find Job Opportunities**: Browse [registered nurse positions](/registered-nurse/jobs) requiring these skills
- **Get Certified**: Learn about [certification programs](/registered-nurse/how-to-become#nclex-rn-examination) that enhance your qualifications
- **Interview Preparation**: Master your next interview with our [RN Interview Guide](/registered-nurse/interview)
`;

export default async function RegisteredNurseSkillsPage({ params }: PageProps) {
    const { profession } = await params;
    const urls = getProfessionUrls(profession);

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            {/* Breadcrumbs */}
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Registered Nurse', href: '/registered-nurse' },
                    { label: 'Skills' }
                ]}
                className="mb-6"
            />

            {/* Skill Categories - Visual Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <Brain className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">Critical Thinking</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Patient Care</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Communication</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <Laptop className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium">Technology</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg">
                    <Award className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                    <p className="text-sm font-medium">Leadership</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                    <p className="text-sm font-medium">Professional Growth</p>
                </div>
            </div>

            <QuickNavigation profession={profession} currentPath="skills" />

            {/* Main Article Content */}
            <article className="prose prose-slate dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        a: ({ node, ...props }) => {
                            const href = props.href || '';
                            if (href.startsWith('http')) {
                                return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{props.children}</a>;
                            }
                            return <Link href={href} className="text-blue-600 dark:text-blue-400 hover:underline">{props.children}</Link>;
                        }
                    }}
                >
                    {RN_SKILLS_CONTENT}
                </ReactMarkdown>
            </article>

            {/* Quick Action CTAs */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <CheckCircle2 className="w-8 h-8 mb-4 text-blue-600" />
                        <h3 className="font-bold text-lg mb-2">View Salary Impact</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            See how skills and certifications affect RN salaries
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.salary}>
                                Explore Salaries <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                        <Users className="w-8 h-8 mb-4 text-green-600" />
                        <h3 className="font-bold text-lg mb-2">Find RN Jobs</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Browse positions that match your skill set
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.jobs}>
                                Search Jobs <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
