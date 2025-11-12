import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parse } from 'csv-parse/sync'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const text = await file.text()
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    })

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const record of records) {
      try {
        // Find or create vendor
        let vendor = await prisma.vendor.findFirst({
          where: { name: record.vendorName },
        })

        if (!vendor) {
          vendor = await prisma.vendor.create({
            data: {
              name: record.vendorName,
              status: 'ACTIVE',
            },
          })
        }

        // Create internal record
        await prisma.internalRecord.create({
          data: {
            vendorId: vendor.id,
            projectName: record.projectName,
            projectCategory: record.projectCategory || 'General',
            contractValue: parseFloat(record.contractValue),
            startDate: new Date(record.startDate),
            endDate: record.endDate ? new Date(record.endDate) : null,
            deliverySuccessRate: parseFloat(record.deliverySuccessRate) || 80,
            qualityScore: parseFloat(record.qualityScore) || 80,
            costEfficiency: parseFloat(record.costEfficiency) || 75,
            responseTime: parseFloat(record.responseTime) || 24,
            complianceScore: parseFloat(record.complianceScore) || 90,
            incidentCount: parseInt(record.incidentCount) || 0,
            notes: record.notes || '',
          },
        })

        results.success++
      } catch (error: any) {
        results.failed++
        results.errors.push(`Row ${results.success + results.failed}: ${error.message}`)
      }
    }

    return NextResponse.json({
      message: 'Upload completed',
      results,
    })
  } catch (error) {
    console.error('Error uploading records:', error)
    return NextResponse.json(
      { error: 'Failed to upload records' },
      { status: 500 }
    )
  }
}
