import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle how-to-become URLs
    const howToMatch = pathname.match(/^\/how-to-become-([a-z0-9-]+)$/i);
    if (howToMatch) {
        const profession = howToMatch[1];
        return NextResponse.rewrite(new URL(`/career-guide/${profession}`, request.url));
    }

    // Handle salary pages
    const salaryMatch = pathname.match(/^\/([a-z0-9-]+)-salary(?:\/([a-z]{2}))?(?:\/([a-z0-9-]+))?$/i);
    if (salaryMatch) {
        const [, profession, state, city] = salaryMatch;
        const url = new URL('/salary-page', request.url);
        url.searchParams.set('profession', profession);
        if (state) url.searchParams.set('location', state);
        if (city) url.searchParams.set('city', city);
        return NextResponse.rewrite(url);
    }

    // Handle job pages
    const jobsMatch = pathname.match(/^\/([a-z0-9-]+)-jobs(?:\/([a-z]{2}))?(?:\/([a-z0-9-]+))?$/i);
    if (jobsMatch) {
        const [, profession, state, city] = jobsMatch;
        const url = new URL('/jobs-page', request.url);
        url.searchParams.set('profession', profession);
        if (state) url.searchParams.set('location', state);
        if (city) url.searchParams.set('city', city);
        return NextResponse.rewrite(url);
    }

    // Handle profession spoke pages
    const spokesMatch = pathname.match(/^\/([a-z0-9-]+)-(schools|certification|interview-questions|resume|specializations|skills|career-path|work-life-balance)(?:\/([a-z-]+))?$/i);
    if (spokesMatch) {
        const [, profession, spokeType, state] = spokesMatch;
        // Map URL spoke types to page directory names
        const pageTypeMap: Record<string, string> = {
            'interview-questions': 'interview',
            'work-life-balance': 'work-life-balance',
            'career-path': 'career-path',
        };
        const pageType = pageTypeMap[spokeType] || spokeType;
        const url = new URL(`/${pageType}-page`, request.url);
        url.searchParams.set('profession', profession);
        if (state) url.searchParams.set('state', state);
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/how-to-become-:path*',
        '/:path*-salary',
        '/:path*-salary/:state',
        '/:path*-salary/:state/:city',
        '/:path*-jobs',
        '/:path*-jobs/:state',
        '/:path*-jobs/:state/:city',
        '/:path*-schools',
        '/:path*-schools/:state',
        '/:path*-certification',
        '/:path*-interview-questions',
        '/:path*-resume',
        '/:path*-specializations',
        '/:path*-skills',
        '/:path*-career-path',
        '/:path*-work-life-balance',
    ],
};
