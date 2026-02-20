'use client';

import {
    Shield, Clock, CheckCircle, FileText, MapPin, RefreshCw,
    BookOpen, Award, Zap, Globe, X, AlertTriangle
} from 'lucide-react';

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
   1. NCLEXOverviewCard
   4-stat info panel for NCLEX-RN exam format
   ═══════════════════════════════════════════════════════════════ */

export function NCLEXOverviewCard() {
    const stats = [
        { label: 'Questions', value: '75–145', sub: 'Adaptive difficulty', icon: FileText },
        { label: 'Time Limit', value: '5 Hours', sub: 'Maximum duration', icon: Clock },
        { label: 'Format', value: 'CAT', sub: 'Computer-adaptive test', icon: Zap },
        { label: 'Exam Fee', value: '$200', sub: '+ state board fees', icon: Award },
    ];

    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm not-prose">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003554] to-[#006494] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">NCLEX-RN at a Glance</h4>
                    <p className="text-sm text-[#6B7280]">National licensure examination essentials</p>
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

            {/* Content breakdown bar */}
            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
                <p className="text-xs font-semibold text-[#003554] mb-3 uppercase tracking-wider">Content Distribution</p>
                <div className="space-y-2.5">
                    {[
                        { area: 'Physiological Integrity', pct: 50, color: '#0582CA' },
                        { area: 'Safe & Effective Care', pct: 32, color: '#006494' },
                        { area: 'Health Promotion', pct: 9, color: '#00A6FB' },
                        { area: 'Psychosocial Integrity', pct: 9, color: '#FFC300' },
                    ].map(item => (
                        <div key={item.area} className="flex items-center gap-3">
                            <span className="text-xs text-[#4A5568] w-40 flex-shrink-0">{item.area}</span>
                            <div className="flex-1 h-2.5 rounded-full bg-[#F0F4F8] overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                            </div>
                            <span className="text-xs font-bold tabular-nums w-8 text-right" style={{ color: item.color }}>{item.pct}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   2. NCLEXPassRatesCard
   Visual stats card for pass rates + prep
   ═══════════════════════════════════════════════════════════════ */

export function NCLEXPassRatesCard() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm not-prose">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">NCLEX Pass Rates & Preparation</h4>
                    <p className="text-sm text-[#6B7280]">2024 national statistics</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Pass rates */}
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5">
                    <h5 className="font-bold text-[#003554] mb-4">Pass Rates</h5>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-[#4A5568]">First-time test takers</span>
                                <span className="text-sm font-bold text-emerald-600">~87%</span>
                            </div>
                            <div className="h-3 rounded-full bg-emerald-100 overflow-hidden">
                                <div className="h-full rounded-full bg-emerald-500" style={{ width: '87%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-[#4A5568]">Repeat test takers</span>
                                <span className="text-sm font-bold text-amber-600">~45%</span>
                            </div>
                            <div className="h-3 rounded-full bg-amber-100 overflow-hidden">
                                <div className="h-full rounded-full bg-amber-500" style={{ width: '45%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prep timeline */}
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-5">
                    <h5 className="font-bold text-[#003554] mb-4">Preparation Guide</h5>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-[#0582CA] flex-shrink-0" />
                            <span className="text-sm text-[#4A5568]"><strong className="text-[#003554]">6-8 weeks</strong> recommended study</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-[#0582CA] flex-shrink-0" />
                            <span className="text-sm text-[#4A5568]"><strong className="text-[#003554]">3-4 hours/day</strong> study time</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <RefreshCw className="w-4 h-4 text-[#0582CA] flex-shrink-0" />
                            <span className="text-sm text-[#4A5568]"><strong className="text-[#003554]">45-day</strong> wait between retakes</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-[#0582CA] flex-shrink-0" />
                            <span className="text-sm text-[#4A5568]"><strong className="text-[#003554]">48-hour</strong> Quick Pass results ($7.95)</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-blue-200">
                        <p className="text-xs text-[#6B7280]"><strong>Popular prep:</strong> UWorld, Kaplan, Hurst Review, NCSBN</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   3. CompactStatesGrid
   Tag cloud of NLC compact vs non-compact states
   ═══════════════════════════════════════════════════════════════ */

const compactStates = [
    'Alabama', 'Arizona', 'Arkansas', 'Colorado', 'Delaware', 'Florida', 'Georgia',
    'Idaho', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'New Hampshire',
    'New Jersey', 'New Mexico', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming', 'Guam', 'U.S. Virgin Islands', 'N. Mariana Islands'
];

const nonCompactStates = [
    'Alaska', 'California', 'Connecticut', 'D.C.', 'Hawaii', 'Illinois',
    'Massachusetts', 'Michigan', 'Minnesota', 'Nevada', 'New York', 'Oregon', 'Puerto Rico'
];

export function CompactStatesGrid() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm not-prose">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0582CA] to-[#00A6FB] flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Nurse Licensure Compact (NLC) States</h4>
                    <p className="text-sm text-[#6B7280]">43 compact jurisdictions as of 2024</p>
                </div>
            </div>

            {/* Compact states */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-700">Compact States ({compactStates.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {compactStates.map(s => (
                        <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            {/* Non-compact */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <X className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-bold text-red-600">Non-Compact States ({nonCompactStates.length})</span>
                    <span className="text-xs text-[#6B7280]">— require separate license</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {nonCompactStates.map(s => (
                        <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   4. EndorsementChecklist
   Styled checklist for endorsement requirements
   ═══════════════════════════════════════════════════════════════ */

const endorsementReqs = [
    { text: 'Active, unencumbered RN license in another U.S. jurisdiction', icon: Award },
    { text: 'Verification of original license (via Nursys.com or paper)', icon: FileText },
    { text: 'Graduation from approved nursing program', icon: BookOpen },
    { text: 'Passed NCLEX-RN (no need to retake!)', icon: CheckCircle },
    { text: 'Criminal background check and fingerprinting', icon: Shield },
    { text: 'Application fees ($50–$400 depending on state)', icon: Award },
    { text: 'Continuing education (some states require CEUs)', icon: RefreshCw },
];

export function EndorsementChecklist() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm not-prose">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC300] to-[#FFD54F] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#003554]" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Endorsement Requirements</h4>
                    <p className="text-sm text-[#6B7280]">Typical requirements for transferring your license</p>
                </div>
            </div>

            <div className="space-y-3">
                {endorsementReqs.map((req, i) => {
                    const Icon = req.icon;
                    return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]">
                            <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-sm text-[#4A5568]">{req.text}</span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-[#006494]">
                    <strong>Processing Time:</strong> 2–8 weeks typically (can be expedited in some states for additional fee)
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   5. RenewalFrequencyCards
   Visual cards for renewal periods by state type
   ═══════════════════════════════════════════════════════════════ */

export function RenewalFrequencyCards() {
    const periods = [
        { freq: 'Every Year', states: 'Arkansas, California', color: '#E74C3C', bgColor: '#FEF2F2', borderColor: '#FECACA' },
        { freq: 'Every 2 Years', states: 'Most states (majority)', color: '#0582CA', bgColor: '#EFF6FF', borderColor: '#BFDBFE' },
        { freq: 'Every 3 Years', states: 'Indiana', color: '#006494', bgColor: '#F0FDFA', borderColor: '#99F6E4' },
        { freq: 'Every 4 Years', states: 'Mississippi', color: '#003554', bgColor: '#F5F3FF', borderColor: '#C4B5FD' },
    ];

    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm not-prose">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006494] to-[#003554] flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">License Renewal Periods</h4>
                    <p className="text-sm text-[#6B7280]">Renewal frequency varies by state • Fees: $50–$150</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {periods.map(p => (
                    <div key={p.freq} className="rounded-xl p-4 text-center border" style={{ backgroundColor: p.bgColor, borderColor: p.borderColor }}>
                        <div className="text-2xl font-bold mb-1" style={{ color: p.color }}>
                            {p.freq.split(' ')[1]}
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: p.color }}>
                            {p.freq.split(' ')[0]} {p.freq.split(' ').slice(2).join(' ')}
                        </div>
                        <div className="text-xs text-[#6B7280]">{p.states}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   6. CompactComparisonTable
   Styled comparison: Compact vs Single-State license
   ═══════════════════════════════════════════════════════════════ */

const comparisonRows = [
    { feature: 'Practice Area', compact: 'All 43 compact states', single: 'Only issuing state', compactWin: true },
    { feature: 'Telehealth', compact: 'All 43 compact states', single: 'Only issuing state', compactWin: true },
    { feature: 'Cost', compact: 'One application fee', single: 'Separate fee per state', compactWin: true },
    { feature: 'Renewal', compact: 'Renew only in primary state', single: 'Renew in each state', compactWin: true },
    { feature: 'Requirement', compact: 'Must reside in compact state', single: 'Any state', compactWin: false },
    { feature: 'Travel Nursing', compact: 'Work anywhere compact', single: 'License per state needed', compactWin: true },
];

export function CompactComparisonTable() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm not-prose">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0582CA] to-[#006494] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Compact vs. Single-State License</h4>
                    <p className="text-sm text-[#6B7280]">Side-by-side comparison</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#003554]">
                            <th className="px-5 py-3 text-sm font-semibold text-white">Feature</th>
                            <th className="px-5 py-3 text-sm font-semibold text-white">
                                <span className="flex items-center gap-1.5">✅ Multistate (Compact)</span>
                            </th>
                            <th className="px-5 py-3 text-sm font-semibold text-white">Single-State</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonRows.map((row, i) => (
                            <tr key={row.feature} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'} hover:bg-blue-50/50 transition-colors`}>
                                <td className="px-5 py-3 text-sm text-[#003554] font-medium">{row.feature}</td>
                                <td className="px-5 py-3 text-sm">
                                    <span className={row.compactWin ? 'text-emerald-700 font-medium' : 'text-[#4A5568]'}>
                                        {row.compact}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <span className={!row.compactWin ? 'text-emerald-700 font-medium' : 'text-[#6B7280]'}>
                                        {row.single}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                    <strong>Important:</strong> Even with a multistate license, you must follow the nursing practice laws of the state WHERE YOU ARE PRACTICING, not your home state.
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   7. LicenseStepsTimeline
   Visual timeline for next steps to get licensed
   ═══════════════════════════════════════════════════════════════ */

const licenseSteps = [
    { step: 1, title: 'Determine Your State', desc: 'Where will your primary residence be?', color: '#0582CA' },
    { step: 2, title: 'Check Compact Status', desc: 'Is it an NLC state?', color: '#006494' },
    { step: 3, title: 'Review Requirements', desc: 'Visit state Board of Nursing website', color: '#003554' },
    { step: 4, title: 'Apply for Licensure', desc: 'Submit application after graduating', color: '#00A6FB' },
    { step: 5, title: 'Register for NCLEX', desc: 'After receiving ATT', color: '#0582CA' },
    { step: 6, title: 'Prepare for NCLEX', desc: '6-8 weeks recommended study', color: '#006494' },
    { step: 7, title: 'Take NCLEX', desc: 'Schedule and pass exam', color: '#003554' },
    { step: 8, title: 'Receive License', desc: 'Typically 1-2 weeks after passing', color: '#FFC300' },
];

export function LicenseStepsTimeline() {
    return (
        <div className="my-8 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm not-prose">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003554] to-[#006494] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#003554]">Your RN Licensure Roadmap</h4>
                    <p className="text-sm text-[#6B7280]">8 steps from graduation to licensed RN</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {licenseSteps.map(s => (
                    <div key={s.step} className="relative rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3"
                            style={{ backgroundColor: s.color }}
                        >
                            {s.step}
                        </div>
                        <h5 className="text-sm font-bold text-[#003554] mb-1">{s.title}</h5>
                        <p className="text-xs text-[#6B7280]">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
