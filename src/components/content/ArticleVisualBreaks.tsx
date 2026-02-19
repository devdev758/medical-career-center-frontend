import Link from 'next/link';
import {
    GraduationCap, DollarSign, Briefcase, Clock, TrendingUp,
    MapPin, BookOpen, Search, Award, Rocket, ArrowRight
} from 'lucide-react';

/* ─── Color Palette (from design_kit.md) ─── */
const C = {
    navy: '#003554',
    ocean: '#006494',
    blue: '#0582CA',
    cyan: '#00A6FB',
    gold: '#FFC300',
    text: '#4A5568',
    muted: '#6B7280',
    bg: '#F8FAFC',
    border: '#E5E7EB',
};

/* ═══════════════════════════════════════════════════════════════
   1. EducationPathwayCard
   Three-column comparison of ADN / BSN / Direct-Entry Masters
   ═══════════════════════════════════════════════════════════════ */

const pathways = [
    {
        title: 'ADN',
        subtitle: 'Associate Degree',
        duration: '2-3 years',
        cost: '$6k-$40k',
        bestFor: 'Fastest entry into workforce',
        icon: Clock,
        color: C.cyan,
        bgColor: 'bg-sky-50',
        borderColor: 'border-sky-200',
    },
    {
        title: 'BSN',
        subtitle: 'Bachelor of Science',
        duration: '4 years',
        cost: '$40k-$100k+',
        bestFor: 'Best career advancement',
        icon: GraduationCap,
        color: C.blue,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        recommended: true,
    },
    {
        title: 'Direct-Entry MSN',
        subtitle: "Master's Program",
        duration: '2-3 years',
        cost: '$50k-$120k',
        bestFor: "Career changers with a bachelor's",
        icon: Award,
        color: C.navy,
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
    },
];

export function EducationPathwayCard() {
    return (
        <div className="my-10 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003554] to-[#0582CA] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#003554]">Compare Education Pathways</h3>
                    <p className="text-sm text-[#6B7280]">Three routes lead to RN licensure</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {pathways.map((p) => {
                    const Icon = p.icon;
                    return (
                        <div
                            key={p.title}
                            className={`relative rounded-xl ${p.bgColor} ${p.borderColor} border p-5 transition-shadow hover:shadow-md`}
                        >
                            {p.recommended && (
                                <span className="absolute -top-2.5 right-4 bg-[#FFC300] text-[#003554] text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                    Recommended
                                </span>
                            )}
                            <Icon className="w-6 h-6 mb-3" style={{ color: p.color }} />
                            <h4 className="text-xl font-bold text-[#003554]">{p.title}</h4>
                            <p className="text-sm text-[#6B7280] mb-4">{p.subtitle}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#6B7280]">Duration</span>
                                    <span className="font-semibold text-[#003554]">{p.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#6B7280]">Typical Cost</span>
                                    <span className="font-semibold text-[#003554]">{p.cost}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-black/5 text-xs font-medium" style={{ color: p.color }}>
                                ✦ {p.bestFor}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   2. SalarySnapshotStrip
   Horizontal range bar showing 10th → median → 90th percentile
   ═══════════════════════════════════════════════════════════════ */

interface SalarySnapshotStripProps {
    entry: string;     // e.g. "$63,000"
    median: string;    // e.g. "$93,600"
    experienced: string; // e.g. "$129,000"
    professionSlug: string;
}

export function SalarySnapshotStrip({ entry, median, experienced, professionSlug }: SalarySnapshotStripProps) {
    // Parse numbers for positioning the bar
    const parse = (s: string) => parseInt(s.replace(/[$,]/g, ''), 10);
    const lo = parse(entry);
    const mid = parse(median);
    const hi = parse(experienced);
    const range = hi - lo || 1;
    const midPct = ((mid - lo) / range) * 100;

    return (
        <div className="my-10 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0582CA] to-[#00A6FB] flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#003554]">Salary Range at a Glance</h3>
                        <p className="text-sm text-[#6B7280]">10th to 90th percentile · BLS 2024</p>
                    </div>
                </div>
                <Link
                    href={`/${professionSlug}/salary`}
                    className="text-sm font-semibold text-[#0582CA] hover:text-[#003554] transition-colors flex items-center gap-1"
                >
                    Full salary data <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Range bar */}
            <div className="relative pt-8 pb-4 px-2 md:px-4">
                {/* Track */}
                <div className="relative h-4 rounded-full bg-gradient-to-r from-[#E5E7EB] via-[#00A6FB]/30 to-[#0582CA]/40 overflow-hidden">
                    {/* Fill to median */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0582CA] to-[#00A6FB]"
                        style={{ width: `${midPct}%` }}
                    />
                </div>

                {/* Median marker */}
                <div
                    className="absolute top-2"
                    style={{ left: `calc(${midPct}% + 0.5rem)`, transform: 'translateX(-50%)' }}
                >
                    <div className="w-0.5 h-6 bg-[#003554] mx-auto" />
                    <div className="bg-[#003554] text-white text-xs font-bold px-2.5 py-1 rounded-lg mt-1 whitespace-nowrap">
                        Median {median}
                    </div>
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-8 text-xs text-[#6B7280]">
                    <div>
                        <span className="block font-semibold text-sm text-[#4A5568]">{entry}</span>
                        <span>Entry Level</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-semibold text-sm text-[#4A5568]">{experienced}</span>
                        <span>Experienced</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   3. TopStatesGrid
   Compact 5-item grid of top-paying states with links
   ═══════════════════════════════════════════════════════════════ */

interface TopStatesGridProps {
    states: Array<{ state: string; salary: string; stateCode: string }>;
    professionSlug: string;
}

export function TopStatesGrid({ states, professionSlug }: TopStatesGridProps) {
    if (!states || states.length === 0) return null;

    const medals = ['🥇', '🥈', '🥉', '4', '5'];

    return (
        <div className="my-10 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006494] to-[#003554] flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#003554]">Highest-Paying States</h3>
                        <p className="text-sm text-[#6B7280]">Median annual salary by state</p>
                    </div>
                </div>
                <Link
                    href={`/${professionSlug}/salary`}
                    className="text-sm font-semibold text-[#0582CA] hover:text-[#003554] transition-colors flex items-center gap-1"
                >
                    All states <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {states.slice(0, 5).map((s, i) => (
                    <Link
                        key={s.stateCode}
                        href={`/${professionSlug}/salary/${s.stateCode.toLowerCase()}`}
                        className="group rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-center hover:border-[#0582CA]/30 hover:shadow-md transition-all"
                    >
                        <span className="text-lg mb-1 block">{medals[i]}</span>
                        <span className="block text-sm text-[#6B7280] group-hover:text-[#003554] transition-colors truncate">
                            {s.state}
                        </span>
                        <span className="block text-lg font-bold text-[#003554] mt-1">
                            {s.salary}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   4. CareerTimelineStrip
   Horizontal 6-step progression from research → career launch
   ═══════════════════════════════════════════════════════════════ */

const timelineSteps = [
    { icon: Search, label: 'Research', time: '1-3 mo', color: '#00A6FB' },
    { icon: BookOpen, label: 'Prerequisites', time: '6-12 mo', color: '#0582CA' },
    { icon: GraduationCap, label: 'Nursing School', time: '2-4 yr', color: '#006494' },
    { icon: Award, label: 'NCLEX-RN', time: '2-3 mo', color: '#003554' },
    { icon: Briefcase, label: 'Job Search', time: '1-3 mo', color: '#0582CA' },
    { icon: Rocket, label: 'Career Launch', time: '🎉', color: '#FFC300' },
];

export function CareerTimelineStrip() {
    return (
        <div className="my-10 rounded-2xl border border-[#006494]/10 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC300] to-[#FFD54F] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#003554]" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#003554]">Your Timeline to RN</h3>
                    <p className="text-sm text-[#6B7280]">Approximate timeline from start to career launch</p>
                </div>
            </div>

            {/* Desktop: horizontal strip */}
            <div className="hidden md:flex items-start gap-0 relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-[#00A6FB] via-[#006494] to-[#FFC300]" />

                {timelineSteps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                        <div key={step.label} className="flex-1 flex flex-col items-center relative z-10">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                                style={{ backgroundColor: step.color }}
                            >
                                <Icon className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="mt-2 text-sm font-semibold text-[#003554] text-center">{step.label}</span>
                            <span className="text-xs text-[#6B7280] mt-0.5">{step.time}</span>
                        </div>
                    );
                })}
            </div>

            {/* Mobile: vertical list */}
            <div className="md:hidden space-y-4">
                {timelineSteps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                        <div key={step.label} className="flex items-center gap-4">
                            <div className="relative flex flex-col items-center">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
                                    style={{ backgroundColor: step.color }}
                                >
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                {i < timelineSteps.length - 1 && (
                                    <div className="w-0.5 h-6 bg-[#E5E7EB] mt-1" />
                                )}
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-[#003554]">{step.label}</span>
                                <span className="text-xs text-[#6B7280] ml-2">{step.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   5. MidArticleCTA
   Full-width banner with two action buttons
   ═══════════════════════════════════════════════════════════════ */

interface MidArticleCTAProps {
    professionSlug: string;
    displayName: string;
}

export function MidArticleCTA({ professionSlug, displayName }: MidArticleCTAProps) {
    return (
        <div className="my-10 rounded-2xl bg-gradient-to-br from-[#003554] to-[#006494] p-6 md:p-8 shadow-lg text-white relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative z-10 md:flex items-center justify-between gap-6">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-1 text-white">Ready to explore your options?</h3>
                    <p className="text-white/80 text-sm">
                        See what {displayName}s earn in your state, or browse open positions right now.
                    </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <Link
                        href={`/${professionSlug}/salary`}
                        className="inline-flex items-center gap-2 bg-white text-[#003554] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#FFC300] transition-colors shadow-md"
                    >
                        <DollarSign className="w-4 h-4" />
                        Salary Data
                    </Link>
                    <Link
                        href={`/${professionSlug}/jobs`}
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <Briefcase className="w-4 h-4" />
                        Browse Jobs
                    </Link>
                </div>
            </div>
        </div>
    );
}
