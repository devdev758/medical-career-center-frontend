/**
 * Get the year to display in content and metadata.
 * From December 1st onwards, show next year for better SEO and relevance.
 * Otherwise show current year.
 */
export function getContentYear(): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed: 0 = January, 11 = December

    // If it's December (month 11), show next year
    if (currentMonth === 11) {
        return currentYear + 1;
    }

    return currentYear;
}
