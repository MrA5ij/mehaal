from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

# Response Models
class ColorsSchema(BaseModel):
    primary: str
    background: str
    foreground: str
    muted: str
    surface: str

class TypographySchema(BaseModel):
    heading: str
    body: str
    weights: Dict[str, int]

class LogoSchema(BaseModel):
    icon: str
    wordmark: str
    lockup: str

class HeroSchema(BaseModel):
    layout: str
    visual_style: str
    background: str
    effects: Dict[str, Any]
    animation: Dict[str, Any]

class MotionSchema(BaseModel):
    spring: Dict[str, int]
    ease: str

class PlatformSettingsResponse(BaseModel):
    colors: ColorsSchema
    typography: TypographySchema
    logo: LogoSchema
    hero: HeroSchema
    motion: Dict[str, Any]

    class Config:
        from_attributes = True

# Update Models
class PlatformSettingsUpdate(BaseModel):
    # Colors
    primary_color: Optional[str] = None
    background_color: Optional[str] = None
    foreground_color: Optional[str] = None
    muted_color: Optional[str] = None
    surface_color: Optional[str] = None

    # Typography
    heading_font: Optional[str] = None
    body_font: Optional[str] = None
    font_weights: Optional[Dict[str, int]] = None

    # Logo
    logo_icon: Optional[str] = None
    logo_wordmark: Optional[str] = None
    logo_lockup: Optional[str] = None

    # Hero
    hero_layout: Optional[str] = None
    hero_visual_style: Optional[str] = None
    hero_background: Optional[str] = None
    hero_effects: Optional[Dict[str, Any]] = None
    hero_animation: Optional[Dict[str, Any]] = None

    # Motion
    motion_profile: Optional[Dict[str, Any]] = None

# Create Model
class PlatformSettingsCreate(BaseModel):
    primary_color: str = "#6366F1"
    background_color: str = "#FFFFFF"
    foreground_color: str = "#0F172A"
    muted_color: str = "#64748B"
    surface_color: str = "#F8FAFC"
    
    heading_font: str = "Cabinet Grotesk"
    body_font: str = "Inter"
    font_weights: Dict[str, int] = {"heading": 600, "body": 400, "bold": 700}
    
    logo_icon: str = "/assets/logo-icon.svg"
    logo_wordmark: str = "/assets/logo-wordmark.svg"
    logo_lockup: str = "/assets/logo-lockup.svg"
    
    hero_layout: str = "centered-display"
    hero_visual_style: str = "magnetic-field"
    hero_background: str = "gradient-mesh"
    hero_effects: Dict[str, Any] = {"blur": True, "glow": True, "noise": False}
    hero_animation: Dict[str, Any] = {"type": "fade-up", "duration": 800, "stagger": 100}
    
    motion_profile: Dict[str, Any] = {
        "spring": {"tension": 170, "friction": 26},
        "ease": "easeOutCubic"
    }
