import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'LOW':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'HIGH':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'CRITICAL':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 75) return 'text-blue-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 90) return 'bg-green-100 text-green-800 border-green-300'
  if (score >= 75) return 'bg-blue-100 text-blue-800 border-blue-300'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  if (score >= 40) return 'bg-orange-100 text-orange-800 border-orange-300'
  return 'bg-red-100 text-red-800 border-red-300'
}
