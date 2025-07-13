import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the access token from environment
  const requiredToken = process.env.ACCESS_TOKEN;
  console.log('Access Token:', requiredToken ? 'Configured' : 'Not Configured');
  
  // Skip auth check if no token is configured (development mode)
  if (!requiredToken) {
    return NextResponse.next();
  }

  // Check for token in Authorization header (Bearer token format)
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  // Also check for token in X-Access-Token header (alternative)
  const accessToken = request.headers.get('X-Access-Token');
  
  // Allow access if either token matches
  const providedToken = bearerToken || accessToken;
  
  if (!providedToken || providedToken !== requiredToken) {
    // Return 401 Unauthorized for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized. Valid access token required.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Return 401 with HTML for web pages
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div>error</div>
        </body>
      </html>`,
      {
        status: 401,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except static assets and Next.js internals
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
