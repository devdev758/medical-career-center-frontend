import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STATE_NAME_TO_ABBR: Record<string, string> = {
    'alabama': 'al', 'alaska': 'ak', 'arizona': 'az', 'arkansas': 'ar', 'california': 'ca',
    'colorado': 'co', 'connecticut': 'ct', 'delaware': 'de', 'florida': 'fl', 'georgia': 'ga',
    'hawaii': 'hi', 'idaho': 'id', 'illinois': 'il', 'indiana': 'in', 'iowa': 'ia',
    'kansas': 'ks', 'kentucky': 'ky', 'louisiana': 'la', 'maine': 'me', 'maryland': 'md',
    'massachusetts': 'ma', 'michigan': 'mi', 'minnesota': 'mn', 'mississippi': 'ms',
    'missouri': 'mo', 'montana': 'mt', 'nebraska': 'ne', 'nevada': 'nv', 'new-hampshire': 'nh',
    'new-jersey': 'nj', 'new-mexico': 'nm', 'new-york': 'ny', 'north-carolina': 'nc',
    'north-dakota': 'nd', 'ohio': 'oh', 'oklahoma': 'ok', 'oregon': 'or', 'pennsylvania': 'pa',
    'rhode-island': 'ri', 'south-carolina': 'sc', 'south-dakota': 'sd', 'tennessee': 'tn',
    'texas': 'tx', 'utah': 'ut', 'vermont': 'vt', 'virginia': 'va', 'washington': 'wa',
    'west-virginia': 'wv', 'wisconsin': 'wi', 'wyoming': 'wy', 'district-of-columbia': 'dc',
};

function cleanProfessionSlug(rawSlug: string): string {
    let slug = rawSlug.toLowerCase().trim();
    if (slug.startsWith('an-')) {
        slug = slug.substring(3);
    } else if (slug.startsWith('a-')) {
        slug = slug.substring(2);
    }

    const mapping: Record<string, string> = {
        'registered-nurses': 'registered-nurse',
        'licensed-practical-nurses': 'licensed-practical-nurse',
        'nurse-practitioners': 'nurse-practitioner',
        'physician-assistants': 'physician-assistant',
        'physical-therapists': 'physical-therapist',
        'occupational-therapists': 'occupational-therapist',
        'respiratory-therapists': 'respiratory-therapist',
        'medical-assistants': 'medical-assistant',
        'dental-hygienists': 'dental-hygienist',
        'dental-assistants': 'dental-assistant',
        'pharmacy-technicians': 'pharmacy-technician',
        'phlebotomists': 'phlebotomist',
        'emt-paramedics': 'emt-paramedic',
        'surgical-technologists': 'surgical-technologist',
        'radiologic-technologists': 'radiologic-technologist',
        'ultrasound-technicians': 'ultrasound-technician',
        'nursing-assistants': 'cna',
        
        'nursing-assistant': 'cna',
        'certified-nursing-assistant': 'cna',
        'certified-nursing-assistants': 'cna',
        'surgical-tech': 'surgical-technologist',
        'surgical-technician': 'surgical-technologist',
        'surgical-technicians': 'surgical-technologist',
        'ultrasound-tech': 'ultrasound-technician',
    };

    return mapping[slug] || slug;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Direct custom legacy URL maps
    if (pathname === '/medical-technician/biomedical-engineering') {
        return NextResponse.redirect(new URL('/biomedical-equipment-technician', request.url), 301);
    }
    if (pathname === '/surgical-tech-program') {
        return NextResponse.redirect(new URL('/surgical-technologist/schools', request.url), 301);
    }

    // 2. Program spoke redirect (e.g. /cna-program -> /cna/schools)
    const programMatch = pathname.match(/^\/([a-z0-9-]+)-program$/i);
    if (programMatch) {
        const profession = cleanProfessionSlug(programMatch[1]);
        return NextResponse.redirect(new URL(`/${profession}/schools`, request.url), 301);
    }

    // 3. How-to-become redirect
    const howToMatch = pathname.match(/^\/how-to-become-([a-z0-9-]+)$/i);
    if (howToMatch) {
        const profession = cleanProfessionSlug(howToMatch[1]);
        return NextResponse.redirect(new URL(`/${profession}/how-to-become`, request.url), 301);
    }

    // 4. Salary state redirects (e.g. /ultrasound-technician-salary-delaware -> /ultrasound-technician/salary/de)
    const salaryStateMatch = pathname.match(/^\/([a-z0-9-]+)-salary-([a-z0-9-]+)$/i);
    if (salaryStateMatch) {
        const profession = cleanProfessionSlug(salaryStateMatch[1]);
        const stateRaw = salaryStateMatch[2];
        const stateCode = stateRaw.length === 2 ? stateRaw.toLowerCase() : (STATE_NAME_TO_ABBR[stateRaw.toLowerCase()] || stateRaw.toLowerCase());
        return NextResponse.redirect(new URL(`/${profession}/salary/${stateCode}`, request.url), 301);
    }

    // 5. Jobs state redirects (e.g. /ultrasound-technician-jobs-delaware -> /ultrasound-technician/jobs/de)
    const jobsStateMatch = pathname.match(/^\/([a-z0-9-]+)-jobs-([a-z0-9-]+)$/i);
    if (jobsStateMatch) {
        const profession = cleanProfessionSlug(jobsStateMatch[1]);
        const stateRaw = jobsStateMatch[2];
        const stateCode = stateRaw.length === 2 ? stateRaw.toLowerCase() : (STATE_NAME_TO_ABBR[stateRaw.toLowerCase()] || stateRaw.toLowerCase());
        return NextResponse.redirect(new URL(`/${profession}/jobs/${stateCode}`, request.url), 301);
    }

    // 6. Schools state redirects (e.g. /ultrasound-technician-schools-delaware -> /ultrasound-technician/schools/de)
    const schoolsStateMatch = pathname.match(/^\/([a-z0-9-]+)-schools-([a-z0-9-]+)$/i);
    if (schoolsStateMatch) {
        const profession = cleanProfessionSlug(schoolsStateMatch[1]);
        const stateRaw = schoolsStateMatch[2];
        const stateCode = stateRaw.length === 2 ? stateRaw.toLowerCase() : (STATE_NAME_TO_ABBR[stateRaw.toLowerCase()] || stateRaw.toLowerCase());
        return NextResponse.redirect(new URL(`/${profession}/schools/${stateCode}`, request.url), 301);
    }

    // 7. General Salary redirect (e.g. /ultrasound-technician-salary -> /ultrasound-technician/salary)
    const salaryMatch = pathname.match(/^\/([a-z0-9-]+)-salary(?:\/([a-z]{2})(?:\/([a-z0-9-]+))?)?$/i);
    if (salaryMatch) {
        const profession = cleanProfessionSlug(salaryMatch[1]);
        const state = salaryMatch[2];
        const city = salaryMatch[3];
        const dest = `/${profession}/salary${state ? '/' + state.toLowerCase() : ''}${city ? '/' + city.toLowerCase() : ''}`;
        return NextResponse.redirect(new URL(dest, request.url), 301);
    }

    // 8. General Jobs redirect (e.g. /ultrasound-technician-jobs -> /ultrasound-technician/jobs)
    const jobsMatch = pathname.match(/^\/([a-z0-9-]+)-jobs(?:\/([a-z]{2})(?:\/([a-z0-9-]+))?)?$/i);
    if (jobsMatch) {
        const profession = cleanProfessionSlug(jobsMatch[1]);
        const state = jobsMatch[2];
        const city = jobsMatch[3];
        const dest = `/${profession}/jobs${state ? '/' + state.toLowerCase() : ''}${city ? '/' + city.toLowerCase() : ''}`;
        return NextResponse.redirect(new URL(dest, request.url), 301);
    }

    // 9. General Schools redirect (e.g. /ultrasound-technician-schools -> /ultrasound-technician/schools)
    const schoolsMatch = pathname.match(/^\/([a-z0-9-]+)-schools(?:\/([a-z]{2}))?$/i);
    if (schoolsMatch) {
        const profession = cleanProfessionSlug(schoolsMatch[1]);
        const state = schoolsMatch[2];
        const dest = `/${profession}/schools${state ? '/' + state.toLowerCase() : ''}`;
        return NextResponse.redirect(new URL(dest, request.url), 301);
    }

    // 10. General Spokes redirect
    const spokesMatch = pathname.match(/^\/([a-z0-9-]+)-(certification|license|interview-questions|resume|specializations|skills|career-path|work-life-balance)$/i);
    if (spokesMatch) {
        const profession = cleanProfessionSlug(spokesMatch[1]);
        const spokeType = spokesMatch[2].toLowerCase();
        
        // Map URL spoke types to page directory names
        const pageTypeMap: Record<string, string> = {
            'interview-questions': 'interview',
            'certification': 'license',
            'work-life-balance': 'work-life-balance',
            'career-path': 'career-path',
        };
        const pageType = pageTypeMap[spokeType] || spokeType;
        return NextResponse.redirect(new URL(`/${profession}/${pageType}`, request.url), 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
