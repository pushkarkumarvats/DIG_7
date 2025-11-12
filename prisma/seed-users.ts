import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding users...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const managerPassword = await bcrypt.hash('manager123', 10)
  const viewerPassword = await bcrypt.hash('viewer123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✓ Created admin user:', admin.email)

  // Create manager user
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'Manager User',
      password: managerPassword,
      role: 'MANAGER',
    },
  })
  console.log('✓ Created manager user:', manager.email)

  // Create viewer user
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: {
      email: 'viewer@example.com',
      name: 'Viewer User',
      password: viewerPassword,
      role: 'VIEWER',
    },
  })
  console.log('✓ Created viewer user:', viewer.email)

  console.log('\n✅ User seeding complete!')
  console.log('\nDemo credentials:')
  console.log('  Admin:   admin@example.com / admin123')
  console.log('  Manager: manager@example.com / manager123')
  console.log('  Viewer:  viewer@example.com / viewer123')
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
