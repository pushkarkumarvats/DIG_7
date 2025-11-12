interface VendorData {
  internalRecords: Array<{
    deliverySuccessRate: number
    qualityScore: number
    costEfficiency: number
    complianceScore: number
  }>
  externalReviews: Array<{
    rating: number
    sentiment: string | null
  }>
  features: Array<{
    certifications: string[]
    yearsInBusiness: number | null
    teamSize: number | null
  }>
  risks: Array<{
    riskLevel: string
    severity: number
  }>
}

export function calculateVendorScore(vendor: VendorData): {
  totalScore: number
  reliabilityScore: number
  costScore: number
  capabilityScore: number
  performanceScore: number
  reputationScore: number
  riskScore: number
  breakdown: any
} {
  // Calculate reliability score (based on internal performance)
  const reliabilityScore = calculateReliabilityScore(vendor.internalRecords)

  // Calculate cost score
  const costScore = calculateCostScore(vendor.internalRecords)

  // Calculate capability score
  const capabilityScore = calculateCapabilityScore(vendor.features)

  // Calculate performance score
  const performanceScore = calculatePerformanceScore(vendor.internalRecords)

  // Calculate reputation score (based on external reviews)
  const reputationScore = calculateReputationScore(vendor.externalReviews)

  // Calculate risk score (lower is better)
  const riskScore = calculateRiskScore(vendor.risks)

  // Weighted total score
  // Formula: 35% reliability + 25% capability + 20% cost + 10% risk_inverse + 10% reputation
  const totalScore =
    reliabilityScore * 0.35 +
    capabilityScore * 0.25 +
    costScore * 0.2 +
    (100 - riskScore) * 0.1 +
    reputationScore * 0.1

  return {
    totalScore: parseFloat(totalScore.toFixed(2)),
    reliabilityScore: parseFloat(reliabilityScore.toFixed(2)),
    costScore: parseFloat(costScore.toFixed(2)),
    capabilityScore: parseFloat(capabilityScore.toFixed(2)),
    performanceScore: parseFloat(performanceScore.toFixed(2)),
    reputationScore: parseFloat(reputationScore.toFixed(2)),
    riskScore: parseFloat(riskScore.toFixed(2)),
    breakdown: {
      reliability: {
        deliverySuccess: reliabilityScore * 0.5,
        qualityMetrics: reliabilityScore * 0.3,
        compliance: reliabilityScore * 0.2,
      },
      cost: {
        efficiency: costScore * 0.6,
        valueForMoney: costScore * 0.4,
      },
      capability: {
        certifications: capabilityScore * 0.4,
        experience: capabilityScore * 0.3,
        teamCapacity: capabilityScore * 0.3,
      },
    },
  }
}

function calculateReliabilityScore(records: VendorData['internalRecords']): number {
  if (!records || records.length === 0) return 50 // Default score

  const avgDeliverySuccess =
    records.reduce((sum, r) => sum + r.deliverySuccessRate, 0) / records.length
  const avgQuality = records.reduce((sum, r) => sum + r.qualityScore, 0) / records.length
  const avgCompliance = records.reduce((sum, r) => sum + r.complianceScore, 0) / records.length

  return avgDeliverySuccess * 0.5 + avgQuality * 0.3 + avgCompliance * 0.2
}

function calculateCostScore(records: VendorData['internalRecords']): number {
  if (!records || records.length === 0) return 50

  const avgCostEfficiency =
    records.reduce((sum, r) => sum + r.costEfficiency, 0) / records.length
  return avgCostEfficiency
}

function calculateCapabilityScore(features: VendorData['features']): number {
  if (!features || features.length === 0) return 50

  // Use the first feature record (or aggregate if multiple)
  const feature = features[0]
  let score = 50

  // Certifications boost
  const certCount = feature.certifications?.length || 0
  score += Math.min(certCount * 5, 20)

  // Years in business boost
  if (feature.yearsInBusiness) {
    score += Math.min(feature.yearsInBusiness * 2, 20)
  }

  // Team size boost
  if (feature.teamSize) {
    if (feature.teamSize > 100) score += 10
    else if (feature.teamSize > 50) score += 7
    else if (feature.teamSize > 20) score += 5
  }

  return Math.min(score, 100)
}

function calculatePerformanceScore(records: VendorData['internalRecords']): number {
  if (!records || records.length === 0) return 50

  const avgDelivery = records.reduce((sum, r) => sum + r.deliverySuccessRate, 0) / records.length
  const avgQuality = records.reduce((sum, r) => sum + r.qualityScore, 0) / records.length

  return (avgDelivery + avgQuality) / 2
}

function calculateReputationScore(reviews: VendorData['externalReviews']): number {
  if (!reviews || reviews.length === 0) return 50

  // Convert ratings to 0-100 scale (assuming ratings are 0-5)
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const ratingScore = (avgRating / 5) * 100

  // Sentiment analysis (handle null sentiments)
  const reviewsWithSentiment = reviews.filter(r => r.sentiment !== null)
  if (reviewsWithSentiment.length === 0) return ratingScore
  
  const positiveCount = reviewsWithSentiment.filter(r => r.sentiment === 'positive').length
  const sentimentScore = (positiveCount / reviewsWithSentiment.length) * 100

  return ratingScore * 0.6 + sentimentScore * 0.4
}

function calculateRiskScore(risks: VendorData['risks']): number {
  if (!risks || risks.length === 0) return 10 // Low risk by default

  const riskLevelMap: Record<string, number> = {
    LOW: 10,
    MEDIUM: 30,
    HIGH: 60,
    CRITICAL: 90,
  }

  const avgRiskLevel =
    risks.reduce((sum, r) => sum + (riskLevelMap[r.riskLevel] || 30), 0) / risks.length
  const avgSeverity = risks.reduce((sum, r) => sum + r.severity * 10, 0) / risks.length

  return (avgRiskLevel + avgSeverity) / 2
}

export function calculateSimilarityScore(requirement: string, vendor: any): number {
  // Simple keyword-based similarity (in production, use embeddings)
  const reqWords = requirement.toLowerCase().split(/\s+/)
  const features = vendor.features?.[0] || {}
  const vendorText = `
    ${vendor.name} 
    ${vendor.description || ''} 
    ${features.services?.join(' ') || ''} 
    ${features.technologies?.join(' ') || ''}
    ${features.expertiseAreas?.join(' ') || ''}
  `.toLowerCase()

  const matchCount = reqWords.filter(word => vendorText.includes(word)).length
  return (matchCount / reqWords.length) * 100
}
