import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { QuickNavigation } from '@/components/ui/quick-navigation';
import { Heart, Clock, Battery, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getProfessionUrls } from '@/lib/url-utils';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        profession: string;
    };
}

const RN_WORK_LIFE_BALANCE_CONTENT = `
# Registered Nurse Work-Life Balance: Real Talk About Shift Schedules, Burnout & Wellness 2026

Work-life balance in nursing is not just a buzzword—it's a critical factor affecting your health, career longevity, and quality of patient care. With 72% of RNs reporting moderate to high burnout levels and 23% considering leaving the profession, understanding how to achieve balance while pursuing a nursing career has never been more important. This guide provides honest, data-driven insights into the realities of nursing work-life balance and actionable strategies to thrive in this demanding yet rewarding profession.

## The Current State of Nursing Work-Life Balance

### Burnout Statistics: The Reality

Recent data paints a concerning picture of nurse well-being:

**2024 Burnout Data:**
- **72% of RNs** experience moderate to high levels of burnout
- **23% of nurses** are considering leaving the profession
- **Nearly half** say work has negatively affected their mental health
- **60%+ of nurses** acknowledge feeling burnt out
- **Younger nurses (18-34)** are particularly susceptible to burnout

While burnout rates have decreased from pandemic peaks (81% in 2022 to 57% in 2023), they remain alarmingly high.

**Primary Contributors to Burnout:**
- Dissatisfaction with salary/wage increases (63%)
- Lack of responsive leadership (60%)
- Unequal work-life balance (54%)
- Feeling unheard (54%)
- Unmanageable workloads (54%)
- Being asked to cover extra shifts frequently (84%)
- Understaffed units (46.4%)
- Feeling unsupported by employers (39%)

### Job Satisfaction vs. Career Satisfaction

Interestingly, there's a disconnect between career satisfaction and current job satisfaction:

**Career Satisfaction:**
- **92%** of nurses are glad they entered the profession
- **73%** would choose nursing again
- **75%** report satisfaction with their career choice (2025)

**Current Job Satisfaction:**
- Only **60%** would choose nursing again when asked about their current role (2025)
- **58%** feel burned out most days despite career satisfaction
- **39%** plan to remain in current positions within the next year (indicating potential turnover)

This suggests many nurses love nursing but struggle with specific work environments or conditions.

## Understanding Shift Schedules

Shift schedules significantly impact work-life balance and are a major driver of burnout. Understanding different schedule types helps you make informed decisions about where to work.

### Common Nursing Shift Types

**12-Hour Shifts (Most Common in Hospitals)**

**Pros:**
- Work 3 days per week (36 hours) for full-time
- 4 days off per week
- Potential for self-scheduling
- Fewer total shifts per month
- Can pick up overtime for extra income

**Cons:**
- Long, exhausting days
- Difficult to maintain energy throughout 12 hours
- Family time limited on work days
- Commute time adds to exhaustion
- Hard to schedule appointments on work days

**8-Hour Shifts**

**Pros:**
- More manageable energy expenditure
- Better separation of work and personal time
- Easier to attend to personal needs before/after work
- Less physical exhaustion per shift

**Cons:**
- Work 5 days per week for full-time (40 hours)
- Only 2 days off per week
- More total commutes
- More difficult to schedule personal appointments

**Rotating Shifts (Days/Evenings/Nights)**

**Research-Backed Concerns:**
- Rotating shift work is **consistently linked to increased burnout**, particularly emotional exhaustion
- **Disrupts circadian rhythms**, negatively impacting sleep quality
- **Hinders physical and psychological recovery**
- Higher levels of emotional fatigue among nurses working irregular night/rotating shifts
- **Long-term health risks**: Sleep disturbances, mood disorders, decreased cognitive abilities, chronic fatigue

**Pros:**
- Some flexibility in schedule
- Shift differentials (evening/night pay premiums)
- Variety in routine

**Cons:**
- Body clock never stabilizes
- Sleep quality suffers significantly
- Increased burnout risk
- Difficultto maintain social/family commitments
- Higher health risks over time

**Night Shift (Permanently)**

**Pros:**
- Night differential pay (typically 10-25% premium)
- Often more autonomy (fewer administrators)
- Quieter patient environment in some settings
- May fit naturally for night owls
- Easier parking, less traffic

**Cons:**
- Sleeping during day is challenging (noise, daylight)
- Social isolation (opposite schedule from family/friends)
- Increased health risks with long-term night work
- Difficult to attend daytime appointments
- Vitamin D deficiency without sunlight exposure
- Compromised patient safety due to fatigue

### Schedule Types by Setting

**Hospital Acute Care:**
- Primarily 12-hour shifts (7a-7p, 7p-7a)
- Rotating weekends typical
- Holiday rotation required
- Self-scheduling in some facilities
- High likelihood of being called in for staffing needs

**Outpatient Clinics:**
- Typically 8-hour shifts, Monday-Friday
- Some weekend/evening clinics
- More predictable schedule
- Better work-life balance potential
- Fewer emergency situations

**Home Health:**
- Variable schedules
- Control over your own calendar (often)
- Travel between patients
- Potential for flexible start/end times
- Weekend/evening visits sometimes required

**Long-Term Care:**
- Mix of 8 and 12-hour shifts
- Often more flexible scheduling
- Slower pace than acute care
- Fewer emergencies

**School Nursing:**
- School hours (typically 7:30a-3:30p)
- Weekends and holidays off
- Summers off (may be paid or unpaid)
- Excellent work-life balance
- Lower pay than hospital nursing

**Occupational Health:**
- Typically Monday-Friday, business hours
- Employee wellness focus
- Corporate environment
- Predictable schedule
- Better work-life balance

## Work-Life Balance by Life Stage

### New Graduates (0-2 Years)

**Challenges:**
- Steep learning curve = high stress
- Often assigned least desirable shifts
- Low seniority = limited schedule control
- Still developing time management skills
- Student loan payments beginning

**Strategies:**
- Accept that first 1-2 years are hardest
- Focus on skill development
- Build strong peer support network
- Prioritize sleep on days off
- Set a timeline ("I'll do night shift for 2 years to gain experience")

**Best Settings for Balance:**
- New grad residency programs (structured support)
- Day shift positions if available
- Facilities with strong orientation programs
- Med-surg or telemetry for broad experience

### Mid-Career with Young Children (3-10 Years)

**Challenges:**
- Childcare coordination with shift work
- Missing family events due to schedule
- Guilt about time away from children
- Difficulty finding reliable childcare for nights/weekends
- Balancing work demands with parenting

**Strategies:**
- Seek positions with self-scheduling
- Consider part-time (24-32 hours)
- Outpatient or school nursing for family-friendly hours
- PRN positions for maximum flexibility
- Partner with spouse/family for childcare coverage
- Use 12-hour shifts to maximize days off with family

**Best Settings for Balance:**
- Outpatient clinics (M-F schedule)
- School nursing (matches children's schedule)
- Home health (schedule flexibility)
- Part-time hospital positions
- Occupational health

### Mid-Career without Children (3-10 Years)

**Challenges:**
- Maintaining personal relationships
- Pursuit of hobbies/interests
- Burnout from chronic understaffing
- Pressure to always pick up extra shifts

**Strategies:**
- Set firm boundaries on extra shifts
- Block off "me time" consistently
- Travel nursing for variety and adventure
- Take advantage of PTO fully
- Pursue specialty certifications for career growth

**Best Settings for Balance:**
- Any setting that matches your interests
- Travel nursing for adventure
- Specialty areas for intellectual stimulation
- Leadership roles if interested

### Late Career (10+ Years)

**Challenges:**
- Physical demands becoming harder
- Potential for accumulated burnout
- May be supporting aging parents
- Financial pressure as retirement approaches

**Strategies:**
- Transition to less physically demanding specialties
- Leadership or education roles
- Case management, utilization review
- Reduce to part-time if financially feasible
- Set firm retirement timeline

**Best Settings for Balance:**
- Case management
- Nurse educator positions
- Informatics
- Quality improvement
- Outpatient settings

## Strategies for Achieving Work-Life Balance

### 1. Set Clear Boundaries

**At Work:**
- Don't consistently stay late off the clock
- Say no to extra shifts when you need rest
- Take your full lunch break
- Delegate appropriately to nursing assistants
- Leave work at work (mentally)

**Sample Scripts:**
- "I appreciate you thinking of me, but I can't pick up that shift. I have personal commitments."
- "I need to leave on time today. I've documented everything thoroughly for the next nurse."

### 2. Prioritize Self-Care

**Physical Health:**
- Maintain regular sleep schedule as much as possible
- Exercise 3-4 times per week (even 20 minutes helps)
- Eat nutritious meals (meal prep on days off)
- Stay hydrated during shifts
- Regular primary care visits

**Mental Health:**
- Therapy or counseling (many employers offer EAP)
- Mindfulness or meditation practices
- Hobbies unrelated to healthcare
- Social connections outside of nursing
- Professional boundaries with patients

**Warning Signs to Watch:**
- Dreading work days
- Physical symptoms (headaches, stomach issues, insomnia)
- Emotional numbness or crying frequently
- Substance use to cope
- Thoughts of harming self or others

**When to Seek Help:**
- If warning signs persist >2 weeks
- If affecting relationships or daily function
- Employee Assistance Programs (EAP) offer confidential counseling
- National Suicide Prevention Lifeline: 988

### 3. Choose Your Work Environment Wisely

**Questions to Ask Potential Employers:**
- "What is the typical nurse-to-patient ratio?"
- "How does self-scheduling work here?"
- "What is the turnover rate for this unit?"
- "How are concerns addressed by leadership?"
- "What support exists for work-life balance?"
- "Are there wellness programs for staff?"

**Red Flags:**
- Vague answers about staffing
- High turnover rates
- Constant overtime required
- Leadership dismissive of concerns
- No mention of staff support

### 4. Utilize Flexible Work Arrangements

**Options to Explore:**
- **Per Diem (PRN)**: Pick your own shifts, higher hourly pay, no benefits typically
- **Part-time**: 24-32 hours per week, often with benefits
- **Job sharing**: Share full-time position with another nurse
- **Weekend option**: Work only weekends for full-time pay (some facilities offer)
- **Float pool**: Variety in units but often more flexibility in scheduling

**2025 Data**: 81% of nurses say flexible schedules would improve working conditions

### 5. Plan Your Exit Strategy

It's okay to leave nursing, change specialties, or take breaks.

**Alternative Paths:**
- Different specialty (if current draining you)
- Non-bedside nursing (case management, informatics, education)
- Travel nursing (change of scenery)
- Per diem while exploring other interests
- Complete career change (your nursing skills are transferable)

**Sabbatical Considerations:**
- Some facilities offer unpaid leave
- Time to recover from burnout
- Maintain license through continuing education
- Plan financially for time without income

## Work Environment Factors Beyond Your Control

Understanding systemic issues helps you avoid self-blame:

### Nursing Shortage

**2025 Projections**: Nursing shortage exceeds 500,000 RNs in the U.S., leading to:
- Increased workloads for current staff
- Pressure to work overtime
- Higher nurse-to-patient ratios
- Increased burnout

**What You Can Do:**
- Advocate for safe staffing through professional organizations
- Choose facilities committed to adequate staffing
- Set personal limits despite pressure

### Patient Acuity Increase

Modern hospital patients are sicker due to:
- Shorter hospital stays
- Complex chronic conditions
- Outpatient management of less acute patients

**Impact**: Higher stress, more complex care needs, less time for each patient

**What You Can Do:**
- Develop prioritization skills (focus on critical needs)
- Utilize the healthcare team (delegate)
- Recognize you can only do your best

### Workplace Violence

**Alarming Statistics:**
- **75%** of nurses report verbal abuse from patients
- **87%** report physical abuse from patients 
- **48%** experienced emotional abuse from managers
- **46%** from coworkers

**What You Can Do:**
- Report all incidents formally
- Support violence prevention initiatives
- Know your facility's safety protocols
- Don't tolerate abuse—patient or colleague
- Seek facilities with strong safety cultures

## Making Work-Life Balance Decisions

### Scenario 1: High Pay vs. Better Schedule

**Choice**: ICU night shift ($95K) vs. Outpatient clinic Monday-Friday ($75K)

**Considerations:**
- Life stage (young children vs. childless)
- Financial needs (student loans, mortgage)
- Health status (can you handle nights?)
- Career goals (ICU experience valuable for CRNA/critical care NP)
- Personal values (money vs. time)

**There's no wrong answer**—only what works for YOUR life right now

### Scenario 2: Career Advancement vs. Personal Life

**Choice**: Manager position (salary, M-F but 50+ hours) vs. Staff nurse (hourly, set hours, less stress)

**Considerations:**
- Career aspirations
- Family situation
- Financial goals
- Stress tolerance
- Leadership interest

**Reality**: Some seasons of life favor career focus, others favor personal life. Both are valid.

### Scenario 3: Staying vs. Leaving Toxic Environment

**Signs of Toxic Environment:**
- Chronic understaffing with no improvement plan
- Leadership that ignores safety concerns
- High turnover
- Bullying culture
- No support for work-life balance

**Action Steps:**
1. Document concerns
2. Attempt to address through proper channels
3. Set a timeline for improvement
4. **If no change, leave**—your health matters more

**Reality**: You can't fix systemic problems alone. It's not giving up to protect yourself.

## Creating Your Personal Work-Life Balance Plan

### Step 1: Assess Current State

**Rate 1-10:**
- Physical health: ___
- Mental/emotional health: ___
- Relationship satisfaction: ___
- Job satisfaction: ___
- Financial stability: ___
- Personal fulfillment: ___

**Areas scoring <6 need attention**

### Step 2: Identify Non-Negotiables

**Examples:**
- "I must have 2 consecutive days off per week"
- "I won't work >48 hours per week short-term or >40 long-term"
- "I need to be home for my kids' bedtime at least 4 nights/week"
- "I must have time for exercise 4x/week"

### Step 3: Identify Temporary vs. Permanent Needs

**Temporary** (1-3 years):
- "I'm willing to work nights to pay off loans quickly"
- "I'll work extra while pursuing my MSN"
- "I can handle a tough schedule while single"

**Permanent** (Long-term lifestyle):
- "I need weekends off for my kids' activities"
- "I can't sustain night shift past age 35"
- "I need intellectual stimulation in my role"

### Step 4: Create Action Plan

**If Currently Imbalanced:**
- **Immediate** (this month): Set one boundary, use all PTO, seek counseling if needed
- **Short-term** (3-6 months): Investigate alternative schedules/units/facilities
- **Long-term** (1 year): Pursue education for different role, change specialties, or leave nursing if needed

**If Currently Balanced:**
- **Maintain**: Guard your boundaries, reassess quarterly
- **Prepare**: Have backup plan if situation changes
- **Advocate**: Help create balance for colleagues

## Conclusion

Work-life balance in nursing is achievable, but it requires intentionality, boundary-setting, and sometimes difficult decisions. With 72% of nurses experiencing burnout, the challenge is real—but so are the solutions.

**Key Takeaways:**

1. **Your Health Comes First**: You can't care for others if you're depleted
2. **Balance Looks Different for Everyone**: Don't compare your chapter 1 to someone else's chapter 10
3. **It's Okay to Change Paths**: Specialties, facilities, or even leaving nursing
4. **Set Boundaries**: Saying no to extra shifts isn't selfish
5. **The Right Fit Exists**: Keep looking for work environments that support your needs
6. **Advocate for Change**: Support safe staffing legislation and workplace wellness initiatives

Remember: The nursing profession needs you long-term. Protecting your well-being ensures you can sustain a career you love.

## Resources

**Mental Health Support:**
- National Suicide Prevention Lifeline: 988
- Employee Assistance Programs (EAP) through your employer
- American Nurses Association Health Risk Appraisal: [nursingworld.org](https://www.nursingworld.org)

**Professional Organizations:**
- American Nurses Association (ANA)
- State nurses associations
- Specialty professional organizations

**Work-Life Balance Initiatives:**
- Healthy Nurse, Healthy Nation (ANA initiative)
- Workplace wellness programs through your employer

## Next Steps

- **Evaluate Current Role**: Use our [career path guide](/registered-nurse/career-path) to explore alternative specialties
- **Research Salaries**: Compare compensation across settings with our [salary data](/registered-nurse/salary)
- **Find Better Fit**: Browse [registered nurse opportunities](/registered-nurse/jobs) with work-life balance
- **Develop Skills**: Review [essential RN skills](/registered-nurse/skills) for career transitions
`;

export default async function RegisteredNurseWorkLifeBalancePage({ params }: PageProps) {
    const { profession } = await params;
    const urls = getProfessionUrls(profession);

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Registered Nurse', href: '/registered-nurse' },
                    { label: 'Work-Life Balance' }
                ]}
                className="mb-6"
            />

            {/* Work-Life Balance Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">Shift Schedules</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <p className="text-sm font-medium">Burnout Stats</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Self-Care</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <Battery className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Strategies</p>
                </div>
            </div>

            <QuickNavigation profession={profession} currentPath="work-life-balance" />

            {/* Alert Card */}
            <Card className="mb-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-lg mb-2">Burnout is Real—You're Not Alone</h3>
                            <p className="text-sm text-muted-foreground">
                                With 72% of RNs reporting moderate to high burnout, you're not weak or failing if
                                you're struggling. This guide provides honest, research-backed strategies to protect
                                your well-being while pursuing a nursing career you love.
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
                    {RN_WORK_LIFE_BALANCE_CONTENT}
                </ReactMarkdown>
            </article>

            {/* CTAs */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <CheckCircle2 className="w-8 h-8 mb-4 text-blue-600" />
                        <h3 className="font-bold text-lg mb-2">Explore Better Options</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Find roles with work-life balance in mind
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.jobs}>
                                Browse Jobs <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                        <Heart className="w-8 h-8 mb-4 text-green-600" />
                        <h3 className="font-bold text-lg mb-2">Consider Career Change</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Explore specialties with better work-life fit
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={urls.careerPath}>
                                View Career Paths <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
