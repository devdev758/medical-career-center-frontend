/**
 * Meta Tags Configuration
 * 
 * Optimized meta titles and descriptions for all profession pages
 * Based on search intent and keyword research
 */

interface MetaTagsConfig {
    title: string;
    description: string;
}

export function getCareerGuideMetaTags(professionName: string, medianSalary: string, jobCount: number): MetaTagsConfig {
    return {
        title: `How to Become a ${professionName}: Complete Guide 2025 | Salary, Education & Jobs`,
        description: `Complete guide to becoming a ${professionName.toLowerCase()}. Learn about education requirements, average salary (${medianSalary}), certification, job outlook, and career paths. ${jobCount.toLocaleString()}+ jobs available. Start today!`
    };
}

export function getProfessionHubMetaTags(professionName: string, medianSalary: string, jobCount: number): MetaTagsConfig {
    return {
        title: `${professionName} Career Guide: Salary, Jobs & How to Become One | 2025`,
        description: `Explore ${professionName.toLowerCase()} careers. Average salary: ${medianSalary}. ${jobCount.toLocaleString()}+ open positions. Learn education requirements, job outlook, and how to start your career today.`
    };
}

export function getSalaryPageMetaTags(
    professionName: string,
    locationName: string,
    medianSalary: string,
    isNational: boolean
): MetaTagsConfig {
    const locationText = isNational ? 'by State & City' : `in ${locationName}`;
    const titleLocation = isNational ? '' : ` in ${locationName}`;

    return {
        title: `${professionName} Salary 2025: Average Pay ${locationText} | Medical Career Center`,
        description: `${professionName} earn an average of ${medianSalary} annually${titleLocation}. Explore detailed salary data by experience level, percentiles, and location. Compare top-paying states and cities.`
    };
}

export function getJobsPageMetaTags(
    professionName: string,
    locationName: string,
    jobCount: number,
    isNational: boolean
): MetaTagsConfig {
    const locationText = isNational ? 'Nationwide' : `in ${locationName}`;
    const titleLocation = isNational ? '' : ` in ${locationName}`;

    return {
        title: `${professionName} Jobs${titleLocation}: ${jobCount.toLocaleString()}+ Openings | Apply Today`,
        description: `Find ${professionName.toLowerCase()} jobs ${locationText.toLowerCase()}. ${jobCount.toLocaleString()}+ current openings. Browse positions, compare salaries, and apply online. Updated daily with new opportunities.`
    };
}

// Helper to generate Open Graph tags
export function getOpenGraphTags(
    title: string,
    description: string,
    url: string,
    type: 'website' | 'article' = 'website'
) {
    return {
        title,
        description,
        url,
        type,
        siteName: 'Medical Career Center',
        locale: 'en_US',
    };
}

// Helper to generate Twitter Card tags
export function getTwitterCardTags(title: string, description: string) {
    return {
        card: 'summary_large_image' as const,
        title,
        description,
    };
}

// Helper to generate canonical URL
export function getCanonicalUrl(pathname: string): string {
    const baseUrl = 'https://medicalcareercenter.org';
    return `${baseUrl}${pathname}`;
}
