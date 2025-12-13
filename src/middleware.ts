import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle how-to-become career guide pages
    const careerGuideMatch = pathname.match(/^\/how-to-become-([a-z0-9-]+)$/i);
    if (careerGuideMatch) {
        const [, profession] = careerGuideMatch;
        const url = request.nextUrl.clone();
        url.pathname = `/career-guide/${profession}`;
        return NextResponse.rewrite(url);
    }

    // Handle salary pages (existing)
    const salaryMatch = pathname.match(/^\/([a-z0-9-]+)-salary(?:\/([a-z]{2})(?:\/([a-z0-9-]+))?)?$/i);
    if (salaryMatch) {
        const [, profession, state, city] = salaryMatch;
        const url = request.nextUrl.clone();
        url.pathname = '/salary-page';
        url.searchParams.set('profession', profession);
        if (state) url.searchParams.set('location', state);
        if (city) url.searchParams.set('city', city);
        return NextResponse.rewrite(url);
    }

    // Handle job pages (new)
    const jobMatch = pathname.match(/^\/([a-z0-9-]+)-jobs(?:\/([a-z]{2})(?:\/([a-z0-9-]+))?)?$/i);
    if (jobMatch) {
        const [, profession, state, city] = jobMatch;
        const url = request.nextUrl.clone();
        url.pathname = '/jobs-page';
        url.searchParams.set('profession', profession);
        if (state) url.searchParams.set('location', state);
        if (city) url.searchParams.set('city', city);
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/how-to-become-:path*',
        '/:path*-salary/:path*',
        '/:path*-jobs/:path*'
    ]
};
