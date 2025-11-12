'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupSuccess, setSetupSuccess] = useState(false)

  const demoAccounts = [
    { role: 'Admin', email: 'admin@example.com', password: 'admin123', color: 'bg-red-500' },
    { role: 'Manager', email: 'manager@example.com', password: 'manager123', color: 'bg-blue-500' },
    { role: 'Viewer', email: 'viewer@example.com', password: 'viewer123', color: 'bg-green-500' },
  ]

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  const setupDemoUsers = async () => {
    setSetupLoading(true)
    setError('')
    setSetupSuccess(false)

    try {
      const response = await fetch('/api/setup/users', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setSetupSuccess(true)
        setError('')
      } else {
        setError(data.error || 'Failed to create demo users')
      }
    } catch (error) {
      setError('Failed to setup demo users. Check database connection.')
    } finally {
      setSetupLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Note: Demo users need to be seeded first. Run: npm run seed:users')
      } else {
        router.push('/dashboard/vendors')
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Vendor Management System
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Quick Demo Login</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoCredentials(account.email, account.password)}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  disabled={loading}
                >
                  <div className="flex items-center gap-3">
                    <Badge className={`${account.color} text-white hover:${account.color}`}>
                      {account.role}
                    </Badge>
                    <div className="text-sm">
                      <div className="font-medium">{account.email}</div>
                      <div className="text-gray-500 text-xs">{account.password}</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">Click to fill</span>
                </button>
              ))}
            </div>
            
            {setupSuccess && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                ✅ Demo users created successfully! You can now sign in.
              </div>
            )}
            
            {!setupSuccess && (
              <div className="mt-4 space-y-2">
                <Button
                  type="button"
                  onClick={setupDemoUsers}
                  disabled={setupLoading}
                  variant="outline"
                  className="w-full"
                >
                  {setupLoading ? '⏳ Setting up...' : '🔧 Setup Demo Users (First Time)'}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Click this button once to create demo accounts in your database
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
