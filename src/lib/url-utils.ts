/**
 * URL Slug Translation Utility
 * 
 * This module handles the translation between:
 * - Database slugs (plural, e.g., 'registered-nurses') 
 * - URL slugs (singular, e.g., 'registered-nurse')
 * 
 * The BLS data uses plural forms (registered-nurses), but SEO best practices
 * recommend singular forms that match how people search (registered nurse).
 */

// Mapping from database slug (plural) to URL slug (singular)
export const DB_TO_URL_SLUG: Record<string, string> = {
    'registered-nurses': 'registered-nurse',
    'licensed-practical-nurses': 'licensed-practical-nurse',
    'nurse-practitioners': 'nurse-practitioner',
    'physician-assistants': 'physician-assistant',
    'physical-therapists': 'physical-therapist',
    'physical-therapist-assistants': 'physical-therapist-assistant',
    'occupational-therapists': 'occupational-therapist',
    'occupational-therapy-assistants': 'occupational-therapy-assistant',
    'speech-language-pathologists': 'speech-language-pathologist',
    'respiratory-therapists': 'respiratory-therapist',
    'medical-assistants': 'medical-assistant',
    'dental-hygienists': 'dental-hygienist',
    'dental-assistants': 'dental-assistant',
    'pharmacy-technicians': 'pharmacy-technician',
    'medical-laboratory-technicians': 'medical-laboratory-technician',
    'radiologic-technologists': 'radiologic-technologist',
    'ultrasound-technicians': 'ultrasound-technician',
    'surgical-technologists': 'surgical-technologist',
    'cardiovascular-technologists': 'cardiovascular-technologist',
    'phlebotomists': 'phlebotomist',
    'emt-paramedics': 'emt-paramedic',
    'home-health-aides': 'home-health-aide',
    'nursing-assistants': 'nursing-assistant',
    'medical-records-specialists': 'medical-records-specialist',
    'health-information-technicians': 'health-information-technician',
    'medical-coders': 'medical-coder',
    'medical-billers': 'medical-biller',
};

// Reverse mapping: URL slug (singular) to database slug (plural)
export const URL_TO_DB_SLUG: Record<string, string> = Object.fromEntries(
    Object.entries(DB_TO_URL_SLUG).map(([db, url]) => [url, db])
);

/**
 * Convert a database slug to a URL-friendly slug
 * @example dbSlugToUrlSlug('registered-nurses') => 'registered-nurse'
 */
export function dbSlugToUrlSlug(dbSlug: string): string {
    return DB_TO_URL_SLUG[dbSlug] || dbSlug;
}

/**
 * Convert a URL slug to a database slug
 * @example urlSlugToDbSlug('registered-nurse') => 'registered-nurses'
 */
export function urlSlugToDbSlug(urlSlug: string): string {
    return URL_TO_DB_SLUG[urlSlug] || urlSlug;
}

/**
 * Get all valid URL slugs for professions
 */
export function getValidProfessionSlugs(): string[] {
    return Object.values(DB_TO_URL_SLUG);
}

/**
 * Get all valid database slugs for professions
 */
export function getValidDbSlugs(): string[] {
    return Object.keys(DB_TO_URL_SLUG);
}

/**
 * Check if a URL slug is valid
 */
export function isValidProfessionSlug(slug: string): boolean {
    return URL_TO_DB_SLUG.hasOwnProperty(slug);
}

/**
 * Format a slug for display (Title Case)
 * @example formatSlugForDisplay('registered-nurse') => 'Registered Nurse'
 */
export function formatSlugForDisplay(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Get the spoke URL paths for a profession
 * New hierarchical structure: /profession/spoke instead of /profession-spoke
 */
export function getProfessionUrls(urlSlug: string) {
    return {
        hub: `/${urlSlug}`,
        howToBecome: `/${urlSlug}/how-to-become`,
        salary: `/${urlSlug}/salary`,
        jobs: `/${urlSlug}/jobs`,
        schools: `/${urlSlug}/schools`,
        license: `/${urlSlug}/license`,
        resume: `/${urlSlug}/resume`,
        interview: `/${urlSlug}/interview`,
        specializations: `/${urlSlug}/specializations`,
        skills: `/${urlSlug}/skills`,
        careerPath: `/${urlSlug}/career-path`,
        workLifeBalance: `/${urlSlug}/work-life-balance`,
    };
}

/**
 * Get the spoke URL paths for sub-pages
 */
export function getProfessionSubUrls(urlSlug: string) {
    return {
        // Jobs sub-pages
        jobsRemote: `/${urlSlug}/jobs/remote`,
        jobsWorkFromHome: `/${urlSlug}/jobs/work-from-home`,
        jobsNewGrad: `/${urlSlug}/jobs/new-grad`,
        jobsTravel: `/${urlSlug}/jobs/travel`,
        jobsPartTime: `/${urlSlug}/jobs/part-time`,
        
        // Schools sub-pages
        schoolsOnline: `/${urlSlug}/schools/online`,
        schoolsAccelerated: `/${urlSlug}/schools/accelerated`,
        schoolsAssociate: `/${urlSlug}/schools/associate`,
        schoolsBsn: `/${urlSlug}/schools/bsn`,
        
        // License sub-pages
        licenseCompact: `/${urlSlug}/license/compact`,
        licenseRenewal: `/${urlSlug}/license/renewal`,
        licenseLookup: `/${urlSlug}/license/lookup`,
        licenseCe: `/${urlSlug}/license/continuing-education`,
        
        // Resume sub-pages
        resumeExamples: `/${urlSlug}/resume/examples`,
        resumeTemplate: `/${urlSlug}/resume/template`,
        resumeNewGrad: `/${urlSlug}/resume/new-grad`,
        resumeCoverLetter: `/${urlSlug}/resume/cover-letter`,
        
        // Specialty pages (top-level for RN)
        crna: `/${urlSlug}/crna`,
        crnaSalary: `/${urlSlug}/crna/salary`,
        crnaSchools: `/${urlSlug}/crna/schools`,
        crnaHowToBecome: `/${urlSlug}/crna/how-to-become`,
    };
}
