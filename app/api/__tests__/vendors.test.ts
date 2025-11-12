/**
 * Integration Tests for Vendor API Routes
 */

import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/vendors/route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    vendor: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe('Vendor API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/vendors', () => {
    it('should return list of vendors', async () => {
      const mockVendors = [
        {
          id: 'v1',
          name: 'Test Vendor 1',
          status: 'ACTIVE',
          industry: 'Technology',
          website: 'https://test1.com',
        },
        {
          id: 'v2',
          name: 'Test Vendor 2',
          status: 'ACTIVE',
          industry: 'Finance',
          website: 'https://test2.com',
        },
      ]

      ;(prisma.vendor.findMany as jest.Mock).mockResolvedValue(mockVendors)

      const request = new NextRequest('http://localhost:3000/api/vendors')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
      expect(data[0].name).toBe('Test Vendor 1')
    })

    it('should filter vendors by status', async () => {
      const mockVendors = [
        {
          id: 'v1',
          name: 'Active Vendor',
          status: 'ACTIVE',
          industry: 'Technology',
        },
      ]

      ;(prisma.vendor.findMany as jest.Mock).mockResolvedValue(mockVendors)

      const request = new NextRequest(
        'http://localhost:3000/api/vendors?status=ACTIVE'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(prisma.vendor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'ACTIVE',
          }),
        })
      )
      expect(response.status).toBe(200)
    })

    it('should handle search query', async () => {
      ;(prisma.vendor.findMany as jest.Mock).mockResolvedValue([])

      const request = new NextRequest(
        'http://localhost:3000/api/vendors?search=tech'
      )
      await GET(request)

      expect(prisma.vendor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.any(Object) }),
              expect.objectContaining({ description: expect.any(Object) }),
            ]),
          }),
        })
      )
    })

    it('should handle database errors gracefully', async () => {
      ;(prisma.vendor.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const request = new NextRequest('http://localhost:3000/api/vendors')
      const response = await GET(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })
  })

  describe('POST /api/vendors', () => {
    it('should create a new vendor', async () => {
      const newVendor = {
        name: 'New Vendor',
        website: 'https://newvendor.com',
        email: 'contact@newvendor.com',
        industry: 'Technology',
        description: 'A new vendor',
      }

      const createdVendor = {
        id: 'new-id',
        ...newVendor,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(prisma.vendor.create as jest.Mock).mockResolvedValue(createdVendor)

      const request = new NextRequest('http://localhost:3000/api/vendors', {
        method: 'POST',
        body: JSON.stringify(newVendor),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('New Vendor')
      expect(prisma.vendor.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining(newVendor),
        })
      )
    })

    it('should validate required fields', async () => {
      const invalidVendor = {
        email: 'test@test.com',
        // Missing required 'name' field
      }

      const request = new NextRequest('http://localhost:3000/api/vendors', {
        method: 'POST',
        body: JSON.stringify(invalidVendor),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })

    it('should handle duplicate vendor names', async () => {
      ;(prisma.vendor.create as jest.Mock).mockRejectedValue(
        new Error('Unique constraint failed')
      )

      const request = new NextRequest('http://localhost:3000/api/vendors', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Duplicate Vendor',
          website: 'https://dup.com',
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
    })
  })
})
