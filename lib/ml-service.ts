/**
 * ML Model Integration Service
 * Calls the Python ML microservice for advanced scoring
 */

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000'

interface MLPredictionResponse {
  totalScore: number
  reliabilityScore: number
  costScore: number
  capabilityScore: number
  performanceScore: number
  reputationScore: number
  riskScore: number
  confidence: number
  modelVersion?: string
}

interface VendorDataForML {
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
    status?: string
  }>
}

/**
 * Get ML predictions from the Python microservice
 * Falls back to TypeScript implementation if service is unavailable
 */
export async function getMLPrediction(
  vendorData: VendorDataForML
): Promise<MLPredictionResponse> {
  try {
    const response = await fetch(`${ML_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendorData }),
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`ML API returned ${response.status}`)
    }

    const result: MLPredictionResponse = await response.json()
    return result
  } catch (error) {
    console.warn('ML API unavailable, falling back to TypeScript implementation:', error)
    // Fallback to existing TypeScript implementation
    const { calculateVendorScore } = await import('./ml-scoring')
    const scores = calculateVendorScore(vendorData)
    
    return {
      ...scores,
      confidence: 0.75, // Lower confidence for fallback
      modelVersion: 'fallback-ts',
    }
  }
}

/**
 * Batch prediction for multiple vendors
 */
export async function getBatchMLPredictions(
  vendors: Array<{ id: string; data: VendorDataForML }>
): Promise<Array<{ vendorId: string; score: MLPredictionResponse; success: boolean }>> {
  try {
    const response = await fetch(`${ML_API_URL}/batch-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendors }),
      signal: AbortSignal.timeout(30000), // 30 second timeout for batch
    })

    if (!response.ok) {
      throw new Error(`ML API returned ${response.status}`)
    }

    const result = await response.json()
    return result.results
  } catch (error) {
    console.error('Batch ML prediction failed:', error)
    // Return individual predictions using fallback
    return Promise.all(
      vendors.map(async (vendor) => {
        try {
          const score = await getMLPrediction(vendor.data)
          return { vendorId: vendor.id, score, success: true }
        } catch (err) {
          return {
            vendorId: vendor.id,
            score: {} as MLPredictionResponse,
            success: false,
          }
        }
      })
    )
  }
}

/**
 * Check if ML service is healthy
 */
export async function checkMLServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${ML_API_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    })
    const data = await response.json()
    return data.status === 'healthy' && data.model_loaded === true
  } catch (error) {
    return false
  }
}
