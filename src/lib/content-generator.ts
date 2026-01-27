// import { SalaryData } from "@prisma/client";

/**
 * Checks if a profession string matches common medical professions
 * Returns the "Display Name" with proper casing for SEO.
 */
function getProfessionDisplayName(careerTitle: string): string {
    const title = careerTitle.toLowerCase();

    // Special handling for CNA - Always ALL CAPS
    if (title.includes('nursing assistant') || title.includes('cna')) return "CNA";

    // Standard capitalization for others
    if (title.includes('registered nurse')) return "Registered Nurse";
    if (title.includes('nurse practitioner')) return "Nurse Practitioner";
    if (title.includes('physician assistant')) return "Physician Assistant";
    if (title.includes('medical assistant')) return "Medical Assistant";
    if (title.includes('surgical tech')) return "Surgical Technologist";
    if (title.includes('dental hygienist')) return "Dental Hygienist";
    if (title.includes('ultrasound')) return "Ultrasound Tech";

    // Default Title Case
    return careerTitle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Returns the full formal name for SEO variation (e.g. "Certified Nursing Assistant")
 */
export function getProfessionFormalName(careerTitle: string): string {
    const title = careerTitle.toLowerCase();
    if (title.includes('nursing assistant') || title.includes('cna')) return "Certified Nursing Assistant";
    return getProfessionDisplayName(careerTitle);
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function generateWageNarrative(salary: any, careerTitle: string, locationName: string, topStateName: string = "California", topCityName: string = "San Francisco") {
    const hourlyMedian = salary.hourlyMedian ? `$${salary.hourlyMedian.toFixed(2)}` : "N/A";
    const annualMedian = formatCurrency(salary.annualMedian || 0);

    const hourly10th = salary.hourly10th ? `$${salary.hourly10th.toFixed(2)}` : "N/A";
    const annual10th = salary.annual10th ? formatCurrency(salary.annual10th) : "N/A";

    const hourly25th = salary.hourly25th ? `$${salary.hourly25th.toFixed(2)}` : "N/A";
    const annual25th = salary.annual25th ? formatCurrency(salary.annual25th) : "N/A";

    const hourly75th = salary.hourly75th ? `$${salary.hourly75th.toFixed(2)}` : "N/A";
    const annual75th = salary.annual75th ? formatCurrency(salary.annual75th) : "N/A";

    const hourly90th = salary.hourly90th ? `$${salary.hourly90th.toFixed(2)}` : "N/A";
    const annual90th = salary.annual90th ? formatCurrency(salary.annual90th) : "N/A";

    const employmentCount = salary.employmentCount ? salary.employmentCount.toLocaleString() : "N/A";
    const profession = getProfessionDisplayName(careerTitle);
    const formalName = getProfessionFormalName(careerTitle);
    const year = 2026; // Forward looking branding. User requested 2026.

    // Richer, thicker narrative with proper HTML paragraphs
    const intro = `
        <h2>${formalName} Salary Guide ${year}</h2>
        
        <p>The healthcare industry continues to face high demand for skilled professionals, and ${formalName}s are no exception. As we look towards ${year}, understanding the salary landscape is crucial for both new entrants and seasoned professionals. If you are considering a career path as a <strong>${profession}</strong>, you're likely asking: "How much does a ${profession} actually make in ${locationName}?"</p>
        
        <p>According to the latest available data, the <strong>average annual salary for a ${profession} in ${locationName} is ${annualMedian}</strong>, which breaks down to approximately <strong>${hourlyMedian} per hour</strong>. However, this single figure doesn't tell the whole story. Your actual take-home pay can vary dramatically based on your experience level, the specific facility you work in, and even the city you call home.</p>
        
        <p>For those just starting their journey, <strong>entry-level ${profession} positions</strong> typically offer a starting base pay around <strong>${annual10th} per year</strong> (${hourly10th}/hr). While this is the starting point, the potential for growth is significant.</p>
        
        <p>With a few years of experience under your belt, you can expect to move into the mid-tier earning bracket. <strong>Experienced ${profession}s</strong> often command salaries upwards of <strong>${annual75th} annually</strong>, with the most highly skilled and specialized top 10% of earners making over <strong>${annual90th} per year</strong>.</p>
        
        ${locationName === 'United States' ? `<p>Geographically, opportunities abound. States like <strong>${topStateName}</strong> currently lead the nation in compensation, offering some of the most competitive wages for ${profession}s. Whether you are looking to work in a bustling metropolitan hub like <strong>${topCityName}</strong> or a quieter rural setting, maximizing your earning potential starts with understanding these numbers.</p>` : `<p>Whether you are looking to work in a bustling metropolitan hub or a quieter rural setting, maximizing your earning potential starts with understanding these numbers.</p>`}
    `;

    return {
        intro: intro,
        distribution: [],
        wageBreakdown: {
            starting: `Entry-Level (${annual10th})`,
            earlyCareer: `Early Career (${annual25th})`,
            median: `Median (${annualMedian})`,
            experienced: `Experienced (${annual75th})`,
            topEarners: `Top Earners (${annual90th})`
        },
        employmentCount: employmentCount
    };
}

export function generateFactorsAffectingSalary(careerTitle: string) {
    const profession = getProfessionDisplayName(careerTitle);
    const formalName = getProfessionFormalName(careerTitle);

    return {
        title: `What factors affect ${profession} salary?`,
        content: `While the median salary of ${formatCurrency(50000)} (example) gives you a baseline, almost no two ${profession}s make exactly the same amount. Why? Because ${formalName} compensation is influenced by a complex mix of variables. Understanding these can help you negotiate better pay or choose a more lucrative career path.`,
        factors: [
            `**Geographic Location & Cost of Living:** This is often the single biggest factor. A ${profession} working in a high-cost-of-living area like San Francisco or New York City will naturally see a higher paycheck than one in a rural town, simply to match local living expenses.`,
            `**Years of Experience:** Healthcare values tenure. As you transition from a novice ${profession} to a seasoned veteran, your efficiency and clinical judgment improve. Employers reward this reliability with steady pay increases, often seeing jumps of 20-30% over a decade.`,
            `**Industry Setting:** Not all healthcare facilities pay the same. Working in a **general medical and surgical hospital** often pays better than a private physician's office. Specialized outpatient care centers can sometimes offer even higher premiums due to the specialized nature of the work.`,
            `**Shift Differentials:** Healthcare is a 24/7 operation. ${profession}s who are willing to cover "unsocial" hours—nights, weekends, and holidays—often receive **shift differential pay**. This can add significantly to your annual gross income compared to a standard 9-to-5 shift.`,
            `**Certifications & Specializations:** Going beyond the basics pays off. Obtaining advanced certifications or specializing in areas like acute care or geriatrics can make you a more valuable asset to your employer, justifying a higher hourly wage.`
        ]
    };
}

export function generateStateSalaryNarrative(careerTitle: string, topState?: { name: string, salary: number }) {
    const profession = getProfessionDisplayName(careerTitle);
    const topStateText = topState
        ? `Currently, **${topState.name}** stands out as a top-paying destination, with median salaries reaching an impressive **${formatCurrency(topState.salary)}**.`
        : `Traditionally, coastal states and those with strong healthcare unions lead the nation in compensation.`;

    return {
        title: `Average ${profession} Salary by State`,
        content: `Location is everything in real estate, and it's nearly as important for your paycheck. Across the 50 states, ${profession} salaries show remarkable variance. ${topStateText} However, it is critical to balance these figures against the **cost of living**. A high salary in a state with expensive housing and taxes might result in less disposable income than a moderate salary in a more affordable region. The table below provides a comprehensive state-by-state breakdown to help you compare.`
    };
}

export function generateCitySalaryNarrative(careerTitle: string, topCity?: { name: string, salary: number }) {
    const profession = getProfessionDisplayName(careerTitle);
    const topCityText = topCity
        ? `Metropolitan hubs like **${topCity.name}** are currently offering some of the highest wages in the country, with medians around **${formatCurrency(topCity.salary)}**.`
        : `Major metropolitan areas typically offer the highest wages due to density and demand.`;

    return {
        title: `Average ${profession} Salary by City`,
        content: `Drilling down to the city level reveals even more opportunity. Within a single state, salaries can fluctuate wildly between metro and rural areas. ${topCityText} Large cities often have to compete fiercely for talent, driving up wages. Below, we highlight top-paying cities where demand for ${profession}s is driving competitive compensation packages.`
    };
}

export function generateIndustrySalaryNarrative(careerTitle: string, topIndustry?: { name: string, salary: number, employment: number }) {
    const profession = getProfessionDisplayName(careerTitle);
    const industryText = topIndustry
        ? `The data shows that **${topIndustry.name}** is a major employer, with a workforce of over **${topIndustry.employment.toLocaleString()}** professionals earning an average of **${formatCurrency(topIndustry.salary)}**.`
        : `${profession}s have the flexibility to work in diverse settings.`;

    return {
        title: `Average ${profession} Salary by Industry`,
        content: `Where you work is just as important as where you live. ${industryText} While hospitals are the most common employer for many, they aren't always the highest paying. Specialized sectors, government facilities, and outpatient centers often compete for top talent with attractive salary packages. Consider the work environment (pace, stress level, and patient type) alongside the paycheck when choosing your industry.`
    };
}

export function generateFAQSchema(careerTitle: string, locationName: string, salary: any) {
    const annualMedian = formatCurrency(salary.annualMedian || 0);
    const hourlyMedian = salary.hourlyMedian ? `$${salary.hourlyMedian.toFixed(2)}` : "N/A";
    const profession = getProfessionDisplayName(careerTitle);
    const year = 2026;

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How much does a ${profession} make in ${locationName} in ${year}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `As of the latest data projections for ${year}, the median annual salary for a ${profession} in ${locationName} is ${annualMedian}, which translates to approximately ${hourlyMedian} per hour. Top earners can make significantly more.`
                }
            },
            {
                "@type": "Question",
                "name": `What is the starting salary for a ${profession} in ${locationName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Entry-level ${profession}s in ${locationName} typically start with a base salary around ${salary.annual10th ? formatCurrency(salary.annual10th) : "N/A"} per year.`
                }
            },
            {
                "@type": "Question",
                "name": `Is being a ${profession} a good career choice in ${year}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, being a ${profession} remains a solid career choice with stable demand. With a median salary of ${annualMedian} in ${locationName}, it offers a competitive entry point into the healthcare sector with strong growth potential.`
                }
            }
        ]
    };
}

export const CAREER_DESCRIPTIONS: Record<string, string> = {
    "registered-nurses": "Registered Nurses (RNs) provide and coordinate patient care, educate patients and the public about various health conditions, and provide advice and emotional support to patients and their family members.",
    "nurse-practitioners": "Nurse Practitioners (NPs) serve as primary and specialty care providers, delivering advanced nursing services to patients and their families.",
    "physician-assistants": "Physician Assistants (PAs) practice medicine on teams with physicians and other healthcare professionals, examining, diagnosing, and treating patients.",
    "ultrasound-technician": "Diagnostic medical sonographers, also known as ultrasound technicians, operate special imaging equipment to create images or conduct tests. The images and test results help physicians assess and diagnose medical conditions.",
    "dental-hygienists": "Dental hygienists examine patients for signs of oral diseases, such as gingivitis, and provide preventive care, including oral hygiene.",
    "nursing-assistants": "Certified Nursing Assistants (CNAs) provide basic care and help patients with activities of daily living. They are a vital link between patients and nurses.",
    "medical-assistants": "Medical Assistants complete administrative and clinical tasks in the offices of physicians, hospitals, and other healthcare facilities.",
    "surgical-technologists": "Surgical Technologists, also called operating room technicians, assist in surgical operations. They prepare operating rooms, arrange equipment, and help doctors during surgeries.",
    // Add generic fallback
    "default": "Healthcare professionals in this field play a vital role in patient care and medical support."
};

export function getCareerDescription(slug: string) {
    // Try exact match
    if (CAREER_DESCRIPTIONS[slug]) return CAREER_DESCRIPTIONS[slug];

    // Try partial match
    for (const key of Object.keys(CAREER_DESCRIPTIONS)) {
        if (slug.includes(key)) return CAREER_DESCRIPTIONS[key];
    }

    return CAREER_DESCRIPTIONS["default"];
}
