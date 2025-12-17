/**
 * Salary page utility functions
 */

/**
 * Format salary as currency
 */
export function formatSalary(amount: number | null | undefined, type: 'annual' | 'hourly' = 'annual'): string {
    if (amount === null || amount === undefined) return 'N/A';

    if (type === 'hourly') {
        return `$${amount.toFixed(2)}`;
    }

    return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/**
 * Format large numbers with K/M suffix
 */
export function formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return 'N/A';

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
}

/**
 * Calculate percent change between two values
 */
export function calculatePercentChange(value: number, baseline: number): {
    percent: number;
    formatted: string;
    isPositive: boolean;
} {
    if (!baseline || !value) {
        return { percent: 0, formatted: '0%', isPositive: true };
    }

    const percent = ((value - baseline) / baseline) * 100;
    const isPositive = percent >= 0;
    const formatted = `${isPositive ? '+' : ''}${percent.toFixed(0)}%`;

    return { percent, formatted, isPositive };
}

/**
 * Interpret location quotient value
 */
export function interpretLocationQuotient(lq: number | null | undefined): {
    text: string;
    description: string;
    isAboveAverage: boolean;
} {
    if (lq === null || lq === undefined) {
        return {
            text: 'Data not available',
            description: 'Location quotient data is not available for this area.',
            isAboveAverage: false,
        };
    }

    const percentDiff = Math.abs((lq - 1) * 100).toFixed(0);

    if (lq >= 1.2) {
        return {
            text: `${percentDiff}% more jobs per capita`,
            description: `This area has a high concentration of jobs in this profession, with ${percentDiff}% more jobs per capita than the national average. This indicates strong demand and potentially more opportunities.`,
            isAboveAverage: true,
        };
    } else if (lq >= 0.8) {
        return {
            text: 'Near average job concentration',
            description: 'This area has a similar concentration of jobs in this profession compared to the national average.',
            isAboveAverage: lq >= 1,
        };
    } else {
        return {
            text: `${percentDiff}% fewer jobs per capita`,
            description: `This area has ${percentDiff}% fewer jobs per capita than the national average. This may indicate less competition but also fewer opportunities.`,
            isAboveAverage: false,
        };
    }
}

/**
 * Generate FAQ schema for salary pages
 */
export function generateSalaryFAQs(
    professionName: string,
    medianSalary: number,
    hourlyRate: number,
    topState?: { name: string; salary: number },
    employment?: number,
    location?: { city?: string; state?: string }
): { question: string; answer: string }[] {
    const locationPrefix = location?.city
        ? `in ${location.city}, ${location.state}`
        : location?.state
            ? `in ${location.state}`
            : '';

    const faqs = [
        {
            question: `How much do ${professionName}s make per hour${locationPrefix ? ' ' + locationPrefix : ''}?`,
            answer: `${professionName}s earn a median hourly wage of ${formatSalary(hourlyRate, 'hourly')}${locationPrefix ? ' ' + locationPrefix : ''}, which translates to an annual salary of ${formatSalary(medianSalary)} based on full-time employment.`,
        },
        {
            question: `What is the average salary for a ${professionName}${locationPrefix ? ' ' + locationPrefix : ''}?`,
            answer: `The median annual salary for ${professionName}s${locationPrefix ? ' ' + locationPrefix : ''} is ${formatSalary(medianSalary)}. Entry-level positions typically start lower, while experienced professionals can earn significantly more.`,
        },
    ];

    if (topState && !location?.state) {
        faqs.push({
            question: `What state pays ${professionName}s the most?`,
            answer: `${topState.name} pays ${professionName}s the highest median salary at ${formatSalary(topState.salary)}, which is significantly above the national average.`,
        });
    }

    if (employment) {
        faqs.push({
            question: `How many ${professionName} jobs are there${locationPrefix ? ' ' + locationPrefix : ''}?`,
            answer: `There are approximately ${formatNumber(employment)} ${professionName} jobs${locationPrefix ? ' ' + locationPrefix : ''}. This represents a significant portion of the healthcare workforce.`,
        });
    }

    return faqs;
}

/**
 * Generate salary comparison data for charts
 */
export function generatePercentileData(salaryData: {
    annual10th?: number | null;
    annual25th?: number | null;
    annualMedian?: number | null;
    annual75th?: number | null;
    annual90th?: number | null;
}): { label: string; value: number; color: string }[] {
    const data = [];

    if (salaryData.annual10th) {
        data.push({ label: '10th Percentile', value: salaryData.annual10th, color: '#94a3b8' });
    }
    if (salaryData.annual25th) {
        data.push({ label: '25th Percentile', value: salaryData.annual25th, color: '#64748b' });
    }
    if (salaryData.annualMedian) {
        data.push({ label: 'Median (50th)', value: salaryData.annualMedian, color: '#3b82f6' });
    }
    if (salaryData.annual75th) {
        data.push({ label: '75th Percentile', value: salaryData.annual75th, color: '#22c55e' });
    }
    if (salaryData.annual90th) {
        data.push({ label: '90th Percentile', value: salaryData.annual90th, color: '#16a34a' });
    }

    return data;
}

/**
 * Create URL slug for salary page
 */
export function createSalaryPageUrl(profession: string, state?: string, city?: string): string {
    let url = `/${profession}/salary`;

    if (state) {
        url += `/${state.toLowerCase()}`;
    }

    if (city) {
        const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        url += `/${citySlug}`;
    }

    return url;
}

/**
 * Get comparison description text
 */
export function getComparisonText(
    currentValue: number,
    nationalValue: number,
    stateValue?: number
): string {
    const vsNational = calculatePercentChange(currentValue, nationalValue);

    let text = `${vsNational.formatted} ${vsNational.isPositive ? 'above' : 'below'} national average`;

    if (stateValue) {
        const vsState = calculatePercentChange(currentValue, stateValue);
        text += `, ${vsState.formatted} ${vsState.isPositive ? 'above' : 'below'} state average`;
    }

    return text;
}
