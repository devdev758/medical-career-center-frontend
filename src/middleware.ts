import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    console.log('[Middleware] Path:', path);

    // Match salary pages: /[profession]-salary or /[profession]-salary/[location]
    const salaryMatch = path.match(/^\/([a-z0-9-]+)-salary(?:\/([a-z0-9-]+))?$/);

    if (salaryMatch) {
        const [_, profession, location] = salaryMatch;

        console.log('[Middleware] Matched salary page:', { profession, location });

        // Rewrite to our salary page with query params
        const url = request.nextUrl.clone();
        url.pathname = '/salary-page';
        url.searchParams.set('profession', profession);
        if (location) {
            url.searchParams.set('location', location);
        }

        console.log('[Middleware] Rewriting to:', url.toString());

        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}
