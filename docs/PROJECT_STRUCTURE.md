# Project Structure & Architecture

## Complete Directory Map

```
mehaal/
│
├── 📦 Frontend (React + TypeScript)
│   ├── src/
│   │   ├── admin/                          # Admin panel components
│   │   │   ├── admin.css                   # Admin styling
│   │   │   ├── AdminLayout.tsx             # Admin layout wrapper
│   │   │   ├── Dashboard.tsx               # Main dashboard
│   │   │   ├── HomePageEditor.tsx          # CMS editor
│   │   │   └── PlatformSettingsAdmin.tsx   # Settings editor
│   │   │
│   │   ├── components/                     # Reusable React components
│   │   │   ├── Hero.tsx                    # Hero section component
│   │   │   └── MediaUploader.tsx           # Media upload component
│   │   │
│   │   ├── lib/                            # Utility functions
│   │   │   └── api.ts                      # API client helpers
│   │   │
│   │   ├── services/                       # External integrations
│   │   │   └── api.ts                      # API service layer
│   │   │
│   │   ├── theme/                          # Design system
│   │   │   └── motion.ts                   # Animation presets
│   │   │
│   │   └── vite-env.d.ts                   # Vite environment types
│   │
│   ├── hero/                               # Standalone hero module
│   │   ├── Hero.css                        # Hero styling
│   │   ├── Hero.jsx                        # Hero component
│   │   ├── hero.layout.ts                  # Layout tokens
│   │   ├── hero.motion.ts                  # Animation library
│   │   ├── hero.theme.ts                   # Design tokens
│   │   └── index.ts                        # Module exports
│   │
│   ├── assets/                             # Static files
│   │   ├── Fonts/                          # Custom fonts
│   │   ├── Images/                         # Image assets
│   │   └── PNGS/                           # PNG graphics
│   │
│   ├── App.jsx                             # Root component
│   ├── App.css                             # App styling
│   ├── index.css                           # Global styles
│   ├── index.html                          # HTML template
│   ├── main.jsx                            # Entry point
│   ├── package.json                        # Dependencies metadata
│   ├── tsconfig.json                       # TypeScript config
│   ├── tsconfig.node.json                  # TypeScript for build
│   ├── vite.config.js                      # Vite configuration
│   └── .env*                               # Environment variables
│
├── 🔧 Backend (FastAPI + SQLAlchemy)
│   ├── app/
│   │   ├── __init__.py                     # Package initialization
│   │   ├── main.py                         # FastAPI application
│   │   │
│   │   ├── database/                       # Database layer
│   │   │   ├── __init__.py
│   │   │   ├── database.py                 # Connection & session
│   │   │   └── __pycache__/
│   │   │
│   │   ├── models/                         # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── home_page.py                # Homepage content model
│   │   │   ├── models.py                   # Base models
│   │   │   ├── platform_settings.py        # Platform config model
│   │   │   └── __pycache__/
│   │   │
│   │   ├── routes/                         # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── docs.py                     # Documentation routes
│   │   │   ├── features.py                 # Features endpoints
│   │   │   ├── home_page.py                # Homepage CMS routes
│   │   │   ├── legal.py                    # Legal pages routes
│   │   │   ├── login.py                    # Authentication routes
│   │   │   ├── media.py                    # Media upload routes
│   │   │   ├── platform_settings.py        # Settings routes
│   │   │   ├── pricing.py                  # Pricing routes
│   │   │   ├── settings.py                 # App settings routes
│   │   │   ├── signup.py                   # Registration routes
│   │   │   └── __pycache__/
│   │   │
│   │   ├── schemas/                        # Pydantic request/response models
│   │   │   ├── home_page.py                # Homepage schema
│   │   │   ├── home_page_schema.py         # Alternative schema
│   │   │   ├── platform_settings.py        # Settings schema
│   │   │   ├── schemas.py                  # Shared schemas
│   │   │   └── __pycache__/
│   │   │
│   │   └── __pycache__/
│   │
│   ├── migrations/                         # SQL migration scripts
│   │   └── 001_platform_settings.sql       # Initial schema
│   │
│   ├── seed/                               # Database seed data
│   │   └── platform_settings_seed.py       # Default settings
│   │
│   ├── uploads/                            # User uploaded files
│   │
│   ├── Dockerfile                          # Development container
│   ├── Dockerfile.prod                     # Production container
│   ├── __init__.py
│   ├── init_db.py                          # Database initialization
│   ├── requirements.txt                    # Python dependencies
│   ├── run_migrations.py                   # Migration runner
│   ├── seed_db.py                          # Seed runner
│   └── .env*                               # Environment variables
│
├── 🐳 Docker & Deployment
│   ├── docker-compose.yml                  # Local development
│   ├── docker-compose.prod.yml             # Production environment
│   ├── Dockerfile                          # Frontend image
│   ├── nginx.conf                          # Nginx config (development)
│   ├── nginx.conf.template                 # Nginx template
│   └── .dockerignore                       # Ignored files for Docker
│
├── 📚 Documentation
│   ├── README.md                           # Main project README
│   ├── PROJECT_STRUCTURE.md                # This file
│   ├── UPDATE_CORE.md                      # Core integration guide
│   ├── DOCUMENTATION_INDEX.md              # Docs map
│   ├── QUICK_START_CMS.md                  # CMS quickstart
│   ├── ADMIN_USAGE_GUIDE.md                # Admin guide
│   ├── CMS_HOMEPAGE_GUIDE.md               # Homepage editor guide
│   ├── DATABASE_SETUP.md                   # Database config
│   ├── DOMAIN_SETUP.md                     # Domain & SSL setup
│   ├── DOMAIN_QUICK_REFERENCE.md           # Quick domain setup
│   ├── DOMAIN_README.md                    # Domain guide
│   ├── PRODUCTION_BUILD.md                 # Build guide
│   ├── PRODUCTION_CHECKLIST.md             # Pre-launch checklist
│   ├── PRODUCTION_COMPLETE_GUIDE.md        # Full deployment
│   ├── DEPLOYMENT_TROUBLESHOOTING.md       # Troubleshooting
│   ├── MEDIA_UPLOAD_IMPLEMENTATION.md      # Media handling
│   ├── MEDIA_FILES_GUIDE.md                # Media guide
│   ├── SETUP_COMPLETE.md                   # Setup verification
│   └── UPDATE_CORE.md                      # Core updates
│
├── 🔧 Configuration Files
│   ├── .env                                # Local secrets
│   ├── .env.development                    # Dev config
│   ├── .env.production                     # Prod config
│   ├── .gitignore                          # Git exclusions
│   ├── .dockerignore                       # Docker exclusions
│   ├── package.json                        # Node.js dependencies
│   ├── package-lock.json                   # Dependency lock
│   ├── tsconfig.json                       # TypeScript config
│   └── vite.config.js                      # Vite config
│
├── 📜 Automation Scripts
│   ├── deploy.sh                           # Deployment script
│   ├── setup-domain.sh                     # Domain setup (Unix)
│   └── setup-domain.ps1                    # Domain setup (Windows)
│
├── 📁 Dynamic Directories
│   ├── uploads/                            # User media files
│   ├── dist/                               # Built frontend
│   ├── node_modules/                       # Node dependencies
│   ├── .venv/                              # Python virtual env
│   └── __pycache__/                        # Python cache
│
└── 🔒 Version Control
    ├── .git/                               # Git repository
    └── .github/                            # GitHub configuration
```

---

## Frontend Architecture

### Directory Organization

The frontend follows a modular component-based structure:

```
src/
├── admin/              # Founder/admin-only pages
├── components/         # Reusable UI components
├── lib/                # Pure utilities & helpers
├── services/           # API client & integrations
├── theme/              # Design tokens & animations
└── vite-env.d.ts       # TypeScript environment
```

### Component Hierarchy

```
App.jsx (Root)
├── Pages/Routes
│   ├── LandingPage
│   │   └── Hero (dynamic content)
│   ├── AdminPanel (if authenticated)
│   │   ├── Dashboard
│   │   ├── HomePageEditor
│   │   └── PlatformSettingsAdmin
│   └── Other Pages
└── Shared Components
    ├── MediaUploader
    └── Navigation
```

---

## Backend Architecture

### Database Schema

```
Platform Settings (1 record)
├── Colors (primary, background, foreground, muted, surface)
├── Typography (heading_font, body_font, font_weights)
├── Branding (logos)
├── Hero Configuration (layout, visual_style, background)
├── Effects (glow, noise, depth)
├── Animations (entry, idle, cta presets)
└── Motion Profile (intensity, easing, duration)

Homepage Content (1 record)
├── Headline
├── Subheadline
├── CTA Primary
├── CTA Secondary
└── Visual Assets
```

### API Layer

```
routes/
├── platform_settings.py    # GET /api/platform-settings
│                           # PUT /api/platform-settings
├── home_page.py            # GET /api/cms/home
│                           # POST/PUT /api/cms/home
├── media.py                # POST /api/media/upload
├── login.py                # POST /api/auth/login
├── signup.py               # POST /api/auth/signup
└── [other routes]
```

---

## Data Flow

### Reading Platform Data

```
Browser
  ↓
Frontend (src/lib/api.ts)
  ↓
GET /api/platform-settings
  ↓
Backend (routes/platform_settings.py)
  ↓
Database (platform_settings table)
  ↓
Response → Hero Component → Applied to UI
```

### Updating Settings (Admin)

```
Admin Dashboard
  ↓
Form Input
  ↓
PUT /api/platform-settings (payload)
  ↓
Backend (routes/platform_settings.py)
  ↓
Update Database
  ↓
Response → Cache invalidated
  ↓
Frontend refetches → Live update
```

---

## Key Files & Their Purposes

### Frontend Core

| File | Purpose | Type |
|------|---------|------|
| `main.jsx` | Vite entry point | React |
| `App.jsx` | Root component | React |
| `index.html` | HTML template | HTML |
| `vite.config.js` | Build configuration | Config |
| `tsconfig.json` | TypeScript config | Config |

### Backend Core

| File | Purpose | Type |
|------|---------|------|
| `app/main.py` | FastAPI app | Python |
| `app/database/database.py` | DB connection | Python |
| `app/models/` | ORM models | Python |
| `app/routes/` | API endpoints | Python |
| `app/schemas/` | Request/response | Python |

### Shared

| File | Purpose | Type |
|------|---------|------|
| `docker-compose.yml` | Local services | YAML |
| `Dockerfile` | Frontend image | Docker |
| `.env*` | Configuration | Env |

---

## Environment-Specific Behavior

### Development
- HMR enabled (hot module replacement)
- Source maps available
- Mock/debug endpoints active
- Docker Compose with all services

### Production
- Code minified & optimized
- Source maps excluded
- API calls to production backend
- Optimized Docker multi-stage builds

---

## Performance Considerations

### Frontend Optimization
- ✅ Code splitting by route
- ✅ Lazy loading of components
- ✅ CSS modules for isolation
- ✅ Image optimization with srcset
- ✅ Browser caching headers

### Backend Optimization
- ✅ Database connection pooling
- ✅ Query result caching
- ✅ Async/await for I/O
- ✅ Pagination for large datasets
- ✅ Strategic database indexes

---

## Security Boundaries

### Public Zone
- Landing page
- CMS content endpoints
- Platform settings (read-only)

### Protected Zone
- Admin dashboard
- Settings update endpoints
- Media upload endpoints
- Authentication required

### Database
- Encrypted passwords
- SQL injection prevention (ORM)
- Prepared statements

---

## Deployment Artifacts

### Frontend Build Output
- `dist/` — Minified HTML, CSS, JS
- `dist/index.html` — Entry point
- `dist/assets/` — Optimized resources

### Backend Package
- `requirements.txt` — Python dependencies
- Docker images for backend

### Docker Compose
- Orchestrates frontend, backend, database
- Persistent volume for database
- Environment-specific configs

---

## Testing & Quality Assurance

### Frontend Testing (Setup Ready)
- ESLint for code quality
- TypeScript for type safety
- Component testing framework ready

### Backend Testing (Setup Ready)
- pytest framework ready
- Pydantic validation
- Type hints throughout

### Integration Testing
- Docker Compose for full stack
- API endpoint verification
- Database migration testing

---

For detailed implementation guides, see:
- [UPDATE_CORE.md](./UPDATE_CORE.md) — Core integration
- [README.md](./README.md) — Quick start
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) — All docs
