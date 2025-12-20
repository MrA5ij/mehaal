# 🏗️ Professional Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Hero Component (Hero.jsx)                    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  HeroBackground3D.tsx (3D Layer)              │ │  │
│  │  │  - Three.js Canvas                            │ │  │
│  │  │  - Magnetic Torus Geometry                    │ │  │
│  │  │  - Auto-rotation + Glow Effects              │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  Content Layer:                                     │  │
│  │  - Headline, Subheading (from CMS)                 │  │
│  │  - CTA Buttons                                     │  │
│  │  - Animations (React Spring)                       │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Admin Panel (Future):                                      │
│  - Update platform settings (with founder key)             │
│  - View version history                                    │
│  - Rollback to previous version                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │                              │
         │ GET /platform-settings       │ PUT /platform-settings
         │ (public, cached 60s)         │ + X-Platform-Key header
         │                              │ (founder only)
         │                              │
         ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (CDN)                        │
├─────────────────────────────────────────────────────────────┤
│                  Cloudflare/Similar                         │
│  - Cache platform settings (60s, smart purge)             │
│  - Cache CMS content (30s)                                │
│  - Cache assets (1 year)                                  │
│  - Route api calls to backend                             │
└─────────────────────────────────────────────────────────────┘
         │                              │
         └──────────────┬───────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               BACKEND (FastAPI + SQLAlchemy)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Platform Settings Routes                     │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  GET /api/platform-settings                         │  │
│  │    └─> Return current settings (public)             │  │
│  │                                                      │  │
│  │  PUT /api/platform-settings + X-Platform-Key       │  │
│  │    ├─> Validate founder key (auth.py)              │  │
│  │    ├─> Save current state to history table          │  │
│  │    ├─> Update settings in DB                        │  │
│  │    ├─> Increment version number                     │  │
│  │    └─> Return updated settings                      │  │
│  │                                                      │  │
│  │  GET /api/platform-settings/history/versions        │  │
│  │    └─> Return all versions with timestamps          │  │
│  │                                                      │  │
│  │  POST /api/platform-settings/rollback/{version}     │  │
│  │    ├─> Validate founder key                         │  │
│  │    ├─> Find version in history                      │  │
│  │    ├─> Restore all settings from history            │  │
│  │    ├─> Increment version                            │  │
│  │    └─> Purge CDN cache                              │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Authentication Module (core/auth.py)        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  founder_only() Dependency:                         │  │
│  │  - Check X-Platform-Key header                      │  │
│  │  - Validate against FOUNDER_KEY env var             │  │
│  │  - Return 403 if invalid                            │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         platform_settings (Current State)           │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ id          | UUID (PK)                             │  │
│  │ version     | INT (incremented on updates)          │  │
│  │ primary_color        | VARCHAR(7)                   │  │
│  │ background_color     | VARCHAR(7)                   │  │
│  │ foreground_color     | VARCHAR(7)                   │  │
│  │ heading_font         | VARCHAR(128)                 │  │
│  │ body_font            | VARCHAR(128)                 │  │
│  │ logo_icon, _wordmark, _lockup | TEXT               │  │
│  │ hero_layout, _style, _background | VARCHAR(64)     │  │
│  │ hero_effects, _animation | JSONB                    │  │
│  │ motion_profile       | JSONB                        │  │
│  │ created_at, updated_at | TIMESTAMP                  │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │ 1:N                              │
│                          │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      platform_settings_history (Audit Trail)        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ id          | UUID (PK)                             │  │
│  │ settings_id | UUID (FK → platform_settings.id)      │  │
│  │ version     | INT (snapshot of version at time)     │  │
│  │ [all settings fields denormalized]                  │  │
│  │ created_at, updated_at | TIMESTAMP                  │  │
│  │                                                      │  │
│  │ Indexes:                                            │  │
│  │ - (settings_id)                                     │  │
│  │ - (settings_id, version) UNIQUE                     │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Update & Rollback

### Update Settings

```
Frontend (Admin)
    │
    └─> POST /api/platform-settings/update
        { colors: { primary: "#FF6666" } }
        Header: X-Platform-Key: my_founder_key
            │
            ▼
        Backend Router
        (platform_settings.py)
            │
            ├─> founder_only() dependency
            │   └─> Validate X-Platform-Key header
            │       └─> Compare against FOUNDER_KEY env var
            │           └─> Return 403 if invalid ✓
            │
            ├─> Database Query
            │   └─> SELECT * FROM platform_settings
            │
            ├─> Create History Entry
            │   └─> INSERT INTO platform_settings_history
            │       └─> Save current state as version N
            │
            ├─> Update Settings
            │   ├─> UPDATE platform_settings
            │   │   SET primary_color = '#FF6666',
            │   │       version = N + 1
            │   │
            │   ├─> COMMIT transaction
            │   │
            │   ├─> Purge CDN Cache
            │   │   └─> Call Cloudflare API
            │   │       └─> Remove /platform-settings from cache
            │   │
            │   └─> Return updated settings
            │       └─> Content-Type: application/json
            │           with Cache-Control: 60s
            │
            ▼
        Frontend
        └─> Update UI with new colors
            └─> Display success message
            └─> Show "Version: 2" (incremented)
```

### Rollback to Version

```
Admin (Frontend)
    │
    └─> Click "Rollback to Version 1"
            │
            ▼
        POST /api/platform-settings/rollback/1
        Header: X-Platform-Key: my_founder_key
            │
            ▼
        Backend
        ├─> founder_only() validates key
        │
        ├─> Find Version 1 in History
        │   └─> SELECT * FROM platform_settings_history
        │       WHERE version = 1 AND settings_id = current
        │
        ├─> Save Current State
        │   └─> INSERT INTO platform_settings_history
        │       └─> version = 2 (current before rollback)
        │
        ├─> Restore from History
        │   ├─> UPDATE platform_settings
        │   │   SET primary_color = history.primary_color,
        │   │       heading_font = history.heading_font,
        │   │       ... (all fields)
        │   │       version = 3 (new version)
        │   │
        │   └─> COMMIT
        │
        ├─> Purge CDN
        │   └─> Remove from cache (forces fresh fetch)
        │
        └─> Return restored settings
            └─> Display "Restored to Version 1 (now Version 3)"
```

---

## Version Timeline Example

```
Time  │ Version │ Primary Color │ Action
──────┼─────────┼───────────────┼────────────────────────────
T1    │    1    │  #6666FF      │ Initial state
      │         │               │
T2    │    2    │  #FF6666      │ Updated color (saved V1 to history)
      │         │               │
T3    │    3    │  #66FF66      │ Updated color (saved V2 to history)
      │         │               │
T4    │    4    │  #FFFF66      │ Updated color (saved V3 to history)
      │         │               │
T5    │    3    │  #66FF66      │ Rollback from V4 to V2
      │  (NEW)  │               │ (V2 settings restored, saved V4 to history)
```

---

## Security Model

```
┌────────────────────────────────────────────────────────────┐
│                 REQUEST VALIDATION CHAIN                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ 1. Network Layer                                          │
│    └─> HTTPS/TLS (enforced in production)               │
│                                                            │
│ 2. Header Validation                                      │
│    └─> X-Platform-Key header required                    │
│        └─> Missing → 401 Unauthorized                    │
│                                                            │
│ 3. Founder Authentication                                │
│    └─> founder_only() dependency                         │
│        └─> Compare X-Platform-Key with FOUNDER_KEY      │
│            └─> Mismatch → 403 Forbidden                  │
│                                                            │
│ 4. Request Validation (Pydantic)                         │
│    └─> Validate JSON schema                              │
│        └─> Invalid → 422 Unprocessable Entity            │
│                                                            │
│ 5. Database Layer                                         │
│    └─> SQLAlchemy ORM                                    │
│        └─> Prevents SQL injection (parameterized)       │
│                                                            │
│ 6. Transaction Integrity                                 │
│    └─> ACID compliance                                   │
│        └─> All-or-nothing updates                        │
│                                                            │
│ 7. Audit Trail                                           │
│    └─> History recorded automatically                    │
│        └─> Complete change tracking                      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Scaling Considerations

### Current (Single Instance)

```
Frontend (React) → CDN → Backend (FastAPI) → Database (PostgreSQL)
```

### Future (Horizontally Scaled)

```
                    ┌────────────────────┐
                    │   Load Balancer    │
                    └────────┬───────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │ Backend 1  │      │ Backend 2  │      │ Backend 3  │
    │ (FastAPI)  │      │ (FastAPI)  │      │ (FastAPI)  │
    └────────────┘      └────────────┘      └────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Connection Pool │
                    │  (pgbouncer)     │
                    └────────┬─────────┘
                             │
                    ┌────────▼──────────┐
                    │ PostgreSQL Primary │
                    │ (Read/Write)       │
                    └────────┬───────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
        ┌───────┐        ┌───────┐       ┌───────┐
        │ Replica│        │ Replica│       │ Replica│
        │(Read)  │        │(Read)  │       │(Read)  │
        └───────┘        └───────┘       └───────┘
```

**History table** would benefit from:
- Partitioning by month
- Archive old versions
- Separate read replicas for history queries

---

## Environment Isolation

```
DEVELOPMENT              STAGING              PRODUCTION
─────────────────────────────────────────────────────────────
.env.development        .env.staging        .env.production
│                       │                   │
├─ API_URL:            ├─ API_URL:         ├─ API_URL:
│  localhost:8000       │  staging-api.     │  api.mehaal.ai
│                       │  mehaal.ai        │
├─ FOUNDER_KEY:        ├─ FOUNDER_KEY:    ├─ FOUNDER_KEY:
│  dev_test_key         │  (staging key)    │  (random, secure)
│                       │                   │
├─ DB: local-dev        ├─ DB: staging-db  ├─ DB: prod-db
│                       │  (test data)      │  (real data)
│                       │                   │
├─ LOG_LEVEL:          ├─ LOG_LEVEL:      ├─ LOG_LEVEL:
│  DEBUG                │  INFO             │  WARNING
│                       │                   │
└─ Cache: disabled      └─ Cache: 30s      └─ Cache: 60s+
```

---

## Success Metrics

| Metric | Target | Monitor |
|--------|--------|---------|
| API Latency (p95) | < 200ms | DataDog/CloudWatch |
| Cache Hit Ratio | > 80% | Cloudflare Analytics |
| Error Rate | < 0.1% | Sentry/Custom Logger |
| Uptime | 99.9% | Pingdom/UptimeRobot |
| Version Update Time | < 500ms | Application logs |
| Rollback Success | 100% | Application logs |
| Database Connections | < 80% pool | pgAdmin/Monitoring |

---

## Deployment Pipeline

```
┌─ Push to Main Branch
│
├─> Run Tests
│   ├─ Unit tests
│   ├─ Integration tests
│   └─ E2E tests
│
├─> Build Docker Images
│   ├─ Frontend image (React)
│   └─ Backend image (FastAPI)
│
├─> Deploy to Staging
│   ├─ Run migrations
│   ├─ Health checks
│   └─ Smoke tests
│
├─> Manual Approval
│
└─> Deploy to Production
    ├─ Blue-green deployment
    ├─ Database migrations
    ├─ CDN cache purge
    ├─ Health checks
    └─ Monitoring alerts
```

---

**Architecture Last Updated**: December 20, 2025
