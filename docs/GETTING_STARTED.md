# Getting Started — Complete Setup Guide

Welcome to the **Mehaal Platform**. This guide walks you through setting up the complete development environment in 15 minutes.

---

## Prerequisites

Before you begin, ensure you have installed:

### Required
- **Node.js** 16+ ([Download](https://nodejs.org/))
  - Check: `node --version`
- **Python** 3.9+ ([Download](https://python.org/))
  - Check: `python --version`
- **Git** ([Download](https://git-scm.com/))
  - Check: `git --version`

### Optional but Recommended
- **Docker & Docker Compose** — For containerized setup
  - Check: `docker --version` and `docker-compose --version`
- **PostgreSQL** 13+ — If not using Docker
  - Check: `psql --version`
- **VS Code** — Recommended IDE
  - Extensions: ESLint, Prettier, Python, Thunder Client

---

## Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/mehaal.git
cd mehaal

# Verify structure
ls -la
```

You should see: `src/`, `backend/`, `docker-compose.yml`, `package.json`, etc.

---

## Step 2: Frontend Setup (5 minutes)

### 2a. Install Dependencies

```bash
# Install Node.js packages
npm install
```

**Expected Output:**
```
added 150+ packages, audited 151 packages in 3s
```

### 2b. Environment Configuration

Create `.env.development`:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
NODE_ENV=development
```

### 2c. Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:5173/
```

**✅ Frontend is running!** Open http://localhost:5173/ in your browser.

---

## Step 3: Backend Setup (7 minutes)

### 3a. Create Python Virtual Environment

**Windows:**
```bash
cd backend
python -m venv venv-development
venv-development\Scripts\activate
```

**macOS/Linux:**
```bash
cd backend
python -m venv venv-development
source venv-development/bin/activate
```

### 3b. Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Expected Output:**
```
Successfully installed fastapi-0.100.0 sqlalchemy-2.0.0 ...
```

### 3c. Configure Database

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mehaal
ENVIRONMENT=development
SECRET_KEY=your-secret-key-here-change-in-production
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

### 3d. Initialize Database

```bash
# Create tables
python init_db.py

# Seed default data
python seed_db.py
```

**Expected Output:**
```
Database initialized successfully
Platform settings seeded
```

### 3e. Start FastAPI Server

```bash
python app/main.py
```

**Expected Output:**
```
Uvicorn running on http://127.0.0.1:8000
Press CTRL+C to quit
```

**✅ Backend is running!**

- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Step 4: Verify Integration (2 minutes)

### 4a. Test API Endpoints

Open a new terminal:

```bash
# Test platform settings endpoint
curl http://localhost:8000/api/platform-settings

# You should get JSON response:
{
  "primary_color": "#6666FF",
  "background_color": "#000000",
  "heading_font": "Cabinet Grotesk",
  ...
}
```

### 4b. Test Frontend Integration

Go to http://localhost:5173/ in your browser:

- ✅ You should see the landing page
- ✅ Hero section should be visible
- ✅ Colors should match platform settings
- ✅ Animations should be smooth

### 4c. Check Admin Dashboard

Visit http://localhost:5173/admin

- ✅ Admin panel should load
- ✅ Settings editor should be accessible
- ✅ CMS editor should be ready

---

## Step 5: Docker Compose Setup (Alternative)

If you prefer to run everything in containers:

### 5a. Build and Start Services

```bash
# Start all services (frontend, backend, database)
docker-compose up -d

# Verify services are running
docker-compose ps
```

**Expected Output:**
```
NAME                COMMAND             STATUS
mehaal-frontend     npm run dev         Up
mehaal-backend      python app/main.py  Up
mehaal-postgres     postgres            Up
```

### 5b. Access Services

```bash
# Frontend
http://localhost:3000

# Backend API
http://localhost:8000

# Swagger Docs
http://localhost:8000/docs

# Database
localhost:5432 (if you need to connect)
```

### 5c. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Verification Checklist

Before proceeding, verify everything works:

- [ ] Frontend loads at http://localhost:5173/
- [ ] Backend API responds at http://localhost:8000/
- [ ] Swagger docs accessible at http://localhost:8000/docs
- [ ] Hero section displays with correct colors
- [ ] Admin dashboard loads at /admin
- [ ] Database initialized with seed data
- [ ] No console errors in browser
- [ ] No Python errors in terminal

---

## Common Issues & Solutions

### Issue: Port Already in Use

**Frontend (5173):**
```bash
npm run dev -- --port 3000
```

**Backend (8000):**
```bash
# Edit app/main.py and change port
uvicorn app.main:app --port 8001
```

### Issue: Database Connection Failed

```bash
# Check PostgreSQL is running
psql --version

# Verify DATABASE_URL in .env
cat backend/.env

# Re-run initialization
python init_db.py
```

### Issue: Module Not Found Error

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: CORS Errors

```bash
# In backend/.env, ensure frontend URL is in CORS_ORIGINS
CORS_ORIGINS=["http://localhost:5173"]
```

### Issue: Python Virtual Environment Not Activated

```bash
# Windows
cd backend && venv\Scripts\activate

# macOS/Linux
cd backend && source venv/bin/activate
```

---

## File Structure After Setup

```
mehaal/
├── frontend/                  # ✅ npm installed
├── backend/
│   ├── venv/                  # ✅ Python virtual env
│   └── .env                   # ✅ Environment configured
├── docker-compose.yml         # ✅ Ready to use
├── .env.development           # ✅ Frontend env configured
├── node_modules/              # ✅ npm packages installed
└── uploads/                   # ✅ Ready for media
```

---

## Next Steps

Once your environment is set up:

1. **Explore the CMS** — Edit homepage content via admin panel
2. **Customize Branding** — Update colors and fonts in platform settings
3. **Test Animations** — Modify animation presets in `src/theme/motion.ts`
4. **Check Documentation** — See [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
5. **Deploy** — Follow [PRODUCTION_COMPLETE_GUIDE.md](./PRODUCTION_COMPLETE_GUIDE.md)

---

## Key Commands Reference

### Frontend

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:5173)
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # Check code quality
```

### Backend

```bash
python app/main.py                  # Start development server
python init_db.py                   # Initialize database
python seed_db.py                   # Seed default data
python run_migrations.py            # Run SQL migrations
```

### Docker

```bash
docker-compose up -d                # Start all services
docker-compose down                 # Stop all services
docker-compose logs -f              # View logs
docker-compose build                # Rebuild images
```

---

## Accessing Your Application

### Local Development

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173/ | User interface |
| Backend API | http://localhost:8000/ | API endpoint |
| Swagger Docs | http://localhost:8000/docs | API documentation |
| Admin Panel | http://localhost:5173/admin | Admin dashboard |

### Database (if needed)

```bash
# Connect to PostgreSQL
psql -h localhost -U postgres -d mehaal

# View tables
\dt

# Query platform settings
SELECT * FROM platform_settings;
```

---

## Troubleshooting Resources

- **Setup Issues?** → [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md)
- **Database Problems?** → [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **Production Deployment?** → [PRODUCTION_COMPLETE_GUIDE.md](./PRODUCTION_COMPLETE_GUIDE.md)
- **Domain Setup?** → [DOMAIN_SETUP.md](./DOMAIN_SETUP.md)

---

## Getting Help

If you encounter issues:

1. **Check the logs** — Frontend (browser console), Backend (terminal), Database (Docker logs)
2. **Verify prerequisites** — Ensure Node.js, Python, and Git are installed
3. **Test connections** — Try `curl http://localhost:8000/` from terminal
4. **Review documentation** — Check [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
5. **Check .env files** — Ensure all environment variables are set correctly

---

**You're all set! 🎉**

Your development environment is now configured. Start building amazing features on top of the Mehaal platform.

**Questions?** Refer to the complete documentation map in [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md).

Happy coding! 🚀
