import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requiredRole = searchParams.get('role');
  const nextUrl = searchParams.get('next') || '/';
  
  const token = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user_role')?.value || 'CLIENT';

  // Authentication Check
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Authorization Check
  if (requiredRole && userRole !== requiredRole) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // If all checks pass, redirect to the intended page
  return NextResponse.redirect(new URL(nextUrl, request.url));
}
