# 🔧 CMS TECHNICAL REFERENCE

**For:** Developers  
**Version:** 1.0  
**Updated:** December 23, 2025

---

## 📁 File Structure

### Backend

```
Mehaal.Backend/
├── app/
│   ├── models/
│   │   ├── models.py          [MODIFIED] - Added CMSPage, CMSNavigation, BrandAsset
│   │   └── __init__.py        [MODIFIED] - Export new models
│   ├── routes/
│   │   ├── cms.py             [NEW] - All CMS endpoints (28 routes)
│   │   └── __init__.py        [MODIFIED] - Import cms router
│   ├── schemas/
│   │   └── cms.py             [NEW] - Pydantic models for CMS
│   └── main.py                [MODIFIED] - Register cms router
├── migrations/
│   └── 009_cms_tables.py       [NEW] - Database migration
└── requirements.txt           [NO CHANGE]
```

### Frontend

```
Mehaal.Frontend/
├── App.jsx                    [MODIFIED] - Import & route new components
├── src/
│   ├── admin/
│   │   ├── CMSPagesAdmin.tsx           [NEW] - Pages management
│   │   ├── CMSNavigationAdmin.tsx      [NEW] - Navigation management
│   │   ├── BrandAssetsAdmin.tsx        [NEW] - Brand assets management
│   │   └── AdminLayout.tsx    [MODIFIED] - Updated navigation menu
│   └── services/
│       └── cmsService.ts      [NEW] - API service layer
└── package.json               [NO CHANGE]
```

---

## 🗄️ Database Schema

### Table: cms_pages

```sql
CREATE TABLE cms_pages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content JSON NOT NULL DEFAULT '{"blocks": []}',
    status VARCHAR(20) DEFAULT 'draft',
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);
```

### Table: cms_navigation

```sql
CREATE TABLE cms_navigation (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    parent_id INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(parent_id) REFERENCES cms_navigation(id)
);

CREATE INDEX idx_cms_navigation_parent ON cms_navigation(parent_id);
CREATE INDEX idx_cms_navigation_position ON cms_navigation(position);
```

### Table: brand_assets

```sql
CREATE TABLE brand_assets (
    id SERIAL PRIMARY KEY,
    asset_key VARCHAR(100) NOT NULL UNIQUE,
    file_path VARCHAR(500) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_brand_assets_key ON brand_assets(asset_key);
```

---

## 🔌 API Endpoints

### Content Management

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/cms/pages/{slug}` | Get published page | No |
| GET | `/cms/pages` | List published pages | No |
| POST | `/cms/admin/pages` | Create page | Admin |
| GET | `/cms/admin/pages` | List all pages | Admin |
| GET | `/cms/admin/pages/{slug}` | Get page (any status) | Admin |
| PUT | `/cms/admin/pages/{slug}` | Update page | Admin |
| POST | `/cms/admin/pages/{slug}/publish` | Publish/unpublish | Admin |
| DELETE | `/cms/admin/pages/{slug}` | Delete page | Admin |

### Navigation

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/cms/navigation` | Get nav hierarchy | No |
| POST | `/cms/admin/navigation` | Create nav item | Admin |
| GET | `/cms/admin/navigation` | List nav items | Admin |
| PUT | `/cms/admin/navigation/{id}` | Update nav item | Admin |
| DELETE | `/cms/admin/navigation/{id}` | Delete nav item | Admin |

### Brand Assets

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/cms/brand-assets/{key}` | Get asset | No |
| POST | `/cms/admin/brand-assets` | Create/update asset | Admin |
| GET | `/cms/admin/brand-assets` | List assets | Admin |
| GET | `/cms/admin/brand-assets/{key}` | Get asset (admin) | Admin |
| DELETE | `/cms/admin/brand-assets/{key}` | Delete asset | Admin |

---

## 📡 Request/Response Examples

### Create Page

```bash
POST /cms/admin/pages
Content-Type: application/json

{
  "slug": "about-us",
  "title": "About Us",
  "content": {
    "blocks": [
      {
        "type": "hero",
        "data": {
          "headline": "About Mehaal",
          "subtitle": "Our story starts here"
        }
      },
      {
        "type": "text",
        "data": {
          "value": "Founded in 2024..."
        }
      }
    ]
  },
  "seo_title": "About Mehaal - Modern SaaS",
  "seo_description": "Learn about our mission and team"
}
```

**Response (201):**
```json
{
  "id": 1,
  "slug": "about-us",
  "title": "About Us",
  "content": { "blocks": [...] },
  "status": "draft",
  "seo_title": "About Mehaal - Modern SaaS",
  "seo_description": "Learn about our mission and team",
  "created_at": "2025-12-23T10:30:00",
  "updated_at": "2025-12-23T10:30:00",
  "published_at": null
}
```

### Get Navigation Hierarchy

```bash
GET /cms/navigation
```

**Response (200):**
```json
[
  {
    "id": 1,
    "label": "Home",
    "slug": "home",
    "position": 0,
    "is_active": true,
    "children": []
  },
  {
    "id": 2,
    "label": "Products",
    "slug": "products",
    "position": 1,
    "is_active": true,
    "children": [
      {
        "id": 3,
        "label": "Pro",
        "slug": "pro",
        "position": 0,
        "is_active": true,
        "children": []
      }
    ]
  }
]
```

### Upload Brand Asset

```bash
POST /cms/admin/brand-assets
Content-Type: application/json

{
  "asset_key": "logo",
  "file_path": "/uploads/brand/logo.svg",
  "asset_type": "image",
  "description": "Main site logo"
}
```

**Response (201):**
```json
{
  "id": 1,
  "asset_key": "logo",
  "file_path": "/uploads/brand/logo.svg",
  "asset_type": "image",
  "description": "Main site logo",
  "created_at": "2025-12-23T10:30:00",
  "updated_at": "2025-12-23T10:30:00"
}
```

---

## 🔐 Authentication (TODO)

### Current Status
All admin endpoints have `# TODO: Add authentication check` comments

### Required Changes

```python
# In each admin route, add:

from app.core.auth import require_admin_auth

@router.post("/cms/admin/pages")
async def create_page(
    page: CMSPageCreate,
    current_user = Depends(require_admin_auth),
    db: Session = Depends(get_db)
):
    # Only admins/founders can reach here
    ...
```

### Implementation Steps

1. Create `app/core/auth.py` with JWT validation
2. Add `require_admin_auth` dependency
3. Add decorator to all `/admin/*` endpoints
4. Test with invalid/expired tokens

---

## 🛠️ Frontend Service Usage

```typescript
import cmsService, { CMSPage } from '@/services/cmsService';

// Get published page
const page: CMSPage = await cmsService.getPageBySlug('about-us');

// List all published pages
const pages: CMSPage[] = await cmsService.listPublishedPages();

// Get navigation
const nav = await cmsService.getNavigation();

// Admin operations
const newPage = await cmsService.adminCreatePage({
  slug: 'contact',
  title: 'Contact Us',
  content: { blocks: [] }
});

// Publish
await cmsService.adminPublishPage('contact', 'published');
```

---

## 🔄 Data Flow

### Publishing a Page

```
Frontend User
    ↓
(click Publish)
    ↓
POST /cms/admin/pages/{slug}/publish
    ↓
Backend Route Handler
    ↓
Update status = 'published'
Set published_at = now()
    ↓
Return updated page
    ↓
Frontend updates UI
    ↓
Page visible at /pages/{slug}
```

### Frontend Rendering

```
DynamicPageComponent
    ↓
Fetch /cms/pages/{slug}
    ↓
Render blocks array
    ↓
BlockRenderer component
    ↓
Map block type → component
    ↓
Render Hero, Text, Image, etc.
```

---

## 🧪 Testing

### Unit Tests (Python)

```python
def test_create_cms_page():
    from app.routes.cms import admin_create_page
    
    page_data = CMSPageCreate(
        slug="test",
        title="Test Page",
        content=CMSPageContentBlock(blocks=[])
    )
    
    result = admin_create_page(page_data, db)
    assert result.slug == "test"
```

### Integration Tests (API)

```bash
# Create
curl -X POST http://localhost:8000/cms/admin/pages \
  -H "Content-Type: application/json" \
  -d '{"slug":"test","title":"Test","content":{"blocks":[]}}'

# Get
curl http://localhost:8000/cms/pages/test

# Publish
curl -X POST http://localhost:8000/cms/admin/pages/test/publish \
  -H "Content-Type: application/json" \
  -d '{"status":"published"}'

# Verify
curl http://localhost:8000/cms/pages/test
```

### Frontend Tests (React)

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import CMSPagesAdmin from '@/admin/CMSPagesAdmin';

test('loads and displays pages', async () => {
  render(<CMSPagesAdmin />);
  
  await waitFor(() => {
    expect(screen.getByText('CMS Pages')).toBeInTheDocument();
  });
});
```

---

## 🚀 Performance Considerations

### Database Queries

- **Index on slug:** For fast page lookups
- **Index on status:** For filtering published pages
- **Index on parent_id:** For navigation hierarchy

### Caching Strategies

```python
# Cache published pages (10 minutes)
@cache(ttl=600)
async def get_published_pages():
    return db.query(CMSPage).filter(status='published').all()

# Cache navigation (5 minutes)
@cache(ttl=300)
async def get_navigation():
    ...
```

### Pagination (Future)

```python
@router.get("/cms/admin/pages")
async def list_pages(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return db.query(CMSPage).offset(skip).limit(limit).all()
```

---

## 📚 Related Documentation

- [CMS Upgrade Complete](./CMS_UPGRADE_COMPLETE.md) - Full upgrade details
- [CMS Deployment Checklist](./CMS_DEPLOYMENT_CHECKLIST.md) - How to deploy
- [CMS User Guide](./CMS_USER_GUIDE.md) - User documentation
- [Professional CMS Guide](./professional_cms_implementation_guide.md) - Design doc

---

## 🔗 External Links

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **SQLAlchemy:** https://www.sqlalchemy.org/
- **Pydantic:** https://docs.pydantic.dev/
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/

---

**Created:** December 23, 2025  
**Version:** 1.0  
**Status:** Complete ✅
