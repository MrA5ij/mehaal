# Project Structure & Architecture (Updated)

> **Updated after separating frontend and backend into independent Docker build contexts**

---

## ✅ Final Directory Layout (Docker‑Safe, CI‑Ready)

```
mehaal/
│
├── Mehaal.Frontend/                        # 🎨 Frontend (React + Vite)
│   ├── src/
│   │   ├── admin/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── theme/
│   │   └── vite-env.d.ts
│   │
│   ├── hero/                        # Standalone hero engine
│   ├── assets/                     # Fonts, images, graphics
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.html
│   ├── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── .env*
│   ├── Dockerfile                  # Frontend Docker image
│   └── .dockerignore               # Frontend-only ignore rules
│
├── Mehaal.Backend/                         # 🔧 Backend (FastAPI + SQLAlchemy)
│   ├── app/
│   │   ├── main.py
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── __init__.py
│   │
│   ├── migrations/
│   ├── seed/
│   ├── uploads/                    # Mounted volume (runtime only)
│   │
│   ├── requirements.txt
│   ├── init_db.py
│   ├── run_migrations.py
│   ├── seed_db.py
│   │
│   ├── Dockerfile                  # Dev backend image
│   ├── Dockerfile.prod             # Prod backend image
│   ├── .env*
│   └── .dockerignore               # Backend-only ignore rules
│
├── docker/                          # 🐳 Deployment & Infra
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── nginx.conf
│   └── nginx.conf.template
│
├── docs/                            # 📚 Documentation
│   ├── PROJECT_STRUCTURE.md
│   ├── README.md
│   ├── UPDATE_CORE.md
│   ├── PRODUCTION_BUILD.md
│   └── [other docs]
│
├── .dockerignore                    # Root ignore (very minimal)
├── .gitignore
├── .env.development
├── .env.production
└── README.md
```

---

## 🎯 Design Principles (Why This Structure Exists)

### 1. Frontend and Backend Are **Physically Isolated**
- Docker build context is now **small and deterministic**
- No accidental inclusion of `node_modules`, `dist`, `uploads`, `.venv`
- CI/CD becomes reliable

### 2. Root Folder Is **Orchestration Only**
Root contains:
- docker-compose files
- env configs
- docs

No runtime code lives at root.

### 3. Each Service Owns Its Boundaries
| Service | Owns | Never Sees |
|------|------|-----------|
| frontend | src, hero, assets | backend, uploads, DB |
| backend | app, migrations | frontend, dist |

---

## 🐳 Docker Build Contexts

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
```

> ⚠️ `context: .` is **never** used.

---

## 📦 Dynamic / Runtime Directories (NOT in build context)

These are **mounted or generated at runtime**, never copied into images:

```
uploads/
dist/
node_modules/
.venv/
__pycache__/
```

---

## 🔒 .dockerignore Strategy

### Root `.dockerignore`
```
.git
node_modules
dist
uploads
.venv
__pycache__
```

### Mehaal.Frontend/.dockerignore
```
node_modules
dist
.vite
.cache
.env*
```

### Mehaal.backend/.dockerignore
```
__pycache__
.venv
.env*
uploads
*.log
```

---

## 🔁 Data Flow (Unchanged, Now Cleaner)

```
Browser
  ↓
Frontend (Mehaal.Frontend/src/lib/api.ts)
  ↓
/api/*
  ↓
Backend (Mehaal.backend/app/routes/*)
  ↓
Database
```

---

## ✅ Result After This Change

- Docker build context < **30MB** per service
- No random `context canceled` errors
- Windows + Docker Desktop stable
- CI/CD ready
- Production deploy predictable

---

## 🚨 Important Rule Going Forward

> **Never place backend code inside frontend again**

Communication happens via **HTTP**, not folders.

---

This structure is now:
- industry standard
- cloud friendly
- scale ready

Next documents (Docker, prod, CI) now assume this layout.

