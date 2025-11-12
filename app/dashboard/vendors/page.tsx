'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Plus, ExternalLink, TrendingUp, AlertTriangle, Star, Building2 } from 'lucide-react'
import { mockVendors, mockStats } from '@/lib/mock-data'

interface Vendor {
  id: number | string
  name: string
  industry: string | null
  status: string
  overallScore?: number
  riskLevel?: string
  website?: string
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState(mockStats)
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await fetch(`/api/vendors?query=${search}&limit=20`)
      
      if (response.ok) {
        const data = await response.json()
        setVendors(data.vendors)
        setUseMockData(false)
      } else {
        throw new Error('API unavailable')
      }
    } catch (error) {
      console.log('Using mock data - database not connected')
      const filtered = search
        ? mockVendors.filter(v =>
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            (v.industry && v.industry.toLowerCase().includes(search.toLowerCase()))
          )
        : mockVendors
      setVendors(filtered)
      setUseMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchVendors()
  }

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800'
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getRiskColor = (risk?: string) => {
    if (!risk) return 'bg-gray-100 text-gray-800'
    switch (risk) {
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {useMockData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> Using sample data. Database not connected. All features are fully functional for demonstration.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all your vendors</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Vendors
            </CardTitle>
            <Building2 className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">All registered vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Vendors
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-gray-500 mt-1">Currently engaged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              High Risk
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.highRisk}</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Top Rated
            </CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.topRated}</div>
            <p className="text-xs text-gray-500 mt-1">Score ≥ 90</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vendors by name or industry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vendors ({vendors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No vendors found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {vendor.name.charAt(0)}
                          </span>
                        </div>
                        {vendor.name}
                      </div>
                    </TableCell>
                    <TableCell>{vendor.industry || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          vendor.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }
                      >
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vendor.overallScore ? (
                        <Badge className={getScoreColor(vendor.overallScore)}>
                          {vendor.overallScore.toFixed(1)}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Not scored</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vendor.riskLevel ? (
                        <Badge className={getRiskColor(vendor.riskLevel)}>
                          {vendor.riskLevel}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/vendor/${vendor.id}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
