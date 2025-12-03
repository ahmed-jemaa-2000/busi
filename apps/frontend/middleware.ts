import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Extract hostname without port
  const hostname = host.split(':')[0];
  const parts = hostname.split('.');

  // Determine if this is a subdomain request
  // For production: *.brandini.tn (3+ parts, not dashboard/api)
  // For development: *.brandini.test (3+ parts, not dashboard/api)
  const isDevelopment = hostname.includes('.test') || hostname.includes('localhost');
  const baseDomain = isDevelopment ? '.brandini.test' : '.brandini.tn';
  const minParts = isDevelopment || hostname.includes('.tn') ? 3 : 2;

  const isSubdomain = parts.length >= minParts &&
    !hostname.startsWith('dashboard.') &&
    !hostname.startsWith('api.') &&
    !hostname.startsWith('www.');

  // STOREFRONT ROUTING (Subdomain-based)
  if (isSubdomain) {
    const subdomain = parts[0];

    // Skip API routes, static files, and Next.js internals
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/static/')
    ) {
      return NextResponse.next();
    }

    // Rewrite to storefront with subdomain parameter
    const rewriteUrl = new URL(pathname, request.url);
    rewriteUrl.searchParams.set('subdomain', subdomain);

    // Rewrite to (storefront) route group
    return NextResponse.rewrite(new URL(`${pathname}${rewriteUrl.search}`, request.url));
  }

  // DASHBOARD ROUTING
  if (pathname.startsWith('/dashboard')) {
    // Ensure dashboard routes are accessed via dashboard subdomain
    if (!hostname.startsWith('dashboard.')) {
      // Redirect to dashboard subdomain
      const dashboardUrl = new URL(request.url);
      dashboardUrl.host = `dashboard${baseDomain}`;
      return NextResponse.redirect(dashboardUrl);
    }

    // Check authentication for protected dashboard routes
    if (pathname !== '/dashboard/login') {
      const token = request.cookies.get('auth_token');

      if (!token) {
        // Redirect to login
        const loginUrl = new URL('/dashboard/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Optional: Verify token with Strapi
      // For now, we trust the cookie exists
      // You can add token verification here if needed
    }

    return NextResponse.next();
  }

  // MAIN DOMAIN ROUTING (brandini.tn or brandini.test)
  if (
    hostname === 'brandini.tn' ||
    hostname === 'brandini.test' ||
    hostname === 'localhost' ||
    hostname.startsWith('localhost:')
  ) {
    // Redirect main domain to dashboard
    if (pathname === '/' || pathname === '') {
      const dashboardUrl = new URL(request.url);
      dashboardUrl.host = `dashboard${baseDomain}`;
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  // Default: continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
