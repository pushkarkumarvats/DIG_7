# ⚡ Quick Start Guide

Get the Intelligent Vendor Management System running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- Git

## Installation Steps

### 1️⃣ Install Dependencies

```powershell
npm install
```

### 2️⃣ Setup Environment

Create `.env` file:

```powershell
cp .env.example .env
```

Edit `.env` with your database:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vendor_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

> 💡 **Quick Database Setup with Supabase:**
> 1. Go to https://supabase.com
> 2. Create new project
> 3. Copy connection string from Settings → Database

### 3️⃣ Setup Database

```powershell
npx prisma generate
npx prisma db push
npm run seed
```

### 4️⃣ Start Development Server

```powershell
npm run dev
```

### 5️⃣ Open Application

Visit: **http://localhost:3000**

---

## 🎉 You're Ready!

Login with:
- **Email**: `admin@vendormanagement.com`
- **Password**: `admin123`

---

## 🚀 What to Try First

### 1. View Vendors
- Go to **Dashboard** → **Vendors**
- See 5 demo vendors with complete data

### 2. View Vendor Details
- Click on any vendor
- See scores, risks, performance history
- Try "Scrape Data" and "Calculate Score" buttons

### 3. Get Recommendations
- Go to **Recommend** page
- Enter requirement like:
  ```
  I need a cloud infrastructure provider with AWS certification 
  and healthcare experience for a 6-month project
  ```
- Click "Get Recommendations"
- See AI-powered vendor suggestions

### 4. Upload Data
- Go to **Upload Data** page
- Use sample CSV from `data/sample_vendor_data.csv`
- Upload and see results

---

## 🛠️ Common Commands

```powershell
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open database browser
npx prisma db push       # Push schema changes
npm run seed             # Seed demo data

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
```

---

## 📱 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Vendors | `/dashboard/vendors` | List all vendors |
| Vendor Detail | `/dashboard/vendor/[id]` | Full vendor profile |
| Recommend | `/dashboard/recommend` | Get recommendations |
| Upload | `/dashboard/upload` | Import CSV data |
| Audit Logs | `/dashboard/audit-logs` | View activity log |

---

## 🐛 Troubleshooting

### Database Connection Failed
```powershell
# Check if PostgreSQL is running
# Verify DATABASE_URL in .env
# Try: npx prisma db pull
```

### Port Already in Use
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001; npm run dev
```

### Prisma Errors
```powershell
# Reset and regenerate
npx prisma generate
npx prisma db push --force-reset
npm run seed
```

---

## 📚 Next Steps

1. **Explore the Dashboard** - Navigate through all pages
2. **Read API Docs** - See `API_DOCUMENTATION.md`
3. **Customize** - Modify components in `components/` folder
4. **Add More Data** - Upload your CSV files
5. **Deploy** - Follow `DEPLOYMENT.md` guide

---

## 🎯 Key Features to Explore

✅ **Vendor Scoring** - ML-powered vendor evaluation
✅ **Web Scraping** - Automated data collection
✅ **Recommendations** - AI suggestions based on requirements
✅ **Risk Assessment** - Automated risk detection
✅ **Performance Tracking** - Historical analytics
✅ **Audit Trail** - Complete activity logging

---

## 💡 Tips

- **Demo Data**: 5 vendors with complete profiles already seeded
- **Search**: Use search on vendors page to find specific vendors
- **Filters**: Filter by status, industry, risk level
- **Scores**: Calculated using 6 different metrics
- **CSV Format**: Check `data/sample_vendor_data.csv` for upload format

---

## 🚀 Deploy to Production

**One-click deployment to Vercel:**

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

See full deployment guide in `DEPLOYMENT.md`

---

## ❓ Need Help?

- 📖 **Full Documentation**: `README.md`
- 🔌 **API Reference**: `API_DOCUMENTATION.md`
- 🚀 **Deployment Guide**: `DEPLOYMENT.md`
- 📊 **Project Overview**: `PROJECT_SUMMARY.md`
- 💬 **GitHub Issues**: Create an issue for bugs

---

**Happy Building! 🎉**

Built for DIGITHON Problem-7
