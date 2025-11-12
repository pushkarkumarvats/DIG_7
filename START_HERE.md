# 🚀 START HERE - Complete Setup Guide

## Current Status

✅ **Application**: Running on http://localhost:3001  
❌ **Database**: Not connected - PostgreSQL needed

## What You Need to Do

Your Intelligent Vendor Management System is **almost ready**! You just need to set up the PostgreSQL database.

---

## 🎯 Quick Fix (Choose ONE Method)

### Option 1: Docker PostgreSQL (⭐ RECOMMENDED - 2 minutes)

**Best if you have or can install Docker Desktop**

#### Step 1: Check if Docker is installed
```powershell
docker --version
```

#### Step 2a: If Docker is installed
```powershell
# Start PostgreSQL
docker-compose up -d

# Setup database
npx prisma db push

# Load demo data
npm run seed

# Restart your app (Ctrl+C in dev server, then):
npm run dev
```

✅ Done! Open http://localhost:3001

#### Step 2b: If Docker is NOT installed
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Run the commands from Step 2a above

---

### Option 2: Supabase Cloud (No installation, 5 minutes)

**Best if you don't want to install anything locally**

#### Steps:
1. **Create account**: Go to https://supabase.com and sign up (FREE)

2. **Create project**:
   - Click "New Project"
   - Name: `vendor-management`
   - Set a database password (save it!)
   - Choose region closest to you
   - Wait 2 minutes for setup

3. **Get connection string**:
   - Click Settings (gear icon) → Database
   - Scroll to "Connection string"
   - Select **"URI"** tab  
   - Copy the string (looks like):
     ```
     postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-xxx.pooler.supabase.com:5432/postgres
     ```

4. **Update .env file**:
   - Open `D:\dig\DIG_7\.env` in notepad
   - Find the line starting with `DATABASE_URL=`
   - Replace it with your Supabase connection string
   - **Important**: Replace `[YOUR-PASSWORD]` with your actual password
   - Save the file

5. **Setup database**:
   ```powershell
   npx prisma db push
   npm run seed
   ```

6. **Restart app** (Ctrl+C in terminal, then):
   ```powershell
   npm run dev
   ```

✅ Done! Open http://localhost:3001

---

### Option 3: Native PostgreSQL (15 minutes)

**Best if you want local installation**

#### Steps:
1. **Download PostgreSQL**:
   - Go to: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or 16
   - Run installer

2. **During installation**:
   - Set password: `postgres` (or remember yours!)
   - Port: `5432` (default)
   - Install all components

3. **Create database**:
   - Open pgAdmin 4 (installed with PostgreSQL)
   - Connect to server (password: postgres)
   - Right-click "Databases" → "Create" → "Database"
   - Name: `vendor_management`
   - Save

4. **Update .env** (only if you used different password):
   - Open `D:\dig\DIG_7\.env`
   - Update: `DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vendor_management"`

5. **Setup database**:
   ```powershell
   npx prisma db push
   npm run seed
   ```

6. **Restart app**:
   ```powershell
   npm run dev
   ```

✅ Done! Open http://localhost:3001

---

## ✅ Verification

After setup, you should see:

1. **No errors** in the terminal
2. **Dashboard loads** with 5 demo vendors
3. **Login works** with:
   - Email: `admin@vendormanagement.com`
   - Password: `admin123`

---

## 🆘 Troubleshooting

### "Can't reach database server at localhost:5432"

**Using Docker?**
```powershell
# Check if container is running
docker ps

# If not running, start it
docker-compose up -d
```

**Using Native PostgreSQL?**
```powershell
# Check if service is running
Get-Service postgresql*

# If not running
Start-Service postgresql-x64-15
```

### "Database does not exist"

```powershell
# Create it
npx prisma db push
```

### "Password authentication failed"

- Check `.env` file
- Make sure DATABASE_URL has correct password
- Default: `postgres`

### Still having issues?

Check the detailed guide: **POSTGRES_SETUP.md**

---

## 📚 What Happens After Setup?

Once database is connected, you'll have:

✅ **5 Demo Vendors**: TechSolutions, CloudMasters, DataSecure, AgileDevs, MarketBoost  
✅ **External Reviews**: From Google, Clutch, G2  
✅ **ML Scores**: Pre-calculated for all vendors  
✅ **Risk Indicators**: Automated risk detection  
✅ **Admin Account**: Full access to system

---

## 🎯 Next Steps After Setup

1. **Explore the Dashboard**
   - View all vendors
   - Click on vendor for details
   - Check scores and risks

2. **Try AI Recommendations**
   - Go to "Recommend" page
   - Enter: "I need AWS certified cloud provider"
   - See ranked recommendations

3. **Upload Data**
   - Go to "Upload Data" page
   - Upload CSV with vendor performance
   - See data imported

4. **Browse Database**
   ```powershell
   npx prisma studio
   ```
   Opens at http://localhost:5555

---

## 📖 Documentation

- **README.md** - Main documentation
- **POSTGRES_SETUP.md** - Detailed database setup
- **API_DOCUMENTATION.md** - API reference
- **DEPLOYMENT.md** - Deploy to production
- **PROJECT_SUMMARY.md** - Technical overview

---

## 💡 My Recommendation

**For fastest setup**: Use **Docker** (Option 1)  
**For no installation**: Use **Supabase** (Option 2)  
**For full control**: Use **Native PostgreSQL** (Option 3)

---

## 🎉 Ready?

Pick an option above and follow the steps. You'll be up and running in 2-5 minutes!

**Questions?** Check POSTGRES_SETUP.md for detailed troubleshooting.
