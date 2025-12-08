import { SalaryData } from "@prisma/client";

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function generateWageNarrative(salary: SalaryData, careerTitle: string, locationName: string) {
    const hourlyMedian = salary.hourlyMedian ? `$${salary.hourlyMedian.toFixed(2)}` : "N/A";
    const annualMedian = formatCurrency(salary.annualMedian || 0);

    const startingHourly = salary.hourly10th ? `$${salary.hourly10th.toFixed(2)}` : "N/A";
    const startingAnnual = salary.annual10th ? formatCurrency(salary.annual10th) : "N/A";

    const experiencedHourly = salary.hourly90th ? `$${salary.hourly90th.toFixed(2)}` : "N/A";
    const experiencedAnnual = salary.annual90th ? formatCurrency(salary.annual90th) : "N/A";

    return {
        intro: `The average salary for a **${careerTitle}** in **${locationName}** is **${annualMedian}** per year (or **${hourlyMedian}** per hour).`,
        starting: `**Starting Out:** Entry-level ${careerTitle}s (10th percentile) typically earn around **${startingHourly}** per hour or **${startingAnnual}** annually.`,
        median: `**Average:** The median wage sits at **${hourlyMedian}** per hour or **${annualMedian}** per year. This means half of the ${careerTitle}s in ${locationName} earn more than this, while the other half earns less.`,
        experienced: `**Top Earners:** Highly experienced professionals (90th percentile) can earn up to **${experiencedHourly}** per hour or **${experiencedAnnual}** per year.`
    };
}

export function generateFAQSchema(careerTitle: string, locationName: string, salary: SalaryData) {
    const annualMedian = formatCurrency(salary.annualMedian || 0);
    const hourlyMedian = salary.hourlyMedian ? `$${salary.hourlyMedian.toFixed(2)}` : "N/A";

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How much does a ${careerTitle} make in ${locationName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The median annual salary for a ${careerTitle} in ${locationName} is ${annualMedian}, which translates to approximately ${hourlyMedian} per hour.`
                }
            },
            {
                "@type": "Question",
                "name": `What is the starting salary for a ${careerTitle} in ${locationName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Entry-level ${careerTitle}s in ${locationName} typically start around ${salary.annual10th ? formatCurrency(salary.annual10th) : "N/A"} per year.`
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
