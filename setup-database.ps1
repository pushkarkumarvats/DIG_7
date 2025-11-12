# Database Setup Helper Script
# Run this AFTER you've updated DATABASE_URL in .env

Write-Host "`n===========================================================" -ForegroundColor Cyan
Write-Host "  Database Setup & Initialization" -ForegroundColor Cyan
Write-Host "===========================================================`n" -ForegroundColor Cyan

# Check if .env exists
if (!(Test-Path .env)) {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    Write-Host "  Run setup.ps1 first or copy .env.example to .env" -ForegroundColor Yellow
    exit 1
}

# Check if DATABASE_URL is set
$envContent = Get-Content .env -Raw
if ($envContent -match 'DATABASE_URL="postgresql://postgres:postgres@localhost') {
    Write-Host "⚠ WARNING: DATABASE_URL is still using default value!" -ForegroundColor Yellow
    Write-Host "  Please update DATABASE_URL in .env file first`n" -ForegroundColor Yellow
    
    Write-Host "Using Supabase? Follow these steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://supabase.com and create account" -ForegroundColor White
    Write-Host "2. Create new project" -ForegroundColor White
    Write-Host "3. Settings > Database > Connection String (URI)" -ForegroundColor White
    Write-Host "4. Copy and paste into .env file as DATABASE_URL`n" -ForegroundColor White
    
    $continue = Read-Host "Have you updated DATABASE_URL? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "`nSetup cancelled. Update .env and run this script again.`n" -ForegroundColor Yellow
        exit 0
    }
}

# Test database connection
Write-Host "Testing database connection..." -ForegroundColor Yellow
npx prisma db pull --force 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Cannot connect to database!" -ForegroundColor Red
    Write-Host "  Please check your DATABASE_URL in .env file`n" -ForegroundColor Yellow
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Wrong password" -ForegroundColor White
    Write-Host "  - Incorrect connection string" -ForegroundColor White
    Write-Host "  - Database server not running" -ForegroundColor White
    Write-Host "  - Network/firewall issues`n" -ForegroundColor White
    exit 1
}

Write-Host "✓ Database connection successful!`n" -ForegroundColor Green

# Push schema
Write-Host "Creating database schema..." -ForegroundColor Yellow
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to create schema" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Database schema created successfully!`n" -ForegroundColor Green

# Seed data
Write-Host "Seeding database with demo data..." -ForegroundColor Yellow
npm run seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to seed database" -ForegroundColor Red
    Write-Host "  You can try running 'npm run seed' manually later`n" -ForegroundColor Yellow
} else {
    Write-Host "✓ Demo data loaded successfully!`n" -ForegroundColor Green
}

# Summary
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Database Setup Complete! 🎉" -ForegroundColor Green
Write-Host "===========================================================`n" -ForegroundColor Cyan

Write-Host "Demo data loaded:" -ForegroundColor Yellow
Write-Host "  • 5 vendors (TechSolutions, CloudMasters, etc.)" -ForegroundColor White
Write-Host "  • External reviews" -ForegroundColor White
Write-Host "  • Internal records" -ForegroundColor White
Write-Host "  • Vendor scores & risks" -ForegroundColor White
Write-Host "  • 1 admin user`n" -ForegroundColor White

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "  3. Login with:" -ForegroundColor White
Write-Host "     Email: admin@vendormanagement.com" -ForegroundColor Cyan
Write-Host "     Password: admin123`n" -ForegroundColor Cyan

Write-Host "Explore the database:" -ForegroundColor Yellow
Write-Host "  Run: npx prisma studio" -ForegroundColor White
Write-Host "  Opens at: http://localhost:5555`n" -ForegroundColor White
