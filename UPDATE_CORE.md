1️⃣ platform_settings — DB SCHEMA (PostgreSQL)

File: backend/migrations/001_platform_settings.sql

CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- BRAND COLORS
  primary_color       VARCHAR(7)  NOT NULL,
  background_color    VARCHAR(7)  NOT NULL,
  foreground_color    VARCHAR(7)  NOT NULL,
  muted_color         VARCHAR(7)  NOT NULL,
  surface_color       VARCHAR(7)  NOT NULL,

  -- TYPOGRAPHY
  heading_font        VARCHAR(128) NOT NULL,
  body_font           VARCHAR(128) NOT NULL,
  font_weights        JSONB        NOT NULL,

  -- LOGO ASSETS (STATIC FILE PATHS)
  logo_icon           TEXT NOT NULL,
  logo_wordmark       TEXT NOT NULL,
  logo_lockup         TEXT NOT NULL,

  -- HERO SYSTEM (CORE)
  hero_layout          VARCHAR(64) NOT NULL,
  hero_visual_style    VARCHAR(64) NOT NULL,
  hero_background      VARCHAR(64) NOT NULL,

  hero_effects         JSONB NOT NULL,
  hero_animation       JSONB NOT NULL,

  -- MOTION
  motion_profile       JSONB NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SINGLE ROW ENFORCEMENT
CREATE UNIQUE INDEX one_platform_settings_only
ON platform_settings ((1));


Rule: table main sirf aik row hogi.
yeh founder-level global config hai.

2️⃣ FastAPI — PLATFORM SETTINGS API (PRODUCTION)
backend/models/platform_settings.py
from sqlalchemy import Column, String, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base
import uuid

class PlatformSettings(Base):
    __tablename__ = "platform_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    primary_color = Column(String)
    background_color = Column(String)
    foreground_color = Column(String)
    muted_color = Column(String)
    surface_color = Column(String)

    heading_font = Column(String)
    body_font = Column(String)
    font_weights = Column(JSON)

    logo_icon = Column(String)
    logo_wordmark = Column(String)
    logo_lockup = Column(String)

    hero_layout = Column(String)
    hero_visual_style = Column(String)
    hero_background = Column(String)

    hero_effects = Column(JSON)
    hero_animation = Column(JSON)

    motion_profile = Column(JSON)

backend/schemas/platform_settings.py
from pydantic import BaseModel
from typing import Dict, Any

class PlatformSettingsOut(BaseModel):
    colors: Dict[str, str]
    typography: Dict[str, Any]
    logo: Dict[str, str]
    hero: Dict[str, Any]
    motion: Dict[str, Any]

backend/routes/platform_settings.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.platform_settings import PlatformSettings
from app.schemas.platform_settings import PlatformSettingsOut

router = APIRouter(prefix="/platform-settings", tags=["Platform Settings"])

@router.get("", response_model=PlatformSettingsOut)
def get_platform_settings(db: Session = Depends(get_db)):
    ps = db.query(PlatformSettings).first()

    return {
        "colors": {
            "primary": ps.primary_color,
            "background": ps.background_color,
            "foreground": ps.foreground_color,
            "muted": ps.muted_color,
            "surface": ps.surface_color
        },
        "typography": {
            "heading": ps.heading_font,
            "body": ps.body_font,
            "weights": ps.font_weights
        },
        "logo": {
            "icon": ps.logo_icon,
            "wordmark": ps.logo_wordmark,
            "lockup": ps.logo_lockup
        },
        "hero": {
            "layout": ps.hero_layout,
            "visual_style": ps.hero_visual_style,
            "background": ps.hero_background,
            "effects": ps.hero_effects,
            "animation": ps.hero_animation
        },
        "motion": ps.motion_profile
    }


Register in main.py:

app.include_router(platform_settings.router)

3️⃣ Hero.tsx — PLATFORM SETTINGS + CMS RENDER

File: frontend/components/Hero.tsx

type PlatformSettings = {
  colors: any;
  typography: any;
  logo: any;
  hero: any;
  motion: any;
};

type HeroCMS = {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
};

export default function Hero({
  platform,
  content,
}: {
  platform: PlatformSettings;
  content: HeroCMS;
}) {
  return (
    <section
      style={{
        backgroundColor: platform.colors.background,
        color: platform.colors.foreground,
        fontFamily: platform.typography.heading,
      }}
      className="min-h-screen flex flex-col items-center justify-center text-center"
    >
      <h1 className="text-6xl font-semibold mb-6">
        {content.headline}
      </h1>

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
    </section>
  );
}

4️⃣ FOUNDER SETTINGS — ADMIN UI (REAL, NOT DEMO)

File: frontend/admin/PlatformSettings.tsx

export default function PlatformSettingsAdmin() {
  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-semibold mb-8">
        Platform Settings (Founder)
      </h1>

      <section className="space-y-6">
        <h2 className="text-xl font-medium">Brand Colors</h2>
        <input type="color" />
        <input type="color" />
      </section>

      <section className="space-y-6 mt-10">
        <h2 className="text-xl font-medium">Typography</h2>
        <select>
          <option>Cabinet Grotesk</option>
        </select>
      </section>

      <section className="space-y-6 mt-10">
        <h2 className="text-xl font-medium">Hero System</h2>
        <select>
          <option>centered-display</option>
        </select>
        <select>
          <option>magnetic-field</option>
        </select>
      </section>

      <button className="mt-10 px-6 py-3 bg-black text-white">
        Save Platform Settings
      </button>
    </div>
  );
}


Access rule:
/admin/platform-settings
Founder only. No CMS editors.