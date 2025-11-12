import axios from 'axios'
import * as cheerio from 'cheerio'

export interface ScrapedData {
  title?: string
  description?: string
  keywords: string[]
  emails: string[]
  phones: string[]
  socialLinks: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  certifications: string[]
  services: string[]
  technologies: string[]
  ratings: {
    source: string
    rating: number
    reviewCount?: number
  }[]
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    })

    const $ = cheerio.load(response.data)
    
    // Extract basic metadata
    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('h1').first().text().trim()
    
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       $('p').first().text().trim()

    // Extract keywords
    const keywords: string[] = []
    const metaKeywords = $('meta[name="keywords"]').attr('content')
    if (metaKeywords) {
      keywords.push(...metaKeywords.split(',').map(k => k.trim()))
    }

    // Extract contact information
    const emails: string[] = []
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    const pageText = $.text()
    const emailMatches = pageText.match(emailRegex)
    if (emailMatches) {
      emails.push(...[...new Set(emailMatches)])
    }

    const phones: string[] = []
    const phoneRegex = /(\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/g
    const phoneMatches = pageText.match(phoneRegex)
    if (phoneMatches) {
      phones.push(...[...new Set(phoneMatches)])
    }

    // Extract social links
    const socialLinks: ScrapedData['socialLinks'] = {}
    $('a[href*="linkedin.com"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && href.includes('linkedin.com/company')) {
        socialLinks.linkedin = href
      }
    })
    $('a[href*="twitter.com"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href) socialLinks.twitter = href
    })
    $('a[href*="facebook.com"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href) socialLinks.facebook = href
    })

    // Extract certifications
    const certifications: string[] = []
    const certKeywords = ['ISO', 'SOC', 'GDPR', 'HIPAA', 'PCI', 'certified', 'compliance']
    certKeywords.forEach(keyword => {
      if (pageText.toLowerCase().includes(keyword.toLowerCase())) {
        // Find context around the keyword
        const regex = new RegExp(`(${keyword}[\\s\\w-]*\\d+)`, 'gi')
        const matches = pageText.match(regex)
        if (matches) {
          certifications.push(...matches)
        }
      }
    })

    // Extract services
    const services: string[] = []
    const serviceKeywords = [
      'consulting', 'development', 'design', 'support', 'maintenance',
      'implementation', 'integration', 'migration', 'training', 'managed services'
    ]
    serviceKeywords.forEach(service => {
      if (pageText.toLowerCase().includes(service)) {
        services.push(service.charAt(0).toUpperCase() + service.slice(1))
      }
    })

    // Extract technologies
    const technologies: string[] = []
    const techKeywords = [
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'React', 'Angular',
      'Vue', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript', 'MongoDB',
      'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch'
    ]
    techKeywords.forEach(tech => {
      if (pageText.includes(tech)) {
        technologies.push(tech)
      }
    })

    return {
      title,
      description,
      keywords: [...new Set(keywords)],
      emails: emails.slice(0, 5),
      phones: phones.slice(0, 3),
      socialLinks,
      certifications: [...new Set(certifications)].slice(0, 10),
      services: [...new Set(services)].slice(0, 10),
      technologies: [...new Set(technologies)].slice(0, 15),
      ratings: [],
    }
  } catch (error) {
    console.error('Scraping error:', error)
    return {
      keywords: [],
      emails: [],
      phones: [],
      socialLinks: {},
      certifications: [],
      services: [],
      technologies: [],
      ratings: [],
    }
  }
}

export async function searchGoogleForVendor(vendorName: string): Promise<any[]> {
  // This is a placeholder for Google Custom Search API integration
  // In production, you would use the actual Google Custom Search API
  
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    const cseId = process.env.GOOGLE_CSE_ID

    if (!apiKey || !cseId) {
      console.warn('Google Search API not configured')
      return []
    }

    const searchQuery = `${vendorName} reviews ratings`
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(searchQuery)}`

    const response = await axios.get(url)
    return response.data.items || []
  } catch (error) {
    console.error('Google search error:', error)
    return []
  }
}

export async function extractReviewsFromPage(url: string): Promise<{
  source: string
  rating: number
  reviewCount: number
  sentiment: string
}[]> {
  // Placeholder for review extraction
  // In production, implement specific scrapers for review sites
  return []
}
