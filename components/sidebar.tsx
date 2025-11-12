'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2,
  Search,
  BarChart3,
  FileText,
  Upload,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Vendors', href: '/dashboard/vendors', icon: Building2 },
  { name: 'Recommend', href: '/dashboard/recommend', icon: BarChart3 },
  { name: 'Upload Data', href: '/dashboard/upload', icon: Upload },
]

export function Sidebar() {
  const pathname = usePathname()

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-50/40">
      <div className="flex h-16 items-center border-b px-6">
        <Building2 className="h-6 w-6 text-primary" />
        <div className="ml-2">
          <span className="text-lg font-semibold block">Vendor Manager</span>
          {isDemoMode && (
            <span className="text-xs text-green-600 font-medium">✓ Demo Mode</span>
          )}
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">AD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
