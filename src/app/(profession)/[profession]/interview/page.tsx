import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { MessageCircle, DollarSign, Briefcase, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
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

// Function to generate interview content with live salary data
function generateRNInterviewContent(salaryData: {
    national: string;
    topStates: Array<{ state: string; salary: string; stateCode: string }>;
}) {
    return `
# Registered Nurse Interview Questions & Answers 2026: Complete Preparation Guide

Landing a registered nurse position requires more than clinical competence—you must demonstrate it effectively during your interview. With the nursing field projected to grow 5% through 2034, creating [approximately 189,100 job openings annually](https://www.bls.gov/ooh/healthcare/registered-nurses.htm), competition for the best positions remains strong. This comprehensive guide prepares you to confidently navigate every aspect of the RN interview process.

## Understanding the RN Interview Process

### Typical Interview Stages

**1. Phone/Video Screen (15-30 minutes)**:
- HR representative or nurse recruiter
- Basic qualifications verification
- Schedule availability discussion
- Salary expectations (preliminary)
- Cultural fit assessment

**2. First In-Person Interview (45-60 minutes)**:
- Nurse manager or director
- Unit-specific questions
- Clinical scenario discussions
- Tour of unit/facility
- More detailed salary conversation

**3. Panel Interview (Optional, 60-90 minutes)**:
- Multiple interviewers (manager, staff nurses, HR)
- Behavioral questions
- Team dynamics assessment
- Presentation of case study (sometimes)

**4. Final Interview/Offer Stage**:
- Final salary negotiation
- Benefits discussion
- Start date confirmation

### What Hiring Managers Look For

1. **Clinical Competence**: Can you safely perform the job?
2. **Critical Thinking**: How do you approach complex situations?
3. **Communication Skills**: Can you effectively interact with patients and team?
4. **Cultural Fit**: Will you thrive in their environment?
5. **Longevity**: Are you likely to stay and grow with the organization?

## Most Common RN Interview Questions & STAR Method Answers

The STAR method (Situation, Task, Action, Result) provides a structured framework for answering behavioral questions effectively.

### Patient Care Questions

**Question 1: "Tell me about a time you dealt with a difficult patient. How did you handle it?"**

**STAR Answer Example**:

**Situation**: During my med-surg rotation, I cared for an elderly patient with COPD who consistently refused breathing treatments and became verbally aggressive when staff attempted to administer them.

**Task**: My responsibility was to ensure the patient received necessary respiratory therapy while building trust and reducing their anxiety about the treatments.

**Action**: I spent extra time listening to the patient's concerns. I learned they had a traumatic experience with a breathing treatment years ago. I:
- Educated them gently about how the medication would help their breathing
- Offered to demonstrate the nebulizer on myself first
- Broke the treatment into shorter sessions initially
- Ensured I was present for the first few treatments to provide reassurance

**Result**: Within two days, the patient accepted regular treatments without resistance. Their oxygen saturation improved from 88% to 95%. They specifically requested me as their nurse and later thanked me for taking time to understand their fear. This taught me that patient resistance often stems from fear or misunderstanding, not stubbornness.

---

**Question 2: "Describe a time you went above and beyond for a patient."**

**STAR Answer Example**:

**Situation**: I was caring for a Spanish-speaking patient newly diagnosed with diabetes who was being discharged the next morning. The patient seemed confused during the standard discharge teaching, even with an interpreter present.

**Task**: Ensure the patient understood diabetes management to prevent readmission and complications.

**Action**: I:
- Arranged an extended teaching session with a bilingual diabetes educator
- Created a visual medication schedule with pictures
- Contacted the patient's family and included them in education
- Provided written materials in Spanish
- Arranged a follow-up call for three days post-discharge
- Connected the patient with a community diabetes support group for Spanish speakers

**Result**: The patient demonstrated correct insulin administration before discharge. The follow-up call confirmed they were managing well at home. They were not readmitted within 30 days, and their A1C improved at the 3-month follow-up. This reinforced the importance of culturally competent, individualized patient education.

---

### Teamwork & Collaboration Questions

**Question 3: "Tell me about a time you had a conflict with a coworker. How did you resolve it?"**

**STAR Answer Example**:

**Situation**: During a particularly busy shift in the ICU, another nurse and I disagreed about patient assignment priorities. She felt I wasn't helping enough with her more critical patient, while I was managing three patients including a fresh post-op patient requiring frequent monitoring.

**Task**: Resolve the conflict professionally while ensuring all patients received appropriate care.

**Action**: I:
- Waited until both of us had a brief moment
- Asked if we could talk privately in the break room
- Listened to her concerns without getting defensive
- Explained my reasoning and current patient demands
- Proposed a solution: I would help with her patient's next turn and repositioning if she could assist with my post-op assessments
- Agreed to communicate better throughout shifts about when we need help

**Result**: We completed both tasks together, which actually improved our teamwork. We developed a system of checking in every two hours to reassess priorities and offer help. This improved the entire unit's culture of collaboration. I learned that perceived conflicts often stem from communication gaps, not actual disagreements.

---

**Question 4: "Describe a time you had to advocate for a patient."**

**STAR Answer Example**:

**Situation**: A patient recovering from abdominal surgery was reporting 8/10 pain, but the physician's order was for pain medication every 6 hours PRN, and it had only been 4 hours since the last dose.

**Task**: Advocate for better pain management while maintaining the patient's comfort and trust in the healthcare team.

**Action**: I:
- Thoroughly assessed the patient's pain (location, quality, radiation)
- Documented detailed pain assessment
- Tried non-pharmacological interventions (repositioning, cold therapy)
- Called the physician with specific SBAR communication: "The patient's pain is 8/10 four hours after last dose. Current order is Q6 hours. Patient is reluctant to move, which is delaying recovery. I recommend either a stronger analgesic or decreasing the interval to Q4 hours."
- Remained professional and focused on patient outcomes

**Result**: The physician ordered a different pain medication with better coverage. The patient's pain decreased to 3/10 within an hour. They were able to participate in physical therapy that afternoon. This experience reinforced that effective advocacy requires clear communication backed by thorough assessment data.

---

### Critical Thinking & Problem-Solving Questions

**Question 5: "Tell me about atime you had to make a quick decision in an emergency."**

**STAR Answer Example**:

**Situation**: During a night shift, I was caring for a post-surgical patient when I noticed their blood pressure dropping (90/50 from baseline 130/80) and tachycardia developing.

**Task**: Quickly assess the situation and intervene appropriately while waiting for physician response.

**Action**: I immediately:
- Performed rapid assessment: patient pale, cool, clammy; surgical dressing had small amount of visible blood but felt saturated underneath
- Checked oxygen saturation (92%) and placed patient on 2L O2
- Called for assistance from charge nurse
- Applied pressure to surgical site
- Elevated patient's legs
- Called physician with SBAR while colleague started IV fluid bolus per standing orders
- Remained calm and reassuring to patient

**Result**: Physician arrived within 5 minutes. Patient had a hemorrhage requiring return to surgery. Because of early recognition and intervention, patient remained hemodynamically stable enough for transport. Patient recovered fully. This reinforced the importance of trusting clinical instincts and acting quickly when something doesn't seem right.

---

**Question 6: "Describe a time you made a mistake at work. What did you learn?"**

**STAR Answer Example**:

**Situation**: As a new graduate nurse, I was administering medications and gave a patient their 9 AM medications at 9:30 AM without documenting the time discrepancy.

**Task**: Own the mistake, ensure patient safety, and prevent future occurrences.

**Action**: I:
- Immediately realized my error when completing documentation
- Reported it to my charge nurse right away
- Completed an incident report honestly
- Monitored the patient closely for any adverse effects (there were none)
- Discussed the error with my preceptor to understand system factors
- Implemented personal strategies: setting medication alarm 30 minutes beforehand, organizing medications during shift report

**Result**: No harm came to the patient. I learned that transparency about errors is essential for both patient safety and system improvement. The unit used my experience to improve the medication preparation process. I haven't had a medication timing error since implementing my new strategies. This taught me that acknowledging mistakes quickly is always better than hiding them.

---

### Stress Management Questions

**Question 7: "How do you handle extremely stressful situations?"**

**STAR Answer Example**:

**Situation**: During a particularly chaotic shift, we had three admissions, two patients rapidly declining, and one family crisis, all occurring simultaneously with two staff members calling in sick.

**Task**: Maintain quality patient care and team morale despite overwhelming circumstances.

**Action**: I:
- Took a 30-second pause to prioritize using ABC (Airway, Breathing, Circulation)
- Communicated with charge nurse about resource needs
- Delegated appropriate tasks to nursing assistants
- Focused on immediate patient safety needs first
- Maintained calm demeanor to prevent team panic
- Checked in briefly with each team member to offer support
- Documented care accurately despite time pressure
- Debriefed with team after shift to process stress

**Result**: All patients received safe care with no adverse events. The team functioned cohesively under pressure. I later implemented a personal stress management routine including brief breathing exercises during overwhelming moments. This experience showed me that staying calm and prioritizing effectively helps the entire team manage stress better.

---

## Questions by Setting

### Hospital/Acute Care Specific

- "How do you prioritize care for multiple patients with competing needs?"
- "Describe your experience with rapid response or code blue situations."
- "How do you maintain patient safety in a fast-paced environment?"
- "What's your experience with electronic health records and unit-specific equipment?"

### Outpatient/Clinic Specific

- "How do you handle high patient volumes in an outpatient setting?"
- "Describe your patient education approach for chronic disease management."
- "How do you triage phone calls from patients?"
- "What's your experience with preventive care and health maintenance?"

### Long-Term Care Specific

- "How do you build relationships with residents and families over time?"
- "Describe your approach to managing complex medication regimens for elderly patients."
- "How do you handle end-of-life care conversations?"
- "What's your experience with rehabilitation and function restoration?"

## Technical/Clinical Questions

Expect scenario-based questions testing clinical knowledge:

**Cardiovascular**:
- "A patient's telemetry shows ventricular tachycardia. What do you do?"
- "How do you assess chest pain?"

**Respiratory**:
- "A COPD patient's O2 sat is 88%. What's your priority?"
- "Describe proper use of incentive spirometry."

**Medication**:
- "How do you verify insulin dosage?"
- "What are signs of digoxin toxicity?"

**Infection Control**:
- "Explain proper donning and doffing of PPE for contact isolation."
- "How do you prevent catheter-associated UTIs?"

**Best Approach**: Use your clinical knowledge honestly. If you don't know, say: "I would verify that information with [drug reference/policy manual/charge nurse] before proceeding to ensure patient safety."

## Salary Negotiation: Data-Driven Approach

### Know Your Worth

**National Salary Data** (Based on BLS May 2023):
- **National Median**: ${salaryData.national}
- **Geographic Variation**: Salaries vary significantly by state and city

**Top-Paying States** (for RN positions):
${salaryData.topStates.map((s, i) => `${i + 1}. ${s.state}: ${s.salary}`).join('\n')}

[Explore detailed salary data by state and city](/registered-nurse/salary) to know your market value.

### When to Discuss Salary

**Phone Screen**: Be prepared with a range based on research
- Example: "Based on my research of RN salaries in this area and my BSN with ICU experience, I'm targeting $75,000-$85,000."

**First Interview**: May come up naturally
- Focus on fit first, salary second
- Be honest but not the first to name a number if possible

**Offer Stage**: Prime negotiation opportunity
- Have your researched range ready
- Consider total compensation package

### How to Negotiate

**Script for Initial Offer**:
> "Thank you for the offer. I'm very excited about joining your team. Based on my research of RN salaries in [city/state] and considering my [degree level/certifications/experience], I was hoping for something in the range of $X-$Y. Is there flexibility in the salary?"

**If They Can't Budge on Salary**:
> "I understand the salary constraints. Could we discuss other aspects of the compensation package? I'm interested in [sign-on bonus/relocation assistance/shift differentials/tuition reimbursement/additional PTO]."

### What Else to Negotiate

- **Sign-on bonuses**: $5,000-$20,000 for high-demand areas
- **Shift differentials**: 10-25% for evenings/nights/weekends
- **Tuition reimbursement**: For BSN or specialty certifications
- **Relocation assistance**: If moving for the position
- **PTO accrual rate**: Especially if you have experience
- **Flexibility**: Schedule preferences, specific unit placement
- **Professional development**: Conference attendance, certification fees

### Red Flags in Salary Discussions

⚠️ Employer won't discuss salary range at any stage
⚠️ Salary significantly below market rate with no explanation
⚠️ Pressure to accept immediately without time to consider
⚠️ Vague explanations about "performance-based increases"
⚠️ No information about benefits package

## What to Wear

### Hospital/Acute Care Settings
- **Conservative business professional**
- Suit or dress pants/skirt with blazer
- Closed-toe shoes (flats or low heels)
- Minimal jewelry
- Natural makeup
- Professional hairstyle

### Outpatient/Clinic Settings
- **Business casual to business professional**
- Nice slacks or skirt with blouse/sweater
- Blazer optional but recommended
- Closed-toe shoes

### What to Avoid
- ❌ Scrubs (even if you already work there)
- ❌ Strong perfume/cologne
- ❌ Excessive jewelry
- ❌ Visible tattoos if possible (cover conservatively)
- ❌ Casual wear (jeans, sneakers, t-shirts)

## Questions to Ask the Employer

### About the Role
- "What does a typical shift look like on this unit?"
- "What's the nurse-to-patient ratio?"
- "How long is the orientation period?"
- "What types of patients are most common on this unit?"
- "What opportunities exist for specialty certifications?"

### About the Team
- "Can you describe the team I'd be working with?"
- "How does the team handle conflicts or disagreements?"
- "What's the average tenure of nurses on this unit?"
- "How does leadership support staff nurses?"

### About Professional Development
- "Does the hospital offer tuition reimbursement for continuing education?"
- "Are there opportunities for advancement into leadership roles?"
- "How does the organization support specialty certification?"
- "What professional development resources are available?"

### About Culture
- "How would you describe the unit culture?"
- "What do you enjoy most about working here?"
- "How does the organization recognize and reward excellent nursing care?"
- "What are the biggest challenges facing the unit right now?"

### Red Flags to Watch For
⚠️ High turnover rates (ask diplomatically)
⚠️ Vague answers about support or resources
⚠️ Unrealistic nurse-to-patient ratios
⚠️ No mention of orientation or training
⚠️ Resistance to questions about culture or challenges

## Day-of Interview Tips

### Before the Interview
- **24-48 Hours Before**:
  - Research the facility (mission, values, recent news)
  - Review common nursing scenarios for your specialty
  - Prepare 2-3 questions to ask
  - Select and prepare your outfit
  - Print extra copies of resume
  
- **Morning of**:
  - Eat a healthy breakfast
  - Arrive 10-15 minutes early (not more)
  - Bring: resume copies, license copy, certifications, reference list, pen, small notepad

### During the Interview
- **Body Language**:
  - Firm handshake
  - Maintain eye contact
  - Sit up straight
  - Smile naturally
  - Avoid crossed arms
  
- **Communication**:
  - Listen carefully to full question before answering
  - Take a breath before complex answers
  - Ask for clarification if needed
  - Be honest about experience gaps
  - Stay positive (don't badmouth previous employers)

### After the Interview
- **Immediately After**:
  - Ask about next steps and timeline
  - Thank interviewers
  - Note down questions you were asked (for future reference)
  
- **Within 24 Hours**:
  - Send thank-you email to each interviewer
  - Reiterate interest in position
  - Mention something specific from conversation
  - Keep it brief (3-4 sentences)


**Sample Thank-You Email**:

    Subject: Thank You - RN Position Interview

    Dear [Interviewer Name],

    Thank you for taking the time to speak with me today about the Registered Nurse position on the Medical-Surgical unit. I enjoyed learning about [specific detail from conversation, e.g., "the unit's focus on patient-centered care and the structured mentorship program for new hires"].

    Our discussion reinforced my enthusiasm for joining your team. My experience in [relevant background] aligns well with the unit's needs, and I'm excited about the opportunity to contribute.

    Please don't hesitate to contact me if you need any additional information. I look forward to hearing about next steps.

    Sincerely,
    [Your Name]
    [Phone Number]


## Common Mistakes to Avoid

❌ **Speaking negatively about previous employers** - Stay professional and focus on what you learned

❌ **Being unprepared for "Tell me about yourself"** - Have a 2-minute professional summary ready

❌ **Failing to ask questions** - Shows lack of interest; always prepare at least 2-3 questions

❌ **Not knowing your resume** - Be able to discuss everything on it in detail

❌ **Arriving late** - Plan for traffic; arrive 10-15 minutes early

❌ **Checking your phone** - Turn it off before entering the building

❌ **Rambling answers** - Use STAR method to stay focused and concise

❌ **No specific examples** - Vague answers don't demonstrate competence

❌ **Appearing desperate** - Show enthusiasm but maintain professionalism

❌ **Not following up** - Always send thank-you email within 24 hours

## For New Graduates

Special considerations for new grad nurses:

### Leverage What You Have
- **Clinical rotations**: Treat these as work experience in your examples
- **Simulation lab scenarios**: Valid examples of clinical judgment
- **Class projects**: Demonstrate teamwork and problem-solving
- **Healthcare volunteer work**: Shows commitment to field
- **Other work experience**: Transferable skills (customer service, time management)

### Questions You Might Face
- "You lack experience. Why should we hire you?"
  - **Answer**: Focus on strong clinical education, enthusiasm to learn, adaptability, and commitment to the profession. Mention specific clinical experiences that prepared you well.

- "How will you handle the transition from student to professional nurse?"
  - **Answer**: Discuss the importance of seeking mentorship, asking questions, using resources, and commitment to continuous learning.

### New Grad Programs
Seek positions offering:
- Structured orientation (minimum 8-12 weeks)
- Preceptorship model
- Regular check-ins with manager
- New grad cohort support
- Critical thinking development focus

## Conclusion

Interview preparation is as crucial as clinical preparation. By understanding common questions, practicing STAR method responses, researching salary data, and presenting yourself professionally, you position yourself as a strong candidate.

Remember:
- **Be authentic**: Don't memorize responses word-for-word
- **Be specific**: Use real examples from your experience
- **Be professional**: Even when discussing challenges
- **Be prepared**: Research, practice, plan
- **Be confident**: You've earned your credentials

The interview is your opportunity to showcase not just your clinical knowledge, but your critical thinking, communication skills, and commitment to excellent patient care.

## Next Steps

- **Research Salaries**: Know your worth with our [detailed salary data by state](/registered-nurse/salary)
- **Find Opportunities**: Browse [registered nurse job openings](/registered-nurse/jobs) to start applying
- **Review Skills**: Brush up on [essential RN skills](/registered-nurse/skills) employers look for
- **Prepare Your Path**: Review our [complete career guide](/registered-nurse/how-to-become) for comprehensive information

Good luck with your interview!
`;
}

export default async function RegisteredNurseInterviewPage({ params }: PageProps) {
    const { profession } = await params;
    const dbSlug = urlSlugToDbSlug(profession);
    const urls = getProfessionUrls(profession);

    // Fetch national salary for negotiation data
    const nationalData = await prisma.salaryData.findFirst({
        where: {
            careerKeyword: dbSlug,
            locationId: null,
            year: 2024
        }
    });

    // Fetch top paying states for salary context
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

    const salaryData = {
        national: nationalData?.annualMedian ? `$${Math.round(nationalData.annualMedian).toLocaleString()}` : '$93,600',
        topStates: topStatesData.map(s => ({
            state: s.location?.stateName || s.location?.state || '',
            salary: `$${Math.round(s.annualMedian || 0).toLocaleString()}`,
            stateCode: s.location?.state || ''
        }))
    };

    const content = generateRNInterviewContent(salaryData);

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            {/* Breadcrumbs */}
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Registered Nurse', href: '/registered-nurse' },
                    { label: 'Interview Guide' }
                ]}
                className="mb-6"
            />

            {/* Quick Prep Checklist */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">STAR Method</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Salary Data</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Questions to Ask</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium">Red Flags</p>
                </div>
            </div>

            <QuickNavigation profession={profession} currentPath="interview" />

            {/* Main Article Content */}
            <article className="prose prose-slate dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4">
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
                    {content}
                </ReactMarkdown>
            </article>

            {/* CTAs */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <DollarSign className="w-8 h-8 mb-4 text-blue-600" />
                        <h3 className="font-bold text-lg mb-2">Research Salaries</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Know your worth before negotiating
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
                        <Briefcase className="w-8 h-8 mb-4 text-green-600" />
                        <h3 className="font-bold text-lg mb-2">Find RN Jobs</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Start applying with confidence
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
