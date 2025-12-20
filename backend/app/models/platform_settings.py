from sqlalchemy import Column, String, JSON, DateTime, Integer, text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.models.models import Base

class PlatformSettings(Base):
    __tablename__ = "platform_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Brand Colors
    primary_color = Column(String(7), nullable=False, default="#6366F1")
    background_color = Column(String(7), nullable=False, default="#FFFFFF")
    foreground_color = Column(String(7), nullable=False, default="#0F172A")
    muted_color = Column(String(7), nullable=False, default="#64748B")
    surface_color = Column(String(7), nullable=False, default="#F8FAFC")

    # Typography
    heading_font = Column(String(128), nullable=False, default="Cabinet Grotesk")
    body_font = Column(String(128), nullable=False, default="Inter")
    font_weights = Column(JSON, nullable=False, default={"heading": 600, "body": 400, "bold": 700})

    # Logo Assets
    logo_icon = Column(String, nullable=False, default="/assets/logo-icon.svg")
    logo_wordmark = Column(String, nullable=False, default="/assets/logo-wordmark.svg")
    logo_lockup = Column(String, nullable=False, default="/assets/logo-lockup.svg")

    # Hero System
    hero_layout = Column(String(64), nullable=False, default="centered-display")
    hero_visual_style = Column(String(64), nullable=False, default="magnetic-field")
    hero_background = Column(String(64), nullable=False, default="gradient-mesh")
    
    hero_effects = Column(JSON, nullable=False, default={"blur": True, "glow": True, "noise": False})
    hero_animation = Column(JSON, nullable=False, default={"type": "fade-up", "duration": 800, "stagger": 100})

    # Motion Profile
    motion_profile = Column(JSON, nullable=False, default={"spring": {"tension": 170, "friction": 26}, "ease": "easeOutCubic"})

    # Versioning & Rollback
    version = Column(Integer, default=1, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class Config:
        from_attributes = True
