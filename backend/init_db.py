"""Production database initialization script"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool
from app.models import Base

def init_production_db():
    """Initialize production database with optimizations"""
    
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql://mehaal_user:mehaal_password@postgres:5432/mehaal_db"
    )
    
    # Production engine without connection pooling (handled by nginx/load balancer)
    engine = create_engine(
        database_url,
        poolclass=NullPool,
        echo=False,
    )
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create indexes for performance
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_home_pages_published 
            ON home_pages(is_published);
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_pricing_plans_page_id 
            ON pricing_plans(page_id);
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_doc_articles_category_id 
            ON doc_articles(category_id);
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_legal_documents_type 
            ON legal_documents(type, is_active);
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_features_order 
            ON features(order);
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_media_type 
            ON media(file_type);
        """))
        
        conn.commit()
    
    print("✅ Database initialized successfully")
    print("✅ Indexes created for performance")
    
    engine.dispose()

if __name__ == "__main__":
    init_production_db()
