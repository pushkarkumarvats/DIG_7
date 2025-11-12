# 🎯 Complete Installation & Setup Guide

## Overview
This guide will help you install and run the Intelligent Vendor Management System on Windows.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- ✅ **Windows 10/11**
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **PostgreSQL** OR **Supabase account** (free)
- ✅ **Git** (optional) - [Download](https://git-scm.com/)
- ✅ **Code Editor** - VS Code recommended

---

## 🚀 Installation Methods

Choose one:

### Method 1: Automated Setup (Recommended)

```powershell
# Navigate to project folder
cd d:\dig\DIG_7

# Run setup script
.\setup.ps1
```

The script will:
1. ✅ Check prerequisites
2. ✅ Install dependencies
3. ✅ Create .env file
4. ✅ Generate Prisma client
5. ✅ Setup database (optional)
6. ✅ Seed demo data

### Method 2: Manual Setup

Follow these steps:

#### Step 1: Install Dependencies

```powershell
npm install
```

Wait for installation to complete (~2-3 minutes).

#### Step 2: Setup Environment

Create `.env` file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` with your preferred editor:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/vendor_management"

# Authentication
NEXTAUTH_SECRET="generate-with-command-below"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Google Search API
GOOGLE_SEARCH_API_KEY=""
GOOGLE_CSE_ID=""
```

**Generate NEXTAUTH_SECRET:**

```powershell
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as `NEXTAUTH_SECRET` value.

#### Step 3: Setup Database

**Option A: Local PostgreSQL**

If you have PostgreSQL installed:

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE vendor_management;"

# Update DATABASE_URL in .env
# DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/vendor_management"
```

**Option B: Supabase (Recommended for beginners)**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up (free)
3. Create new project
4. Go to **Settings** → **Database**
5. Copy **Connection String** (URI)
6. Paste into `.env` as `DATABASE_URL`

#### Step 4: Initialize Prisma

```powershell
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed demo data
npm run seed
```

You should see:
```
✅ Created admin user
✅ Created vendor: TechSolutions Inc
✅ Created vendor: CloudMasters Pro
... (5 vendors total)
🎉 Seed completed successfully!
```

#### Step 5: Start Development Server

```powershell
npm run dev
```

You should see:
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

#### Step 6: Open Application

Open browser and go to:
```
http://localhost:3000
```

---

## 🔐 First Login

Use these credentials:
- **Email**: `admin@vendormanagement.com`
- **Password**: `admin123`

---

## ✨ Verify Installation

### 1. Check Dashboard
- You should see the vendor dashboard
- 5 demo vendors should be listed

### 2. View Vendor Details
- Click on "TechSolutions Inc"
- You should see:
  - Vendor scores
  - Performance history
  - Risk indicators
  - External reviews

### 3. Test Recommendations
- Go to **Recommend** page
- Enter: "I need AWS certified cloud provider"
- Click "Get Recommendations"
- You should see ranked vendor suggestions

---

## 🗄️ Database Browser

To view your database:

```powershell
npx prisma studio
```

Opens at `http://localhost:5555`

You can browse all tables:
- vendors
- users
- vendor_scores
- vendor_risks
- etc.

---

## 🛠️ Common Commands

### Development

```powershell
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Database

```powershell
# Open database browser
npx prisma studio

# Push schema changes
npx prisma db push

# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Seed demo data
npm run seed
```

### Deployment

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 📊 Understanding the Demo Data

The seed script creates:

### 5 Vendors:
1. **TechSolutions Inc** - IT Services
2. **CloudMasters Pro** - Cloud Computing
3. **DataSecure Systems** - Cybersecurity
4. **AgileDevs Co** - Software Development
5. **MarketBoost Digital** - Digital Marketing

Each vendor has:
- ✅ 2-3 external reviews (Google, Clutch, G2)
- ✅ 2 internal project records
- ✅ Vendor features (certifications, technologies)
- ✅ ML-generated scores
- ✅ Risk indicators
- ✅ Audit logs

### 1 Admin User:
- Email: `admin@vendormanagement.com`
- Password: `admin123`
- Role: ADMIN

---

## 🎨 Customization

### Change Port

```powershell
$env:PORT=3001; npm run dev
```

### Update Demo Credentials

Edit `prisma/seed.ts`:

```typescript
const hashedPassword = await bcrypt.hash('yournewpassword', 10)
const adminUser = await prisma.user.upsert({
  where: { email: 'your@email.com' },
  // ...
})
```

Then run:
```powershell
npm run seed
```

### Add More Vendors

Use the **Upload Data** page or add directly via Prisma Studio.

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```powershell
npx prisma generate
```

### Issue: "Port 3000 already in use"

**Solution:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001; npm run dev
```

### Issue: Database connection failed

**Solution:**
1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `.env`
3. Test connection:
   ```powershell
   npx prisma db pull
   ```

### Issue: "Prisma Schema not found"

**Solution:**
```powershell
# Ensure you're in project root
cd d:\dig\DIG_7

# Regenerate
npx prisma generate
```

### Issue: Seed script fails

**Solution:**
```powershell
# Reset and retry
npx prisma db push --force-reset
npm run seed
```

### Issue: Build errors

**Solution:**
```powershell
# Clear cache and rebuild
Remove-Item -Recurse -Force .next
npm run build
```

---

## 🔄 Updates & Maintenance

### Update Dependencies

```powershell
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm update next
```

### Database Migrations

When schema changes:

```powershell
npx prisma db push
```

### Backup Database

```powershell
# PostgreSQL
pg_dump -U postgres vendor_management > backup.sql

# Restore
psql -U postgres vendor_management < backup.sql
```

---

## 📚 Next Steps

1. ✅ **Explore Features**
   - View all vendors
   - Calculate vendor scores
   - Get recommendations
   - Upload CSV data

2. ✅ **Customize**
   - Modify UI components
   - Add new features
   - Adjust scoring weights

3. ✅ **Deploy**
   - Follow `DEPLOYMENT.md`
   - Deploy to Vercel
   - Setup production database

4. ✅ **Learn More**
   - Read `API_DOCUMENTATION.md`
   - Check `PROJECT_SUMMARY.md`
   - Explore codebase

---

## 📖 Additional Resources

- **Full README**: `README.md`
- **API Docs**: `API_DOCUMENTATION.md`
- **Deployment**: `DEPLOYMENT.md`
- **Quick Start**: `QUICKSTART.md`
- **Project Summary**: `PROJECT_SUMMARY.md`

---

## 💡 Tips for Success

1. **Start Simple**: Use demo data first
2. **Test Locally**: Verify everything works before deploying
3. **Read Docs**: Check documentation for advanced features
4. **Use Prisma Studio**: Great for viewing/editing data
5. **Check Logs**: Use `vercel logs` to debug issues

---

## 🎓 Learning Path

### Beginner
1. Run the application
2. Explore the dashboard
3. Add a vendor manually
4. Try recommendations

### Intermediate
1. Upload CSV data
2. Modify UI components
3. Adjust scoring weights
4. Deploy to Vercel

### Advanced
1. Train custom ML models
2. Add new API endpoints
3. Integrate with external APIs
4. Build custom features

---

## ⚠️ Important Notes

- **Demo Data**: Automatically seeded, includes 5 vendors
- **Admin Credentials**: Change in production!
- **Environment Variables**: Never commit `.env` to Git
- **Database**: Regular backups recommended
- **Security**: Enable authentication in production

---

## 🎉 Congratulations!

You now have a fully functional Intelligent Vendor Management System!

### What You Can Do:
✅ Manage vendors
✅ Calculate ML scores
✅ Get AI recommendations
✅ Track performance
✅ Monitor risks
✅ Upload data
✅ View audit trails

---

## 📞 Need Help?

- 📖 Documentation: See all `.md` files
- 💬 GitHub Issues: Report bugs
- 📧 Email: support@yourproject.com

---

**Built with ❤️ for DIGITHON Problem-7**

**Status**: ✅ READY TO USE
