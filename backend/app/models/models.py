from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

# 1. HOME PAGE
class HomePage(Base):
    __tablename__ = "home_pages"

    id = Column(Integer, primary_key=True, index=True)
    hero_title = Column(String(255), nullable=False)
    hero_subtitle = Column(Text, nullable=True)
    hero_cta_text = Column(String(100), nullable=True)
    hero_cta_url = Column(String(500), nullable=True)
    hero_media_id = Column(String(255), nullable=True)
    sections = Column(JSON, nullable=True, default={
        "feature_grid": [],
        "pricing_preview": [],
        "testimonials": [],
        "call_to_action": []
    })
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    seo_image = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

# 2. PRICING PAGE
class PricingPage(Base):
    __tablename__ = "pricing_pages"

    id = Column(Integer, primary_key=True, index=True)
    heading = Column(String(255), nullable=False)
    subheading = Column(Text, nullable=True)
    currency = Column(String(3), default="USD")
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    plans = relationship("PricingPlan", back_populates="page", cascade="all, delete-orphan")

class PricingPlan(Base):
    __tablename__ = "pricing_plans"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pricing_pages.id"), nullable=False)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    price_monthly = Column(Float, nullable=False)
    price_yearly = Column(Float, nullable=False)
    features = Column(JSON, default=[])
    limits = Column(JSON, default={})
    highlight = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    page = relationship("PricingPage", back_populates="plans")

# 3. FEATURES PAGE
class Feature(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    short_description = Column(String(500), nullable=True)
    long_description = Column(Text, nullable=True)
    icon_media_id = Column(String(255), nullable=True)
    order = Column(Integer, default=0)
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FeaturesPage(Base):
    __tablename__ = "features_pages"

    id = Column(Integer, primary_key=True, index=True)
    intro_text = Column(Text, nullable=True)
    feature_ids = Column(JSON, default=[])
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# 4. DOCS / KNOWLEDGE BASE
class DocCategory(Base):
    __tablename__ = "doc_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    articles = relationship("DocArticle", back_populates="category", cascade="all, delete-orphan")

class DocArticle(Base):
    __tablename__ = "doc_articles"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("doc_categories.id"), nullable=False)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    content = Column(Text, nullable=False)
    version = Column(Integer, default=1)
    related_docs = Column(JSON, default=[])
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("DocCategory", back_populates="articles")

# 5. LOGIN PAGE
class LoginPage(Base):
    __tablename__ = "login_pages"

    id = Column(Integer, primary_key=True, index=True)
    heading = Column(String(255), nullable=False)
    subheading = Column(Text, nullable=True)
    show_social_login = Column(Boolean, default=False)
    background_media_id = Column(String(255), nullable=True)
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# 6. SIGNUP PAGE
class SignupPage(Base):
    __tablename__ = "signup_pages"

    id = Column(Integer, primary_key=True, index=True)
    heading = Column(String(255), nullable=False)
    subheading = Column(Text, nullable=True)
    signup_fields = Column(JSON, default=[])
    show_social_signup = Column(Boolean, default=False)
    terms_required = Column(Boolean, default=True)
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# 7. LEGAL DOCUMENTS
class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20), nullable=False)  # 'tos' or 'privacy'
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    content = Column(Text, nullable=False)
    version = Column(Integer, default=1)
    effective_date = Column(DateTime, nullable=True)
    last_reviewed_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# 8. SITE SETTINGS
class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String(255), nullable=False, default="Mehaal")
    logo_media_id = Column(String(255), nullable=True)
    primary_color = Column(String(7), default="#000000")
    support_email = Column(String(255), nullable=True)
    footer_links = Column(JSON, default=[])
    social_links = Column(JSON, default={})
    default_seo_title = Column(String(255), nullable=True)
    default_seo_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# 9. MEDIA LIBRARY
class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)  # 'image', 'video', 'document'
    alt_text = Column(String(255), nullable=True)
    size = Column(Integer, nullable=True)  # in bytes
    uploaded_at = Column(DateTime, default=datetime.utcnow)
