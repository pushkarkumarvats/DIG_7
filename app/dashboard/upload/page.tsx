'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload as UploadIcon } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setResult(data)
      alert('Upload completed!')
    } catch (error) {
      console.error('Error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Vendor Data</h1>
        <p className="text-gray-600 mt-2">
          Import historical vendor performance data from CSV
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>CSV File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select CSV File
              </label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Data'}
              <UploadIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">
                ✓ Success: {result.results.success} records
              </p>
              {result.results.failed > 0 && (
                <>
                  <p className="text-red-600 font-semibold">
                    ✗ Failed: {result.results.failed} records
                  </p>
                  {result.results.errors.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 rounded">
                      <p className="font-semibold mb-2">Errors:</p>
                      <ul className="text-sm space-y-1">
                        {result.results.errors.map((error: string, i: number) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>CSV Format</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Your CSV file should include the following columns:
          </p>
          <div className="bg-gray-50 p-4 rounded font-mono text-xs overflow-x-auto">
            <pre>
vendorName,projectName,projectCategory,contractValue,startDate,endDate,deliverySuccessRate,qualityScore,costEfficiency,responseTime,complianceScore,incidentCount,notes{'\n'}
TechCorp,Cloud Migration,IT Services,250000,2023-01-01,2023-12-31,95,90,85,24,95,0,Excellent delivery{'\n'}
DataSystems,Security Audit,Security,120000,2023-06-01,2024-01-31,88,92,80,12,98,1,Minor delays
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
