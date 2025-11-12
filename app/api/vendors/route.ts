import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const status = searchParams.get('status')
    const industry = searchParams.get('industry')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (industry) {
      where.industry = industry
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        include: {
          scores: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          risks: {
            where: { status: 'ACTIVE' },
            orderBy: { severity: 'desc' },
            take: 3,
          },
          externalReviews: {
            take: 3,
            orderBy: { rating: 'desc' },
          },
          features: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vendor.count({ where }),
    ])

    return NextResponse.json({
      vendors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const vendor = await prisma.vendor.create({
      data: {
        name: body.name,
        website: body.website,
        description: body.description,
        email: body.email,
        phone: body.phone,
        address: body.address,
        companySize: body.companySize,
        industry: body.industry,
        founded: body.founded,
        status: body.status || 'PENDING',
      },
    })

    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}
