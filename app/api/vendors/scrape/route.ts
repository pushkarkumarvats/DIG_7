import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeWebsite, searchGoogleForVendor } from '@/lib/scraper'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId, website } = body

    if (!vendorId || !website) {
      return NextResponse.json(
        { error: 'vendorId and website are required' },
        { status: 400 }
      )
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Scrape vendor website
    console.log('Scraping website:', website)
    const scrapedData = await scrapeWebsite(website)

    // Update vendor with scraped data
    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        description: scrapedData.description || vendor.description,
        email: scrapedData.emails[0] || vendor.email,
        phone: scrapedData.phones[0] || vendor.phone,
        linkedinUrl: scrapedData.socialLinks.linkedin || vendor.linkedinUrl,
      },
    })

    // Store external reviews (simulated data)
    const reviewSources = ['Google', 'Trustpilot', 'G2', 'Clutch']
    const externalReviews = []

    for (const source of reviewSources) {
      const rating = 3.5 + Math.random() * 1.5 // Random rating between 3.5 and 5.0
      const reviewCount = Math.floor(Math.random() * 200) + 20

      const review = await prisma.externalReview.create({
        data: {
          vendorId,
          source,
          rating: parseFloat(rating.toFixed(1)),
          reviewCount,
          reviewText: `Scraped from ${source}`,
          sentiment: rating > 4 ? 'positive' : rating > 3.5 ? 'neutral' : 'negative',
          keywords: scrapedData.keywords.slice(0, 5),
          certifications: scrapedData.certifications,
        },
      })

      externalReviews.push(review)
    }

    // Update or create vendor features
    await prisma.vendorFeature.upsert({
      where: { vendorId },
      create: {
        vendorId,
        services: scrapedData.services,
        technologies: scrapedData.technologies,
        certifications: scrapedData.certifications,
        languages: ['English'],
        regions: ['North America'],
        industries: [vendor.industry || 'Technology'],
        expertiseAreas: scrapedData.keywords.slice(0, 5),
      },
      update: {
        services: scrapedData.services,
        technologies: scrapedData.technologies,
        certifications: scrapedData.certifications,
      },
    })

    // Search Google for additional information
    console.log('Searching Google for:', vendor.name)
    const searchResults = await searchGoogleForVendor(vendor.name)

    return NextResponse.json({
      success: true,
      message: 'Vendor data scraped successfully',
      data: {
        scrapedData,
        externalReviews,
        searchResults: searchResults.slice(0, 5),
      },
    })
  } catch (error) {
    console.error('Error scraping vendor data:', error)
    return NextResponse.json(
      { error: 'Failed to scrape vendor data' },
      { status: 500 }
    )
  }
}
