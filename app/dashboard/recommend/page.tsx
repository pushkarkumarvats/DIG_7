'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

export default function RecommendPage() {
  const [requirement, setRequirement] = useState('')
  const [recommendations, setRecommendations] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleRecommend = async () => {
    if (!requirement.trim()) {
      alert('Please enter a requirement')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement, maxResults: 5, minScore: 50 }),
      })
      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vendor Recommendation Engine</h1>
        <p className="text-gray-600 mt-2">
          Get AI-powered vendor recommendations based on your requirements
        </p>
      </div>

      {/* Search Input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Describe Your Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              className="w-full min-h-32 p-3 border rounded-lg"
              placeholder="Example: We need a cloud infrastructure provider with AWS expertise, ISO 27001 certification, and experience in healthcare industry. Budget is around $150k for a 6-month project..."
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
            />
            <Button onClick={handleRecommend} disabled={loading} className="w-full">
              {loading ? 'Analyzing...' : 'Get Recommendations'}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {recommendations && (
        <>
          {/* Reasoning */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recommendation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{recommendations.reasoning}</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Analysis:</strong> Found {recommendations.recommendation.qualifiedCandidates} qualified vendors out of {recommendations.recommendation.totalCandidates} total candidates
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Top Vendors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {recommendations.recommendation.topVendors.map((vendor: any, index: number) => (
              <Card key={vendor.id} className="relative">
                {index === 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600">Top Match</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{vendor.name}</span>
                    <span className="text-lg font-bold text-blue-600">
                      {vendor.score.toFixed(1)}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">ML Score</p>
                      <p className="text-lg font-semibold">{vendor.mlScore.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Match Score</p>
                      <p className="text-lg font-semibold">{vendor.similarityScore.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Risk */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Risk Level</p>
                    <Badge className={vendor.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' : vendor.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                      {vendor.riskLevel}
                    </Badge>
                  </div>

                  {/* Cost */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Estimated Cost</p>
                    <p className="font-medium">{vendor.estimatedCost}</p>
                  </div>

                  {/* Match Reasons */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Why this vendor?</p>
                    <ul className="space-y-1">
                      {vendor.matchReasons.map((reason: string, i: number) => (
                        <li key={i} className="text-sm flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strengths */}
                  {vendor.strengths.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.strengths.map((strength: string, i: number) => (
                          <Badge key={i} variant="outline">{strength}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {vendor.certifications.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.certifications.slice(0, 5).map((cert: string, i: number) => (
                          <Badge key={i} variant="secondary">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button variant="outline" className="w-full">
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Matrix */}
          {recommendations.recommendation.comparisonMatrix && (
            <Card>
              <CardHeader>
                <CardTitle>Comparison Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Criteria</th>
                        {recommendations.recommendation.comparisonMatrix.vendors.map((name: string, i: number) => (
                          <th key={i} className="text-center py-2 px-4">{name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recommendations.recommendation.comparisonMatrix.criteria.map((criterion: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="py-2 px-4 font-medium">{criterion.name}</td>
                          {criterion.values.map((value: number, j: number) => (
                            <td key={j} className="text-center py-2 px-4">
                              <span className={value >= 80 ? 'text-green-600 font-semibold' : value >= 60 ? 'text-blue-600' : 'text-gray-600'}>
                                {value.toFixed(1)}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
