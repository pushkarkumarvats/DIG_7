// Mock data for frontend demo without database
export const mockVendors = [
  {
    id: 1,
    name: "TechSolutions Inc",
    website: "https://techsolutions.example.com",
    contactName: "John Smith",
    email: "john@techsolutions.example.com",
    phone: "+1-555-0101",
    address: "123 Tech Street, San Francisco, CA 94105",
    industry: "IT Services",
    status: "ACTIVE",
    description: "Leading provider of enterprise IT solutions with 15+ years of experience",
    overallScore: 87.5,
    riskLevel: "LOW",
    scores: {
      reliability: 92,
      cost: 85,
      capability: 88,
      performance: 86,
      reputation: 90,
      risk: 12
    },
    reviews: [
      {
        id: 1,
        source: "Google Reviews",
        rating: 4.5,
        reviewText: "Excellent service and professional team. Delivered our project on time.",
        date: "2024-10-15",
        reviewerName: "Alice Johnson"
      },
      {
        id: 2,
        source: "Clutch",
        rating: 5.0,
        reviewText: "Outstanding technical expertise. Highly recommended!",
        date: "2024-09-20",
        reviewerName: "Bob Williams"
      }
    ],
    internalRecords: [
      {
        id: 1,
        projectName: "Cloud Migration Project",
        onTimeDelivery: true,
        qualityScore: 95,
        budgetAdherence: 98,
        feedback: "Exceptional work on our cloud infrastructure migration",
        completedDate: "2024-08-15"
      },
      {
        id: 2,
        projectName: "Security Audit",
        onTimeDelivery: true,
        qualityScore: 92,
        budgetAdherence: 95,
        feedback: "Thorough security assessment with actionable recommendations",
        completedDate: "2024-06-10"
      }
    ],
    features: [
      { category: "Certifications", name: "AWS Certified Solutions Architect", verified: true },
      { category: "Certifications", name: "ISO 27001", verified: true },
      { category: "Technology", name: "AWS", verified: true },
      { category: "Technology", name: "Azure", verified: true },
      { category: "Technology", name: "Kubernetes", verified: true }
    ],
    risks: [
      {
        category: "Financial",
        level: "LOW",
        description: "Strong financial position",
        severity: 2,
        status: "MONITORING"
      }
    ]
  },
  {
    id: 2,
    name: "CloudMasters Pro",
    website: "https://cloudmasters.example.com",
    contactName: "Sarah Chen",
    email: "sarah@cloudmasters.example.com",
    phone: "+1-555-0102",
    address: "456 Cloud Avenue, Seattle, WA 98101",
    industry: "Cloud Computing",
    status: "ACTIVE",
    description: "Specialized cloud infrastructure and DevOps consulting services",
    overallScore: 91.2,
    riskLevel: "LOW",
    scores: {
      reliability: 95,
      cost: 88,
      capability: 92,
      performance: 90,
      reputation: 93,
      risk: 8
    },
    reviews: [
      {
        id: 3,
        source: "Google Reviews",
        rating: 4.8,
        reviewText: "Best cloud consulting firm we've worked with. Very knowledgeable team.",
        date: "2024-11-01",
        reviewerName: "David Lee"
      },
      {
        id: 4,
        source: "G2",
        rating: 4.9,
        reviewText: "Exceptional DevOps expertise and great communication throughout.",
        date: "2024-10-10",
        reviewerName: "Emma Davis"
      }
    ],
    internalRecords: [
      {
        id: 3,
        projectName: "AWS Infrastructure Setup",
        onTimeDelivery: true,
        qualityScore: 98,
        budgetAdherence: 100,
        feedback: "Perfect execution of our AWS infrastructure deployment",
        completedDate: "2024-09-15"
      }
    ],
    features: [
      { category: "Certifications", name: "AWS Advanced Partner", verified: true },
      { category: "Certifications", name: "Kubernetes Certified Administrator", verified: true },
      { category: "Technology", name: "AWS", verified: true },
      { category: "Technology", name: "Docker", verified: true },
      { category: "Technology", name: "Terraform", verified: true }
    ],
    risks: []
  },
  {
    id: 3,
    name: "DataSecure Systems",
    website: "https://datasecure.example.com",
    contactName: "Michael Brown",
    email: "michael@datasecure.example.com",
    phone: "+1-555-0103",
    address: "789 Security Blvd, Austin, TX 78701",
    industry: "Cybersecurity",
    status: "ACTIVE",
    description: "Comprehensive cybersecurity solutions and penetration testing services",
    overallScore: 89.8,
    riskLevel: "LOW",
    scores: {
      reliability: 91,
      cost: 82,
      capability: 94,
      performance: 88,
      reputation: 92,
      risk: 10
    },
    reviews: [
      {
        id: 5,
        source: "Clutch",
        rating: 4.7,
        reviewText: "Top-notch security experts. Found vulnerabilities we didn't know existed.",
        date: "2024-10-25",
        reviewerName: "Frank Martinez"
      }
    ],
    internalRecords: [
      {
        id: 4,
        projectName: "Penetration Testing",
        onTimeDelivery: true,
        qualityScore: 96,
        budgetAdherence: 92,
        feedback: "Comprehensive security assessment with detailed report",
        completedDate: "2024-07-20"
      }
    ],
    features: [
      { category: "Certifications", name: "CEH Certified", verified: true },
      { category: "Certifications", name: "CISSP", verified: true },
      { category: "Service", name: "Penetration Testing", verified: true },
      { category: "Service", name: "Security Audits", verified: true }
    ],
    risks: []
  },
  {
    id: 4,
    name: "AgileDevs Co",
    website: "https://agiledevs.example.com",
    contactName: "Lisa Anderson",
    email: "lisa@agiledevs.example.com",
    phone: "+1-555-0104",
    address: "321 Dev Lane, Boston, MA 02101",
    industry: "Software Development",
    status: "ACTIVE",
    description: "Custom software development with agile methodologies",
    overallScore: 85.3,
    riskLevel: "MEDIUM",
    scores: {
      reliability: 88,
      cost: 90,
      capability: 85,
      performance: 82,
      reputation: 86,
      risk: 18
    },
    reviews: [
      {
        id: 6,
        source: "Google Reviews",
        rating: 4.3,
        reviewText: "Good development team, some communication issues but delivered quality code.",
        date: "2024-09-15",
        reviewerName: "George Wilson"
      }
    ],
    internalRecords: [
      {
        id: 5,
        projectName: "Mobile App Development",
        onTimeDelivery: false,
        qualityScore: 85,
        budgetAdherence: 88,
        feedback: "Good quality but 2 weeks delayed",
        completedDate: "2024-08-30"
      }
    ],
    features: [
      { category: "Technology", name: "React", verified: true },
      { category: "Technology", name: "Node.js", verified: true },
      { category: "Technology", name: "React Native", verified: true },
      { category: "Service", name: "Mobile Development", verified: true }
    ],
    risks: [
      {
        category: "Delivery",
        level: "MEDIUM",
        description: "Occasional delivery delays",
        severity: 4,
        status: "MONITORING"
      }
    ]
  },
  {
    id: 5,
    name: "MarketBoost Digital",
    website: "https://marketboost.example.com",
    contactName: "Rachel Green",
    email: "rachel@marketboost.example.com",
    phone: "+1-555-0105",
    address: "567 Marketing Plaza, New York, NY 10001",
    industry: "Digital Marketing",
    status: "ACTIVE",
    description: "Full-service digital marketing agency specializing in SEO and content marketing",
    overallScore: 82.7,
    riskLevel: "MEDIUM",
    scores: {
      reliability: 80,
      cost: 88,
      capability: 82,
      performance: 79,
      reputation: 85,
      risk: 22
    },
    reviews: [
      {
        id: 7,
        source: "G2",
        rating: 4.2,
        reviewText: "Decent results on our SEO campaign. Takes time to see improvements.",
        date: "2024-08-10",
        reviewerName: "Henry Taylor"
      }
    ],
    internalRecords: [
      {
        id: 6,
        projectName: "SEO Campaign",
        onTimeDelivery: true,
        qualityScore: 80,
        budgetAdherence: 85,
        feedback: "Satisfactory results, ongoing optimization needed",
        completedDate: "2024-07-01"
      }
    ],
    features: [
      { category: "Service", name: "SEO", verified: true },
      { category: "Service", name: "Content Marketing", verified: true },
      { category: "Service", name: "Social Media", verified: true },
      { category: "Technology", name: "Google Analytics", verified: true }
    ],
    risks: [
      {
        category: "Performance",
        level: "MEDIUM",
        description: "Variable campaign results",
        severity: 5,
        status: "MONITORING"
      }
    ]
  }
];

export const mockStats = {
  total: mockVendors.length,
  active: mockVendors.filter(v => v.status === "ACTIVE").length,
  highRisk: mockVendors.filter(v => v.riskLevel === "HIGH").length,
  topRated: mockVendors.filter(v => v.overallScore >= 90).length
};

export const mockRecommendations = (requirements: string) => {
  // Simple keyword matching for demo
  const keywords = requirements.toLowerCase();
  
  let scored = mockVendors.map(vendor => {
    let matchScore = 0;
    
    // Industry matching
    if (keywords.includes(vendor.industry.toLowerCase())) matchScore += 30;
    
    // Technology matching
    vendor.features.forEach(feature => {
      if (keywords.includes(feature.name.toLowerCase())) matchScore += 20;
    });
    
    // Description matching
    if (vendor.description.toLowerCase().includes(keywords)) matchScore += 10;
    
    // Combine with vendor score
    const finalScore = (matchScore * 0.6) + (vendor.overallScore * 0.4);
    
    return {
      ...vendor,
      matchScore: finalScore,
      matchReason: generateMatchReason(vendor, keywords)
    };
  });
  
  // Sort by match score
  scored.sort((a, b) => b.matchScore - a.matchScore);
  
  return scored.slice(0, 3);
};

function generateMatchReason(vendor: any, keywords: string): string {
  const reasons = [];
  
  if (keywords.includes(vendor.industry.toLowerCase())) {
    reasons.push(`Specializes in ${vendor.industry}`);
  }
  
  const matchingTech = vendor.features.filter((f: any) => 
    keywords.includes(f.name.toLowerCase())
  );
  
  if (matchingTech.length > 0) {
    reasons.push(`Expertise in ${matchingTech.map((f: any) => f.name).join(', ')}`);
  }
  
  if (vendor.overallScore >= 90) {
    reasons.push("Top-rated vendor with excellent track record");
  } else if (vendor.overallScore >= 85) {
    reasons.push("Highly rated with strong performance");
  }
  
  if (vendor.riskLevel === "LOW") {
    reasons.push("Low risk profile");
  }
  
  return reasons.join(". ");
}

export const mockAuditLogs = [
  {
    id: 1,
    action: "VENDOR_CREATED",
    details: "Created vendor: TechSolutions Inc",
    timestamp: "2024-11-10T10:30:00Z",
    userName: "Admin User",
    vendorName: "TechSolutions Inc"
  },
  {
    id: 2,
    action: "VENDOR_UPDATED",
    details: "Updated contact information",
    timestamp: "2024-11-09T14:20:00Z",
    userName: "Admin User",
    vendorName: "CloudMasters Pro"
  },
  {
    id: 3,
    action: "SCORE_CALCULATED",
    details: "Calculated ML scores",
    timestamp: "2024-11-08T09:15:00Z",
    userName: "System",
    vendorName: "DataSecure Systems"
  },
  {
    id: 4,
    action: "VENDOR_CREATED",
    details: "Created vendor: AgileDevs Co",
    timestamp: "2024-11-07T16:45:00Z",
    userName: "Admin User",
    vendorName: "AgileDevs Co"
  },
  {
    id: 5,
    action: "RISK_DETECTED",
    details: "Medium risk detected: Delivery delays",
    timestamp: "2024-11-06T11:30:00Z",
    userName: "System",
    vendorName: "AgileDevs Co"
  }
];
