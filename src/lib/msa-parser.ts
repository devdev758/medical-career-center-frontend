/**
 * MSA (Metropolitan Statistical Area) Parser
 * Parses BLS MSA names to extract component cities and states
 */

export interface ParsedMSA {
    cities: string[];
    states: string[];
    originalName: string;
}

/**
 * Parse an MSA name into component cities and states
 * 
 * Examples:
 * - "Las Vegas-Henderson-North Las Vegas, NV" → cities: [Las Vegas, Henderson, North Las Vegas], states: [NV]
 * - "La Crosse-Onalaska, WI-MN" → cities: [La Crosse, Onalaska], states: [WI, MN]
 * - "Kingsport-Bristol, TN-VA" → cities: [Kingsport, Bristol], states: [TN, VA]
 */
export function parseMSA(msaName: string): ParsedMSA {
    // Extract state codes from end (e.g., "WI-MN", "TN-VA")
    const stateMatch = msaName.match(/,\s*([A-Z]{2}(?:-[A-Z]{2})*)$/);
    const states = stateMatch
        ? stateMatch[1].split('-').map(s => s.trim())
        : [];

    // Extract city names before state codes
    const cityPart = msaName.replace(/,\s*[A-Z]{2}(?:-[A-Z]{2})*$/, '');

    // Split by hyphens and slashes to get individual cities
    const cities = cityPart
        .split(/[-\/]/)
        .map(c => c.trim())
        .filter(c => c.length > 0);

    return {
        cities,
        states,
        originalName: msaName
    };
}

/**
 * Generate all city-state combinations from an MSA
 * For multi-state MSAs, creates entries for each city in each state
 */
export function generateCityStateCombinations(msa: ParsedMSA): Array<{ city: string; state: string }> {
    const combinations: Array<{ city: string; state: string }> = [];

    // If only one state, all cities belong to that state
    if (msa.states.length === 1) {
        const state = msa.states[0];
        msa.cities.forEach(city => {
            combinations.push({ city, state });
        });
    } else {
        // Multi-state MSA: typically first city is in first state, rest distributed
        // For simplicity, we'll create entries for primary cities in their respective states
        // This handles cases like "Kingsport-Bristol, TN-VA" where Bristol spans both states

        // First city in first state
        if (msa.cities.length > 0 && msa.states.length > 0) {
            combinations.push({ city: msa.cities[0], state: msa.states[0] });
        }

        // Remaining cities in remaining states
        for (let i = 1; i < msa.cities.length; i++) {
            const stateIndex = Math.min(i, msa.states.length - 1);
            combinations.push({ city: msa.cities[i], state: msa.states[stateIndex] });
        }

        // For twin cities (like Bristol, TN-VA), add to both states
        if (msa.cities.length === 2 && msa.states.length === 2) {
            // Add second city to first state as well (twin city scenario)
            combinations.push({ city: msa.cities[1], state: msa.states[0] });
        }
    }

    return combinations;
}

/**
 * Check if an area name is an MSA (contains multiple cities)
 */
export function isMSA(areaName: string): boolean {
    // Remove state codes
    const cityPart = areaName.replace(/,\s*[A-Z]{2}(?:-[A-Z]{2})*$/, '');

    // Check if it contains hyphens or slashes (indicating multiple cities)
    return cityPart.includes('-') || cityPart.includes('/');
}
