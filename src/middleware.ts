import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Match salary pages: /[profession]-salary or /[profession]-salary/[location]
    const salaryMatch = path.match(/^\/([a-z0-9-]+)-salary(?:\/([a-z0-9-]+))?$/);

    if (salaryMatch) {
        const [_, profession, location] = salaryMatch;

        // Rewrite to our salary handler
        const url = request.nextUrl.clone();
        url.pathname = '/api/salary-page';
        url.searchParams.set('profession', profession);
        if (location) {
            url.searchParams.set('location', location);
        }

        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/:path*-salary',
        '/:path*-salary/:location*',
    ],
};
