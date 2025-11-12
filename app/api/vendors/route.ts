import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockVendors } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  // Demo mode: return mock data immediately
  const isDemoMode = process.env.DEMO_MODE === 'true'
  if (isDemoMode) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    let filteredVendors = mockVendors
    
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredVendors = mockVendors.filter(v => 
        v.name.toLowerCase().includes(lowerQuery) || 
        v.description?.toLowerCase().includes(lowerQuery)
      )
    }
    
    const total = filteredVendors.length
    const startIndex = (page - 1) * limit
    const paginatedVendors = filteredVendors.slice(startIndex, startIndex + limit)
    
    return NextResponse.json({
      vendors: paginatedVendors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  }

  // Database mode
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
  // Demo mode: return mock success
  const isDemoMode = process.env.DEMO_MODE === 'true'
  if (isDemoMode) {
    const body = await request.json()
    return NextResponse.json({
      id: `demo-${Date.now()}`,
      ...body,
      status: body.status || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { status: 201 })
  }

  // Database mode
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
