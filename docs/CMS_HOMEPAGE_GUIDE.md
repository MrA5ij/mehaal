# Home Page CMS Settings - Complete Guide

## 🎯 Overview

Landing Home Page CMS آپ یہ manage کر سکتے ہیں:
- Hero Section (Title, Subtitle, CTA button)
- Sections (Feature Grid, Pricing Preview, Testimonials, Call to Action)
- SEO Settings (Title, Description, Image)
- Publish/Unpublish

## 🔌 API Endpoints

### Base URL
- **Development:** `http://localhost:8000`
- **Production:** `https://yourdomain.com`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/home-page/` | Get home page data |
| `GET` | `/api/home-page/published` | Get published home page |
| `POST` | `/api/home-page/` | Create home page |
| `PUT` | `/api/home-page/{id}` | Update home page |
| `PATCH` | `/api/home-page/{id}/publish` | Publish home page |
| `DELETE` | `/api/home-page/{id}` | Delete home page |

## 📝 Data Structure

```json
{
  "id": 1,
  "hero_title": "Welcome to Mehaal",
  "hero_subtitle": "The best CMS platform for modern websites",
  "hero_cta_text": "Get Started",
  "hero_cta_url": "/signup",
  "hero_media_id": "hero-image-1.jpg",
  "sections": {
    "feature_grid": [
      {
        "id": "f1",
        "title": "Fast Performance",
        "description": "Lightning fast load times",
        "icon": "⚡"
      }
    ],
    "pricing_preview": [
      {
        "id": "p1",
        "plan": "Pro",
        "price": "$99/mo",
        "features": ["Unlimited pages", "Custom domain"]
      }
    ],
    "testimonials": [
      {
        "id": "t1",
        "name": "John Doe",
        "role": "CEO, Company",
        "content": "Best platform ever!",
        "avatar": "avatar.jpg"
      }
    ],
    "call_to_action": {
      "heading": "Ready to get started?",
      "description": "Join thousands of happy customers",
      "button_text": "Start Free Trial",
      "button_url": "/signup"
    }
  },
  "seo_title": "Mehaal - Modern CMS Platform",
  "seo_description": "Build amazing websites with Mehaal CMS",
  "seo_image": "og-image.jpg",
  "is_published": true,
  "created_at": "2025-12-20T10:00:00",
  "updated_at": "2025-12-20T10:00:00"
}
```

## 🛠️ Method 1: Using Swagger UI (Easiest)

### Step 1: Start Backend
```bash
cd docker
docker-compose up -d
cd ..
```

### Step 2: Open Swagger UI
Open browser: `http://localhost:8000/docs`

### Step 3: Create Home Page
1. Find **POST /api/home-page/** endpoint
2. Click "Try it out"
3. Enter data:

```json
{
  "hero_title": "Welcome to Mehaal",
  "hero_subtitle": "Build amazing websites with ease",
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

4. Click "Execute"
5. Check response (status 201)

### Step 4: Get Home Page
1. Find **GET /api/home-page/published**
2. Click "Try it out" → "Execute"
3. See your data

## 🖥️ Method 2: Using cURL/PowerShell

### Create Home Page
```bash
curl -X POST "http://localhost:8000/api/home-page/" \
  -H "Content-Type: application/json" \
  -d '{
    "hero_title": "Welcome to Mehaal",
    "hero_subtitle": "Build amazing websites",
    "hero_cta_text": "Get Started",
    "hero_cta_url": "/signup",
    "sections": {
      "feature_grid": [],
      "pricing_preview": [],
      "testimonials": [],
      "call_to_action": {}
    },
    "is_published": true
  }'
```

### PowerShell:
```powershell
$body = @{
    hero_title = "Welcome to Mehaal"
    hero_subtitle = "Build amazing websites"
    hero_cta_text = "Get Started"
    hero_cta_url = "/signup"
    sections = @{
        feature_grid = @()
        pricing_preview = @()
        testimonials = @()
        call_to_action = @{}
    }
    is_published = $true
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:8000/api/home-page/" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### Update Home Page
```powershell
$body = @{
    hero_title = "New Title"
    sections = @{
        feature_grid = @(
            @{
                id = "f1"
                title = "Fast"
                description = "Lightning speed"
                icon = "⚡"
            }
        )
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:8000/api/home-page/1" `
  -Method Put `
  -Body $body `
  -ContentType "application/json"
```

## 🎨 Method 3: Frontend Integration (React/TypeScript)

### Create API Service

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface HomePage {
  id: number;
  hero_title: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  hero_cta_url?: string;
  hero_media_id?: string;
  sections: {
    feature_grid: any[];
    pricing_preview: any[];
    testimonials: any[];
    call_to_action: any;
  };
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const homePageApi = {
  // Get published home page
  getPublished: async (): Promise<HomePage> => {
    const response = await fetch(`${API_BASE_URL}/api/home-page/published`);
    if (!response.ok) throw new Error('Failed to fetch home page');
    return response.json();
  },

  // Get all home pages
  getAll: async (): Promise<HomePage> => {
    const response = await fetch(`${API_BASE_URL}/api/home-page/`);
    if (!response.ok) throw new Error('Failed to fetch home page');
    return response.json();
  },

  // Create home page
  create: async (data: Partial<HomePage>): Promise<HomePage> => {
    const response = await fetch(`${API_BASE_URL}/api/home-page/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create home page');
    return response.json();
  },

  // Update home page
  update: async (id: number, data: Partial<HomePage>): Promise<HomePage> => {
    const response = await fetch(`${API_BASE_URL}/api/home-page/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update home page');
    return response.json();
  },

  // Publish home page
  publish: async (id: number): Promise<HomePage> => {
    const response = await fetch(`${API_BASE_URL}/api/home-page/${id}/publish`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to publish home page');
    return response.json();
  },
};
```

### Use in Component

```typescript
// src/pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { homePageApi, HomePage } from '../services/api';

export default function HomePage() {
  const [pageData, setPageData] = useState<HomePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await homePageApi.getPublished();
        setPageData(data);
      } catch (error) {
        console.error('Failed to load home page:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!pageData) return <div>No data found</div>;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>{pageData.hero_title}</h1>
        <p>{pageData.hero_subtitle}</p>
        <a href={pageData.hero_cta_url}>
          {pageData.hero_cta_text}
        </a>
      </section>

      {/* Feature Grid */}
      <section className="features">
        {pageData.sections.feature_grid.map((feature) => (
          <div key={feature.id}>
            <span>{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        {pageData.sections.testimonials.map((testimonial) => (
          <div key={testimonial.id}>
            <p>"{testimonial.content}"</p>
            <strong>{testimonial.name}</strong>
            <span>{testimonial.role}</span>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>{pageData.sections.call_to_action.heading}</h2>
        <p>{pageData.sections.call_to_action.description}</p>
        <a href={pageData.sections.call_to_action.button_url}>
          {pageData.sections.call_to_action.button_text}
        </a>
      </section>
    </div>
  );
}
```

## 🎛️ Method 4: Simple Admin Dashboard

میں نے آپ کے لیے ایک simple admin dashboard component بنا دوں:

See next file: `src/admin/HomePageEditor.tsx`

## 🔍 Testing

### 1. Check if backend is running
```bash
curl http://localhost:8000/health
```

### 2. Test API endpoint
```bash
curl http://localhost:8000/api/home-page/published
```

### 3. Check Swagger UI
Open: `http://localhost:8000/docs`

## 📊 Database View

```sql
-- View home page data in PostgreSQL
cd docker
docker-compose exec postgres psql -U mehaal_user mehaal_db
cd ..

SELECT id, hero_title, is_published, updated_at FROM home_pages;

-- Full details
SELECT * FROM home_pages WHERE id = 1;

-- JSON sections
SELECT sections FROM home_pages WHERE id = 1;
```

## 🚀 Quick Start Workflow

1. **Start Backend:**
   ```bash
   cd docker
   docker-compose up -d
   cd ..
   ```

2. **Open Swagger:** `http://localhost:8000/docs`

3. **Create Home Page** using POST endpoint

4. **Frontend integration** using API service

5. **View on website:** Your React app will fetch and display

## 💡 Best Practices

1. **Always validate data** before sending to API
2. **Handle errors** properly in frontend
3. **Use TypeScript types** for type safety
4. **Cache data** using React Query or SWR
5. **Add loading states** for better UX
6. **Test on Swagger** before frontend integration

## 🔐 Production Notes

- Add authentication middleware
- Rate limit API calls
- Validate user permissions
- Use environment variables for API URL
- Enable CORS properly
- Add request/response logging
