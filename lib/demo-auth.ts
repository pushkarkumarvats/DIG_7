/**
 * Demo Authentication System
 * In-memory authentication that works without a database
 * Perfect for demos, development, and frontend testing
 */

export interface DemoUser {
  id: string
  email: string
  name: string
  password: string
  role: 'ADMIN' | 'MANAGER' | 'VIEWER'
}

// In-memory demo users storage
const demoUsers: DemoUser[] = [
  {
    id: 'demo-admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    id: 'demo-manager-1',
    email: 'manager@example.com',
    name: 'Manager User',
    password: 'manager123',
    role: 'MANAGER',
  },
  {
    id: 'demo-viewer-1',
    email: 'viewer@example.com',
    name: 'Viewer User',
    password: 'viewer123',
    role: 'VIEWER',
  },
]

/**
 * Validate demo user credentials
 */
export function validateDemoUser(email: string, password: string): DemoUser | null {
  const user = demoUsers.find(
    (u) => u.email === email && u.password === password
  )
  return user || null
}

/**
 * Get demo user by email
 */
export function getDemoUserByEmail(email: string): DemoUser | null {
  return demoUsers.find((u) => u.email === email) || null
}

/**
 * Get all demo users (without passwords)
 */
export function getAllDemoUsers() {
  return demoUsers.map(({ password, ...user }) => user)
}

/**
 * Check if demo mode is enabled
 */
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === 'true' || process.env.NODE_ENV === 'development'
}
