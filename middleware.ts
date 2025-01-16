import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip the root layout for admin routes
    return NextResponse.next({
      request: {
        headers: new Headers({
          'x-middleware-skip-root-layout': '1',
        }),
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 