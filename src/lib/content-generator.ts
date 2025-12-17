// import { SalaryData } from "@prisma/client";

/**
 * Checks if a profession string matches common medical professions
 */
function getProfessionDisplayName(careerTitle: string): string {
    const title = careerTitle.toLowerCase();
    if (title.includes('registered nurse')) return "Registered Nurse";
    if (title.includes('nurse practitioner')) return "Nurse Practitioner";
    if (title.includes('physician assistant')) return "Physician Assistant";
    if (title.includes('nursing assistant') || title.includes('cna')) return "CNA";
    if (title.includes('medical assistant')) return "Medical Assistant";
    if (title.includes('surgical tech')) return "Surgical Technologist";
    if (title.includes('dental hygienist')) return "Dental Hygienist";
    if (title.includes('ultrasound')) return "Ultrasound Tech";
    return careerTitle;
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function generateWageNarrative(salary: any, careerTitle: string, locationName: string) {
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
    const professionName = getProfessionDisplayName(careerTitle);

    return {
        intro: `The average salary for a **${careerTitle}** in **${locationName}** is **${annualMedian}** per year (or **${hourlyMedian}** per hour).`,
        overview: `The median hourly salary for ${careerTitle.toLowerCase()}s in ${locationName} is ${hourlyMedian}.`,
        distribution: [
            `${professionName}s in the bottom 10% earn ${hourly10th} per hour or ${annual10th} annually.`,
            `Those in the bottom 25% earn ${hourly25th} per hour or ${annual25th} per year.`,
            `The median or average salary is ${hourlyMedian} per hour or ${annualMedian} annually.`,
            `In the top 25%, ${locationName} ${professionName.toLowerCase()}s make ${hourly75th} per hour or ${annual75th} per year.`,
            `The highest paid ${professionName.toLowerCase()}s in the top 10% earn ${hourly90th} per hour or ${annual90th} annually.`
        ],
        wageBreakdown: {
            starting: `If you're starting as a ${professionName.toLowerCase()}, you might find yourself earning around ${hourly10th} per hour or ${annual10th} per year.`,
            earlyCareer: `With a bit more experience, earnings around ${hourly25th} per hour or ${annual25th} per year are common.`,
            median: `The median wage sits at ${hourlyMedian} per hour or ${annualMedian} per year. This means half of the ${professionName.toLowerCase()}s in ${locationName} earn more than this, while the other half earns less.`,
            experienced: `Those in the top 25% of earners take home around ${hourly75th} per hour or ${annual75th} per year.`,
            topEarners: `The highest earners, the top 10%, make about ${hourly90th} per hour or ${annual90th} per year.`
        },
        employmentCount: employmentCount
    };
}

export function generateFactorsAffectingSalary(careerTitle: string) {
    const profession = getProfessionDisplayName(careerTitle);

    return {
        title: `What factors affect ${profession} salary?`,
        content: `${profession} salaries can vary significantly based on several key factors. While the median salary provides a baseline, your actual earnings potential depends on:`,
        factors: [
            `**Geographic Location:** Region and cost of living play a major role in salary ranges. ${profession}s in metropolitan areas and states with higher costs of living (like California or Massachusetts) often earn significantly more than the national average.`,
            `**Years of Experience:** As with most professions, your salary will typically grow as you gain experience. Entry-level ${profession}s start lower, while those with 5-10+ years of experience can earn 20-30% more.`,
            `**Industry Setting:** Where you work matters. ${profession}s employed in hospitals or outpatient care centers often earn differently than those in private physician offices or nursing care facilities.`,
            `**Certifications & Education:** Additional certifications or advanced degrees can qualify you for specialized roles or leadership positions that command higher pay.`,
            `**Shift Differentials:** Healthcare is a 24/7 industry. ${profession}s willing to work nights, weekends, or holidays often receive "shift differential" pay that boosts their overall income.`
        ]
    };
}

export function generateStateSalaryNarrative(careerTitle: string, topState?: { name: string, salary: number }) {
    const profession = getProfessionDisplayName(careerTitle);
    const topStateText = topState
        ? `States like **${topState.name}** are among the highest paying, with median salaries reaching **${formatCurrency(topState.salary)}**.`
        : `Coastal states and those with strong healthcare unions often offer the highest compensation.`;

    return {
        title: `Average ${profession} Salary by State`,
        content: `Location is one of the biggest influencers on multiple variables of a ${profession}'s salary. ${topStateText} However, it's important to weigh these higher salaries against the local cost of living. A higher salary in a expensive city might not go as far as a moderate salary in a more affordable state.`
    };
}

export function generateCitySalaryNarrative(careerTitle: string, topCity?: { name: string, salary: number }) {
    const profession = getProfessionDisplayName(careerTitle);
    const topCityText = topCity
        ? `Major metropolitan areas like **${topCity.name}** top the charts with median salaries of **${formatCurrency(topCity.salary)}**.`
        : `Metropolitan areas typically pay more due to higher demand and cost of living.`;

    return {
        title: `Average ${profession} Salary by City`,
        content: `City-level data reveals even more granularity. ${topCityText} Use the table below to compare ${profession} salaries across different metropolitan areas to find the best balance of pay and lifestyle for you.`
    };
}

export function generateIndustrySalaryNarrative(careerTitle: string) {
    const profession = getProfessionDisplayName(careerTitle);

    return {
        title: `Average ${profession} Salary by Industry`,
        content: `${profession}s work in a variety of healthcare settings, and pay can vary by industry. Hospitals and outpatient care centers typically offer competitive wages, while roles in educational services or residential facilities may vary. The chart below breaks down where ${profession}s work and the average annual mean wage in those specific industries.`
    };
}

export function generateFAQSchema(careerTitle: string, locationName: string, salary: any) {
    const annualMedian = formatCurrency(salary.annualMedian || 0);
    const hourlyMedian = salary.hourlyMedian ? `$${salary.hourlyMedian.toFixed(2)}` : "N/A";
    const profession = getProfessionDisplayName(careerTitle);

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How much does a ${profession} make in ${locationName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The median annual salary for a ${profession} in ${locationName} is ${annualMedian}, which translates to approximately ${hourlyMedian} per hour.`
                }
            },
            {
                "@type": "Question",
                "name": `What is the starting salary for a ${profession} in ${locationName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Entry-level ${profession}s in ${locationName} typically start around ${salary.annual10th ? formatCurrency(salary.annual10th) : "N/A"} per year.`
                }
            },
            {
                "@type": "Question",
                "name": `Is being a ${profession} a good career choice?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, being a ${profession} is a solid career choice with stable demand. With a median salary of ${annualMedian} in ${locationName}, it offers a competitive wage in the healthcare sector.`
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
    "nursing-assistants": "Nursing Assistants, often called CNAs, provide basic care and help patients with activities of daily living. They are a vital link between patients and nurses.",
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
