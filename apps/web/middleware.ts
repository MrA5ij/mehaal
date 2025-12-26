import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose' // Standard Node crypto doesn't work in Edge

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const token = request.cookies.get('auth-token')?.value 
  
  // 1. PUBLIC ROUTES (Skip Auth)
  const isPublic = 
      url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/api/auth') || 
      url.pathname.startsWith('/static') ||
      url.pathname === '/' || 
      url.pathname === '/login' || 
      url.pathname === '/signup' ||
      url.pathname === '/register' ||
      url.pathname === '/forgot-password' ||
      url.pathname === '/verify-email' ||
      url.pathname === '/onboarding';

  if (isPublic) {
    return NextResponse.next()
  }

  // 2. AUTHENTICATION GUARD (Zero Trust Verification)
  if (!token) {
    return redirectToLogin(request);
  }

  try {
    // Secret verification - "Jose" library is essential for Vercel Edge functions
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_dev_secret');
    const { payload } = await jwtVerify(token, secret);
    
    // Token is valid, check Role
    const userRole = (payload.role as string) || 'CLIENT';

    // 3. ROLE-BASED ACCESS CONTROL (RBAC)
    if (url.pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', request.url)) // Explicit Forbidden Page
    }

    if (url.pathname.startsWith('/franchise') && userRole !== 'FRANCHISE') {
       return NextResponse.redirect(new URL('/403', request.url))
    }

    // Attach user info headers for backend services to read
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub as string);
    requestHeaders.set('x-user-role', userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err) {
    // Token tampered or expired
    const error = err instanceof Error ? err.message : String(err);
    console.error('Middleware Auth Failed:', error);
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 