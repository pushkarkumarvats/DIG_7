'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Award,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { getRiskColor, getScoreBadgeColor, formatPercentage, formatCurrency, formatDate } from '@/lib/utils'

export default function VendorDetailPage() {
  const params = useParams()
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchVendor()
    }
  }, [params.id])

  const fetchVendor = async () => {
    try {
      const response = await fetch(`/api/vendors/${params.id}`)
      if (!response.ok) {
        throw new Error('Vendor not found')
      }
      const data = await response.json()
      setVendor(data)
    } catch (error) {
      console.error('Error fetching vendor:', error)
      // Use mock vendor data in demo mode
      const mockVendor = {
        id: params.id,
        name: 'Demo Vendor Corporation',
        email: 'contact@demovendor.com',
        phone: '+1 (555) 123-4567',
        website: 'https://demovendor.com',
        address: '123 Business St, Tech City, CA 94000',
        description: 'A leading technology solutions provider specializing in cloud infrastructure and AI services.',
        status: 'ACTIVE',
        isVerified: true,
        scores: [{
          totalScore: 85,
          reliabilityScore: 90,
          capabilityScore: 88,
          complianceScore: 82,
          sustainabilityScore: 78,
          costScore: 85,
          riskLevel: 'LOW',
          createdAt: new Date().toISOString()
        }],
        certifications: [
          { name: 'ISO 27001', issuedBy: 'ISO', validUntil: '2025-12-31' },
          { name: 'SOC 2 Type II', issuedBy: 'AICPA', validUntil: '2025-06-30' }
        ],
        services: ['Cloud Infrastructure', 'AI Solutions', 'Data Analytics'],
        projects: [
          {
            name: 'Enterprise Cloud Migration',
            status: 'COMPLETED',
            startDate: '2024-01-15',
            endDate: '2024-06-30',
            budget: 150000,
            performance: 95
          }
        ]
      }
      setVendor(mockVendor)
    } finally {
      setLoading(false)
    }
  }

  const handleScrape = async () => {
    if (!vendor?.website) {
      alert('No website URL available')
      return
    }
    
    try {
      const response = await fetch('/api/vendors/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId: vendor.id, website: vendor.website }),
      })
      const data = await response.json()
      alert('Scraping completed! Refresh to see new data.')
    } catch (error) {
      console.error('Error scraping vendor:', error)
      alert('Scraping failed')
    }
  }

  const handleScore = async () => {
    try {
      const response = await fetch('/api/vendors/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId: vendor.id }),
      })
      const data = await response.json()
      alert('Scoring completed!')
      fetchVendor() // Refresh data
    } catch (error) {
      console.error('Error scoring vendor:', error)
      alert('Scoring failed')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!vendor) {
    return <div className="p-8">Vendor not found</div>
  }

  const latestScore = vendor.scores?.[0]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">{vendor.name}</h1>
            {vendor.isVerified && (
              <Badge variant="default">Verified</Badge>
            )}
            <Badge variant={vendor.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {vendor.status}
            </Badge>
          </div>
          <p className="text-gray-600">{vendor.description || 'No description available'}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleScrape} variant="outline">
            Scrape Data
          </Button>
          <Button onClick={handleScore}>
            Calculate Score
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      {latestScore && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Total Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreBadgeColor(latestScore.totalScore)}`}>
                {formatPercentage(latestScore.totalScore)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Reliability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(latestScore.reliabilityScore)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Capability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(latestScore.capabilityScore)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(latestScore.costScore)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Reputation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(latestScore.reputationScore)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatPercentage(latestScore.riskScore)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vendor.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 mt-1 text-gray-400" />
                <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {vendor.website}
                </a>
              </div>
            )}
            {vendor.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-gray-400" />
                <span>{vendor.email}</span>
              </div>
            )}
            {vendor.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-1 text-gray-400" />
                <span>{vendor.phone}</span>
              </div>
            )}
            {vendor.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-gray-400" />
                <span>{vendor.address}</span>
              </div>
            )}
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">Industry: {vendor.industry || 'N/A'}</p>
              <p className="text-sm text-gray-600">Company Size: {vendor.companySize || 'N/A'}</p>
              <p className="text-sm text-gray-600">Founded: {vendor.founded || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Capabilities */}
        {vendor.features && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vendor.features.certifications?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {vendor.features.certifications.map((cert: string, i: number) => (
                      <Badge key={i} variant="outline">{cert}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {vendor.features.technologies?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {vendor.features.technologies.slice(0, 10).map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {vendor.features.services?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {vendor.features.services.slice(0, 8).map((service: string, i: number) => (
                      <Badge key={i} variant="outline">{service}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Risk Indicators */}
        {vendor.risks?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {vendor.risks.slice(0, 5).map((risk: any) => (
                <div key={risk.id} className="border-l-4 pl-3 py-2" style={{ borderColor: risk.riskLevel === 'HIGH' ? '#dc2626' : risk.riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981' }}>
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={getRiskColor(risk.riskLevel)}>
                      {risk.riskLevel}
                    </Badge>
                    <span className="text-xs text-gray-500">{risk.riskCategory}</span>
                  </div>
                  <p className="text-sm">{risk.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Severity: {risk.severity}/10</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance History */}
      {vendor.internalRecords?.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Cost Efficiency</TableHead>
                  <TableHead>Period</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendor.internalRecords.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.projectName}</TableCell>
                    <TableCell>{record.projectCategory}</TableCell>
                    <TableCell>{formatCurrency(record.contractValue)}</TableCell>
                    <TableCell>{formatPercentage(record.deliverySuccessRate)}</TableCell>
                    <TableCell>{formatPercentage(record.qualityScore)}</TableCell>
                    <TableCell>{formatPercentage(record.costEfficiency)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(record.startDate)} - {record.endDate ? formatDate(record.endDate) : 'Ongoing'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* External Reviews */}
      {vendor.externalReviews?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>External Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vendor.externalReviews.map((review: any) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{review.source}</span>
                    <Badge variant={review.sentiment === 'positive' ? 'default' : 'secondary'}>
                      {review.sentiment}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {review.rating.toFixed(1)} ★
                  </div>
                  {review.reviewCount && (
                    <p className="text-sm text-gray-600">{review.reviewCount} reviews</p>
                  )}
                  {review.reviewText && (
                    <p className="text-sm mt-2 line-clamp-2">{review.reviewText}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
