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
    const professionLower = profession.toLowerCase();

    // Context-aware introduction
    const roleDescription = getCareerDescription(careerTitle.toLowerCase().replace(/ /g, '-'));

    // Main "Story" Narrative
    const overview = `
        ${roleDescription} As interest in this career continues to grow, many prospective ${professionLower}s wonder – how much do ${professionLower}s make? Here's an overview of typical ${professionLower} salary data in ${locationName}:

        The average annual salary for ${professionLower}s is ${annualMedian} per year or ${hourlyMedian} per hour, according to latest data from the U.S. Bureau of Labor Statistics (BLS).

        Entry-level ${professionLower}s with less than 1 year of experience can expect to earn an average base pay of around ${annual10th} annually or ${hourly10th} hourly.

        Experienced ${professionLower}s with 5-10 years of experience can earn closer to ${annual75th} annually or ${hourly75th} per hour.

        The top 10% of ${professionLower}s earn over ${annual90th} annually or ${hourly90th} hourly.
        
        ${locationName === 'United States' ? `Some of the top paying states for ${professionLower}s include ${topStateName}, where salaries are significantly higher than the national average.` : ''}
        
        Major metropolitan areas like ${topCityName} also offer competitive salaries for ${professionLower}s.
    `;

    return {
        intro: overview, // This is now a rich markdown string
        distribution: [
            // Kept for backward compatibility if needed, but primary content is above
        ],
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

    return {
        title: `What factors affect ${profession} salary?`,
        content: `${profession} salaries can vary significantly based on factors like:`,
        factors: [
            `**Geographic location** – Region and cost of living play a major role in salary ranges. ${profession}s earn the highest salaries in metropolitan areas on the coasts with higher costs of living.`,
            `**Years of experience** – As ${profession}s gain more on-the-job expertise, their salaries increase substantially. The most experienced professionals can make 20-30% higher salaries.`,
            `**Industry** – Professionals in hospital settings and medical centers typically make more than those in physicians' offices and outpatient clinics.`,
            `**Employment setting** – Salaries are often higher for those working in private and group practice settings vs. public and government hospitals.`,
            `**Overtime** – ${profession}s frequently work longer shifts with overtime pay which increases total compensation.`,
            `**Specialization** – Those who specialize in niche areas can demand higher pay.`,
            `**Certification** – Professionals who earn additional credentials tend to earn higher salaries than non-certified peers.`
        ]
    };
}

export function generateStateSalaryNarrative(careerTitle: string, topState?: { name: string, salary: number }) {
    const profession = getProfessionDisplayName(careerTitle);
    const topStateText = topState
        ? `${topState.name} leads the pack with a median salary of ${formatCurrency(topState.salary)}.`
        : `Coastal states often lead in compensation.`;

    return {
        title: `Average ${profession} Salary by State`,
        content: `When it comes to location, not all states are created equal. ${topStateText} Costs of living vary wildly, so a higher paycheck in California might not stretch as far as a moderate one in Texas. Below is the full breakdown of ${profession} salaries across all 50 states.`
    };
}

export function generateCitySalaryNarrative(careerTitle: string, topCity?: { name: string, salary: number }) {
    const profession = getProfessionDisplayName(careerTitle);
    const topCityText = topCity
        ? `Cities like ${topCity.name} offer some of the highest wages in the country at ${formatCurrency(topCity.salary)}.`
        : `Major metropolitan hubs typically offer the highest wages.`;

    return {
        title: `Average ${profession} Salary by City`,
        content: `For many professionals, the specific city can matter even more than the state. ${topCityText} Large metro areas often pay a premium to attract talent, though this usually comes with higher housing costs.`
    };
}

export function generateIndustrySalaryNarrative(careerTitle: string, topIndustry?: { name: string, salary: number, employment: number }) {
    const profession = getProfessionDisplayName(careerTitle);
    const industryText = topIndustry
        ? `The largest employer of ${profession}s is ${topIndustry.name}, employing over ${topIndustry.employment.toLocaleString()} professionals with an average salary of ${formatCurrency(topIndustry.salary)}.`
        : `${profession}s work across a wide range of healthcare settings.`;

    return {
        title: `Average ${profession} Salary by Industry`,
        content: `${industryText} While hospitals often pay well, other sectors like outpatient care centers or specialized clinics can sometimes offer even higher hourly rates. Understanding where the jobs are can help you target your job search effectively.`
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
