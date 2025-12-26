import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const token = request.cookies.get('auth-token')?.value 
  // Secret: In prod, validate this JWT with Clerk/NextAuth secret

  // 1. PUBLIC ROUTES (Performance Optimization: Skip early)
  const isPublic = 
      url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/api') || 
      url.pathname.startsWith('/static') ||
      url.pathname === '/' || 
      url.pathname === '/login' || 
      url.pathname === '/register';

  if (isPublic) {
    return NextResponse.next()
  }

  // 2. AUTHENTICATION GUARD
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', url.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. ROLE-BASED ACCESS CONTROL (RBAC) Logic
  // Mocking decoding logic here. In real app: jwt.decode(token)
  const userRole = request.cookies.get('user_role')?.value || 'CLIENT';

  // Admin Protection
  if (url.pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Franchise Isolation
  if (url.pathname.startsWith('/franchise') && userRole !== 'FRANCHISE') {
     return NextResponse.redirect(new URL('/client', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
