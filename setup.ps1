# Intelligent Vendor Management System - Setup Script
# Run with: .\setup.ps1

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Intelligent Vendor Management System - Setup" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Setup environment file
Write-Host ""
Write-Host "Setting up environment..." -ForegroundColor Yellow
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✓ Created .env file from template" -ForegroundColor Green
    Write-Host "⚠ Please update .env with your database credentials" -ForegroundColor Yellow
} else {
    Write-Host "⚠ .env file already exists, skipping..." -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host ""
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green

# Ask about database setup
Write-Host ""
$setupDb = Read-Host "Do you want to setup the database now? (y/n)"

if ($setupDb -eq "y" -or $setupDb -eq "Y") {
    Write-Host ""
    Write-Host "Setting up database..." -ForegroundColor Yellow
    
    # Push schema
    Write-Host "Pushing database schema..." -ForegroundColor Yellow
    npx prisma db push
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to push database schema" -ForegroundColor Red
        Write-Host "  Please check your DATABASE_URL in .env file" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Database schema created" -ForegroundColor Green
    
    # Seed database
    Write-Host "Seeding database with demo data..." -ForegroundColor Yellow
    npm run seed
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to seed database" -ForegroundColor Red
    } else {
        Write-Host "✓ Database seeded with demo data" -ForegroundColor Green
    }
} else {
    Write-Host "⚠ Skipping database setup" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update .env file with your database credentials" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Demo credentials:" -ForegroundColor Yellow
Write-Host "  Email: admin@vendormanagement.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "For deployment instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
