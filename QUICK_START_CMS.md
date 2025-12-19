# 🚀 Quick Start - Home Page CMS

## چلائیں (3 منٹ میں)

### Step 1: Backend شروع کریں
```bash
# Terminal 1
cd backend
docker-compose up -d

# Wait 10 seconds for database to start
```

### Step 2: Database Initialize کریں
```bash
# In backend folder
python init_db.py
python seed_db.py
```

### Step 3: Frontend شروع کریں
```bash
# Terminal 2 (root directory)
npm install
npm run dev
```

### Step 4: Home Page Data بنائیں

**Option A: Swagger UI استعمال کریں (آسان)**

1. Open: http://localhost:8000/docs
2. Find: `POST /api/home-page/`
3. Click "Try it out"
4. Copy paste یہ JSON:

```json
{
  "hero_title": "Welcome to Mehaal CMS",
  "hero_subtitle": "Build beautiful websites with ease",
  "hero_cta_text": "Get Started Free",
  "hero_cta_url": "/signup",
  "hero_media_id": null,
  "sections": {
    "feature_grid": [
      {
        "id": "f1",
        "title": "Easy to Use",
        "description": "Intuitive interface for everyone",
        "icon": "🎯"
      },
      {
        "id": "f2",
        "title": "Powerful Features",
        "description": "Everything you need in one place",
        "icon": "⚡"
      },
      {
        "id": "f3",
        "title": "Secure & Reliable",
        "description": "Enterprise-grade security",
        "icon": "🔒"
      }
    ],
    "pricing_preview": [],
    "testimonials": [],
    "call_to_action": {
      "heading": "Ready to transform your website?",
      "description": "Join thousands of satisfied customers",
      "button_text": "Start Free Trial",
      "button_url": "/signup"
    }
  },
  "seo_title": "Mehaal - Modern CMS Platform",
  "seo_description": "The easiest way to build and manage your website",
  "seo_image": null,
  "is_published": true
}
```

5. Click "Execute"
6. Check response (status 201 = success ✅)

**Option B: PowerShell استعمال کریں**

```powershell
$body = @{
    hero_title = "Welcome to Mehaal"
    hero_subtitle = "Build amazing websites"
    hero_cta_text = "Get Started"
    hero_cta_url = "/signup"
    sections = @{
        feature_grid = @(
            @{ id = "f1"; title = "Fast"; description = "Lightning speed"; icon = "⚡" }
        )
        pricing_preview = @()
        testimonials = @()
        call_to_action = @{
            heading = "Ready?"
            description = "Join us today"
            button_text = "Sign Up"
            button_url = "/signup"
        }
    }
    is_published = $true
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:8000/api/home-page/" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### Step 5: Admin Dashboard استعمال کریں

1. Open: http://localhost:3000/admin
2. Edit all fields
3. Click "💾 Save"
4. Click "🚀 Publish"

## 📝 CMS Settings کہاں ہیں؟

### 1. Backend API (Database میں Store)
```
Location: PostgreSQL Database
Container: mehaal-db
Table: home_pages
```

**Access via:**
- Swagger UI: http://localhost:8000/docs
- API directly: http://localhost:8000/api/home-page/
- Database: `docker exec -it mehaal-db psql -U mehaal_user mehaal_db`

### 2. Admin Dashboard (Frontend)
```
Location: src/admin/HomePageEditor.tsx
URL: http://localhost:3000/admin
```

**Features:**
- ✏️ Edit hero title, subtitle, CTA
- ➕ Add/Remove features
- 📝 Edit call to action
- 🔍 SEO settings
- 💾 Save changes
- 🚀 Publish

### 3. API Service (Code میں)
```
Location: src/services/api.ts
Usage: Import and use in any component
```

```typescript
import { homePageApi } from '@/services/api';

// Get data
const data = await homePageApi.getPublished();

// Update
await homePageApi.update(1, { hero_title: "New Title" });
```

## 🎨 Frontend Integration

### Method 1: Using Hook (Recommended)

```typescript
import { useHomePage } from '@/services/api';

function HomePage() {
  const { data, loading, error } = useHomePage();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.hero_title}</h1>
      <p>{data.hero_subtitle}</p>
      {data.sections.feature_grid.map(feature => (
        <div key={feature.id}>
          <span>{feature.icon}</span>
          <h3>{feature.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

### Method 2: Direct API Call

```typescript
import { homePageApi } from '@/services/api';
import { useEffect, useState } from 'react';

function HomePage() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    homePageApi.getPublished().then(setPage);
  }, []);

  return <div>{page?.hero_title}</div>;
}
```

## 🔍 Testing

### Check if Backend is Running
```bash
curl http://localhost:8000/health
# Output: {"status":"healthy"}
```

### Get Home Page Data
```bash
curl http://localhost:8000/api/home-page/published
```

### View in Database
```bash
docker exec -it mehaal-db psql -U mehaal_user mehaal_db

# SQL commands:
SELECT * FROM home_pages;
SELECT sections FROM home_pages WHERE id = 1;
```

## 📊 Data Flow

```
User Types → Admin Dashboard → API Call → FastAPI → PostgreSQL
                                                     ↓
User Views ← Frontend Component ← API Call ← PostgreSQL
```

## 🔄 Update Workflow

1. **Edit in Admin Dashboard** (http://localhost:3000/admin)
2. Click **"💾 Save"** → Data saved in database
3. Click **"🚀 Publish"** → is_published = true
4. **Frontend automatically shows** published data
5. **No page refresh needed** (if using React Query/SWR)

## 🎯 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Public website |
| Admin Dashboard | http://localhost:3000/admin | CMS editor |
| Backend API | http://localhost:8000 | API endpoints |
| Swagger UI | http://localhost:8000/docs | API documentation |
| Database | localhost:5432 | PostgreSQL |

## 💡 Tips

1. **Always save before publishing**
2. **Use Swagger UI for testing** API endpoints
3. **Check browser console** for errors
4. **Database persists** in Docker volume
5. **API automatically validates** data

## ⚠️ Troubleshooting

### Backend not starting?
```bash
docker-compose logs backend
# Check for errors
```

### Database connection failed?
```bash
docker-compose exec postgres pg_isready -U mehaal_user
```

### Frontend can't connect to API?
- Check VITE_API_URL in .env.development
- Check browser console for CORS errors
- Verify backend is running on port 8000

### Data not saving?
- Check Swagger UI response
- Check browser Network tab
- Check backend logs

## 🎉 Done!

اب آپ کا CMS مکمل طور پر کام کر رہا ہے:
- ✅ Database setup
- ✅ Backend API
- ✅ Admin Dashboard
- ✅ Frontend integration
- ✅ All working!
