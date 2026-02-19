import {
    Stethoscope, BookOpen, FlaskConical, ShieldCheck, Heart, Brain,
    MessageCircle, Clock, Zap, Activity, Syringe, Clipboard,
    Monitor, BedDouble, Home, School, Building2, Briefcase,
    DollarSign, Gift, GraduationCap, Plane, Wallet, CalendarDays,
    HeartPulse, Microscope
} from 'lucide-react';
import Link from 'next/link';

/* ─── Shared colors ─── */
const C = {
    navy: '#003554',
    ocean: '#006494',
    blue: '#0582CA',
    cyan: '#00A6FB',
    gold: '#FFC300',
    text: '#4A5568',
    muted: '#6B7280',
};

/* ═══════════════════════════════════════════════════════════════
   1. WorkEnvironmentChart
   CSS-only horizontal bar chart showing RN work settings + %
   ═══════════════════════════════════════════════════════════════ */

const workEnvData = [
    { label: 'Hospitals', pct: 60, desc: 'Acute care, ED, ICU, surgical, specialty', icon: Activity, color: '#0582CA' },
    { label: 'Ambulatory Care', pct: 18, desc: 'Physician offices, outpatient clinics', icon: Stethoscope, color: '#006494' },
    { label: 'Long-term Care', pct: 7, desc: 'Nursing homes, rehab centers', icon: BedDouble, color: '#00A6FB' },
    { label: 'Home Healthcare', pct: 6, desc: "Providing care in patients' homes", icon: Home, color: '#003554' },
    { label: 'Schools & Public Health', pct: 5, desc: 'School nursing, community programs', icon: School, color: '#FFC300' },
    { label: 'Other Settings', pct: 4, desc: 'Insurance, pharma, research, education', icon: Building2, color: '#6B7280' },
];

export function WorkEnvironmentChart() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0582CA] to-[#00A6FB] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Where RNs Work</h4>
                    <p className="text-sm text-[#6B7280]">Distribution across healthcare settings</p>
                </div>
            </div>

            <div className="space-y-4">
                {workEnvData.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} className="group">
                            <div className="flex items-center gap-3 mb-1.5">
                                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                                <span className="text-sm font-semibold text-[#003554] flex-1">{item.label}</span>
                                <span className="text-sm font-bold tabular-nums" style={{ color: item.color }}>{item.pct}%</span>
                            </div>
                            <div className="relative h-3 rounded-full bg-[#F0F4F8] overflow-hidden ml-7">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                                    style={{ width: `${item.pct}%`, backgroundColor: item.color, opacity: 0.85 }}
                                />
                            </div>
                            <p className="text-xs text-[#6B7280] mt-1 ml-7">{item.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   2. CurriculumGrid
   Two-column tag grid: Sciences vs Nursing courses
   ═══════════════════════════════════════════════════════════════ */

const scienceCourses = ['Anatomy & Physiology', 'Microbiology', 'Chemistry', 'Nutrition', 'Psychology'];
const nursingCourses = [
    'Fundamentals of Nursing', 'Pharmacology', 'Pathophysiology', 'Health Assessment',
    'Medical-Surgical', 'Maternal-Child', 'Pediatrics', 'Psych-Mental Health', 'Community Health'
];

export function CurriculumGrid() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006494] to-[#003554] flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Curriculum at a Glance</h4>
                    <p className="text-sm text-[#6B7280]">Core coursework in nursing programs</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Sciences column */}
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <FlaskConical className="w-5 h-5 text-emerald-600" />
                        <h5 className="font-bold text-[#003554]">Foundational Sciences</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {scienceCourses.map(c => (
                            <span key={c} className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-sm text-emerald-800 font-medium shadow-sm">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Nursing column */}
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <HeartPulse className="w-5 h-5 text-blue-600" />
                        <h5 className="font-bold text-[#003554]">Nursing Theory & Practice</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {nursingCourses.map(c => (
                            <span key={c} className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-blue-200 text-sm text-blue-800 font-medium shadow-sm">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <p className="mt-4 text-sm text-[#6B7280] italic">
                Plus 500-1,000 hours of supervised clinical rotations across various healthcare settings.
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   3. ExamInfoCard
   Styled 2x2 info card for NCLEX-RN exam details
   ═══════════════════════════════════════════════════════════════ */

export function ExamInfoCard() {
    const stats = [
        { label: 'Format', value: '75-145 Questions', sub: 'Computerized Adaptive', icon: Monitor },
        { label: 'Duration', value: 'Up to 5 Hours', sub: 'Timed exam', icon: Clock },
        { label: 'Pass Rate', value: '~85%', sub: 'First-time U.S. grads', icon: ShieldCheck },
        { label: 'Cost', value: '$200+', sub: 'Plus state fees', icon: DollarSign },
    ];

    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003554] to-[#006494] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">NCLEX-RN at a Glance</h4>
                    <p className="text-sm text-[#6B7280]">National licensure exam essentials</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-4 text-center">
                            <Icon className="w-5 h-5 mx-auto mb-2 text-[#0582CA]" />
                            <div className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">{s.label}</div>
                            <div className="text-lg font-bold text-[#003554]">{s.value}</div>
                            <div className="text-xs text-[#6B7280] mt-0.5">{s.sub}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   4. SkillsGrid
   2x3 grid of icon cards for RN soft skills
   ═══════════════════════════════════════════════════════════════ */

const softSkills = [
    { name: 'Critical Thinking', desc: 'Analyze data, prioritize care, anticipate complications', icon: Brain, color: '#0582CA' },
    { name: 'Communication', desc: 'Clear verbal/written skills with patients and teams', icon: MessageCircle, color: '#006494' },
    { name: 'Emotional Intelligence', desc: 'Empathy, compassion, professional boundaries', icon: Heart, color: '#E74C3C' },
    { name: 'Time Management', desc: 'Organize multiple patients with competing needs', icon: Clock, color: '#FFC300' },
    { name: 'Adaptability', desc: 'Adjust to new tech, protocols, and situations rapidly', icon: Zap, color: '#00A6FB' },
    { name: 'Clinical Judgment', desc: 'Evidence-based decisions under pressure', icon: Stethoscope, color: '#003554' },
];

export function SkillsGrid() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A6FB] to-[#0582CA] flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Essential Soft Skills</h4>
                    <p className="text-sm text-[#6B7280]">Non-clinical skills every RN needs</p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {softSkills.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.name} className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                                </div>
                                <h5 className="text-sm font-bold text-[#003554]">{s.name}</h5>
                            </div>
                            <p className="text-xs text-[#6B7280] leading-relaxed">{s.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   5. SpecializationsTable
   Styled table for RN certifications
   ═══════════════════════════════════════════════════════════════ */

const specializations = [
    { specialty: 'Critical Care', code: 'CCRN', org: 'AACN' },
    { specialty: 'Emergency Nursing', code: 'CEN', org: 'BCEN' },
    { specialty: 'Oncology', code: 'OCN', org: 'ONCC' },
    { specialty: 'Pediatrics', code: 'CPN', org: 'PNCB' },
    { specialty: 'Operating Room', code: 'CNOR', org: 'CCI' },
    { specialty: 'Cardiac Care', code: 'CMC', org: 'AACN' },
];

export function SpecializationsTable() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC300] to-[#FFD54F] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#003554]" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Nursing Specializations</h4>
                    <p className="text-sm text-[#6B7280]">Advanced certifications for experienced RNs (1-2 years experience required)</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#003554]">
                            <th className="px-5 py-3 text-sm font-semibold text-white">Specialty</th>
                            <th className="px-5 py-3 text-sm font-semibold text-white">Certification</th>
                            <th className="px-5 py-3 text-sm font-semibold text-white">Credentialing Org</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specializations.map((s, i) => (
                            <tr key={s.code} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'} hover:bg-blue-50/50 transition-colors`}>
                                <td className="px-5 py-3 text-sm text-[#003554] font-medium">{s.specialty}</td>
                                <td className="px-5 py-3">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#003554]/10 text-[#003554] text-xs font-bold tracking-wider">
                                        {s.code}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-sm text-[#6B7280]">{s.org}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   6. SalaryByExperienceTable
   Table showing salary progression by experience level
   ═══════════════════════════════════════════════════════════════ */

const experienceLevels = [
    { level: 'New Graduate', years: '0-2 yrs', range: '$60,000 - $75,000', note: 'Varies by location & setting', barPct: 50 },
    { level: 'Mid-Career', years: '3-7 yrs', range: '$75,000 - $95,000', note: 'Shift differentials + specialty pay', barPct: 65 },
    { level: 'Experienced', years: '8-15 yrs', range: '$85,000 - $110,000', note: 'Leadership & specialization', barPct: 80 },
    { level: 'Senior / Advanced', years: '15+ yrs', range: '$95,000 - $130,000+', note: 'Management & advanced practice', barPct: 95 },
];

export function SalaryByExperienceTable() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0582CA] to-[#00A6FB] flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Salary by Experience Level</h4>
                    <p className="text-sm text-[#6B7280]">Average annual salary ranges</p>
                </div>
            </div>

            <div className="space-y-4">
                {experienceLevels.map((lvl) => (
                    <div key={lvl.level} className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div>
                                <span className="text-sm font-bold text-[#003554]">{lvl.level}</span>
                                <span className="text-xs text-[#6B7280] ml-2 bg-[#E5E7EB] px-2 py-0.5 rounded-full">{lvl.years}</span>
                            </div>
                            <span className="text-sm font-bold text-[#0582CA]">{lvl.range}</span>
                        </div>
                        <div className="relative h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0582CA] to-[#00A6FB]"
                                style={{ width: `${lvl.barPct}%` }}
                            />
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1.5">{lvl.note}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   7. BenefitsGrid
   Icon + label chip grid for additional compensation
   ═══════════════════════════════════════════════════════════════ */

const benefits = [
    { label: 'Shift Differentials', detail: '10-25% premium', icon: Clock },
    { label: 'Sign-on Bonus', detail: '$5k-$20k', icon: Gift },
    { label: 'Relocation Help', detail: 'Moving assistance', icon: Plane },
    { label: 'Tuition Reimbursement', detail: 'Continuing education', icon: GraduationCap },
    { label: 'Retirement Match', detail: '401(k) / 403(b)', icon: Wallet },
    { label: 'Health Insurance', detail: 'Medical + dental', icon: HeartPulse },
    { label: 'Paid Time Off', detail: '3-4 weeks/year', icon: CalendarDays },
];

export function BenefitsGrid() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC300] to-[#FFD54F] flex items-center justify-center">
                    <Gift className="w-5 h-5 text-[#003554]" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Benefits & Compensation Perks</h4>
                    <p className="text-sm text-[#6B7280]">Common benefits offered to nursing positions</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {benefits.map((b) => {
                    const Icon = b.icon;
                    return (
                        <div key={b.label} className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-3.5 text-center hover:shadow-sm transition-shadow">
                            <Icon className="w-5 h-5 mx-auto mb-2 text-[#0582CA]" />
                            <div className="text-xs font-bold text-[#003554] mb-0.5">{b.label}</div>
                            <div className="text-[11px] text-[#6B7280]">{b.detail}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
