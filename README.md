# Intelligent Vendor Management System v1.0

A complete AI-powered vendor management and selection platform built with Next.js 15, TypeScript, Prisma, and Machine Learning.

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Database**: PostgreSQL  
**Built for**: DIGITHON Problem-7

## 🚀 Features

### Core Functionality
- **Vendor Management Dashboard** - Comprehensive vendor database with full CRUD operations
- **Web Scraping & OSINT** - Automated vendor data collection from websites and public sources
- **ML-Based Scoring** - Intelligent vendor scoring using Random Forest and Gradient Boosting models
- **Recommendation Engine** - AI-powered vendor recommendations based on requirements
- **Risk Assessment** - Automated risk detection and monitoring
- **Performance Tracking** - Historical performance analytics and reporting
- **Audit Logging** - Complete audit trail of all actions
- **CSV Data Import** - Bulk upload of vendor performance data

### Technical Features
- **Next.js 15** with App Router and Server Components
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **Tailwind CSS** + **shadcn/ui** for modern UI
- **Machine Learning** scoring pipeline
- **Web Scraping** with Cheerio and Playwright
- **RESTful API** design
- **Responsive Design** for all devices

## 📋 Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL Database** - Choose one:
  - Docker (recommended) - [Get Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Native PostgreSQL - [Download](https://www.postgresql.org/download/windows/)
  - Supabase (cloud) - [Free tier available](https://supabase.com)
- Python 3.8+ (for ML training)
- Git

## 🛠️ Quick Start

### Method 1: Automated Setup (Recommended)

```powershell
# 1. Install dependencies
npm install

# 2. Run complete setup (includes PostgreSQL with Docker)
.\setup-complete.ps1

# 3. Start the application
npm run dev
```

Open http://localhost:3000 and login with:
- **Email**: `admin@vendormanagement.com`
- **Password**: `admin123`

### Method 2: Manual Setup

#### Step 1: Install Dependencies
```powershell
npm install
```

#### Step 2: Setup PostgreSQL

**Option A: Using Docker (Easiest)**
```powershell
# Start PostgreSQL container
docker-compose up -d
```

**Option B: Using Native PostgreSQL**
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Create database: `vendor_management`
3. Default credentials: `postgres` / `postgres`

**Option C: Using Supabase (Cloud)**
1. Sign up at https://supabase.com
2. Create new project
3. Get connection string from Settings > Database

📖 **Detailed guide**: See [POSTGRES_SETUP.md](POSTGRES_SETUP.md)

#### Step 3: Configure Environment
```powershell
# .env file is already created with defaults
# For Docker/Local PostgreSQL, no changes needed
# For Supabase, update DATABASE_URL in .env
```

#### Step 4: Initialize Database
```powershell
# Push schema to database
npx prisma db push

# Load demo data (5 vendors, 1 admin user)
npm run seed
```

#### Step 5: Start Development Server
```powershell
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
DIG_7/
├── app/
│   ├── api/                    # API Routes
│   │   ├── vendors/            # Vendor CRUD
│   │   ├── recommend/          # Recommendation engine
│   │   ├── upload/             # CSV upload
│   │   └── audit-logs/         # Audit trail
│   ├── dashboard/              # Dashboard pages
│   │   ├── vendors/            # Vendor list
│   │   ├── vendor/[id]/        # Vendor detail
│   │   ├── recommend/          # Recommendations
│   │   └── upload/             # Data upload
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── sidebar.tsx             # Navigation
├── lib/
│   ├── prisma.ts               # Prisma client
│   ├── scraper.ts              # Web scraping
│   ├── ml-scoring.ts           # ML scoring logic
│   └── utils.ts                # Utilities
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── scripts/
│   └── ml/
│       └── train_model.py      # ML training
└── vercel.json                 # Deployment config
```

## 🗄️ Database Schema

### Core Models
- **User** - Admin/manager users
- **Vendor** - Vendor companies
- **ExternalReview** - Scraped reviews from web
- **InternalRecord** - Historical project data
- **VendorFeature** - Capabilities and certifications
- **VendorScore** - ML-generated scores
- **VendorRisk** - Risk indicators
- **AuditLog** - Action audit trail

## 🤖 API Endpoints

### Vendors
- `GET /api/vendors` - List vendors (with filters)
- `GET /api/vendors/[id]` - Get vendor details
- `POST /api/vendors` - Create vendor
- `PATCH /api/vendors/[id]` - Update vendor
- `DELETE /api/vendors/[id]` - Delete vendor

### Operations
- `POST /api/vendors/scrape` - Scrape vendor data
- `POST /api/vendors/score` - Calculate ML score
- `POST /api/recommend` - Get recommendations
- `POST /api/upload` - Upload CSV data
- `GET /api/audit-logs` - View audit logs

## 📊 ML Scoring System

### Feature Engineering
The system extracts and analyzes:
- Delivery success rates
- Quality scores
- Cost efficiency
- Compliance metrics
- External ratings
- Certifications
- Team capacity
- Risk indicators

### Scoring Formula
```
total_score = 
  reliability_score × 0.35 +
  capability_score × 0.25 +
  cost_score × 0.20 +
  (100 - risk_score) × 0.10 +
  reputation_score × 0.10
```

### Model Training
```powershell
# Train new model
python scripts/ml/train_model.py

# Models saved to:
# - models/vendor_scoring_model.pkl
# - models/feature_scaler.pkl
# - models/model_metadata.json
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```powershell
npm i -g vercel
```

2. **Login to Vercel**
```powershell
vercel login
```

3. **Deploy**
```powershell
vercel
```

4. **Configure Environment Variables**
In Vercel dashboard, add:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_SEARCH_API_KEY` (optional)
- `GOOGLE_CSE_ID` (optional)

5. **Deploy Production**
```powershell
vercel --prod
```

### Database Hosting
Recommended PostgreSQL hosting:
- **Supabase** (Free tier available)
- **Neon** (Serverless Postgres)
- **Railway** (Simple deployment)

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generated-secret-key"

# Optional: Google Search API
GOOGLE_SEARCH_API_KEY="your-api-key"
GOOGLE_CSE_ID="your-cse-id"

# ML Service (if separate)
ML_SERVICE_URL="http://localhost:8000"
```

### Generate Secret Key
```powershell
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📈 Usage Examples

### 1. Add a New Vendor
Navigate to Dashboard → Vendors → Add Vendor

### 2. Scrape Vendor Data
- Go to vendor detail page
- Click "Scrape Data"
- System fetches website, reviews, certifications

### 3. Calculate Vendor Score
- Go to vendor detail page
- Click "Calculate Score"
- ML model generates comprehensive score

### 4. Get Recommendations
- Navigate to "Recommend" page
- Enter requirements (e.g., "AWS certified cloud provider for healthcare")
- Get ranked vendor recommendations with explanations

### 5. Upload Historical Data
- Navigate to "Upload Data" page
- Select CSV file with format:
```csv
vendorName,projectName,projectCategory,contractValue,startDate,endDate,deliverySuccessRate,qualityScore,costEfficiency,responseTime,complianceScore,incidentCount,notes
```

## 🧪 Testing

### Run Tests
```powershell
npm run test
```

### Test Data
Seed script includes 5 demo vendors with:
- External reviews
- Internal performance records
- Features and certifications
- ML scores
- Risk indicators

## 🐛 Troubleshooting

### Database Connection Issues
```powershell
# Check connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

### Build Errors
```powershell
# Clear cache
rm -rf .next
npm run build
```

### Missing Packages
```powershell
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 CSV Upload Format

```csv
vendorName,projectName,projectCategory,contractValue,startDate,endDate,deliverySuccessRate,qualityScore,costEfficiency,responseTime,complianceScore,incidentCount,notes
TechCorp,Cloud Migration,IT Services,250000,2023-01-01,2023-12-31,95,90,85,24,95,0,Excellent
```

## 🔒 Security

- All API routes should be protected with authentication in production
- Environment variables for sensitive data
- SQL injection protection via Prisma
- Input validation and sanitization
- CORS configuration for API access

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

DIGITHON - Problem 7: Intelligent Vendor Management System

## 🎯 Demo Credentials

```
Email: admin@vendormanagement.com
Password: admin123
```

## 📞 Support

For issues or questions:
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)
- Email: support@yourproject.com

## 🚀 Roadmap

- [ ] Email notifications for risk alerts
- [ ] Advanced analytics dashboard
- [ ] Vendor comparison tool
- [ ] Contract management module
- [ ] Mobile app
- [ ] Integration with ERP systems
- [ ] Advanced ML models (Deep Learning)
- [ ] Real-time vendor monitoring

## 📊 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 15, React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL, Prisma ORM |
| ML | Python, scikit-learn, pandas |
| Scraping | Cheerio, Playwright |
| Deployment | Vercel |
| Auth | NextAuth.js |

---

**Built with ❤️ for DIGITHON Problem-7**
