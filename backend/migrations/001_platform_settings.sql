-- Platform Settings Table
-- Single row table for founder-level global configuration

CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- BRAND COLORS
  primary_color       VARCHAR(7)  NOT NULL DEFAULT '#6366F1',
  background_color    VARCHAR(7)  NOT NULL DEFAULT '#FFFFFF',
  foreground_color    VARCHAR(7)  NOT NULL DEFAULT '#0F172A',
  muted_color         VARCHAR(7)  NOT NULL DEFAULT '#64748B',
  surface_color       VARCHAR(7)  NOT NULL DEFAULT '#F8FAFC',

  -- TYPOGRAPHY
  heading_font        VARCHAR(128) NOT NULL DEFAULT 'Cabinet Grotesk',
  body_font           VARCHAR(128) NOT NULL DEFAULT 'Inter',
  font_weights        JSONB        NOT NULL DEFAULT '{"heading": 600, "body": 400, "bold": 700}',

  -- LOGO ASSETS (STATIC FILE PATHS)
  logo_icon           TEXT NOT NULL DEFAULT '/assets/logo-icon.svg',
  logo_wordmark       TEXT NOT NULL DEFAULT '/assets/logo-wordmark.svg',
  logo_lockup         TEXT NOT NULL DEFAULT '/assets/logo-lockup.svg',

  -- HERO SYSTEM (CORE)
  hero_layout          VARCHAR(64) NOT NULL DEFAULT 'centered-display',
  hero_visual_style    VARCHAR(64) NOT NULL DEFAULT 'magnetic-field',
  hero_background      VARCHAR(64) NOT NULL DEFAULT 'gradient-mesh',

  hero_effects         JSONB NOT NULL DEFAULT '{"blur": true, "glow": true, "noise": false}',
  hero_animation       JSONB NOT NULL DEFAULT '{"type": "fade-up", "duration": 800, "stagger": 100}',

  -- MOTION
  motion_profile       JSONB NOT NULL DEFAULT '{"spring": {"tension": 170, "friction": 26}, "ease": "easeOutCubic"}',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SINGLE ROW ENFORCEMENT
CREATE UNIQUE INDEX IF NOT EXISTS one_platform_settings_only
ON platform_settings ((1));

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_platform_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER platform_settings_updated_at
BEFORE UPDATE ON platform_settings
FOR EACH ROW
EXECUTE FUNCTION update_platform_settings_timestamp();

-- Insert default settings if table is empty
INSERT INTO platform_settings (
  primary_color,
  background_color,
  foreground_color,
  muted_color,
  surface_color,
  heading_font,
  body_font
) VALUES (
  '#6366F1',
  '#FFFFFF',
  '#0F172A',
  '#64748B',
  '#F8FAFC',
  'Cabinet Grotesk',
  'Inter'
)
ON CONFLICT DO NOTHING;
