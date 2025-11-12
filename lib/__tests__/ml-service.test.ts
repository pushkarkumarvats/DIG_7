/**
 * Integration Tests for ML Service
 */

import {
  getMLPrediction,
  getBatchMLPredictions,
  checkMLServiceHealth,
} from '../ml-service'

// Mock fetch
global.fetch = jest.fn()

describe('ML Service Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getMLPrediction', () => {
    it('should return prediction from ML service', async () => {
      const mockResponse = {
        totalScore: 85.5,
        reliabilityScore: 88.0,
        costScore: 82.0,
        capabilityScore: 87.0,
        performanceScore: 90.0,
        reputationScore: 86.0,
        riskScore: 15.0,
        confidence: 0.92,
        modelVersion: '1.0.0',
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const vendorData = {
        internalRecords: [
          {
            deliverySuccessRate: 95,
            qualityScore: 90,
            costEfficiency: 85,
            complianceScore: 92,
          },
        ],
        externalReviews: [{ rating: 4.5, sentiment: 'positive' }],
        features: [
          {
            certifications: ['ISO9001'],
            yearsInBusiness: 10,
            teamSize: 50,
          },
        ],
        risks: [{ riskLevel: 'LOW', severity: 2, status: 'ACTIVE' }],
      }

      const result = await getMLPrediction(vendorData)

      expect(result.totalScore).toBe(85.5)
      expect(result.confidence).toBe(0.92)
      expect(result.modelVersion).toBe('1.0.0')
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/predict',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    it('should fallback to TypeScript implementation on ML service failure', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(
        new Error('Service unavailable')
      )

      const vendorData = {
        internalRecords: [
          {
            deliverySuccessRate: 90,
            qualityScore: 85,
            costEfficiency: 88,
            complianceScore: 90,
          },
        ],
        externalReviews: [{ rating: 4.0, sentiment: 'positive' }],
        features: [
          {
            certifications: ['SOC2'],
            yearsInBusiness: 5,
            teamSize: 30,
          },
        ],
        risks: [],
      }

      const result = await getMLPrediction(vendorData)

      expect(result).toHaveProperty('totalScore')
      expect(result.confidence).toBe(0.75) // Fallback confidence
      expect(result.modelVersion).toBe('fallback-ts')
    })

    it('should handle timeout from ML service', async () => {
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true }), 10000)
          )
      )

      const vendorData = {
        internalRecords: [],
        externalReviews: [],
        features: [],
        risks: [],
      }

      const result = await getMLPrediction(vendorData)

      // Should fallback
      expect(result.modelVersion).toBe('fallback-ts')
    })
  })

  describe('getBatchMLPredictions', () => {
    it('should return batch predictions', async () => {
      const mockResponse = {
        results: [
          { vendorId: 'v1', totalScore: 85, success: true },
          { vendorId: 'v2', totalScore: 78, success: true },
        ],
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const vendors = [
        {
          id: 'v1',
          data: {
            internalRecords: [],
            externalReviews: [],
            features: [],
            risks: [],
          },
        },
        {
          id: 'v2',
          data: {
            internalRecords: [],
            externalReviews: [],
            features: [],
            risks: [],
          },
        },
      ]

      const results = await getBatchMLPredictions(vendors)

      expect(results).toHaveLength(2)
      expect(results[0].vendorId).toBe('v1')
      expect(results[0].success).toBe(true)
    })
  })

  describe('checkMLServiceHealth', () => {
    it('should return true when service is healthy', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'healthy', model_loaded: true }),
      })

      const isHealthy = await checkMLServiceHealth()

      expect(isHealthy).toBe(true)
    })

    it('should return false when service is down', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(
        new Error('Connection refused')
      )

      const isHealthy = await checkMLServiceHealth()

      expect(isHealthy).toBe(false)
    })

    it('should return false when model is not loaded', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'healthy', model_loaded: false }),
      })

      const isHealthy = await checkMLServiceHealth()

      expect(isHealthy).toBe(false)
    })
  })
})
