# Complete PostgreSQL Setup Guide for Windows

## Quick Setup (Choose One Method)

### Method 1: Docker PostgreSQL (Recommended - Easiest)

#### Prerequisites
- Docker Desktop for Windows
- Download: https://www.docker.com/products/docker-desktop/

#### Steps

1. **Install Docker Desktop**
   - Download and install from link above
   - Start Docker Desktop
   - Wait until "Docker is running" appears

2. **Start PostgreSQL Container**
   ```powershell
   # Navigate to project folder
   cd D:\dig\DIG_7
   
   # Start PostgreSQL
   docker-compose up -d
   
   # Verify it's running
   docker ps
   ```
   
   You should see: `vendor_management_db` container running on port 5432

3. **Setup Database Schema**
   ```powershell
   # Push schema to database
   npx prisma db push
   
   # Seed demo data
   npm run seed
   ```

4. **Start Application**
   ```powershell
   npm run dev
   ```
   
   Open: http://localhost:3001 (or 3000)

5. **Login**
   - Email: `admin@vendormanagement.com`
   - Password: `admin123`

#### Docker Management Commands

```powershell
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and remove all data
docker-compose down -v

# View logs
docker-compose logs -f

# Restart database
docker-compose restart

# Check status
docker ps
```

---

### Method 2: Native PostgreSQL Installation

#### Step 1: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download PostgreSQL 15 or 16 (recommended)

#### Step 2: Install PostgreSQL

1. Run the installer
2. Choose installation directory (default is fine)
3. Select components:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (database browser)
   - ✅ Command Line Tools
4. Set password for postgres user: **postgres** (remember this!)
5. Port: **5432** (default)
6. Locale: Default
7. Complete installation

#### Step 3: Verify Installation

```powershell
# Open PowerShell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# Should show Status: Running
```

#### Step 4: Create Database

**Option A: Using pgAdmin**
1. Open pgAdmin 4 (Start menu)
2. Connect to PostgreSQL server (password: postgres)
3. Right-click "Databases" → "Create" → "Database"
4. Name: `vendor_management`
5. Click "Save"

**Option B: Using Command Line**
```powershell
# Open PowerShell as Administrator
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# In PostgreSQL shell:
CREATE DATABASE vendor_management;
\l
# (should show vendor_management in list)
\q
```

#### Step 5: Configure Environment

The `.env` file is already configured with correct settings:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vendor_management"
```

If you used a different password, update it in `.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vendor_management"
```

#### Step 6: Setup Database Schema

```powershell
# Navigate to project
cd D:\dig\DIG_7

# Push schema to database
npx prisma db push

# Seed demo data
npm run seed
```

#### Step 7: Start Application

```powershell
npm run dev
```

Open: http://localhost:3001

---

### Method 3: Supabase (Cloud - No Installation)

#### Step 1: Create Account
1. Go to: https://supabase.com
2. Sign up (free tier available)
3. Verify your email

#### Step 2: Create Project
1. Click "New Project"
2. Fill in details:
   - **Name**: vendor-management
   - **Database Password**: (choose strong password - save it!)
   - **Region**: Select closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

#### Step 3: Get Connection String
1. Go to **Project Settings** (gear icon)
2. Click **Database** tab
3. Scroll to "Connection string"
4. Select **"URI"** mode
5. Copy the connection string

Example:
```
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

#### Step 4: Update Environment

1. Open `.env` file
2. Replace DATABASE_URL with your Supabase connection string
3. **Important**: Replace `[YOUR-PASSWORD]` with your actual password

Example:
```env
DATABASE_URL="postgresql://postgres.abcdefgh:MyStrongPass123@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

#### Step 5: Setup Database

```powershell
npx prisma db push
npm run seed
npm run dev
```

---

## Troubleshooting

### Issue: "Can't reach database server at localhost:5432"

**Using Docker:**
```powershell
# Check if container is running
docker ps

# If not running, start it
docker-compose up -d

# Check logs for errors
docker-compose logs
```

**Using Native PostgreSQL:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# If stopped, start it
Start-Service postgresql-x64-15  # (adjust version number)

# Or use Services app (Win+R → services.msc)
```

### Issue: "Password authentication failed"

- Verify password in DATABASE_URL matches your PostgreSQL password
- Default in this project: `postgres`
- If you changed it during installation, update `.env`

### Issue: "Database does not exist"

```powershell
# Using Docker - recreate database
docker-compose down
docker-compose up -d
npx prisma db push

# Using Native PostgreSQL
# Connect to postgres
psql -U postgres
CREATE DATABASE vendor_management;
\q

# Then push schema
npx prisma db push
```

### Issue: Port 5432 already in use

```powershell
# Find what's using port 5432
netstat -ano | findstr :5432

# Kill the process (use PID from above)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
# Change: "5433:5432" instead of "5432:5432"
# Then update DATABASE_URL to use port 5433
```

### Issue: "Prisma Client not generated"

```powershell
npx prisma generate
```

### Issue: Docker Desktop not starting

- Make sure Hyper-V is enabled (Windows Pro/Enterprise)
- Or use WSL 2 backend (Windows Home)
- Restart computer after Docker installation

---

## Verification Steps

### 1. Test Database Connection

```powershell
# Quick test
npx prisma db pull
```

If successful, you'll see: "Introspected X models and wrote to prisma/schema.prisma"

### 2. Check Database Tables

```powershell
# Open Prisma Studio
npx prisma studio
```

Opens at http://localhost:5555

You should see 8 tables:
- users
- vendors
- external_reviews
- internal_records
- vendor_features
- vendor_scores
- vendor_risks
- audit_logs

### 3. Verify Demo Data

After running `npm run seed`, check in Prisma Studio:
- **users**: 1 admin user
- **vendors**: 5 demo vendors
- **external_reviews**: Multiple reviews
- **vendor_scores**: Scores for each vendor

### 4. Test Application

```powershell
npm run dev
```

1. Open http://localhost:3001
2. Login with: admin@vendormanagement.com / admin123
3. Should see dashboard with 5 vendors
4. Click on any vendor to see details
5. No database errors in console

---

## Database Management

### Backup Database

**Docker:**
```powershell
docker exec vendor_management_db pg_dump -U postgres vendor_management > backup.sql
```

**Native PostgreSQL:**
```powershell
& "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -U postgres vendor_management > backup.sql
```

### Restore Database

**Docker:**
```powershell
docker exec -i vendor_management_db psql -U postgres vendor_management < backup.sql
```

**Native PostgreSQL:**
```powershell
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres vendor_management < backup.sql
```

### Reset Database

```powershell
# Drop and recreate schema
npx prisma migrate reset

# Or manually
npx prisma db push --force-reset
npm run seed
```

### View Database with pgAdmin

1. Open pgAdmin 4
2. Add server:
   - Name: Vendor Management
   - Host: localhost
   - Port: 5432
   - Database: vendor_management
   - Username: postgres
   - Password: postgres
3. Browse tables, run queries, view data

---

## Environment Variables Reference

```env
# Local PostgreSQL (Docker or Native)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vendor_management"

# Supabase
DATABASE_URL="postgresql://postgres.xxxxx:[password]@aws-xxxx.pooler.supabase.com:5432/postgres"

# Custom PostgreSQL server
DATABASE_URL="postgresql://username:password@hostname:port/database_name"
```

---

## Quick Reference Commands

```powershell
# Start everything
docker-compose up -d          # Start PostgreSQL
npm run dev                    # Start app

# Database operations
npx prisma studio              # Browse database
npx prisma db push             # Update schema
npm run seed                   # Load demo data

# Stop everything
docker-compose down            # Stop PostgreSQL
# Ctrl+C in terminal           # Stop app

# Reset everything
docker-compose down -v         # Remove all data
npx prisma db push             # Recreate schema
npm run seed                   # Reload demo data
```

---

## Recommended Setup for Development

**Best for Windows:**
1. ✅ **Docker** - Cleanest, easiest to manage
2. ⚡ **Native PostgreSQL** - Faster, more control
3. ☁️ **Supabase** - No local setup, good for testing

**My Recommendation:** 
Start with Docker (5 minutes setup), switch to Native PostgreSQL later if needed.

---

## Next Steps

1. ✅ Choose a setup method above
2. ✅ Install and configure PostgreSQL
3. ✅ Run `npx prisma db push`
4. ✅ Run `npm run seed`
5. ✅ Start app with `npm run dev`
6. ✅ Open http://localhost:3001
7. ✅ Login and explore!

---

## Support

If you encounter issues:
1. Check "Troubleshooting" section above
2. Review error messages carefully
3. Verify DATABASE_URL in .env
4. Check PostgreSQL service status
5. Try Docker method if native installation fails
