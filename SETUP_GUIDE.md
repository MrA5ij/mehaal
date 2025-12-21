# 🚀 Mehaal Project - Complete Setup Guide

## Project Overview

**Mehaal.Tech AI** is a complete full-stack SaaS platform with:
- ⚛️ React 18 + Vite Frontend
- 🐍 FastAPI Backend with PostgreSQL
- 🎨 Advanced 3D animations with React Three Fiber
- 📊 phpMyAdmin for database management
- 🐳 Docker containerization
- 🔒 Complete authentication system

---

## 🎯 Quick Start

### Option 1: Docker Compose (Recommended)

**Prerequisites:**
- Docker Desktop installed and running
- 4GB+ available RAM

**Steps:**

```powershell
# Windows
.\start.ps1

# Linux/Mac
chmod +x start.sh
./start.sh
```

This will automatically:
- Build all containers
- Setup PostgreSQL database
- Start phpMyAdmin
- Launch backend API
- Start frontend dev server

**Access URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- phpMyAdmin: http://localhost:8080

**Database Credentials:**
- Username: `mehaal_user`
- Password: `mehaal_password`
- Database: `mehaal_db`

---

### Option 2: Manual Development Setup

**Prerequisites:**
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+

#### Backend Setup

```powershell
# Navigate to backend
cd Mehaal.Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (already created)
# Edit .env and update DATABASE_URL if needed

# Initialize database
python init_database.py

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```powershell
# Navigate to project root
cd ..

# Install dependencies
npm install

# Run frontend
npm run dev
```

#### Database Setup (Manual)

```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE mehaal_db;
CREATE USER mehaal_user WITH PASSWORD 'mehaal_password';
GRANT ALL PRIVILEGES ON DATABASE mehaal_db TO mehaal_user;
```

---

## 📁 Project Structure

```
mehaal/
├── Mehaal.Backend/          # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Application entry point
│   │   ├── database/       # Database configuration
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   └── schemas/        # Pydantic schemas
│   ├── phpmyadmin/         # phpMyAdmin configuration
│   │   └── config.inc.php  # phpMyAdmin settings
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   └── Dockerfile         # Backend container
│
├── src/                    # Frontend source
│   ├── admin/             # Admin panel components
│   ├── components/        # React components
│   ├── lib/              # Utilities and API clients
│   └── services/         # Service integrations
│
├── hero/                  # Hero section module
├── assets/               # Static assets
├── docker-compose.yml    # Docker services configuration
├── package.json         # Frontend dependencies
├── vite.config.js       # Vite configuration
└── .env                # Frontend environment variables
```

---

## 🔧 Configuration Files

### Backend Environment (.env.<env> in Mehaal.Backend/)

```env
APP_ENV=dev
DATABASE_URL=sqlite:///./mehaal_dev.db
FOUNDER_KEY=dev-founder-key-1c9e6c46b20e4090b132e1776937f124
JWT_SECRET=dev-jwt-secret-8f2df0e7bbf14c0c93c3788c12f5030b
SSO_METADATA_URL=https://idp.dev.mehaal.local/metadata
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8000
```

Create matching `.env.staging` and `.env.prod` files with real secrets; each file must correspond to an activated `venv.<env>` virtual environment.

### Frontend Environment (.env in root)

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Mehaal.Tech AI
VITE_APP_VERSION=3.0.0
VITE_ENVIRONMENT=development
VITE_FOUNDER_KEY=dev-founder-key-1c9e6c46b20e4090b132e1776937f124
VITE_ENABLE_3D_ANIMATIONS=true
VITE_ENABLE_ADMIN_PANEL=true
```

---

## 🐳 Docker Commands

```powershell
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Restart a specific service
docker-compose restart backend
```

---

## 📊 Database Management

### Using phpMyAdmin

1. Open http://localhost:8080
2. Login with:
   - Server: `postgres`
   - Username: `mehaal_user`
   - Password: `mehaal_password`

### Using Command Line

```powershell
# Connect to database container
docker exec -it mehaal-db psql -U mehaal_user -d mehaal_db

# Common SQL commands
\dt              # List tables
\d table_name    # Describe table
\q              # Quit
```

---

## 🛠️ Development Workflow

### Backend Development

```powershell
cd Mehaal.Backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Make changes to code

# API will auto-reload (uvicorn --reload)

# Run database migrations
python run_migrations.py

# Seed database with test data
python seed_database.py
```

### Frontend Development

```powershell
# Frontend auto-reloads with Vite HMR

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

## 🧪 Testing

### Test Backend API

```powershell
# Visit API documentation
# http://localhost:8000/docs

# Test endpoint
curl http://localhost:8000/api/home-page
```

### Test Frontend

```powershell
# Open in browser
# http://localhost:5173
```

---

## 🚨 Troubleshooting

### Port Already in Use

```powershell
# Check what's using the port
netstat -ano | findstr :8000
netstat -ano | findstr :5173
netstat -ano | findstr :5432

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Docker Issues

```powershell
# Reset Docker
docker-compose down -v
docker system prune -a

# Restart Docker Desktop
```

### Database Connection Issues

1. Check if PostgreSQL is running
2. Verify credentials in `.env` files
3. Check docker-compose logs: `docker-compose logs postgres`

### Frontend Not Loading

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Clear Vite cache
Remove-Item -Recurse -Force .vite
```

---

## 📚 API Documentation

Once backend is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🔒 Security Notes

**⚠️ IMPORTANT: Before deploying to production:**

1. Rotate `JWT_SECRET` in backend `.env.prod`
2. Rotate `FOUNDER_KEY` and update frontend `VITE_FOUNDER_KEY`
3. Change `blowfish_secret` in phpMyAdmin config
4. Update database passwords
5. Set `DEBUG=False`
6. Configure proper CORS origins
7. Ensure `SSO_METADATA_URL` points to the live IdP metadata
8. Use environment-specific `.env` files

---

## 📦 Production Deployment

See [PRODUCTION_COMPLETE_GUIDE.md](PRODUCTION_COMPLETE_GUIDE.md) for detailed production deployment instructions.

---

## 🎯 Next Steps

1. ✅ Project is configured and ready to run
2. 🚀 Run `.\start.ps1` to start all services
3. 🌐 Access frontend at http://localhost:5173
4. 📊 Manage database at http://localhost:8080
5. 📖 Explore API at http://localhost:8000/docs
6. 💻 Start developing!

---

## 📞 Support

For issues or questions, check the documentation files:
- [README.md](README.md)
- [DEVELOPER_HANDBOOK.md](DEVELOPER_HANDBOOK.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)

---

**Status:** ✅ Fully Configured and Ready to Use  
**Version:** 3.0.0  
**Last Updated:** December 2025
