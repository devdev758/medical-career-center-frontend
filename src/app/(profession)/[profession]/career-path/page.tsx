import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { TrendingUp, GraduationCap, Award, Users, ArrowRight, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getProfessionUrls, urlSlugToDbSlug } from '@/lib/url-utils';
import { validateProfession, getProfessionDisplayName, getBLSKeywords } from '@/lib/profession-utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

// Generate career path content with live salary data
function generateRNCareerPathContent(salaryData: {
    rn: string;
    np: string;
}) {
    return `
# Registered Nurse Career Path: Complete Guide to Advancement 2026

Nursing offers one of the most diverse and rewarding career advancement opportunities in healthcare. Whether you aspire to specialize in a clinical area, pursue leadership roles, advance your education, or transition into research or policy, the RN credential serves as a foundation for countless career trajectories. This comprehensive guide maps out the various paths available to registered nurses, with data-driven insights to help you make informed decisions about your professional future.

## Understanding the Nursing Career Ladder

The nursing profession features a well-defined career ladder with multiple entry and advancement points. Understanding this structure helps you plan your educational investments and career moves strategically.

### Educational Levels

**1. Entry-Level RN (ADN or Diploma)**
- **Education**: Associate Degree in Nursing (ADN) or Diploma program
- **Duration**: 2-3 years
- **National Median Salary**: ${salaryData.rn}
- **Scope**: Direct patient care, medication administration, care plan implementation
- **Settings**: Hospitals, clinics, long-term care, home health

**2. BSN-Prepared RN (Bachelor's Degree)**
- **Education**: Bachelor of Science in Nursing
- **Duration**: 4 years (or 12-18 months for RN-to-BSN)
- **Salary Premium**: Typically 10-20% higher than ADN
- **Advantages**: 
  - Preferred or required by many employers (especially Magnet hospitals)
  - Required for most leadership and advanced practice paths
  - Stronger preparation in critical thinking, research, community health
  - Better job security and advancement opportunities

According to the American Association of Colleges of Nursing, [BSN-prepared nurses demonstrate stronger leadership, critical thinking, and case management skills](https://www.aacnnursing.org/).

**3. Master's-Prepared Nurse (MSN)**
- **Education**: Master of Science in Nursing
- **Duration**: 2-3 years post-BSN
- **Career Options**: Advanced Practice Registered Nurse (APRN) roles, leadership, education, informatics
- **Salary Range**: Varies by specialty ($90K-$140K+)

**4. Doctoral-Prepared Nurse (DNP or PhD)**
- **DNP (Doctor of Nursing Practice)**: Clinical practice doctorate, highest level of clinical nursing
  - Focus: Advanced clinical practice, healthcare systems leadership
  - Duration**: 3-4 years post-BSN, 1-2 years post-MSN
  - Career Paths: APRN, executive leadership, policy, population health
  
- **PhD in Nursing**: Research doctorate
  - Focus: Nursing science, research, academia
  - Duration: 4-6 years post-BSN
  - Career Paths: Researcher, faculty, thought leader

The AACN has proposed the DNP as the standard entry-level degree for advanced practice nursing by 2025, though implementation continues to evolve.

## Clinical Advancement Paths

### Specialization Tracks

Specializing allows you to develop deep expertise in a specific patient population or clinical area. Here are the fastest-growing specializations with projected job growth from 2024-2034:

**High-Demand Specializations:**

1. **Nurse Practitioner (NP)** - 45-46% Growth
   - Direct patient care, diagnosis, treatment
   - Prescriptive authority in most states
   - Median Salary: ${salaryData.np}
   - Settings: Primary care clinics, specialty practices, hospitals
   - Sub-specialties: Family (FNP), Adult-Gerontology (AGNP), Psychiatric-Mental Health (PMHNP), Pediatric (PNP)

2. **Critical Care RN** - 22.7% Growth
   - ICU, CCU, trauma units
   - Advanced ventilator management, hemodynamic monitoring
   - Certifications: CCRN (Critical Care Registered Nurse)
   - Salary Premium: 15-25% above general RN

3. **Geriatric RN** - 16.3% Growth
   - Aging population driving demand
   - Long-term care, assisted living, home health
   - Focus: Chronic disease management, quality of life
   - Certifications: Gerontological Nursing Certification

4. **Psychiatric/Mental Health RN** - 15.1% Growth
   - Mental health crisis response
   - Addiction treatment, behavioral health
   - Growing awareness of mental health needs
   - Advanced role: PMHNP (Psychiatric-Mental Health Nurse Practitioner)

5. **Oncology RN** - 15.8% Growth
   - Cancer care across treatment spectrum
   - Chemotherapy administration, symptom management
   - Emotional support for patients and families
   - Certification: OCN (Oncology Certified Nurse)

6. **Home Health RN** - 17.3% Growth
   - Patient preference for home-based care
   - Aging population
   - Independent clinical judgment required
   - Strong assessment skills essential

7. **Labor & Delivery RN** - 17.2% Growth
   - Maternal-child health
   - Birthing support, newborn care
   - High-acuity, rewarding specialty

8. **Informatics RN** - 15.2% Growth
   - Bridge between technology and clinical care
   - EHR optimization, data management
   - Systems implementation
   - Growing importance of healthcare data

### Advanced Practice Registered Nurse (APRN) Roles

APRNs represent the highest level of clinical nursing practice, requiring graduate education (MSN or DNP) and national certification.

**Four APRN Roles:**

**1. Nurse Practitioner (NP)**
- **Focus**: Direct patient care across lifespan
- **Scope**: Assess, diagnose, treat, prescribe medications
- **Growth**: 45-46% (2024-2034) - one of the fastest-growing healthcare professions
- **Projected New Jobs**: 135,000+ over the decade
- **Median Salary**: $129,210 (May 2024)
- **Why Growing**: Primary care physician shortage, especially in rural areas; increased emphasis on preventive care

**2. Clinical Nurse Specialist (CNS)**
- **Focus**: Systems-level improvement, evidence-based practice
- **Scope**: Clinical expertise, consultation, education, research, policy development
- **Growth**: 6% (included in APRN 40% overall growth)
- **Average Salary**: $94,545 (May 2025)
- **Unique Role**: Improve patient outcomes through practice innovation and staff education
- **Specializations**: Adult-gerontology, pediatric, neonatal, psychiatric, oncology

**3. Certified Registered Nurse Anesthetist (CRNA)**
- **Focus**: Anesthesia administration
- **Scope**: Administer anesthesia for all types of procedures
- **Education**: DNP now required for entry (as of 2025)
- **Salary**: Among highest-paid nursing roles ($180K-$250K+)
- **Settings**: Hospitals, surgical centers, pain management clinics

**4. Certified Nurse Midwife (CNM)**
- **Focus**: Women's health across lifespan
- **Scope**: Prenatal care, labor/delivery, postpartum, well-woman care
- **Settings**: Hospitals, birth centers, private practices
- **Philosophy**: Natural childbirth, patient-centered care

## Leadership & Administrative Paths

Nurses with leadership aspirations can advance into management and executive roles without necessarily pursuing advanced practice.

### Management Track

**Charge Nurse (3-5 years experience)**
- Shift leadership
- Staff assignments, resource management
- First-line problem solving
- Typically no formal additional education required
- Salary: 5-10% premium over staff nurse

**Nurse Manager/Unit Manager (5-8 years experience)**
- Manage specific unit or department
- Staff hiring, scheduling, performance management
- Budget responsibility
- Quality improvement initiatives
- **Education**: BSN required, MSN preferred
- **Salary**: $85K-$110K depending on location and facility size

**Director of Nursing (10+ years experience)**
- Oversee multiple units or entire service line
- Strategic planning, policy development
- Large budget management
- C-suite interaction
- **Education**: MSN often required
- **Salary**: $110K-$150K+

**Chief Nursing Officer (CNO) / Vice President of Nursing (15+ years)**
- Executive leadership
- Hospital-wide nursing operations
- Board-level decision making
- System-wide quality, safety, nursing practice
- **Education**: DNP or MSN with MBA increasingly common
- **Salary**: $150K-$250K+ depending on facility

### Alternative Leadership Roles

**Clinical Nurse Leader (CNL)**
- MSN-prepared generalist
- Improve quality at point of care
- Microsystem management
- Evidence-based practice implementation

**Nurse Educator**
- Academic settings: Teach nursing students (MSN or DNP required, often PhD for tenure-track)
- Clinical settings: Staff development, onboarding, continuing education
- Curriculum development, clinical instruction
- **Salary**: Academic $65K-$95K (higher for doctoral faculty), Hospital-based $70K-$90K

**Quality Improvement / Patient Safety Officer**
- Data analysis for outcomes improvement
- Infection control, fall prevention programs
- Regulatory compliance (Joint Commission, CMS)
- Root cause analysis, error reduction
- **Education**: BSN required, MSN preferred, often with quality/data certifications

## Non-Direct Care Paths

Not all nursing careers involve bedside care. These paths leverage clinical expertise in different ways:

### Nurse Informatics Specialist
- EHR optimization and implementation
- Clinical decision support systems
- Data analytics for clinical improvement
- Bridge between IT and clinical staff
- **Education**: BSN with informatics certification, or MSN in Nursing Informatics
- **Growth**: 15.2% through 2034
- **Salary**: $85K-$115K

### Nurse Researcher
- Conduct nursing research studies
- Evidence-based practice development
- Grant writing, publication
- Academic or hospital-based research centers
- **Education**: PhD in Nursing or DNP with research focus
- **Salary**: $80K-$120K+

### Healthcare Policy & Advocacy
- Influence healthcare legislation
- Professional organization leadership
- Government agencies (CDC, FDA, CMS)
- Health policy think tanks
- **Education**: MSN or DNP, often with MPH or MPA
- **Typical Path**: Years of clinical experience + advanced degree

### Legal Nurse Consultant
- Bridge between healthcare and legal system
- Medical malpractice case review
- Expert witness testimony
- Work for law firms, insurance companies, or independently
- **Education**: RN license, Legal Nurse Consultant Certification (LNCC)
- **Salary**: $70K-$100K+ depending on setting

### Pharmaceutical/Medical Device Industry
- Clinical research coordinator
- Regulatory affairs
- Medical science liaison
- Product development, training
- **Typical Path**: Clinical experience + industry-specific training
- **Salary**: $90K-$140K+

## Decision-Making Framework: Choosing Your Path

### Questions to Ask Yourself

**1. What Aspect of Nursing Do I Enjoy Most?**
- Direct patient care → Specialization or APRN
- Teaching/mentoring → Nurse educator or preceptor roles
- Problem-solving/systems improvement → CNS, quality improvement, leadership
- Data and technology → Informatics
- Research and innovation → Researcher, CNS, academia

**2. What Work-Life Balance Do I Need?**
- Shift work with predictable schedule → Specialization in med-surg, OR
- Monday-Friday, 9-5 → Clinic settings, school nursing, occupational health, some APRN practices
- High autonomy → Home health, NP in private practice, legal consulting
- Part-time flexibility → Many specializations offer PRN opportunities

**3. How Much Additional Education Am I Willing to Pursue?**
- No additional degree (for now) → Certifications in current specialty, charge nurse, clinical ladder advancement
- Bridge program (12-18 months) → RN-to-BSN
- Master's (2-3 years) → NP, CNS, education, leadership, informatics
- Doctorate (3-6 years) → DNP for advanced practice, PhD for research/academia, DNP for executive leadership

**4. What Are My Financial Considerations?**
- **ROI Analysis**: 
  - MSN for NP: Investment ~$50K-$80K, salary increase ~$30K-$40K annually
  - Payback period: 2-3 years
  - Lifetime earnings significantly higher
- **Loan Forgiveness**: Many programs exist for nurses in underserved areas (NHSC, NURSE Corps)
- **Employer Tuition Assistance**: Many hospitals offer $5K-$10K annually for continued education

### Timeline Examples

**Scenario 1: Specialization Path (No Advanced Degree)**
- **Year 0**: New grad RN, med-surg unit
- **Year 2**: Transfer to ICU (specialty of interest)
- **Year 3**: Obtain CCRN certification
- **Year 4-5**: Charge nurse role, precept new nurses
- **Year 6+**: Clinical ladder advancement, travel ICU nursing for higher pay, or enter leadership

**Scenario 2: Nurse Practitioner Path**
- **Year 0-2**: Staff RN gaining clinical experience
- **Year 3-5**: Enroll in MSN-NP program (part-time while working)
- **Year 5**: Graduate, pass certification exam
- **Year 6**: First year as NP in clinic or hospital setting
- **Year 8+**: Experienced NP, potential for independent practice or specialization

**Scenario 3: Leadership Path**
- **Year 0-3**: Staff RN, develop clinical competence
- **Year 3-4**: Charge nurse, start RN-to-BSN online
- **Year 5**: Complete BSN, continue charge role
- **Year 6-8**: Enroll in MSN-Leadership/Administration program
- **Year 8**: Unit manager position
- **Year 12+**: Director of nursing or CNO track

**Scenario 4: Academia Path**
- **Year 0-5**: Clinical RN, build expertise
- **Year 5-7**: Complete MSN in Nursing Education while working
- **Year 8**: Clinical instructor position at nursing school (adjunct or part-time)
- **Year 9-13**: Enroll in PhD program (if pursuing tenure-track)
- **Year 14+**: Assistant professor, tenure-track position

## Certifications That Accelerate Your Path

Obtaining specialty certifications demonstrates advanced knowledge and commitment to your field. Many come with salary premiums and improved job prospects.

**Popular Certifications by Specialty:**

**Critical Care:**
- CCRN (Critical Care Registered Nurse)
- PCCN (Progressive Care Certified Nurse)
- CMC (Cardiac Medicine Certification)

**Emergency:**
- CEN (Certified Emergency Nurse)
- TCRN (Trauma Certified Registered Nurse)

**Perioperative:**
- CNOR (Certified Nurse Operating Room)
- CAPA (Certified Ambulatory Perianesthesia Nurse)

**Oncology:**
- OCN (Oncology Certified Nurse)
- BMTCN (Blood and Marrow Transplant Certified Nurse)

**Pediatrics:**
- CPN (Certified Pediatric Nurse)
- CPEN (Certified Pediatric Emergency Nurse)

**Women's Health:**
- RNC-OB (Inpatient Obstetric Nursing)
- C-EFM (Electronic Fetal Monitoring)

**Leadership:**
- CNML (Certified Nurse Manager and Leader)
- NEA-BC (Nurse Executive Advanced-Board Certified)

**Certifying Bodies**:
- American Nurses Credentialing Center (ANCC)
- American Association of Critical-Care Nurses (AACN)
- Board of Certification for Emergency Nursing (BCEN)
- Oncology Nursing Certification Corporation (ONCC)

## Emerging Career Opportunities

The healthcare landscape continues evolving, creating new specialized roles:

**1. Telehealth Nurse**
- Virtual patient assessments
- Remote triage and care coordination
- Technology-mediated healthcare
- Growing rapidly post-pandemic

**2. Genomics/Precision Medicine Nurse**
- Genetic testing interpretation
- Personalized treatment planning
- Family history assessment
- Growing field as genomic medicine advances

**3. Population Health Nurse**
- Community-level health improvement
- Data analytics for health trends
- Preventive care programs
- Social determinants of health focus

**4. Infection Control/Epidemiology Nurse**
- Hospital infection prevention
- Outbreak investigation
- Public health collaboration
- Heightened importance post-COVID-19

**5. Cannabis Care Nurse**
- Medical marijuana patient education
- Dosing guidance
- Symptom management
- Emerging as legalization expands

## Common Career Path Challenges & How to Navigate Them

### Challenge 1: Burnout During Clinical Years
**Reality**: 72% of RNs report moderate to high burnout levels
**Strategy**: 
- Set a timeline for advancement (e.g., "I'll work bedside for 5 years while getting my MSN")
- Use clinical time intentionally to build expertise for your chosen specialty
- Practice self-care and set boundaries
- Remember clinical experience strengthens your future advanced roles

### Challenge 2: Financing Advanced Education
**Solutions**:
- Employer tuition assistance programs ($5K-$10K/year typical)
- Federal loan forgiveness programs (NHSC, NURSE Corps)
- Scholarships from professional organizations
- Part-time program enrollment while working
- Some employers offer loan repayment as hiring incentive

### Challenge 3: Balancing Work, School, Family
**Strategies**:
- Choose online/hybrid programs for flexibility
- Reduce work hours temporarily if financially feasible  
- Communicate with family about time commitment
- Many MSN programs designed for working nurses (evening/weekend classes)
- Consider slower pacing (3 years part-time vs. 2 years full-time)

### Challenge 4: Choosing Between Similar Paths
**Example**: NP vs. CNS
**Approach**:
- Shadow professionals in both roles
- Speak with recent graduates
- Consider your personality (direct patient care vs. systems improvement)
- Many programs allow flexibility to switch tracks early on

## Geographic Considerations

Career advancement opportunities vary by location:

**Urban Areas:**
- More diverse specialty options
- Academic medical centers with research opportunities
- Higher competition but more positions
- Generally higher salaries (offset by cost of living)

**Rural/Underserved Areas:**
- High demand for all nursing roles, especially APRNs
- Loan forgiveness programs available
- Broader scope of practice often needed
- May have limited continuing education access
- Strong community relationships

**Independent Practice States (for NPs):**
- Full practice authority without physician collaboration requirements
- Currently 26 states + D.C.
- Influences NP autonomy and pay

## Conclusion

The registered nurse career path offers exceptional versatility—few professions provide such diverse advancement opportunities while maintaining a common professional foundation. Whether drawn to advanced clinical practice, leadership, education, research, or entirely different applications of nursing knowledge, the RN credential opens doors.

**Key Takeaways:**

1. **Start with Experience**: 2-5 years of solid clinical experience strengthens any advanced role
2. **BSN is the Gateway**: Most advancement paths require or strongly prefer BSN
3. **Growth is Strong**: Multiple specializations showing 15-45% job growth through 2034
4. **Financial ROI is Positive**: Advanced degrees typically pay for themselves within 2-3 years
5. **Flexibility Exists**: Many programs designed for working nurses with families
6. **The Profession Values Lifelong Learning**: Continuing education and certification are cultural norms

Your career path is uniquely yours. Use this guide as a roadmap, but remain open to opportunities that align with your evolving interests and life circumstances.

## Next Steps

- **Explore Salaries**: Compare compensation across specializations and geographic areas with our [detailed salary data](/registered-nurse/salary)
- **Find Opportunities**: Browse [registered nurse job openings](/registered-nurse/jobs) across specializations
- **Review Skills**: Understand [essential RN skills](/registered-nurse/skills) for your chosen path
- **Get Started**: Review our [complete career guide](/registered-nurse/how-to-become) for entry into nursing
`;
}

export default async function RegisteredNurseCareerPathPage({ params }: PageProps) {
    const { profession } = await params;
    const isValid = await validateProfession(profession);
    if (!isValid) notFound();

    const displayName = await getProfessionDisplayName(profession);
    const urls = getProfessionUrls(profession);
    const blsKeywords = await getBLSKeywords(profession);

    // Placeholder for non-RN professions
    if (profession !== 'registered-nurse') {
        return (
            <main className="container mx-auto py-10 px-4 max-w-5xl">
                <Breadcrumb items={[
                    { label: 'Home', href: '/' },
                    { label: displayName, href: `/${profession}` },
                    { label: 'Career Path' }
                ]} className="mb-6" />

                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayName} Career Path</h1>
                    <p className="text-xl text-muted-foreground">Career progression resources coming soon</p>
                </div>

                <QuickNavigation profession={profession} />

                <Card className="mt-8">
                    <CardContent className="pt-8">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <TrendingUp className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{displayName} Career Path Resources</h2>
                                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                    Career progression guides for {displayName} professionals are coming soon.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button asChild>
                                    <Link href={urls.salary}>
                                        View Salary Data
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={urls.jobs}>
                                        Browse Jobs
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // RN content below
    const dbSlug = urlSlugToDbSlug(profession);

    // Fetch RN and NP salary data for comparison
    const rnSalary = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: { in: blsKeywords },
            locationId: null,
            year: 2024
        }
    });

    const npSalary = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: 'nurse-practitioners',
            locationId: null,
            year: 2024
        }
    });

    const salaryData = {
        rn: rnSalary?.annualMedian ? `$${Math.round(rnSalary.annualMedian).toLocaleString()}` : '$93,600',
        np: npSalary?.annualMedian ? `$${Math.round(npSalary.annualMedian).toLocaleString()}` : '$129,210'
    };

    const content = generateRNCareerPathContent(salaryData);

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Registered Nurse', href: '/registered-nurse' },
                    { label: 'Career Path' }
                ]}
                className="mb-6"
            />

            {/* Career Path Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <GraduationCap className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">Education Paths</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <Award className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Specializations</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Leadership</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium">Growth Paths</p>
                </div>
            </div>

            <QuickNavigation profession={profession} currentPath="career-path" />

            {/* Info Card */}
            <Card className="mb-8 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-lg mb-2">Career Advancement is Common in Nursing</h3>
                            <p className="text-sm text-muted-foreground">
                                Unlike many professions, nursing offers clear pathways for advancement at every career stage.
                                From certifications that boost your specialty expertise to advanced degrees that open leadership
                                or APRN roles, you control your career trajectory.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Article */}
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
                                return <a href={href} target="_blank" rel="noopener noreferrer">{props.children}</a>;
                            }
                            return <Link href={href}>{props.children}</Link>;
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>

            {/* CTAs */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <TrendingUp className="w-8 h-8 mb-4 text-blue-600" />
                        <h3 className="font-bold text-lg mb-2">Compare Salaries by Role</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            See how specializations and advancement affect earning potential
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.salary}>
                                View Salary Data <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                        <Users className="w-8 h-8 mb-4 text-green-600" />
                        <h3 className="font-bold text-lg mb-2">Find Your Next Role</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Explore opportunities across all specializations
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.jobs}>
                                Browse Jobs <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
