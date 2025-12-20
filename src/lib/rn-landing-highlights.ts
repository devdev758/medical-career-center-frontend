// RN Landing Page - Spoke Content Snippets
// Engaging, data-driven anecdotes that summarize each spoke's comprehensive content

export interface SpokeHighlight {
    title: string;
    snippet: string;
    cta: string;
    href: string;
    icon: string; // Icon name from lucide-react
    tier: 1 | 2 | 3; // Priority tier
    gradient?: boolean; // Use gradient background
}

export const RN_SPOKE_HIGHLIGHTS: Record<string, SpokeHighlight> = {
    'how-to-become': {
        title: 'How to Become an RN',
        snippet: 'From ADN to DNP: Your complete roadmap to nursing. BSN programs take 4 years and open doors to specialties earning $90K-$200K+. Start with prerequisites, pass NCLEX (87% first-time rate), and launch your career.',
        cta: 'Read Complete Guide',
        href: '/registered-nurse/how-to-become',
        icon: 'BookOpen',
        tier: 1,
        gradient: true,
    },

    'salary': {
        title: 'RN Salary & Compensation',
        snippet: 'RNs earn $60K-$95K nationally depending on location and specialty. California leads at $124K median. Travel nurses command $2,000-$3,000/week. ICU and ER nurses earn 15-20% above base salary.',
        cta: 'Explore Salary by State',
        href: '/registered-nurse/salary',
        icon: 'DollarSign',
        tier: 1,
        gradient: true,
    },

    'jobs': {
        title: 'RN Job Opportunities',
        snippet: 'Browse current openings nationwide. Remote positions up 40% since 2024. New grads start at $60K-$75K. Travel nursing offers $2K-$3K weekly plus housing. Part-time and PRN roles available.',
        cta: 'Browse All Jobs',
        href: '/registered-nurse/jobs',
        icon: 'Briefcase',
        tier: 1,
        gradient: true,
    },

    'schools': {
        title: 'Nursing Schools & Programs',
        snippet: 'Compare ADN ($6K-$20K, 2 years) vs BSN ($40K-$80K, 4 years). 5 program types: Associate, BSN, Accelerated BSN, Online RN-to-BSN, and MSN. NCLEX pass rates above 90% indicate quality programs.',
        cta: 'Compare Programs',
        href: '/registered-nurse/schools',
        icon: 'GraduationCap',
        tier: 1,
    },

    'license': {
        title: 'RN License & NCLEX',
        snippet: '43 states participate in NLC compact for multi-state practice. NCLEX: 75-145 adaptive questions, 87% first-time pass rate. License renewal every 2-3 years with CE requirements. Endorsement available for state transfers.',
        cta: 'View License Guide',
        href: '/registered-nurse/license',
        icon: 'Award',
        tier: 2,
    },

    'crna': {
        title: 'CRNA - Nurse Anesthetist',
        snippet: 'The highest-paid RN specialty. CRNAs earn $180K-$250K annually. Requires BSN, 1-2 years ICU experience, and 3-year doctoral program. Administer anesthesia independently in all 50 states.',
        cta: 'Explore CRNA Career',
        href: '/registered-nurse/crna',
        icon: 'Stethoscope',
        tier: 1,
        gradient: true,
    },

    'specializations': {
        title: '10 RN Specializations',
        snippet: 'ICU, Emergency Room, Operating Room, Pediatrics, Oncology, NICU, Labor & Delivery, Cardiac, Aesthetic, and Psychiatric nursing. Earn $75K-$110K with specialized certifications. Find your perfect match.',
        cta: 'Explore Specialties',
        href: '/registered-nurse/specializations',
        icon: 'Target',
        tier: 2,
    },

    'resume': {
        title: 'RN Resume & Cover Letters',
        snippet: 'ATS-optimized templates for new grads, experienced RNs, and ICU nurses. 6 comprehensive guides covering resume writing, examples, templates, new grad strategies, specialty resumes, and cover letters. Download free samples.',
        cta: 'View Resume Guide',
        href: '/registered-nurse/resume',
        icon: 'FileText',
        tier: 2,
    },

    'interview': {
        title: 'Nursing Interview Prep',
        snippet: '100+ behavioral questions, clinical scenarios, and salary negotiation tips. Practice situational questions, prepare your STAR stories, and ace interviews at top hospitals. Average prep time: 2-3 weeks.',
        cta: 'Prepare for Interview',
        href: '/registered-nurse/interview',
        icon: 'MessageSquare',
        tier: 2,
    },

    'skills': {
        title: 'Essential RN Skills',
        snippet: 'Master clinical skills (IV insertion, wound care, medication administration), technical proficiencies (EHR systems, medical equipment), and soft skills (communication, critical thinking, emotional intelligence) based on AACN framework.',
        cta: 'Develop Your Skills',
        href: '/registered-nurse/skills',
        icon: 'Zap',
        tier: 3,
    },

    'career-path': {
        title: 'RN Career Advancement',
        snippet: 'Progress from Staff RN ($75K) → Charge Nurse ($85K) → Nurse Manager ($95K) → Director of Nursing ($110K) → CNO ($150K+). Or specialize: NP ($115K), CRNA ($200K+), Clinical Nurse Specialist ($105K).',
        cta: 'Plan Your Path',
        href: '/registered-nurse/career-path',
        icon: 'TrendingUp',
        tier: 3,
    },

    'work-life-balance': {
        title: 'Work-Life Balance',
        snippet: '12-hour shifts (3 days/week common). 75% career satisfaction rate. Burnout affects 60% of nurses - flexible schedules, self-care strategies, and specialty choices impact quality of life. Remote and part-time options growing.',
        cta: 'Learn More',
        href: '/registered-nurse/work-life-balance',
        icon: 'Heart',
        tier: 3,
    },
};

// Helper to get highlights by tier
export function getHighlightsByTier(tier: 1 | 2 | 3): SpokeHighlight[] {
    return Object.values(RN_SPOKE_HIGHLIGHTS).filter(h => h.tier === tier);
}

// Helper to get all highlights in priority order
export function getAllHighlightsPriority(): SpokeHighlight[] {
    return [
        ...getHighlightsByTier(1),
        ...getHighlightsByTier(2),
        ...getHighlightsByTier(3),
    ];
}
