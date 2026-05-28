import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://medicalcareercenter.org';

// Spokes available per tier
const TIER_SPOKES: Record<number, string[]> = {
    1: ['how-to-become', 'salary', 'jobs', 'schools', 'license', 'specializations', 'resume', 'interview', 'skills', 'career-path', 'work-life-balance'],
    2: ['how-to-become', 'salary', 'jobs', 'schools', 'license', 'resume', 'skills'],
    3: ['how-to-become', 'salary', 'jobs', 'schools'],
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const professions = await prisma.profession.findMany({
        select: { slug: true, tier: true },
        orderBy: { rank: 'asc' },
    });

    const entries: MetadataRoute.Sitemap = [
        // Homepage
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        // Professions listing
        {
            url: `${BASE_URL}/professions`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];

    // Generate URLs for each profession hub + spokes
    for (const prof of professions) {
        const spokes = TIER_SPOKES[prof.tier] || TIER_SPOKES[3];

        // Hub page
        entries.push({
            url: `${BASE_URL}/${prof.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        });

        // Spoke pages
        for (const spoke of spokes) {
            entries.push({
                url: `${BASE_URL}/${prof.slug}/${spoke}`,
                lastModified: new Date(),
                changeFrequency: spoke === 'jobs' ? 'daily' : 'weekly',
                priority: spoke === 'salary' || spoke === 'jobs' ? 0.7 : 0.6,
            });
        }
    }

    return entries;
}
