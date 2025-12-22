# Admin Panel کا استعمال - Complete Guide

## 🎯 Admin Panel کہاں ہے؟

```
Local Development:
├─ Frontend: http://localhost:5173
├─ Backend API: http://localhost:8000
├─ Swagger UI: http://localhost:8000/docs
└─ Admin Components: Direct access (routing needed)

Production:
├─ Frontend: https://yourdomain.com
├─ Backend API: https://api.yourdomain.com
├─ Swagger UI: https://api.yourdomain.com/docs
└─ Admin: https://yourdomain.com/admin
```

---

## 🚀 Quick Start - 3 منٹ میں

### Step 1: Backend شروع کریں (30 seconds)

```powershell
# Terminal 1
cd e:\code\site\mehaal\docker
docker-compose up -d
cd ..

# Check status
cd docker
docker-compose ps
cd ..

# Verify:
# http://localhost:8000/docs
```

### Step 2: Frontend شروع کریں (30 seconds)

```powershell
# Terminal 2
cd e:\code\site\mehaal
npm run dev

# Verify:
# http://localhost:5173
```

### Step 3: Admin Access کریں (1 minute)

```
Option A: Swagger UI استعمال کریں (فوری)
├─ http://localhost:8000/docs کھولیں
├─ Endpoints دیکھیں
└─ "Try it out" سے test کریں

Option B: Admin Components استعمال کریں (proper)
├─ Browser میں components import کریں
└─ React router setup کریں (below)
```

---

## 📱 Admin Panel Components

آپ کے پاس 2 admin components ہیں:

### 1. **HomePageEditor** 🏠
```
Location: src/admin/HomePageEditor.tsx
Purpose: Home page content manage کریں
Features:
├─ Hero section (title, subtitle, CTA)
├─ Features grid
├─ Call to action
├─ SEO settings
└─ Publish/unpublish
```

### 2. **PlatformSettingsAdmin** ⚙️
```
Location: src/admin/PlatformSettingsAdmin.tsx
Purpose: Global brand settings
Features:
├─ Brand colors (5 colors)
├─ Typography (fonts, weights)
├─ Logo assets (3 types)
├─ Hero system (layout, style)
└─ Motion profile
```

---

## 🛣️ Admin Routing Setup

### Step 1: Install React Router

```powershell
npm install react-router-dom
```

### Step 2: Update App.jsx

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePageEditor from './admin/HomePageEditor';
import PlatformSettingsAdmin from './admin/PlatformSettingsAdmin';
import Hero from './components/Hero';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        
        {/* Admin Routes */}
        <Route path="/admin/home-page" element={<HomePageEditor />} />
        <Route path="/admin/platform-settings" element={<PlatformSettingsAdmin />} />
        
        {/* Admin Dashboard (Optional) */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Step 3: Admin Dashboard بنائیں (Optional)

```jsx
// src/admin/AdminDashboard.jsx
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mehaal Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Page Editor */}
          <Link 
            to="/admin/home-page"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">🏠</div>
            <h2 className="text-xl font-bold mb-2">Home Page</h2>
            <p className="text-gray-600">Edit hero, features, and content</p>
          </Link>

          {/* Platform Settings */}
          <Link 
            to="/admin/platform-settings"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-xl font-bold mb-2">Platform Settings</h2>
            <p className="text-gray-600">Brand colors, fonts, and logos</p>
          </Link>

          {/* API Docs */}
          <a 
            href="http://localhost:8000/docs"
            target="_blank"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-bold mb-2">API Docs</h2>
            <p className="text-gray-600">Swagger UI documentation</p>
          </a>

          {/* Database */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">🗄️</div>
            <h2 className="text-xl font-bold mb-2">Database</h2>
            <p className="text-gray-600">PostgreSQL via Docker</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Home Page Settings - Step by Step

### Access کریں:

```
http://localhost:5173/admin/home-page
```

### 1. Hero Section Edit کریں

```
Title:
├─ "Welcome to Mehaal"
├─ Main heading for hero

Subtitle:
├─ "Build amazing websites..."
├─ Supporting text

CTA Button:
├─ Text: "Get Started"
├─ URL: "/signup"
└─ Click action
```

**Example:**
```
Title: "Intelligence Beyond Impossible"
Subtitle: "The most advanced AI platform for modern businesses"
CTA Text: "Start Free Trial"
CTA URL: "/signup"
```

### 2. Features Add کریں

```
Click: "➕ Add Feature"

For each feature:
├─ Icon: 🎯 (emoji یا image)
├─ Title: "Feature Name"
└─ Description: "What it does"

Example Feature:
├─ Icon: ⚡
├─ Title: "Lightning Fast"
└─ Description: "Deploy in seconds, not hours"
```

### 3. Call to Action

```
Heading: "Ready to get started?"
Description: "Join thousands of happy customers"
Button Text: "Start Free Trial"
Button URL: "/signup"
```

### 4. SEO Settings

```
SEO Title:
└─ "Mehaal - Modern CMS Platform"

SEO Description:
└─ "The easiest way to build and manage your website"
```

### 5. Save & Publish

```
1. Click "💾 Save" - Draft save ہوتا ہے
2. Click "🚀 Publish" - Live ہو جاتا ہے
```

---

## ⚙️ Platform Settings - Step by Step

### Access کریں:

```
http://localhost:5173/admin/platform-settings
```

### 1. Brand Colors

```
Primary Color: #6366F1 (Blue)
├─ Main brand color
├─ Buttons, links, highlights

Background: #FFFFFF (White)
├─ Page background

Foreground: #0F172A (Dark)
├─ Text color

Muted: #64748B (Gray)
├─ Secondary text

Surface: #F8FAFC (Light Gray)
├─ Cards, surfaces
```

**Color Picker استعمال کریں:**
```jsx
<input 
  type="color" 
  value="#6366F1"
  onChange={(e) => setColor(e.target.value)}
/>
```

### 2. Typography

```
Heading Font:
├─ "Cabinet Grotesk" (Default)
├─ یا "Inter", "Roboto", etc.

Body Font:
├─ "Inter" (Default)
├─ Readable font for paragraphs

Font Weights:
├─ Heading: 600 (Semi-bold)
├─ Body: 400 (Regular)
└─ Bold: 700 (Bold)
```

### 3. Logo Assets

```
Logo Icon:
├─ Path: "/assets/logo-icon.svg"
├─ Use: Favicon, small icon
└─ Size: 32x32 to 64x64

Logo Wordmark:
├─ Path: "/assets/logo-wordmark.svg"
├─ Use: Text-only horizontal
└─ Size: Height 40-60px

Logo Lockup:
├─ Path: "/assets/logo-lockup.svg"
├─ Use: Icon + text full logo
└─ Size: Height 60-80px
```

### 4. Hero System

```
Layout:
├─ "centered-display" - Center aligned
├─ "left-aligned" - Text left, media right
└─ "split-screen" - 50-50 split

Visual Style:
├─ "magnetic-field" - Animated particles
├─ "minimal" - Clean & simple
└─ "bold" - Strong visual impact

Background:
├─ "gradient-mesh" - Colorful gradient
├─ "solid" - Solid color
└─ "image" - Background image

Effects:
├─ Blur: true/false - Background blur
├─ Glow: true/false - Glow effect
└─ Noise: true/false - Grain texture

Animation:
├─ Type: "fade-up", "fade-in", "slide-right"
├─ Duration: 800ms
└─ Stagger: 100ms (items delay)
```

### 5. Motion Profile

```
Spring Physics:
├─ Tension: 170 - Spring stiffness
├─ Friction: 26 - Spring damping
└─ Mass: 1 - Element weight

Easing:
└─ "easeOutCubic" - Smooth deceleration
```

### 6. Save Settings

```
Click "💾 Save Platform Settings"
└─ All changes apply globally
```

---

## 🔧 Using Swagger UI (Easiest Way)

### Step 1: Open Swagger

```
http://localhost:8000/docs
```

### Step 2: Common Operations

#### Get Current Home Page
```
GET /api/home-page
Click "Try it out" → "Execute"

Response:
{
  "id": 1,
  "hero_title": "Welcome...",
  "hero_subtitle": "...",
  ...
}
```

#### Update Home Page
```
PUT /api/home-page/1

Body:
{
  "hero_title": "New Title",
  "hero_subtitle": "New Subtitle",
  "hero_cta_text": "Get Started",
  "hero_cta_url": "/signup",
  "sections": {
    "feature_grid": [],
    "call_to_action": {...}
  },
  "seo_title": "...",
  "seo_description": "..."
}

Click "Execute"
```

#### Publish Home Page
```
PATCH /api/home-page/1/publish
Click "Try it out" → "Execute"

Response: { "is_published": true }
```

#### Get Platform Settings
```
GET /api/platform-settings
Click "Execute"

Response:
{
  "primary_color": "#6366F1",
  "logo_icon": "/assets/logo-icon.svg",
  ...
}
```

#### Update Platform Settings
```
PUT /api/platform-settings

Body:
{
  "primary_color": "#FF0000",
  "background_color": "#FFFFFF",
  "heading_font": "Inter",
  "logo_icon": "/assets/my-logo.svg"
}

Click "Execute"
```

---

## 📊 Database Directly Access (Advanced)

### Access PostgreSQL

```powershell
# Container میں enter کریں
cd docker
docker-compose exec postgres psql -U mehaal_user -d mehaal_db
cd ..

# Tables دیکھیں
\dt

# Home pages دیکھیں
SELECT * FROM home_pages;

# Platform settings دیکھیں
SELECT * FROM platform_settings;

# Exit
\q
```

### Quick Queries

```sql
-- Current home page
SELECT hero_title, is_published FROM home_pages;

-- Platform colors
SELECT primary_color, background_color FROM platform_settings;

-- All media files
SELECT id, file_url, file_type FROM media;

-- Update directly (⚠️ Advanced)
UPDATE platform_settings 
SET primary_color = '#FF0000' 
WHERE id = (SELECT id FROM platform_settings LIMIT 1);
```

---

## 🎯 Common Admin Tasks

### Task 1: Homepage Hero تبدیل کریں

```
Option A: Admin UI
1. http://localhost:5173/admin/home-page
2. Title field میں نیا text
3. "Save" کریں
4. "Publish" کریں

Option B: Swagger UI
1. http://localhost:8000/docs
2. PUT /api/home-page/1
3. JSON میں hero_title update کریں
4. Execute کریں
```

### Task 2: Brand Colors تبدیل کریں

```
Option A: Admin UI
1. http://localhost:5173/admin/platform-settings
2. Color picker استعمال کریں
3. Save کریں

Option B: API
1. PUT /api/platform-settings
2. primary_color update کریں
3. Execute
```

### Task 3: Logo تبدیل کریں

```
Step 1: Logo file assets folder میں رکھیں
cp my-logo.svg e:\code\site\mehaal\assets\logo-icon.svg

Step 2: Platform Settings میں path update کریں
├─ Admin UI: logo_icon = "/assets/logo-icon.svg"
└─ یا API: PUT /api/platform-settings

Step 3: Frontend refresh کریں
└─ Auto-update ہو جائے گا
```

### Task 4: Feature Add کریں

```
1. Admin UI میں "Add Feature" کریں
2. Icon: ⚡
3. Title: "Lightning Fast"
4. Description: "Deploy instantly"
5. Save & Publish
```

---

## 🔐 Security (Future Enhancement)

```
Currently: کوئی authentication نہیں
Future: JWT tokens یا OAuth

Recommended Flow:
Login → JWT Token → Protected Routes
├─ /api/login → Token return
├─ Headers: Authorization: Bearer <token>
└─ Protected: /api/home-page PUT, DELETE
```

---

## 🐛 Troubleshooting

### Issue: Admin component نہیں دیکھ رہا

```
Fix 1: Direct import کریں
import HomePageEditor from './admin/HomePageEditor';

Fix 2: React Router setup کریں
npm install react-router-dom

Fix 3: URL directly open کریں
http://localhost:5173/admin/home-page
```

### Issue: API connection failed

```
Check:
1. Backend running? docker-compose ps
2. Correct URL? http://localhost:8000
3. CORS enabled? Check backend logs
4. Network? curl http://localhost:8000/api/home-page
```

### Issue: Changes نہیں دیکھ رہا

```
1. Clear browser cache (Ctrl+Shift+R)
2. Check database: docker-compose exec postgres psql
3. Verify API response: http://localhost:8000/docs
4. Frontend re-fetch: useEffect dependency
```

---

## 📝 Admin Workflow Summary

```
Development:
1. cd docker && docker-compose up -d && cd ..        (Backend start)
2. npm run dev                 (Frontend start)
3. http://localhost:5173       (App)
4. /admin/home-page           (Edit content)
5. /admin/platform-settings   (Brand config)
6. Save & Publish             (Go live)

Quick Testing:
1. http://localhost:8000/docs (Swagger)
2. Try endpoints directly
3. See instant results

Production:
1. https://yourdomain.com/admin
2. Same workflow
3. Changes reflect immediately
```

---

## 🎓 Learning Path

```
Day 1: Setup & Access
├─ Backend running ✓
├─ Frontend running ✓
└─ Swagger UI explore ✓

Day 2: Basic Editing
├─ Home page hero edit ✓
├─ Features add ✓
└─ Save & publish ✓

Day 3: Customization
├─ Brand colors change ✓
├─ Fonts update ✓
└─ Logo replace ✓

Day 4: Advanced
├─ Direct API calls
├─ Database queries
└─ Custom workflows
```

---

## 🚀 Quick Reference

```
Admin URLs:
├─ /admin/home-page           Home page editor
├─ /admin/platform-settings   Brand settings
└─ /admin                     Dashboard (optional)

API Endpoints:
├─ GET  /api/home-page        Get content
├─ PUT  /api/home-page/1      Update content
├─ PATCH /api/home-page/1/publish  Publish
├─ GET  /api/platform-settings     Get settings
└─ PUT  /api/platform-settings     Update settings

Tools:
├─ Swagger UI: localhost:8000/docs
├─ Database: cd docker && docker-compose exec postgres psql && cd ..
└─ Logs: cd docker && docker-compose logs -f backend && cd ..
```

---

**تیار ہیں! اب جاؤ اور admin چلاؤ! 🎉**
