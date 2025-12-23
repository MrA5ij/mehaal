# PROFESSIONAL CMS IMPLEMENTATION GUIDE (CODER-READY)

> Objective: Replace dummy / hard‑coded UI with a **real, production‑grade CMS**.
> Scope: **Admin panel + CMS backend + frontend binding**.
> Audience: **Developers (no theory, no options)**.

---

## 1. SYSTEM OVERVIEW (FINAL)

### Control Layers

1. **Brand & Platform Settings** (Founder‑only)
2. **Content CMS** (Admin / Editor)
3. **Frontend Renderer** (Read‑only)

No layer crosses boundaries.

---

## 2. CMS DATA MODEL (BACKEND — FASTAPI)

### 2.1 Pages

```sql
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT CHECK (status IN ('draft','published')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.2 Navigation

```sql
CREATE TABLE cms_navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  slug TEXT NOT NULL,
  position INT NOT NULL
);
```

### 2.3 Brand Assets

```sql
CREATE TABLE brand_assets (
  key TEXT PRIMARY KEY,
  file_path TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. BACKEND API (FASTAPI ROUTES)

### Pages

- `GET /cms/pages/{slug}` → public (published only)
- `GET /admin/pages` → list all
- `POST /admin/pages` → create / update
- `POST /admin/pages/publish/{slug}` → publish

### Navigation

- `GET /cms/navigation`
- `POST /admin/navigation`

### Brand Assets

- `POST /admin/brand/logo`

All admin routes are **founder / admin protected**.

---

## 4. ADMIN PANEL (REACT — REAL CMS)

### Routes

```
/admin
/admin/brand
/admin/pages
/admin/pages/edit/:slug
/admin/navigation
```

### Pages Responsibility

| Page | Function |
|----|----|
| Brand | Upload logo |
| Pages | List / create pages |
| Editor | Edit JSON blocks |
| Navigation | Menu order |

---

## 5. CONTENT FORMAT (BLOCK‑BASED, SAFE)

```json
{
  "blocks": [
    { "type": "hero", "data": { "headline": "..." } },
    { "type": "text", "data": { "value": "..." } }
  ]
}
```

Frontend renders blocks — not raw HTML.

---

## 6. FRONTEND BINDING (NO HARDCODE)

### Navigation

- Load from `/cms/navigation`
- Render links dynamically

### Pages

- Route `/[slug]`
- Fetch `/cms/pages/{slug}`
- Render blocks

---

## 7. LOGO SYSTEM (FIXED)

- Upload → `/uploads/brand/logo.svg`
- Path stored in DB
- Frontend fetches path → renders

No rebuild required.

---

## 8. ERROR HANDLING (PRODUCTION)

| Scenario | Behavior |
|----|----|
| CMS down | Serve cached content |
| Page missing | 404 |
| Draft page | 404 |
| Invalid block | Skip block |

No infinite loops.

---

## 9. SECURITY RULES

- Admin APIs require founder key / JWT
- CMS public APIs are read‑only
- Uploads validated (type, size)

---

## 10. DONE CRITERIA (GREEN)

- Admin can change logo
- Admin can edit page content
- Links work
- No hard‑coded copy remains
- No redeploy for content change

---

## FINAL NOTE

This replaces the dummy landing page with a **real SaaS CMS**.
After this point, the system behaves like a product — not a prototype.

