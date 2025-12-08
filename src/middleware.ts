import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    console.log('[Middleware] Path:', path);

    // Match salary pages: 
    // - /[profession]-salary (national)
    // - /[profession]-salary/[state] (state)
    // - /[profession]-salary/[state]/[city] (city)
    const salaryMatch = path.match(/^\/([a-z0-9-]+)-salary(?:\/([a-z0-9-]+))?(?:\/([a-z0-9-]+))?$/);

    if (salaryMatch) {
        const [_, profession, state, city] = salaryMatch;

        console.log('[Middleware] Matched salary page:', { profession, state, city });

        // Rewrite to our salary page with query params
        const url = request.nextUrl.clone();
        url.pathname = '/salary-page';
        url.searchParams.set('profession', profession);
        if (state) {
            url.searchParams.set('location', state);
        }
        if (city) {
            url.searchParams.set('city', city);
        }

        console.log('[Middleware] Rewriting to:', url.toString());

        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}
