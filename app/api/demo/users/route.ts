import { NextRequest, NextResponse } from 'next/server'
import { getAllDemoUsers } from '@/lib/demo-auth'

/**
 * GET /api/demo/users
 * Returns all demo users (without passwords)
 * Works without database - instant setup!
 */
export async function GET(request: NextRequest) {
  try {
    const users = getAllDemoUsers()
    
    return NextResponse.json({
      success: true,
      message: 'Demo users ready! No database required.',
      mode: 'demo',
      users,
      info: {
        demoMode: true,
        requiresDatabase: false,
        instantLogin: true,
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get demo users',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
