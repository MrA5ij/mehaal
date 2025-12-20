"""Production database initialization script"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool, StaticPool
from app.models import Base

def init_production_db():
    """Initialize production database with optimizations"""
    
    database_url = os.getenv(
        "DATABASE_URL",
        "sqlite:///./test.db"
    )
    
    # Production engine without connection pooling (handled by nginx/load balancer)
    if database_url.startswith("sqlite"):
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
            echo=False,
        )
    else:
        engine = create_engine(
            database_url,
            poolclass=NullPool,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False,
        )
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create indexes for performance
    with engine.connect() as conn:
        # Home pages
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_home_pages_published 
            ON home_pages(is_published);
        """))
        
        # Pricing
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_pricing_plans_page_id 
            ON pricing_plans(page_id);
        """))
        
        # Docs
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_doc_articles_category_id 
            ON doc_articles(category_id);
        """))
        
        # Legal
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_legal_documents_type 
            ON legal_documents(type, is_active);
        """))
        
        # Features
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_features_order 
            ON features("order");
        """))
        
        # Media
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_media_type 
            ON media(file_type);
        """))
        
        # Platform Settings - Single row enforcement
        conn.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS one_platform_settings_only
            ON platform_settings ((1));
        """))
        
        # Insert default platform settings if not exists
        conn.execute(text("""
            INSERT INTO platform_settings (
                id,
                primary_color,
                background_color,
                foreground_color,
                muted_color,
                surface_color,
                heading_font,
                body_font,
                font_weights,
                logo_icon,
                logo_wordmark,
                logo_lockup,
                hero_layout,
                hero_visual_style,
                hero_background,
                hero_effects,
                hero_animation,
                motion_profile
            ) VALUES (
                '550e8400-e29b-41d4-a716-446655440000',
                '#6366F1',
                '#FFFFFF',
                '#0F172A',
                '#64748B',
                '#F8FAFC',
                'Cabinet Grotesk',
                'Inter',
                '{"heading": 600, "body": 400, "bold": 700}',
                '/assets/logo-icon.svg',
                '/assets/logo-wordmark.svg',
                '/assets/logo-lockup.svg',
                'centered-display',
                'magnetic-field',
                'gradient-mesh',
                '{"blur": true, "glow": true, "noise": false}',
                '{"type": "fade-up", "duration": 800, "stagger": 100}',
                '{"spring": {"tension": 170, "friction": 26}, "ease": "easeOutCubic"}'
            )
            ON CONFLICT DO NOTHING;
        """))
        
        conn.commit()
    
    print("✅ Database initialized successfully")
    print("✅ Indexes created for performance")
    print("✅ Platform settings initialized")
    
    engine.dispose()

if __name__ == "__main__":
    init_production_db()
