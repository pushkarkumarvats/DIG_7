import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateSimilarityScore } from '@/lib/ml-scoring'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requirement, category, maxResults = 10, minScore = 50 } = body

    if (!requirement) {
      return NextResponse.json(
        { error: 'requirement text is required' },
        { status: 400 }
      )
    }

    // Fetch all active vendors with their data
    const vendors = await prisma.vendor.findMany({
      where: {
        status: 'ACTIVE',
        ...(category && { industry: category }),
      },
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
        features: true,
        externalReviews: {
          take: 5,
        },
        internalRecords: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    // Calculate relevance scores for each vendor
    const rankedVendors = vendors.map((vendor) => {
      const latestScore = vendor.scores[0]
      const similarityScore = calculateSimilarityScore(requirement, vendor)
      
      // Combined score: 60% ML score + 40% similarity
      const combinedScore = latestScore
        ? latestScore.totalScore * 0.6 + similarityScore * 0.4
        : similarityScore

      return {
        vendor,
        combinedScore: parseFloat(combinedScore.toFixed(2)),
        similarityScore: parseFloat(similarityScore.toFixed(2)),
        mlScore: latestScore?.totalScore || 0,
        matchReasons: generateMatchReasons(requirement, vendor),
      }
    })

    // Filter and sort
    const filteredVendors = rankedVendors
      .filter((v) => v.combinedScore >= minScore)
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, maxResults)

    // Generate comparison data
    const comparison = {
      requirement,
      totalCandidates: vendors.length,
      qualifiedCandidates: filteredVendors.length,
      topVendors: filteredVendors.map((v) => ({
        id: v.vendor.id,
        name: v.vendor.name,
        score: v.combinedScore,
        mlScore: v.mlScore,
        similarityScore: v.similarityScore,
        matchReasons: v.matchReasons,
        riskLevel: v.vendor.risks[0]?.riskLevel || 'LOW',
        estimatedCost: estimateCost(v.vendor),
        strengths: extractStrengths(v.vendor),
        certifications: v.vendor.features?.[0]?.certifications || [],
      })),
      comparisonMatrix: generateComparisonMatrix(filteredVendors),
    }

    // Generate recommendation reasoning
    const reasoning = generateRecommendationReasoning(
      requirement,
      filteredVendors
    )

    return NextResponse.json({
      success: true,
      recommendation: comparison,
      reasoning,
      rankingCriteria: {
        mlScoreWeight: 0.6,
        similarityWeight: 0.4,
        minScoreThreshold: minScore,
      },
    })
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

function generateMatchReasons(requirement: string, vendor: any): string[] {
  const reasons: string[] = []
  const reqLower = requirement.toLowerCase()

  // Check for technology matches
  const technologies = vendor.features?.technologies || []
  const matchingTech = technologies.filter((tech: string) =>
    reqLower.includes(tech.toLowerCase())
  )
  if (matchingTech.length > 0) {
    reasons.push(`Expertise in ${matchingTech.join(', ')}`)
  }

  // Check for service matches
  const services = vendor.features?.services || []
  const matchingServices = services.filter((service: string) =>
    reqLower.includes(service.toLowerCase())
  )
  if (matchingServices.length > 0) {
    reasons.push(`Offers ${matchingServices.join(', ')}`)
  }

  // Check for industry match
  if (vendor.industry && reqLower.includes(vendor.industry.toLowerCase())) {
    reasons.push(`Specialized in ${vendor.industry}`)
  }

  // Check for certifications
  const certifications = vendor.features?.certifications || []
  if (certifications.length > 0) {
    reasons.push(`Certified: ${certifications.slice(0, 3).join(', ')}`)
  }

  // Check for performance
  const latestScore = vendor.scores[0]
  if (latestScore && latestScore.totalScore > 85) {
    reasons.push('High overall performance score')
  }

  return reasons.length > 0 ? reasons : ['General capability match']
}

function estimateCost(vendor: any): string {
  const records = vendor.internalRecords || []
  if (records.length > 0) {
    const avgCost = records.reduce((sum: number, r: any) => sum + r.contractValue, 0) / records.length
    if (avgCost > 200000) return 'High ($200k+)'
    if (avgCost > 100000) return 'Medium ($100k-$200k)'
    return 'Competitive (< $100k)'
  }
  return 'Contact for quote'
}

function extractStrengths(vendor: any): string[] {
  const strengths: string[] = []
  const latestScore = vendor.scores[0]

  if (latestScore) {
    if (latestScore.reliabilityScore > 85) strengths.push('High Reliability')
    if (latestScore.capabilityScore > 85) strengths.push('Strong Capabilities')
    if (latestScore.reputationScore > 85) strengths.push('Excellent Reputation')
    if (latestScore.riskScore < 20) strengths.push('Low Risk')
  }

  if (vendor.features?.yearsInBusiness > 10) {
    strengths.push('Established Provider')
  }

  if (vendor.features?.certifications?.length > 3) {
    strengths.push('Well Certified')
  }

  return strengths
}

function generateComparisonMatrix(rankedVendors: any[]): any {
  return {
    vendors: rankedVendors.slice(0, 5).map((v) => v.vendor.name),
    criteria: [
      {
        name: 'Overall Score',
        values: rankedVendors.slice(0, 5).map((v) => v.combinedScore),
      },
      {
        name: 'Reliability',
        values: rankedVendors.slice(0, 5).map((v) => v.vendor.scores[0]?.reliabilityScore || 0),
      },
      {
        name: 'Capability',
        values: rankedVendors.slice(0, 5).map((v) => v.vendor.scores[0]?.capabilityScore || 0),
      },
      {
        name: 'Cost Efficiency',
        values: rankedVendors.slice(0, 5).map((v) => v.vendor.scores[0]?.costScore || 0),
      },
      {
        name: 'Risk Level',
        values: rankedVendors.slice(0, 5).map((v) => 100 - (v.vendor.scores[0]?.riskScore || 50)),
      },
    ],
  }
}

function generateRecommendationReasoning(
  requirement: string,
  rankedVendors: any[]
): string {
  if (rankedVendors.length === 0) {
    return 'No vendors match the specified requirements. Consider broadening your search criteria.'
  }

  const topVendor = rankedVendors[0]
  const reasoning = [
    `Based on the requirement "${requirement}", we analyzed ${rankedVendors.length} qualified vendors.`,
    `Top recommendation: ${topVendor.vendor.name} with a combined score of ${topVendor.combinedScore}/100.`,
    `This vendor scores ${topVendor.mlScore.toFixed(1)} on performance metrics and ${topVendor.similarityScore.toFixed(1)} on requirement matching.`,
  ]

  if (topVendor.matchReasons.length > 0) {
    reasoning.push(`Key strengths: ${topVendor.matchReasons.join('; ')}.`)
  }

  if (rankedVendors.length > 1) {
    reasoning.push(
      `Alternative options include ${rankedVendors.slice(1, 3).map((v) => v.vendor.name).join(' and ')} for comparison.`
    )
  }

  return reasoning.join(' ')
}
