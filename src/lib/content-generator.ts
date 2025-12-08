// import { SalaryData } from "@prisma/client";


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
    const hourlyMean = salary.hourlyMean ? `$${salary.hourlyMean.toFixed(2)}` : "N/A";
    const annualMean = salary.annualMean ? formatCurrency(salary.annualMean) : "N/A";

    const hourly10th = salary.hourly10th ? `$${salary.hourly10th.toFixed(2)}` : "N/A";
    const annual10th = salary.annual10th ? formatCurrency(salary.annual10th) : "N/A";

    const hourly25th = salary.hourly25th ? `$${salary.hourly25th.toFixed(2)}` : "N/A";
    const annual25th = salary.annual25th ? formatCurrency(salary.annual25th) : "N/A";

    const hourly75th = salary.hourly75th ? `$${salary.hourly75th.toFixed(2)}` : "N/A";
    const annual75th = salary.annual75th ? formatCurrency(salary.annual75th) : "N/A";

    const hourly90th = salary.hourly90th ? `$${salary.hourly90th.toFixed(2)}` : "N/A";
    const annual90th = salary.annual90th ? formatCurrency(salary.annual90th) : "N/A";

    const employmentCount = salary.employmentCount ? salary.employmentCount.toLocaleString() : "N/A";
    const jobsPer1000 = salary.jobsPer1000 ? salary.jobsPer1000.toFixed(3) : "N/A";
    const locationQuotient = salary.locationQuotient ? salary.locationQuotient.toFixed(2) : "N/A";

    return {
        intro: `The average salary for a **${careerTitle}** in **${locationName}** is **${annualMedian}** per year (or **${hourlyMedian}** per hour).`,
        overview: `The average hourly salary for ${careerTitle.toLowerCase()}s in ${locationName} is ${hourlyMean}.`,
        distribution: [
            `${careerTitle}s in the bottom 10% earn ${hourly10th} per hour or ${annual10th} annually.`,
            `Those in the bottom 25% earn ${hourly25th} per hour or ${annual25th} per year.`,
            `The median or average salary is ${hourlyMedian} per hour or ${annualMedian} annually.`,
            `In the top 25%, ${locationName} ${careerTitle.toLowerCase()}s make ${hourly75th} per hour or ${annual75th} per year.`,
            `The highest paid ${careerTitle.toLowerCase()}s in the top 10% earn ${hourly90th} per hour or ${annual90th} annually.`
        ],
        wageBreakdown: {
            starting: `If you're starting as a ${careerTitle.toLowerCase()}, you might find yourself earning around ${hourly10th} per hour or ${annual10th} per year.`,
            earlyCareer: `With a bit more experience, earnings around ${hourly25th} per hour or ${annual25th} per year are common.`,
            median: `The median wage sits at ${hourlyMedian} per hour or ${annualMedian} per year. This means half of the ${careerTitle.toLowerCase()}s in ${locationName} earn more than this, while the other half earns less.`,
            experienced: `Those in the top 25% of earners take home around ${hourly75th} per hour or ${annual75th} per year.`,
            topEarners: `The highest earners, the top 10%, make about ${hourly90th} per hour or ${annual90th} per year.`
        },
        employment: {
            count: employmentCount,
            jobsPer1000: jobsPer1000,
            locationQuotient: locationQuotient
        }
    };
}

export function generateFAQSchema(careerTitle: string, locationName: string, salary: any) {
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
