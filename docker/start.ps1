#!/usr/bin/env pwsh
# PowerShell startup script for Mehaal Project on Windows

Write-Host "🚀 Starting Mehaal Project..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "🔍 Checking Docker..." -ForegroundColor Yellow
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue

if (-not $dockerInstalled) {
    Write-Host "⚠️  Docker is not installed!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You have two options:" -ForegroundColor Cyan
    Write-Host "  1. Install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor White
    Write-Host "  2. Run in development mode without Docker: .\start-dev.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "For now, starting in DEVELOPMENT MODE..." -ForegroundColor Yellow
    Write-Host ""
    Start-Sleep -Seconds 2
    & .\start-dev.ps1
    exit
}

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker is installed but not running!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please start Docker Desktop first, or run: .\start-dev.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Starting in DEVELOPMENT MODE instead..." -ForegroundColor Yellow
    Write-Host ""
    Start-Sleep -Seconds 2
    & .\start-dev.ps1
    exit
}

# Check if docker-compose is available
Write-Host "🔍 Checking Docker Compose..." -ForegroundColor Yellow
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Building and starting containers..." -ForegroundColor Cyan
Write-Host "This may take a few minutes on first run..." -ForegroundColor Gray
Write-Host ""

# Navigate to docker directory
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)\..\docker

# Build and start containers
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Mehaal Project is now running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access your services:" -ForegroundColor Cyan
    Write-Host "   Frontend:    http://localhost:5173" -ForegroundColor White
    Write-Host "   Backend API: http://localhost:8000" -ForegroundColor White
    Write-Host "   API Docs:    http://localhost:8000/docs" -ForegroundColor White
    Write-Host "   pgAdmin:     http://localhost:8080 (admin@mehaal.com/admin)" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Database Credentials:" -ForegroundColor Cyan
    Write-Host "   Username: mehaal_user" -ForegroundColor White
    Write-Host "   Password: mehaal_password" -ForegroundColor White
    Write-Host "   Database: mehaal_db" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 View logs: docker-compose logs -f" -ForegroundColor Gray
    Write-Host "🛑 Stop:      docker-compose down" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to start containers. Check the logs above." -ForegroundColor Red
    Write-Host ""
    exit 1
}
