import { PrismaClient, UserRole, VendorStatus, RiskLevel, RiskStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@vendormanagement.com' },
    update: {},
    create: {
      email: 'admin@vendormanagement.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  })

  console.log('✅ Created admin user')

  // Create demo vendors
  const vendors = [
    {
      name: 'TechSolutions Inc',
      website: 'https://techsolutions.example.com',
      description: 'Leading IT services provider specializing in cloud infrastructure and DevOps',
      email: 'contact@techsolutions.example.com',
      phone: '+1-555-0101',
      companySize: '500-1000',
      industry: 'IT Services',
      founded: '2010',
      status: VendorStatus.ACTIVE,
      isVerified: true,
      linkedinUrl: 'https://linkedin.com/company/techsolutions',
    },
    {
      name: 'CloudMasters Pro',
      website: 'https://cloudmasters.example.com',
      description: 'AWS and Azure certified cloud migration experts',
      email: 'info@cloudmasters.example.com',
      phone: '+1-555-0102',
      companySize: '100-250',
      industry: 'Cloud Computing',
      founded: '2015',
      status: VendorStatus.ACTIVE,
      isVerified: true,
      linkedinUrl: 'https://linkedin.com/company/cloudmasters',
    },
    {
      name: 'DataSecure Systems',
      website: 'https://datasecure.example.com',
      description: 'Cybersecurity and data protection specialists',
      email: 'security@datasecure.example.com',
      phone: '+1-555-0103',
      companySize: '250-500',
      industry: 'Cybersecurity',
      founded: '2012',
      status: VendorStatus.ACTIVE,
      isVerified: true,
    },
    {
      name: 'AgileDevs Co',
      website: 'https://agiledevs.example.com',
      description: 'Software development and agile consulting',
      email: 'hello@agiledevs.example.com',
      phone: '+1-555-0104',
      companySize: '50-100',
      industry: 'Software Development',
      founded: '2018',
      status: VendorStatus.ACTIVE,
      isVerified: false,
    },
    {
      name: 'MarketBoost Digital',
      website: 'https://marketboost.example.com',
      description: 'Digital marketing and SEO services',
      email: 'contact@marketboost.example.com',
      phone: '+1-555-0105',
      companySize: '10-50',
      industry: 'Digital Marketing',
      founded: '2019',
      status: VendorStatus.ACTIVE,
      isVerified: true,
    },
  ]

  for (const vendorData of vendors) {
    const vendor = await prisma.vendor.create({
      data: vendorData,
    })

    // Add external reviews
    await prisma.externalReview.createMany({
      data: [
        {
          vendorId: vendor.id,
          source: 'Google',
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 200) + 50,
          reviewText: 'Excellent service and professional team',
          sentiment: 'positive',
          keywords: ['professional', 'reliable', 'quality'],
          certifications: ['ISO 9001', 'SOC 2'],
        },
        {
          vendorId: vendor.id,
          source: 'Clutch',
          rating: 4.3 + Math.random() * 0.7,
          reviewCount: Math.floor(Math.random() * 100) + 20,
          sentiment: 'positive',
          keywords: ['innovative', 'responsive', 'expert'],
          certifications: ['ISO 27001'],
        },
        {
          vendorId: vendor.id,
          source: 'G2',
          rating: 4.2 + Math.random() * 0.8,
          reviewCount: Math.floor(Math.random() * 150) + 30,
          sentiment: 'positive',
          keywords: ['efficient', 'knowledgeable', 'supportive'],
          certifications: [],
        },
      ],
    })

    // Add internal records
    await prisma.internalRecord.createMany({
      data: [
        {
          vendorId: vendor.id,
          projectName: 'Infrastructure Modernization',
          projectCategory: 'IT Services',
          contractValue: 150000 + Math.random() * 100000,
          startDate: new Date('2023-01-15'),
          endDate: new Date('2023-12-31'),
          deliverySuccessRate: 85 + Math.random() * 15,
          qualityScore: 80 + Math.random() * 20,
          costEfficiency: 75 + Math.random() * 25,
          responseTime: 2 + Math.random() * 6,
          complianceScore: 90 + Math.random() * 10,
          incidentCount: Math.floor(Math.random() * 3),
          notes: 'Delivered on time with excellent quality',
        },
        {
          vendorId: vendor.id,
          projectName: 'Security Audit Implementation',
          projectCategory: 'Security',
          contractValue: 80000 + Math.random() * 50000,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-08-31'),
          deliverySuccessRate: 90 + Math.random() * 10,
          qualityScore: 85 + Math.random() * 15,
          costEfficiency: 80 + Math.random() * 20,
          responseTime: 1.5 + Math.random() * 4,
          complianceScore: 95 + Math.random() * 5,
          incidentCount: Math.floor(Math.random() * 2),
          notes: 'Exceeded expectations in security implementation',
        },
      ],
    })

    // Add vendor features
    await prisma.vendorFeature.create({
      data: {
        vendorId: vendor.id,
        services: ['Consulting', 'Implementation', 'Support', 'Training'],
        technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
        certifications: ['ISO 9001', 'ISO 27001', 'SOC 2', 'AWS Certified'],
        languages: ['English', 'Spanish', 'French'],
        regions: ['North America', 'Europe', 'Asia Pacific'],
        teamSize: Math.floor(Math.random() * 100) + 20,
        yearsInBusiness: Math.floor(Math.random() * 10) + 5,
        clientCount: Math.floor(Math.random() * 200) + 50,
        industries: ['Finance', 'Healthcare', 'Technology', 'Retail'],
        expertiseAreas: ['Cloud Migration', 'DevOps', 'Security', 'Automation'],
      },
    })

    // Add vendor scores
    const reliabilityScore = 75 + Math.random() * 25
    const costScore = 70 + Math.random() * 30
    const capabilityScore = 80 + Math.random() * 20
    const performanceScore = 75 + Math.random() * 25
    const reputationScore = 80 + Math.random() * 20
    const riskScore = Math.random() * 30 // Lower is better

    const totalScore =
      reliabilityScore * 0.35 +
      capabilityScore * 0.25 +
      costScore * 0.2 +
      (100 - riskScore) * 0.1 +
      reputationScore * 0.1

    await prisma.vendorScore.create({
      data: {
        vendorId: vendor.id,
        totalScore: parseFloat(totalScore.toFixed(2)),
        reliabilityScore: parseFloat(reliabilityScore.toFixed(2)),
        costScore: parseFloat(costScore.toFixed(2)),
        capabilityScore: parseFloat(capabilityScore.toFixed(2)),
        performanceScore: parseFloat(performanceScore.toFixed(2)),
        reputationScore: parseFloat(reputationScore.toFixed(2)),
        riskScore: parseFloat(riskScore.toFixed(2)),
        mlPredictionScore: 75 + Math.random() * 25,
        embeddingScore: 0.7 + Math.random() * 0.3,
        scoreBreakdown: {
          reliability: {
            pastPerformance: reliabilityScore * 0.6,
            deliveryTrack: reliabilityScore * 0.4,
          },
          cost: {
            competitiveness: costScore * 0.5,
            valueForMoney: costScore * 0.5,
          },
          capability: {
            technicalSkills: capabilityScore * 0.6,
            certifications: capabilityScore * 0.4,
          },
        },
        rankingFactors: {
          strengths: ['High reliability', 'Strong technical capability', 'Good reputation'],
          weaknesses: ['Moderate cost efficiency'],
          recommendations: ['Excellent for mission-critical projects'],
        },
        modelVersion: 'v1.0.0',
      },
    })

    // Add vendor risks
    const riskLevel =
      riskScore < 10 ? RiskLevel.LOW : riskScore < 20 ? RiskLevel.MEDIUM : RiskLevel.HIGH

    await prisma.vendorRisk.create({
      data: {
        vendorId: vendor.id,
        riskLevel,
        riskCategory: 'Operational',
        description: 'Minor delays observed in past projects',
        severity: Math.floor(riskScore / 10) + 1,
        probability: riskScore / 100,
        impact: riskScore,
        indicators: {
          delayIncidents: Math.floor(Math.random() * 3),
          qualityIssues: Math.floor(Math.random() * 2),
          communicationGaps: Math.floor(Math.random() * 2),
        },
        mitigation: 'Regular status meetings and milestone tracking',
        status: RiskStatus.MONITORING,
      },
    })

    // Add audit log
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        vendorId: vendor.id,
        action: 'VENDOR_CREATED',
        entity: 'Vendor',
        entityId: vendor.id,
        details: {
          vendorName: vendor.name,
          createdBy: 'seed script',
        },
      },
    })

    console.log(`✅ Created vendor: ${vendor.name}`)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
