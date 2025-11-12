import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10)
    const managerPassword = await bcrypt.hash('manager123', 10)
    const viewerPassword = await bcrypt.hash('viewer123', 10)

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        password: adminPassword,
      },
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    })

    // Create manager user
    const manager = await prisma.user.upsert({
      where: { email: 'manager@example.com' },
      update: {
        password: managerPassword,
      },
      create: {
        email: 'manager@example.com',
        name: 'Manager User',
        password: managerPassword,
        role: 'MANAGER',
      },
    })

    // Create viewer user
    const viewer = await prisma.user.upsert({
      where: { email: 'viewer@example.com' },
      update: {
        password: viewerPassword,
      },
      create: {
        email: 'viewer@example.com',
        name: 'Viewer User',
        password: viewerPassword,
        role: 'VIEWER',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Demo users created successfully',
      users: [
        { email: admin.email, role: admin.role },
        { email: manager.email, role: manager.role },
        { email: viewer.email, role: viewer.role },
      ],
    })
  } catch (error) {
    console.error('Error seeding users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create demo users. Make sure database is connected.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
