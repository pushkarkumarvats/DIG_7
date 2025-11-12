# 🚀 Quick Database Setup Guide

## Current Issue
❌ **DATABASE_URL not configured in .env file**

## Solution: Use Supabase (Free, 5 minutes)

### Step 1: Create Supabase Account
1. Open: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub/Google/Email (FREE)

### Step 2: Create Project
1. Click **"New Project"**
2. Enter project details:
   - **Name**: `vendor-management`
   - **Database Password**: (Choose a strong password - save it!)
   - **Region**: (Select closest to you)
3. Click **"Create new project"**
4. Wait 2 minutes for setup to complete

### Step 3: Get Database URL
1. Go to **Settings** (gear icon in sidebar)
2. Click **Database**
3. Scroll to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres.xxxxx:password@aws-xxxx.pooler.supabase.com:5432/postgres
   ```

### Step 4: Update .env File
1. Open `d:\dig\DIG_7\.env` in your editor
2. Replace the DATABASE_URL line with your copied string:
   ```env
   DATABASE_URL="postgresql://postgres.xxxxx:YourPassword@aws-xxxx.pooler.supabase.com:5432/postgres"
   ```
3. **Important**: Replace `[YOUR-PASSWORD]` with your actual password
4. Save the file

### Step 5: Setup Database Schema
Run these commands:

```powershell
# Push database schema to Supabase
npx prisma db push

# Seed demo data
npm run seed
```

### Step 6: Restart Dev Server
```powershell
# Stop the server (Ctrl+C in terminal)
# Then restart
npm run dev
```

### Step 7: Open Application
Open browser: **http://localhost:3000**

Login with:
- Email: `admin@vendormanagement.com`
- Password: `admin123`

---

## Alternative: Install PostgreSQL Locally

If you prefer local database:

### Windows Installation
1. Download: https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set!
4. Use default port: 5432

### Create Database
```powershell
# Open PowerShell as Administrator
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE vendor_management;
\q
```

### Update .env
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/vendor_management"
```

Then run:
```powershell
npx prisma db push
npm run seed
npm run dev
```

---

## ✅ Verification

After setup, you should see:
- ✅ No DATABASE_URL errors
- ✅ Dashboard loads with 5 demo vendors
- ✅ Can click on vendors to see details

---

## 🆘 Still Having Issues?

### Error: "Can't reach database server"
- Check your internet connection (for Supabase)
- Verify DATABASE_URL is correct
- Ensure no typos in connection string

### Error: "Password authentication failed"
- Double-check your password in DATABASE_URL
- Make sure you replaced `[YOUR-PASSWORD]`

### Error: "Port 5432 is not open"
- For Supabase: Check project status (must be "Active")
- For local: Ensure PostgreSQL service is running

---

**Recommended**: Use Supabase - it's free, fast, and no local installation needed! ✨
