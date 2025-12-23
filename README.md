# Mehaal — AI Intelligence Platform

## Overview

**Mehaal** is a modern SaaS platform featuring a dynamic landing page with advanced animations, real-time admin controls, and a comprehensive content management system. The platform supports multi-tenant configuration, brand customization, and seamless frontend-backend integration.

**Current Version:** 3.0.0  
**Status:** ✅ Production Ready  
**Stack:** React 18 + Vite + FastAPI + PostgreSQL + Docker

---

## Project Architecture

```
mehaal/
├── frontend (React + TypeScript)
│   ├── src/
│   │   ├── admin/              # Admin dashboard components
│   │   ├── components/         # Reusable React components
│   │   ├── lib/                # API utilities and helpers
│   │   ├── services/           # External service integrations
│   │   ├── theme/              # Motion and styling presets
│   │   └── vite-env.d.ts       # Vite environment types
│   ├── hero/                   # Hero section module (standalone)
│   ├── assets/                 # Static assets (images, fonts, icons)
│   ├── App.jsx, main.jsx       # App entry points
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Dependencies
│
├── backend (FastAPI + SQLAlchemy)
│   ├── app/
│   │   ├── main.py             # FastAPI application entry
│   │   ├── database/           # Database connection
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── routes/             # API endpoints
│   │   └── schemas/            # Pydantic request/response schemas
│   ├── migrations/             # SQL migration scripts
│   ├── seed/                   # Database seed data
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Container configuration
│   └── run_migrations.py       # Migration runner
│
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production deployment
├── Dockerfile                  # Frontend image
├── nginx.conf                  # Reverse proxy configuration
├── package.json                # Frontend package metadata
├── DOCUMENTATION_INDEX.md      # Complete docs guide
└── UPDATE_CORE.md              # Core platform integration guide
```

---

## Quick Start Guide

### Prerequisites

- **Node.js** 16+ (v18+ recommended)
- **Python** 3.9+
- **Docker & Docker Compose** (for production)
- **PostgreSQL** 13+ (if not using Docker)

### Development Environment Setup

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/mehaal.git
cd mehaal
```

#### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

#### 3. Backend Setup

```bash
# Create Python virtual environment
cd backend
python -m venv venv-development

# Activate virtual environment
# Windows
venv-development\Scripts\activate
# macOS/Linux
source venv-development/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py
python seed_db.py

# Start FastAPI server
python app/main.py
```

Backend API runs at: `http://localhost:8000`  
Swagger Docs: `http://localhost:8000/docs`

#### 4. Docker Compose (All Services)

```bash
# Start all services (frontend, backend, database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Key Features

### 🎨 Hero Section
- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **Advanced Animations** — React Spring powered smooth transitions
- **Dynamic Branding** — Colors, typography, and layouts controlled via admin
- **Performance Optimized** — GPU-accelerated animations, optimized re-renders

### 🛠 Admin Dashboard
- **Platform Settings Control** — Manage colors, fonts, animations in real-time
- **Homepage CMS Editor** — Edit headlines, copy, CTAs without code
- **Media Upload** — Intuitive asset management
- **Live Preview** — See changes instantly on the frontend

### 🔌 API Architecture
- **RESTful Endpoints** — Standard HTTP verbs for all operations
- **Async Processing** — Non-blocking background tasks
- **Database Seeding** — One-command initialization
- **Swagger Documentation** — Auto-generated API docs

### 📦 Deployment Ready
- **Docker Containerization** — Consistent environments across all stages
- **Nginx Reverse Proxy** — Production-grade web server
- **Environment Configuration** — Separate .env files for dev/prod
- **Database Migrations** — Version-controlled schema management

---

## Available Commands

### Frontend

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |

### Backend

| Command | Purpose |
|---------|---------|
| `python app/main.py` | Start FastAPI development server |
| `python run_migrations.py` | Execute database migrations |
| `python seed_db.py` | Populate database with seed data |
| `python init_db.py` | Initialize database schema |

### Docker

| Command | Purpose |
|---------|---------|
| `docker-compose up -d` | Start all services (background) |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View live service logs |
| `docker-compose build` | Rebuild Docker images |

---

## Technology Stack

### Frontend

| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI framework | 18.2.0+ |
| Vite | Build tool & dev server | 5.0.0+ |
| React Spring | Animation library | 9.7.5+ |
| React Router | Client-side routing | 7.11.0+ |
| TypeScript | Type safety | 5.3.0+ |
| ESLint | Code quality | 8.54.0+ |

### Backend

| Technology | Purpose | Version |
|-----------|---------|---------|
| FastAPI | Web framework | 0.100.0+ |
| SQLAlchemy | ORM | 2.0.0+ |
| Pydantic | Data validation | 2.0.0+ |
| PostgreSQL | Database | 13+ |
| Python | Runtime | 3.9+ |

### DevOps

| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Reverse proxy & static serving |
| SSL/TLS | HTTPS encryption |

---

## Configuration

### Environment Variables

Create `.env` files for each environment:

#### `.env.development` (Local)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
NODE_ENV=development
```

#### `.env.production` (Production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
NODE_ENV=production
```

#### Backend (`Mehaal.Backend/.env.<env>`)
```env
APP_ENV=dev
DATABASE_URL=sqlite:///./mehaal_dev.db
FOUNDER_KEY=
JWT_SECRET=
SSO_METADATA_URL=https://idp.dev.mehaal.local/metadata
CORS_ORIGINS=["http://localhost:5173","https://yourdomain.com"]
```

Use `.env.dev`, `.env.staging`, and `.env.prod` files to mirror the active virtual environment; replace sample secrets with live values before deploying.

---

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/platform-settings` | Fetch branding & configuration |
| GET | `/api/cms/home` | Fetch homepage content |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/platform-settings` | Update platform configuration |
| POST | `/api/cms/home` | Create/update homepage content |
| POST | `/api/media/upload` | Upload media files |

For complete API documentation, see [UPDATE_CORE.md](./UPDATE_CORE.md)

---

## Responsive Design

### Breakpoints

| Device | Width | Layout | Notes |
|--------|-------|--------|-------|
| Mobile | < 768px | Single column | Optimized touch targets |
| Tablet | 768px - 1023px | 2 columns | Flexible spacing |
| Desktop | 1024px+ | Multi-column | Full hero with effects |
| Large | 1440px+ | Max-width container | Centered layout |

All animations are hardware-accelerated and perform smoothly across devices.

---

## Project Standards

### Code Quality

- **TypeScript** — Strict type checking enabled
- **ESLint** — Enforces consistent code style
- **Component Isolation** — Each component is standalone and testable
- **Performance** — React.memo, lazy loading, code splitting enabled

### Documentation

Every major file includes:
- ✅ File purpose and description
- ✅ Clear comments for complex logic
- ✅ Usage examples
- ✅ Configuration options

### Version Control

- `main` branch — Production-ready code
- `dev` branch — Development branch
- Feature branches — `feature/[name]`
- Bugfix branches — `bugfix/[name]`

---

## Security Considerations

### Frontend
- ✅ No hardcoded credentials
- ✅ CORS properly configured
- ✅ XSS prevention via React escaping
- ✅ Environment variables for sensitive data

### Backend
- ✅ Input validation via Pydantic
- ✅ SQL injection protection via SQLAlchemy ORM
- ✅ HTTPS enforced in production
- ✅ Admin endpoints require authentication

### Database
- ✅ SSL connections enabled
- ✅ Prepared statements used
- ✅ Regular backups configured
- ✅ Secret keys never in version control

---

## Performance Optimization

### Frontend
- **Vite** — Sub-100ms HMR
- **Code Splitting** — Automatic route-based splits
- **Lazy Loading** — Components loaded on-demand
- **CSS Modules** — No style conflicts
- **Image Optimization** — Responsive images with srcset

### Backend
- **Database Indexing** — Strategic indexes for queries
- **Async Processing** — Non-blocking I/O operations
- **Response Caching** — Configurable cache headers
- **Query Optimization** — N+1 query prevention

---

## Deployment

### Local Development
```bash
# Start all services with Docker
docker-compose up -d

# Access the application
http://localhost:3000      # Frontend
http://localhost:8000      # Backend API
http://localhost:8000/docs # Swagger docs
```

### Production Deployment
For complete production deployment guide, see:
- [PRODUCTION_COMPLETE_GUIDE.md](./PRODUCTION_COMPLETE_GUIDE.md)
- [DOMAIN_SETUP.md](./DOMAIN_SETUP.md)
- [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md)

---

## Documentation

Complete documentation is available in:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | 15-minute setup guide ⭐ **START HERE** | 15 min |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Complete directory map & architecture | 10 min |
| [UPDATE_CORE.md](./UPDATE_CORE.md) | Core platform integration & API setup | 10 min |
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) | Complete documentation map | 5 min |
| [DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md) | Code standards & best practices | 20 min |
| [QUICK_START_CMS.md](./QUICK_START_CMS.md) | CMS usage guide | 5 min |
| [ADMIN_USAGE_GUIDE.md](./ADMIN_USAGE_GUIDE.md) | Admin dashboard guide | 10 min |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | Database configuration | 10 min |
| [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) | Domain & SSL setup | 20 min |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Pre-deployment checklist | 10 min |
| [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md) | Troubleshooting guide | As needed |

---

## Support & Troubleshooting

### Common Issues

**Issue: Port 5173 already in use**
```bash
# Use a different port
npm run dev -- --port 3000
```

**Issue: Database connection failed**
```bash
# Check PostgreSQL is running
# Update DATABASE_URL in .env
# Run migrations: python run_migrations.py
```

**Issue: CORS errors**
```bash
# Ensure backend CORS_ORIGINS includes frontend URL
# Check .env for correct API_URL
```

For more troubleshooting, see [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md)

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

---

## License

Proprietary — All rights reserved © 2025 Mehaal Technologies

---

## Project Status

✅ **Version 3.0.0** — Production Ready

- [x] Core platform setup
- [x] Admin dashboard
- [x] API integration
- [x] Docker deployment
- [x] Complete documentation

---

**Last Updated:** December 2025  
**Maintainer:** Development Team  
**Questions?** Refer to documentation or create an issue.

Happy building! 🚀
