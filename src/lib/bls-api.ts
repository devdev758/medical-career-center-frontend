/**
 * BLS (Bureau of Labor Statistics) API Client
 * 
 * Fetches occupational employment and wage statistics from the BLS Public API v2.
 * Requires registration at https://www.bls.gov/developers/
 * 
 * API Reference: https://www.bls.gov/developers/api_signature_v2.htm
 */

// BLS API Configuration
const BLS_API_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';
const BLS_API_KEY = process.env.BLS_API_KEY || '';

// Rate limiting: API v2 allows 500 queries/day, 50 series per query
const MAX_SERIES_PER_REQUEST = 50;
const REQUEST_DELAY_MS = 1000; // 1 second between requests

/**
 * Standard Occupational Classification (SOC) codes for medical professions
 * Format: XX-XXXX (displayed) -> XXXXXX (for series ID)
 */
export const PROFESSION_SOC_CODES: Record<string, { soc: string; name: string }> = {
    'registered-nurse': { soc: '291141', name: 'Registered Nurses' },
    'nursing-assistants': { soc: '311131', name: 'Nursing Assistants' },
    'licensed-practical-nurse': { soc: '292061', name: 'Licensed Practical and Licensed Vocational Nurses' },
    'nurse-practitioner': { soc: '291171', name: 'Nurse Practitioners' },
    'physician-assistant': { soc: '291071', name: 'Physician Assistants' },
    'physical-therapist': { soc: '291123', name: 'Physical Therapists' },
    'occupational-therapist': { soc: '291122', name: 'Occupational Therapists' },
    'respiratory-therapist': { soc: '291126', name: 'Respiratory Therapists' },
    'medical-assistant': { soc: '319092', name: 'Medical Assistants' },
    'dental-hygienist': { soc: '291292', name: 'Dental Hygienists' },
    'dental-assistant': { soc: '319091', name: 'Dental Assistants' },
    'pharmacy-technician': { soc: '292052', name: 'Pharmacy Technicians' },
    'phlebotomist': { soc: '319097', name: 'Phlebotomists' },
    'emt-paramedic': { soc: '292040', name: 'Emergency Medical Technicians and Paramedics' },
    'surgical-technologist': { soc: '292055', name: 'Surgical Technologists' },
    'radiologic-technologist': { soc: '292034', name: 'Radiologic Technologists and Technicians' },
    'ultrasound-technician': { soc: '292032', name: 'Diagnostic Medical Sonographers' },
};

/**
 * BLS FIPS State Codes
 * Used in OES series IDs: OEUS[STATE][AREA][OCCUPATION][DATATYPE]
 */
export const STATE_FIPS_CODES: Record<string, string> = {
    'national': '00',
    'al': '01', 'ak': '02', 'az': '04', 'ar': '05', 'ca': '06',
    'co': '08', 'ct': '09', 'de': '10', 'dc': '11', 'fl': '12',
    'ga': '13', 'hi': '15', 'id': '16', 'il': '17', 'in': '18',
    'ia': '19', 'ks': '20', 'ky': '21', 'la': '22', 'me': '23',
    'md': '24', 'ma': '25', 'mi': '26', 'mn': '27', 'ms': '28',
    'mo': '29', 'mt': '30', 'ne': '31', 'nv': '32', 'nh': '33',
    'nj': '34', 'nm': '35', 'ny': '36', 'nc': '37', 'nd': '38',
    'oh': '39', 'ok': '40', 'or': '41', 'pa': '42', 'pr': '72',
    'ri': '44', 'sc': '45', 'sd': '46', 'tn': '47', 'tx': '48',
    'ut': '49', 'vt': '50', 'va': '51', 'wa': '53', 'wv': '54',
    'wi': '55', 'wy': '56',
};

/**
 * OES Data Type Codes
 * Reference: BLS OES series ID format
 */
export const OES_DATA_TYPES = {
    HOURLY_10TH: '01',
    HOURLY_25TH: '02',
    EMPLOYMENT: '03',
    HOURLY_MEAN: '04',
    ANNUAL_MEAN: '05',
    HOURLY_MEDIAN: '06',
    ANNUAL_MEDIAN: '07',
    HOURLY_75TH: '08',
    HOURLY_90TH: '09',
    ANNUAL_10TH: '10',
    ANNUAL_25TH: '11',
    ANNUAL_75TH: '12',
    ANNUAL_90TH: '13',
} as const;

/**
 * Build a BLS OES series ID
 * 
 * National format: OEUN0000000000000[OCCUPATION][DATATYPE] (26 chars)
 * State format:    OEUS[STATE]000000000000[OCCUPATION][DATATYPE] (26 chars)
 * 
 * @param stateCode - 'national' or state FIPS code (2 digits)
 * @param socCode - SOC occupation code (6 digits, no hyphen)
 * @param dataType - Data type code (2 digits)
 */
export function buildSeriesId(
    stateCode: string,
    socCode: string,
    dataType: string
): string {
    // Both formats produce 25-character series IDs
    // OEUN/OEUS (4) + area code (13) + occupation (6) + datatype (2) = 25 chars
    if (stateCode === '00') {
        // National data: OEUN + 13 zeros + SOC (6) + type (2)
        return `OEUN0000000000000${socCode}${dataType}`;
    } else {
        // State data: OEUS + state (2) + 11 zeros + SOC (6) + type (2)
        return `OEUS${stateCode}00000000000${socCode}${dataType}`;
    }
}

/**
 * Generate all series IDs for a profession in a specific location
 */
export function getWageSeriesIds(
    professionSlug: string,
    stateCode: string = 'national'
): string[] {
    const profession = PROFESSION_SOC_CODES[professionSlug];
    if (!profession) {
        throw new Error(`Unknown profession: ${professionSlug}`);
    }

    const fips = STATE_FIPS_CODES[stateCode];
    if (!fips) {
        throw new Error(`Unknown state code: ${stateCode}`);
    }

    // Get all wage-related data types
    const dataTypes = [
        OES_DATA_TYPES.EMPLOYMENT,
        OES_DATA_TYPES.HOURLY_MEAN,
        OES_DATA_TYPES.HOURLY_MEDIAN,
        OES_DATA_TYPES.HOURLY_10TH,
        OES_DATA_TYPES.HOURLY_25TH,
        OES_DATA_TYPES.HOURLY_75TH,
        OES_DATA_TYPES.HOURLY_90TH,
        OES_DATA_TYPES.ANNUAL_MEAN,
        OES_DATA_TYPES.ANNUAL_MEDIAN,
        OES_DATA_TYPES.ANNUAL_10TH,
        OES_DATA_TYPES.ANNUAL_25TH,
        OES_DATA_TYPES.ANNUAL_75TH,
        OES_DATA_TYPES.ANNUAL_90TH,
    ];

    return dataTypes.map(dt => buildSeriesId(fips, profession.soc, dt));
}

/**
 * BLS API Response Types
 */
interface BLSSeriesData {
    seriesID: string;
    data: {
        year: string;
        period: string;
        periodName: string;
        value: string;
        footnotes: { code: string; text: string }[];
    }[];
}

interface BLSAPIResponse {
    status: string;
    responseTime: number;
    message: string[];
    Results?: {
        series: BLSSeriesData[];
    };
}

/**
 * Fetch data from BLS API
 * 
 * @param seriesIds - Array of series IDs to fetch
 * @param startYear - Start year for data range
 * @param endYear - End year for data range
 */
export async function fetchBLSData(
    seriesIds: string[],
    startYear: number = new Date().getFullYear() - 1,
    endYear: number = new Date().getFullYear()
): Promise<BLSAPIResponse> {
    if (seriesIds.length > MAX_SERIES_PER_REQUEST) {
        throw new Error(`Cannot request more than ${MAX_SERIES_PER_REQUEST} series at once`);
    }

    const payload = {
        seriesid: seriesIds,
        startyear: startYear.toString(),
        endyear: endYear.toString(),
        registrationkey: BLS_API_KEY,
    };

    const response = await fetch(BLS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`BLS API request failed: ${response.status} ${response.statusText}`);
    }

    const data: BLSAPIResponse = await response.json();

    if (data.status !== 'REQUEST_SUCCEEDED') {
        throw new Error(`BLS API error: ${data.message.join(', ')}`);
    }

    return data;
}

/**
 * Parsed wage data structure
 */
export interface WageData {
    professionSlug: string;
    stateCode: string;
    year: number;
    employment?: number;
    hourlyMean?: number;
    hourlyMedian?: number;
    hourly10th?: number;
    hourly25th?: number;
    hourly75th?: number;
    hourly90th?: number;
    annualMean?: number;
    annualMedian?: number;
    annual10th?: number;
    annual25th?: number;
    annual75th?: number;
    annual90th?: number;
}

/**
 * Parse series ID to extract data type
 */
function getDataTypeFromSeriesId(seriesId: string): string {
    // Series ID format: OEUS[2][5][6][2] = 17 chars
    // Data type is last 2 characters
    return seriesId.slice(-2);
}

/**
 * Parse BLS API response into structured wage data
 */
export function parseWageData(
    response: BLSAPIResponse,
    professionSlug: string,
    stateCode: string
): WageData[] {
    const results: Map<number, WageData> = new Map();

    if (!response.Results?.series) {
        return [];
    }

    for (const series of response.Results.series) {
        const dataType = getDataTypeFromSeriesId(series.seriesID);

        for (const dataPoint of series.data) {
            // Only use annual data (period M13 = annual average)
            if (dataPoint.period !== 'A01' && dataPoint.period !== 'M13') {
                continue;
            }

            const year = parseInt(dataPoint.year);
            const value = parseFloat(dataPoint.value);

            if (isNaN(value)) continue;

            // Get or create wage data for this year
            let wageData = results.get(year);
            if (!wageData) {
                wageData = {
                    professionSlug,
                    stateCode,
                    year,
                };
                results.set(year, wageData);
            }

            // Map data type to field
            switch (dataType) {
                case OES_DATA_TYPES.EMPLOYMENT:
                    wageData.employment = Math.round(value);
                    break;
                case OES_DATA_TYPES.HOURLY_MEAN:
                    wageData.hourlyMean = value;
                    break;
                case OES_DATA_TYPES.HOURLY_MEDIAN:
                    wageData.hourlyMedian = value;
                    break;
                case OES_DATA_TYPES.HOURLY_10TH:
                    wageData.hourly10th = value;
                    break;
                case OES_DATA_TYPES.HOURLY_25TH:
                    wageData.hourly25th = value;
                    break;
                case OES_DATA_TYPES.HOURLY_75TH:
                    wageData.hourly75th = value;
                    break;
                case OES_DATA_TYPES.HOURLY_90TH:
                    wageData.hourly90th = value;
                    break;
                case OES_DATA_TYPES.ANNUAL_MEAN:
                    wageData.annualMean = value;
                    break;
                case OES_DATA_TYPES.ANNUAL_MEDIAN:
                    wageData.annualMedian = value;
                    break;
                case OES_DATA_TYPES.ANNUAL_10TH:
                    wageData.annual10th = value;
                    break;
                case OES_DATA_TYPES.ANNUAL_25TH:
                    wageData.annual25th = value;
                    break;
                case OES_DATA_TYPES.ANNUAL_75TH:
                    wageData.annual75th = value;
                    break;
                case OES_DATA_TYPES.ANNUAL_90TH:
                    wageData.annual90th = value;
                    break;
            }
        }
    }

    return Array.from(results.values());
}

/**
 * Fetch complete wage data for a profession in a specific location
 */
export async function getWageDataForProfession(
    professionSlug: string,
    stateCode: string = 'national'
): Promise<WageData[]> {
    const seriesIds = getWageSeriesIds(professionSlug, stateCode);
    const response = await fetchBLSData(seriesIds);
    return parseWageData(response, professionSlug, stateCode);
}

/**
 * Fetch wage data for multiple professions with rate limiting
 */
export async function getWageDataBatch(
    professionSlugs: string[],
    stateCode: string = 'national'
): Promise<WageData[]> {
    const allData: WageData[] = [];

    for (const slug of professionSlugs) {
        try {
            const data = await getWageDataForProfession(slug, stateCode);
            allData.push(...data);

            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
        } catch (error) {
            console.error(`Failed to fetch data for ${slug} in ${stateCode}:`, error);
        }
    }

    return allData;
}

/**
 * Get all state codes (excluding national)
 */
export function getAllStateCodes(): string[] {
    return Object.keys(STATE_FIPS_CODES).filter(code => code !== 'national');
}

/**
 * Get all profession slugs
 */
export function getAllProfessionSlugs(): string[] {
    return Object.keys(PROFESSION_SOC_CODES);
}
