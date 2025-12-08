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

        // Rewrite to our salary handler
        const url = request.nextUrl.clone();
        url.pathname = '/api/salary-page';

        // Pass parameters via headers (query params don't survive rewrites)
        const headers = new Headers(request.headers);
        headers.set('x-salary-profession', profession);
        if (location) {
            headers.set('x-salary-location', location);
        }

        console.log('[Middleware] Rewriting to:', url.toString());

        return NextResponse.rewrite(url, {
            request: {
                headers: headers,
            },
        });
    }

    return NextResponse.next();
}
