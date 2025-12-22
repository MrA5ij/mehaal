#!/usr/bin/env pwsh
# Development startup script without Docker

Write-Host "🚀 Starting Mehaal Project (Development Mode - SQLite)" -ForegroundColor Cyan
Write-Host "   Using SQLite database for easy development" -ForegroundColor Gray
Write-Host ""

# Check Python
Write-Host "🔍 Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✅ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check Node.js
Write-Host "🔍 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 20+" -ForegroundColor Red
    exit 1
}

# Set to use SQLite for development
Write-Host "📊 Using SQLite database (no PostgreSQL needed)" -ForegroundColor Cyan
$env:DATABASE_URL = "sqlite:///./mehaal_dev.db"

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location Mehaal.Backend
if (!(Test-Path "venv")) {
    python -m venv venv
}
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Initialize database
Write-Host "Initializing database..." -ForegroundColor Yellow
python init_database.py

Set-Location ..

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🚀 Starting services..." -ForegroundColor Cyan

# Start backend in background
Write-Host "Starting backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Mehaal.Backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow
npm run dev

Write-Host ""
Write-Host "✅ Services started!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your services:" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:5173" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs:    http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
