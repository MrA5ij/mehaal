from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, Boolean
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class HomePage(Base):
    __tablename__ = "home_pages"

    id = Column(Integer, primary_key=True, index=True)
    
    # Hero Section
    hero_title = Column(String(255), nullable=False)
    hero_subtitle = Column(Text, nullable=True)
    hero_cta_text = Column(String(100), nullable=True)
    hero_cta_url = Column(String(500), nullable=True)
    hero_media_id = Column(String(255), nullable=True)
    
    # Sections (Blocks)
    sections = Column(JSON, nullable=True, default={
        "feature_grid": [],
        "pricing_preview": [],
        "testimonials": [],
        "call_to_action": []
    })
    
    # SEO
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    seo_image = Column(String(500), nullable=True)
    
    # Status
    is_published = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    class Config:
        from_attributes = True
