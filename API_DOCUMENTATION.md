# API Documentation

## Base URL
```
Production: https://your-project.vercel.app/api
Development: http://localhost:3000/api
```

## Authentication
Most endpoints require authentication. Include authentication token in headers:
```
Authorization: Bearer <token>
```

---

## Vendors

### List Vendors
Get paginated list of vendors with optional filters.

**Endpoint:** `GET /api/vendors`

**Query Parameters:**
- `query` (string, optional): Search by name or description
- `status` (string, optional): Filter by status (ACTIVE, INACTIVE, BLOCKED, PENDING)
- `industry` (string, optional): Filter by industry
- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 10): Results per page

**Response:**
```json
{
  "vendors": [
    {
      "id": "clx...",
      "name": "TechSolutions Inc",
      "industry": "IT Services",
      "status": "ACTIVE",
      "isVerified": true,
      "scores": [
        {
          "totalScore": 87.5,
          "reliabilityScore": 92.3,
          "riskScore": 15.2
        }
      ],
      "risks": [
        {
          "riskLevel": "LOW"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### Get Vendor Details
Retrieve complete vendor profile with all related data.

**Endpoint:** `GET /api/vendors/[id]`

**Response:**
```json
{
  "id": "clx...",
  "name": "TechSolutions Inc",
  "website": "https://techsolutions.example.com",
  "email": "contact@techsolutions.com",
  "phone": "+1-555-0101",
  "description": "Leading IT services provider...",
  "industry": "IT Services",
  "companySize": "500-1000",
  "status": "ACTIVE",
  "isVerified": true,
  "externalReviews": [...],
  "internalRecords": [...],
  "features": {...},
  "scores": [...],
  "risks": [...],
  "auditLogs": [...]
}
```

---

### Create Vendor
Add a new vendor to the system.

**Endpoint:** `POST /api/vendors`

**Request Body:**
```json
{
  "name": "New Vendor Inc",
  "website": "https://newvendor.com",
  "email": "contact@newvendor.com",
  "phone": "+1-555-9999",
  "description": "Description of services",
  "industry": "Technology",
  "companySize": "50-100",
  "founded": "2020",
  "status": "PENDING"
}
```

**Response:** `201 Created`
```json
{
  "id": "clx...",
  "name": "New Vendor Inc",
  ...
}
```

---

### Update Vendor
Update vendor information.

**Endpoint:** `PATCH /api/vendors/[id]`

**Request Body:** (partial update)
```json
{
  "status": "ACTIVE",
  "isVerified": true
}
```

**Response:** `200 OK`

---

### Delete Vendor
Remove a vendor from the system.

**Endpoint:** `DELETE /api/vendors/[id]`

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Vendor Operations

### Scrape Vendor Data
Initiate web scraping to collect vendor information from public sources.

**Endpoint:** `POST /api/vendors/scrape`

**Request Body:**
```json
{
  "vendorId": "clx...",
  "website": "https://vendor-website.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor data scraped successfully",
  "data": {
    "scrapedData": {
      "title": "Company Name",
      "description": "...",
      "emails": ["contact@example.com"],
      "phones": ["+1-555-0000"],
      "certifications": ["ISO 9001", "SOC 2"],
      "technologies": ["AWS", "Docker", "Kubernetes"]
    },
    "externalReviews": [...],
    "searchResults": [...]
  }
}
```

---

### Calculate Vendor Score
Run ML model to calculate comprehensive vendor score.

**Endpoint:** `POST /api/vendors/score`

**Request Body:**
```json
{
  "vendorId": "clx..."
}
```

**Response:**
```json
{
  "success": true,
  "vendorId": "clx...",
  "scores": {
    "totalScore": 87.5,
    "reliabilityScore": 92.3,
    "costScore": 78.5,
    "capabilityScore": 89.2,
    "performanceScore": 85.7,
    "reputationScore": 88.4,
    "riskScore": 15.2,
    "scoreBreakdown": {...},
    "modelVersion": "v1.0.0"
  },
  "riskIndicators": [
    {
      "type": "LOW_RELIABILITY",
      "message": "..."
    }
  ],
  "explainability": {
    "strengths": ["High reliability", "Strong capabilities"],
    "weaknesses": ["Cost efficiency needs improvement"],
    "recommendations": ["Suitable for mission-critical projects"]
  }
}
```

---

## Recommendation Engine

### Get Vendor Recommendations
Get AI-powered vendor recommendations based on requirements.

**Endpoint:** `POST /api/recommend`

**Request Body:**
```json
{
  "requirement": "We need a cloud infrastructure provider with AWS expertise, ISO 27001 certification, and healthcare experience. Budget around $150k.",
  "category": "IT Services",
  "maxResults": 5,
  "minScore": 60
}
```

**Response:**
```json
{
  "success": true,
  "recommendation": {
    "totalCandidates": 50,
    "qualifiedCandidates": 5,
    "topVendors": [
      {
        "id": "clx...",
        "name": "TechSolutions Inc",
        "score": 92.5,
        "mlScore": 89.2,
        "similarityScore": 95.8,
        "matchReasons": [
          "Expertise in AWS",
          "ISO 27001 certified",
          "Healthcare industry experience"
        ],
        "riskLevel": "LOW",
        "estimatedCost": "Medium ($100k-$200k)",
        "strengths": ["High Reliability", "Well Certified"],
        "certifications": ["ISO 27001", "SOC 2", "HIPAA"]
      }
    ],
    "comparisonMatrix": {
      "vendors": ["TechSolutions", "CloudMasters"],
      "criteria": [
        {
          "name": "Overall Score",
          "values": [92.5, 87.3]
        }
      ]
    }
  },
  "reasoning": "Based on the requirement...",
  "rankingCriteria": {
    "mlScoreWeight": 0.6,
    "similarityWeight": 0.4,
    "minScoreThreshold": 60
  }
}
```

---

## Data Upload

### Upload Vendor Performance Data
Bulk upload historical vendor performance data via CSV.

**Endpoint:** `POST /api/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: CSV file

**CSV Format:**
```csv
vendorName,projectName,projectCategory,contractValue,startDate,endDate,deliverySuccessRate,qualityScore,costEfficiency,responseTime,complianceScore,incidentCount,notes
TechCorp,Project A,IT Services,250000,2023-01-01,2023-12-31,95,90,85,24,95,0,Excellent
```

**Response:**
```json
{
  "message": "Upload completed",
  "results": {
    "success": 8,
    "failed": 2,
    "errors": [
      "Row 3: Invalid date format",
      "Row 7: Missing required field 'contractValue'"
    ]
  }
}
```

---

## Audit Logs

### Create Audit Log
Record user action in audit trail.

**Endpoint:** `POST /api/audit-logs`

**Request Body:**
```json
{
  "userId": "clx...",
  "vendorId": "clx...",
  "action": "VENDOR_VIEWED",
  "entity": "Vendor",
  "entityId": "clx...",
  "details": {
    "page": "vendor-detail",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Response:** `200 OK`

---

### Get Audit Logs
Retrieve audit trail with filters.

**Endpoint:** `GET /api/audit-logs`

**Query Parameters:**
- `userId` (string, optional)
- `vendorId` (string, optional)
- `action` (string, optional)
- `limit` (number, optional, default: 50)

**Response:**
```json
[
  {
    "id": "clx...",
    "userId": "clx...",
    "vendorId": "clx...",
    "action": "VENDOR_SCORED",
    "entity": "Vendor",
    "entityId": "clx...",
    "details": {...},
    "timestamp": "2024-01-15T10:30:00Z",
    "user": {
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "vendor": {
      "name": "TechSolutions Inc"
    }
  }
]
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
  "error": "Vendor not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request"
}
```

---

## Rate Limiting

- Development: No rate limits
- Production: 100 requests per minute per IP

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Webhooks (Future)

Coming soon:
- Vendor score updates
- Risk alert notifications
- Compliance changes

---

## SDKs and Examples

### JavaScript/TypeScript
```typescript
// Fetch vendors
const response = await fetch('/api/vendors?status=ACTIVE')
const data = await response.json()

// Get recommendations
const recommendations = await fetch('/api/recommend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    requirement: 'AWS cloud provider',
    maxResults: 5
  })
})
```

### Python
```python
import requests

# Fetch vendors
response = requests.get('https://api.example.com/api/vendors')
vendors = response.json()

# Calculate score
score = requests.post(
    'https://api.example.com/api/vendors/score',
    json={'vendorId': 'clx...'}
)
```

---

## Support

For API support:
- Email: api-support@yourproject.com
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)
