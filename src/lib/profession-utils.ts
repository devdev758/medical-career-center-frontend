/**
 * Profession Utilities
 * 
 * Helper functions to work with the Profession model and map
 * URL slugs to BLS database keywords for data queries.
 * 
 * CRITICAL: This preserves existing salary data functionality while
 * enabling multi-keyword queries for consolidated professions.
 */

import { prisma } from './prisma';
import { cache } from 'react';

/**
 * Get profession by URL slug
 * Uses React cache to avoid duplicate database queries
 */
export const getProfession = cache(async (slug: string) => {
    return await prisma.profession.findUnique({
        where: { slug }
    });
});

/**
 * Get all professions (for admin/listing purposes)
 */
export const getAllProfessions = cache(async () => {
    return await prisma.profession.findMany({
        orderBy: { rank: 'asc' }
    });
});

/**
 * Get professions by tier
 */
export const getProfessionsByTier = cache(async (tier: number) => {
    return await prisma.profession.findMany({
        where: { tier },
        orderBy: { rank: 'asc' }
    });
});

/**
 * Get BLS keywords for a profession slug
 * Returns array of keywords to query in SalaryData/Jobs tables
 * 
 * Example: 
 *   slug "registered-nurse" → ["registered-nurses", "registered-nurse"]
 *   slug "lpn" → ["licensed-practical-and-licensed-vocational-nurses", "licensed-practical-nurse"]
 */
export async function getBLSKeywords(professionSlug: string): Promise<string[]> {
    const profession = await getProfession(professionSlug);

    if (!profession) {
        // Fallback: if profession not in our approved list, try slug as-is
        // This maintains backward compatibility
        console.warn(`Profession "${professionSlug}" not found in approved list, using slug as keyword`);
        return [professionSlug];
    }

    return profession.blsKeywords;
}

/**
 * Get enabled spokes for a profession based on tier
 */
export async function getEnabledSpokes(professionSlug: string): Promise<string[]> {
    const profession = await getProfession(professionSlug);

    if (!profession) {
        // Default to Tier 3 (most restrictive) for unknown professions
        return ['how-to-become', 'salary', 'jobs', 'schools'];
    }

    const TIER_SPOKES: Record<number, string[]> = {
        1: ['how-to-become', 'salary', 'jobs', 'schools', 'license', 'specializations', 'resume', 'interview', 'skills', 'career-path', 'work-life-balance'],
        2: ['how-to-become', 'salary', 'jobs', 'schools', 'license', 'resume', 'skills'],
        3: ['how-to-become', 'salary', 'jobs', 'schools']
    };

    return TIER_SPOKES[profession.tier] || TIER_SPOKES[3];
}

/**
 * Check if a spoke is enabled for a profession
 */
export async function isSpokeEnabled(professionSlug: string, spoke: string): Promise<boolean> {
    const enabledSpokes = await getEnabledSpokes(professionSlug);
    return enabledSpokes.includes(spoke);
}

/**
 * Validate that a profession exists in our approved list
 * Use this in page components to return 404 for invalid professions
 */
export async function validateProfession(slug: string): Promise<boolean> {
    const profession = await getProfession(slug);
    return profession !== null;
}

/**
 * Get profession display name for metadata/UI
 */
export async function getProfessionDisplayName(slug: string): Promise<string> {
    const profession = await getProfession(slug);
    return profession?.displayName || formatSlugToTitle(slug);
}

/**
 * Fallback: Format slug to title case
 * Used when profession not found in database
 */
function formatSlugToTitle(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
