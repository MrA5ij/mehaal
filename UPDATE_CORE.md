# Core Platform Update Guide

This document outlines the complete implementation process for integrating the Platform Settings system with the Frontend, CMS, and Admin Dashboard. Follow these steps in order to enable dynamic branding, typography, and animation configuration.

---

## 4. Database Seed — Platform Settings (One-Time Setup)

**File:** `backend/seed/platform_settings_seed.py`

This script initializes the default platform configuration in the database. It should only run once during initial deployment.

```python
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.platform_settings import PlatformSettings

def seed():
    """Initialize platform settings with default configuration."""
    db: Session = SessionLocal()

    # Check if settings already exist
    exists = db.query(PlatformSettings).first()
    if exists:
        return

    # Create default platform settings
    ps = PlatformSettings(
        # Color palette
        primary_color="#6666FF",
        background_color="#000000",
        foreground_color="#FFFFFF",
        muted_color="#999999",
        surface_color="#0B0B0F",

        # Typography
        heading_font="Cabinet Grotesk",
        body_font="Cabinet Grotesk",
        font_weights=["300", "400", "600", "700"],

        # Brand assets
        logo_icon="/assets/brand/icon.svg",
        logo_wordmark="/assets/brand/wordmark.svg",
        logo_lockup="/assets/brand/lockup.svg",

        # Hero configuration
        hero_layout="centered-display",
        hero_visual_style="magnetic-field",
        hero_background="dark-glass",

        # Visual effects
        hero_effects={
            "glow": True,
            "noise": True,
            "depth": True
        },

        # Animation presets
        hero_animation={
            "entry": "slow-fade-scale",
            "idle": "subtle-float",
            "cta": "soft-pulse"
        },

        # Motion profile
        motion_profile={
            "intensity": "low",
            "easing": "easeOut",
            "duration": "slow"
        }
    )

    db.add(ps)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed()
```

**Execution:**

```bash
python backend/seed/platform_settings_seed.py
```

**Note:** This script will only execute once. Subsequent runs will detect existing settings and exit gracefully.

## 5. Frontend — Data Wiring (Platform + CMS)

**File:** `src/lib/api.ts`

These API functions retrieve the platform configuration and homepage CMS content from the backend. Both requests include cache-busting headers to ensure fresh data on each request.

```typescript
export async function getPlatformSettings() {
  const res = await fetch("/api/platform-settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch platform settings");
  return res.json();
}

export async function getHomeCMS() {
  const res = await fetch("/api/cms/home", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch home page content");
  return res.json();
}
```

**Usage:** These functions are consumed by the main landing page component to populate both styling and content dynamically.

## 6. Landing Page — Final Integration (Production)

**File:** `src/app/page.tsx`

This is the main landing page component that integrates both platform settings and CMS content. Data is fetched concurrently for optimal performance.

```typescript
import Hero from "@/components/Hero";
import { getPlatformSettings, getHomeCMS } from "@/lib/api";

export default async function Page() {
  // Fetch platform configuration and content in parallel
  const [platform, content] = await Promise.all([
    getPlatformSettings(),
    getHomeCMS()
  ]);

  return <Hero platform={platform} content={content} />;
}
```

**Benefits:**
- Parallel data fetching reduces load time
- Clean separation of concerns (layout vs. components)
- Server-side rendering for optimal SEO and performance

## 7. Motion Engine — Animation Presets (React Spring)

**File:** `src/theme/motion.ts`

This module defines reusable animation presets that are referenced in the platform settings. Each preset is configured with specific easing and spring physics parameters.

```typescript
export const motionPresets = {
  "slow-fade-scale": {
    from: { opacity: 0, transform: "scale(0.98)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 80, friction: 20 }
  },
  "subtle-float": {
    loop: true,
    from: { transform: "translateY(0px)" },
    to: { transform: "translateY(-6px)" },
    config: { duration: 4000 }
  },
  "soft-pulse": {
    loop: true,
    from: { opacity: 0.9 },
    to: { opacity: 1 },
    config: { duration: 1800 }
  }
};
```

**Configuration:**
- `slow-fade-scale` — Entry animation with fade and scale effect
- `subtle-float` — Continuous subtle vertical movement
- `soft-pulse` — Gentle opacity pulsing effect

These presets are dynamically applied based on the platform settings configuration.

## 8. Hero Component — Motion Binding (Production)

**File:** `src/components/Hero.tsx`

The Hero component is the core landing page element. It applies platform-specific styling, typography, and animations to create a fully branded, dynamic experience.

```typescript
import { animated, useSpring } from "@react-spring/web";
import { motionPresets } from "@/theme/motion";

export default function Hero({ platform, content }: any) {
  // Apply entry animation from platform settings
  const entry = useSpring(motionPresets[platform.hero.animation.entry]);

  return (
    <animated.section
      style={{
        ...entry,
        backgroundColor: platform.colors.background,
        color: platform.colors.foreground,
        fontFamily: platform.typography.heading
      }}
      className="min-h-screen flex flex-col items-center justify-center text-center"
    >
      <h1 className="text-6xl font-semibold mb-6">{content.headline}</h1>
      <p className="max-w-2xl text-lg opacity-70 mb-10">
        {content.subheadline}
      </p>
      <div className="flex gap-4">
        <button
          style={{ backgroundColor: platform.colors.primary }}
          className="px-6 py-3 rounded-lg"
        >
          {content.cta_primary}
        </button>
        <button className="px-6 py-3 border rounded-lg">
          {content.cta_secondary}
        </button>
      </div>
    </animated.section>
  );
}
```

**Features:**
- Dynamically applies platform colors and typography
- Uses motion presets for smooth entry animations
- Renders CMS content (headline, subheadline, CTAs)
- Fully responsive layout
- Accessible button components

## 9. Admin Dashboard — Settings Update API

**File:** `backend/app/routes/platform_settings.py`

The PUT endpoint allows administrators to update platform settings dynamically. All changes are persisted to the database immediately.

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.platform_settings import PlatformSettings
from app.schemas.platform_settings import PlatformSettingsOut

router = APIRouter(prefix="/api/platform-settings", tags=["platform"])

@router.put("", response_model=PlatformSettingsOut)
def update_platform_settings(payload: dict, db: Session = Depends(get_db)):
    """
    Update platform settings.
    
    Args:
        payload: Dictionary of settings to update
        db: Database session
        
    Returns:
        Updated platform settings object
    """
    ps = db.query(PlatformSettings).first()
    
    # Update all provided fields
    for key, value in payload.items():
        setattr(ps, key, value)
    
    db.commit()
    db.refresh(ps)
    
    return ps
```

**Frontend Integration:**

```typescript
// src/admin/PlatformSettingsAdmin.tsx
async function savePlatformSettings(settings: any) {
  const response = await fetch("/api/platform-settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  });
  
  if (!response.ok) throw new Error("Failed to save settings");
  return response.json();
}
```

**Note:** Changes made through the admin dashboard are immediately reflected on the live website.