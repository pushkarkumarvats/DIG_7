/**
 * Unit Tests for ML Scoring Functions
 */

import {
  calculateVendorScore,
  calculateSimilarityScore,
} from '../ml-scoring'

describe('ML Scoring Functions', () => {
  describe('calculateVendorScore', () => {
    it('should calculate scores for vendor with complete data', () => {
      const vendorData = {
        internalRecords: [
          {
            deliverySuccessRate: 95,
            qualityScore: 90,
            costEfficiency: 85,
            complianceScore: 92,
          },
          {
            deliverySuccessRate: 93,
            qualityScore: 88,
            costEfficiency: 87,
            complianceScore: 90,
          },
        ],
        externalReviews: [
          { rating: 4.5, sentiment: 'positive' },
          { rating: 4.0, sentiment: 'positive' },
          { rating: 5.0, sentiment: 'positive' },
        ],
        features: [
          {
            certifications: ['ISO9001', 'SOC2', 'GDPR'],
            yearsInBusiness: 10,
            teamSize: 75,
          },
        ],
        risks: [
          { riskLevel: 'LOW', severity: 2 },
          { riskLevel: 'MEDIUM', severity: 3 },
        ],
      }

      const scores = calculateVendorScore(vendorData)

      expect(scores.totalScore).toBeGreaterThan(0)
      expect(scores.totalScore).toBeLessThanOrEqual(100)
      expect(scores.reliabilityScore).toBeGreaterThan(80)
      expect(scores.costScore).toBeGreaterThan(80)
      expect(scores.capabilityScore).toBeGreaterThan(70)
      expect(scores.performanceScore).toBeGreaterThan(85)
      expect(scores.reputationScore).toBeGreaterThan(80)
      expect(scores.riskScore).toBeLessThan(30)
    })

    it('should handle vendor with minimal data', () => {
      const vendorData = {
        internalRecords: [],
        externalReviews: [],
        features: [],
        risks: [],
      }

      const scores = calculateVendorScore(vendorData)

      expect(scores.totalScore).toBe(50) // Default baseline
      expect(scores.reliabilityScore).toBe(50)
      expect(scores.costScore).toBe(50)
      expect(scores.capabilityScore).toBe(50)
      expect(scores.performanceScore).toBe(50)
      expect(scores.reputationScore).toBe(50)
      expect(scores.riskScore).toBe(10) // Low risk by default
    })

    it('should handle null sentiment in reviews', () => {
      const vendorData = {
        internalRecords: [
          {
            deliverySuccessRate: 80,
            qualityScore: 85,
            costEfficiency: 75,
            complianceScore: 80,
          },
        ],
        externalReviews: [
          { rating: 4.0, sentiment: null },
          { rating: 4.5, sentiment: 'positive' },
          { rating: 3.5, sentiment: null },
        ],
        features: [
          {
            certifications: ['ISO9001'],
            yearsInBusiness: 5,
            teamSize: 30,
          },
        ],
        risks: [],
      }

      const scores = calculateVendorScore(vendorData)

      expect(scores.reputationScore).toBeGreaterThan(50)
      expect(scores.reputationScore).toBeLessThanOrEqual(100)
    })

    it('should penalize high risk vendors', () => {
      const vendorData = {
        internalRecords: [
          {
            deliverySuccessRate: 90,
            qualityScore: 90,
            costEfficiency: 90,
            complianceScore: 90,
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
        risks: [
          { riskLevel: 'CRITICAL', severity: 9 },
          { riskLevel: 'HIGH', severity: 8 },
          { riskLevel: 'HIGH', severity: 7 },
        ],
      }

      const scores = calculateVendorScore(vendorData)

      expect(scores.riskScore).toBeGreaterThan(50)
      expect(scores.totalScore).toBeLessThan(85)
    })
  })

  describe('calculateSimilarityScore', () => {
    const vendor = {
      name: 'TechSolutions Inc',
      description: 'Cloud infrastructure and DevOps services',
      features: [
        {
          services: ['Cloud Migration', 'DevOps', 'Infrastructure'],
          technologies: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
          expertiseAreas: ['Cloud Computing', 'Automation', 'CI/CD'],
          certifications: [],
          yearsInBusiness: null,
          teamSize: null,
        },
      ],
    }

    it('should return high score for exact keyword match', () => {
      const requirement = 'Looking for AWS and Kubernetes expertise'
      const score = calculateSimilarityScore(requirement, vendor)

      expect(score).toBeGreaterThan(60)
    })

    it('should return lower score for partial match', () => {
      const requirement = 'Need machine learning and AI services'
      const score = calculateSimilarityScore(requirement, vendor)

      expect(score).toBeLessThan(40)
    })

    it('should handle empty features array', () => {
      const vendorWithoutFeatures = {
        ...vendor,
        features: [],
      }

      const requirement = 'Cloud services needed'
      const score = calculateSimilarityScore(requirement, vendorWithoutFeatures)

      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should be case-insensitive', () => {
      const requirement1 = 'AWS KUBERNETES DOCKER'
      const requirement2 = 'aws kubernetes docker'

      const score1 = calculateSimilarityScore(requirement1, vendor)
      const score2 = calculateSimilarityScore(requirement2, vendor)

      expect(score1).toBe(score2)
    })
  })
})
