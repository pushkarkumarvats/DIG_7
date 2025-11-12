import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, vendorId, action, entity, entityId, details } = body

    const auditLog = await prisma.auditLog.create({
      data: {
        userId,
        vendorId,
        action,
        entity,
        entityId,
        details,
      },
    })

    return NextResponse.json(auditLog)
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const vendorId = searchParams.get('vendorId')
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (userId) where.userId = userId
    if (vendorId) where.vendorId = vendorId
    if (action) where.action = action

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vendor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
