# Complete Setup Script - Intelligent Vendor Management System
# This script sets up PostgreSQL with Docker and initializes the database

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Intelligent Vendor Management System - Full Setup    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Function to check if command exists
function Test-CommandExists {
    param($command)
    $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "Checking prerequisites...`n" -ForegroundColor Yellow

# Check Node.js
if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    Write-Host "  Install from: https://nodejs.org/`n" -ForegroundColor Yellow
    exit 1
}

# Check Docker
$dockerInstalled = Test-CommandExists docker
if ($dockerInstalled) {
    Write-Host "✓ Docker found" -ForegroundColor Green
    
    # Check if Docker is running
    try {
        docker ps 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker is running" -ForegroundColor Green
        } else {
            Write-Host "⚠ Docker is installed but not running" -ForegroundColor Yellow
            Write-Host "  Please start Docker Desktop and run this script again`n" -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "⚠ Docker is installed but not running" -ForegroundColor Yellow
        Write-Host "  Please start Docker Desktop and run this script again`n" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "⚠ Docker not found" -ForegroundColor Yellow
    Write-Host "`nDocker provides the easiest PostgreSQL setup." -ForegroundColor White
    Write-Host "Would you like to:" -ForegroundColor White
    Write-Host "  1. Install Docker (recommended)" -ForegroundColor White
    Write-Host "  2. Use Supabase cloud database (no installation)" -ForegroundColor White
    Write-Host "  3. Install PostgreSQL natively`n" -ForegroundColor White
    
    $choice = Read-Host "Enter choice (1-3)"
    
    switch ($choice) {
        "1" {
            Write-Host "`nOpening Docker Desktop download page..." -ForegroundColor Yellow
            Start-Process "https://www.docker.com/products/docker-desktop/"
            Write-Host "After installing Docker, run this script again.`n" -ForegroundColor Yellow
            exit 0
        }
        "2" {
            Write-Host "`nOpening Supabase..." -ForegroundColor Yellow
            Start-Process "https://supabase.com"
            Write-Host "`nFollow these steps:" -ForegroundColor Yellow
            Write-Host "1. Create free account" -ForegroundColor White
            Write-Host "2. Create new project" -ForegroundColor White
            Write-Host "3. Settings > Database > Connection String (URI)" -ForegroundColor White
            Write-Host "4. Copy connection string" -ForegroundColor White
            Write-Host "5. Edit .env file and update DATABASE_URL" -ForegroundColor White
            Write-Host "6. Run: .\setup-database.ps1`n" -ForegroundColor White
            Write-Host "Full guide: POSTGRES_SETUP.md`n" -ForegroundColor Cyan
            exit 0
        }
        "3" {
            Write-Host "`nOpening PostgreSQL download page..." -ForegroundColor Yellow
            Start-Process "https://www.postgresql.org/download/windows/"
            Write-Host "`nAfter installing PostgreSQL:" -ForegroundColor Yellow
            Write-Host "1. Create database: vendor_management" -ForegroundColor White
            Write-Host "2. Update .env if you used different password" -ForegroundColor White
            Write-Host "3. Run: .\setup-database.ps1`n" -ForegroundColor White
            Write-Host "Full guide: POSTGRES_SETUP.md`n" -ForegroundColor Cyan
            exit 0
        }
        default {
            Write-Host "`nInvalid choice. Exiting.`n" -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host ""

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies...`n" -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install dependencies`n" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed`n" -ForegroundColor Green
}

# Ensure .env file exists
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created`n" -ForegroundColor Green
}

# Start PostgreSQL with Docker
Write-Host "Setting up PostgreSQL database...`n" -ForegroundColor Yellow

# Check if container already exists
$existingContainer = docker ps -a --filter "name=vendor_management_db" --format "{{.Names}}" 2>$null

if ($existingContainer -eq "vendor_management_db") {
    Write-Host "PostgreSQL container already exists" -ForegroundColor Yellow
    
    # Check if it's running
    $runningContainer = docker ps --filter "name=vendor_management_db" --format "{{.Names}}" 2>$null
    
    if ($runningContainer -eq "vendor_management_db") {
        Write-Host "✓ PostgreSQL is already running`n" -ForegroundColor Green
    } else {
        Write-Host "Starting existing PostgreSQL container..." -ForegroundColor Yellow
        docker start vendor_management_db
        Start-Sleep -Seconds 3
        Write-Host "✓ PostgreSQL started`n" -ForegroundColor Green
    }
} else {
    Write-Host "Creating PostgreSQL container..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to start PostgreSQL`n" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ PostgreSQL container created" -ForegroundColor Green
    Write-Host "  Waiting for database to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    Write-Host "✓ PostgreSQL is ready`n" -ForegroundColor Green
}

# Generate Prisma Client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client`n" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated`n" -ForegroundColor Green

# Push database schema
Write-Host "Creating database schema..." -ForegroundColor Yellow
npx prisma db push --skip-generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to create database schema" -ForegroundColor Red
    Write-Host "  Check if DATABASE_URL in .env is correct`n" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Database schema created`n" -ForegroundColor Green

# Seed database
Write-Host "Loading demo data..." -ForegroundColor Yellow
npm run seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Warning: Failed to seed database" -ForegroundColor Yellow
    Write-Host "  You can try running 'npm run seed' manually later`n" -ForegroundColor Yellow
} else {
    Write-Host "✓ Demo data loaded successfully`n" -ForegroundColor Green
}

# Summary
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              SETUP COMPLETE! 🎉                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Your Vendor Management System is ready!`n" -ForegroundColor Cyan

Write-Host "Demo Data Loaded:" -ForegroundColor Yellow
Write-Host "  • 5 Vendors (TechSolutions, CloudMasters, DataSecure, etc.)" -ForegroundColor White
Write-Host "  • External Reviews from Google, Clutch, G2" -ForegroundColor White
Write-Host "  • Internal Project Records" -ForegroundColor White
Write-Host "  • ML-Generated Scores & Risk Indicators" -ForegroundColor White
Write-Host "  • 1 Admin User`n" -ForegroundColor White

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Start the application:" -ForegroundColor White
Write-Host "     npm run dev`n" -ForegroundColor Cyan
Write-Host "  2. Open your browser:" -ForegroundColor White
Write-Host "     http://localhost:3000`n" -ForegroundColor Cyan
Write-Host "  3. Login with:" -ForegroundColor White
Write-Host "     Email:    admin@vendormanagement.com" -ForegroundColor Cyan
Write-Host "     Password: admin123`n" -ForegroundColor Cyan

Write-Host "Useful Commands:" -ForegroundColor Yellow
Write-Host "  npm run dev           - Start development server" -ForegroundColor White
Write-Host "  npx prisma studio     - Browse database (localhost:5555)" -ForegroundColor White
Write-Host "  docker-compose down   - Stop PostgreSQL" -ForegroundColor White
Write-Host "  docker-compose up -d  - Start PostgreSQL`n" -ForegroundColor White

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  README.md             - Main documentation" -ForegroundColor White
Write-Host "  POSTGRES_SETUP.md     - Database setup guide" -ForegroundColor White
Write-Host "  API_DOCUMENTATION.md  - API reference" -ForegroundColor White
Write-Host "  DEPLOYMENT.md         - Deployment guide`n" -ForegroundColor White

Write-Host "Ready to start? Run: " -NoNewline -ForegroundColor Yellow
Write-Host "npm run dev`n" -ForegroundColor Cyan
