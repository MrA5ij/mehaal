# 🚀 Mehaal Project - Quick Reference

## Start Commands

```powershell
# Docker mode (recommended)
.\start.ps1                # Start all services with Docker

# Development mode (without Docker)
.\start-dev.ps1           # Start with local Python/Node

# Linux/Mac
chmod +x start.sh && ./start.sh
```

## Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | - |
| Backend API | http://localhost:8000 | - |
| API Docs | http://localhost:8000/docs | - |
| phpMyAdmin | http://localhost:8080 | user: mehaal_user<br>pass: mehaal_password |

## Docker Commands

```powershell
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f            # View all logs
docker-compose logs -f backend    # View backend logs
docker-compose restart backend    # Restart backend
docker exec -it mehaal-db bash    # Access database container
```

## Database Access

```powershell
# Connect to PostgreSQL
docker exec -it mehaal-db psql -U mehaal_user -d mehaal_db

# Common SQL commands
\dt              # List tables
\d table_name    # Describe table
\l               # List databases
\q               # Quit
```

## Backend Commands

```powershell
cd Mehaal.Backend
.\venv\Scripts\Activate.ps1      # Activate virtual environment
python init_database.py          # Initialize database
python seed_database.py          # Seed data
uvicorn app.main:app --reload    # Run backend
```

## Frontend Commands

```powershell
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run linter
```

## Troubleshooting

```powershell
# Kill process on port
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Reset Docker
docker-compose down -v
docker system prune -a

# Clear npm cache
Remove-Item -Recurse -Force node_modules
npm install
```

## Configuration Files

- `Mehaal.Backend/.env` - Backend environment
- `.env` - Frontend environment
- `docker-compose.yml` - Docker services
- `Mehaal.Backend/phpmyadmin/config.inc.php` - phpMyAdmin config

## Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup guide
- [CONFIGURATION_COMPLETE.md](CONFIGURATION_COMPLETE.md) - What was configured
- [README.md](README.md) - Project overview

---

**Quick Start:** Run `.\start.ps1` and access http://localhost:5173 🚀
