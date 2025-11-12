import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateVendorScore } from '@/lib/ml-scoring'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId } = body

    if (!vendorId) {
      return NextResponse.json(
        { error: 'vendorId is required' },
        { status: 400 }
      )
    }

    // Fetch vendor with all related data
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        internalRecords: true,
        externalReviews: true,
        features: true,
        risks: {
          where: { status: 'ACTIVE' },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Calculate scores using ML algorithm
    const scores = calculateVendorScore(vendor)

    // Determine risk indicators
    const riskIndicators = []
    if (scores.riskScore > 50) {
      riskIndicators.push({
        type: 'HIGH_RISK',
        message: 'Vendor has high risk indicators',
      })
    }
    if (scores.reliabilityScore < 60) {
      riskIndicators.push({
        type: 'LOW_RELIABILITY',
        message: 'Vendor reliability is below threshold',
      })
    }
    if (scores.costScore < 50) {
      riskIndicators.push({
        type: 'COST_CONCERN',
        message: 'Cost efficiency is below average',
      })
    }

    // Generate explainability data
    const explainability = {
      strengths: [],
      weaknesses: [],
      recommendations: [],
    }

    if (scores.reliabilityScore > 80) {
      explainability.strengths.push('High reliability with consistent delivery')
    }
    if (scores.capabilityScore > 80) {
      explainability.strengths.push('Strong technical capabilities and certifications')
    }
    if (scores.reputationScore > 80) {
      explainability.strengths.push('Excellent reputation and customer reviews')
    }

    if (scores.costScore < 60) {
      explainability.weaknesses.push('Cost efficiency needs improvement')
    }
    if (scores.riskScore > 40) {
      explainability.weaknesses.push('Some risk factors identified')
    }

    if (scores.totalScore > 80) {
      explainability.recommendations.push('Highly recommended for critical projects')
    } else if (scores.totalScore > 60) {
      explainability.recommendations.push('Suitable for standard projects with monitoring')
    } else {
      explainability.recommendations.push('Consider alternative vendors or additional due diligence')
    }

    // Store scores in database
    const vendorScore = await prisma.vendorScore.create({
      data: {
        vendorId,
        totalScore: scores.totalScore,
        reliabilityScore: scores.reliabilityScore,
        costScore: scores.costScore,
        capabilityScore: scores.capabilityScore,
        performanceScore: scores.performanceScore,
        reputationScore: scores.reputationScore,
        riskScore: scores.riskScore,
        mlPredictionScore: scores.totalScore,
        embeddingScore: 0.85,
        scoreBreakdown: scores.breakdown,
        rankingFactors: explainability,
        modelVersion: 'v1.0.0',
      },
    })

    return NextResponse.json({
      success: true,
      vendorId,
      scores: vendorScore,
      riskIndicators,
      explainability,
    })
  } catch (error) {
    console.error('Error calculating vendor score:', error)
    return NextResponse.json(
      { error: 'Failed to calculate vendor score' },
      { status: 500 }
    )
  }
}
