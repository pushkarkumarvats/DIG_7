import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Allow public access to auth pages
    if (path.startsWith('/auth/')) {
      return NextResponse.next()
    }

    // Protect API routes
    if (path.startsWith('/api/')) {
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Role-based access control for sensitive operations
      const role = token.role as string

      // Only ADMIN and MANAGER can create/update/delete vendors
      if (
        (path.includes('/api/vendors') && req.method !== 'GET') ||
        path.includes('/api/vendors/score') ||
        path.includes('/api/vendors/scrape')
      ) {
        if (role !== 'ADMIN' && role !== 'MANAGER') {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }
      }

      // Only ADMIN can access audit logs
      if (path.includes('/api/audit-logs') && role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    // Protect dashboard routes
    if (path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
  ],
}
