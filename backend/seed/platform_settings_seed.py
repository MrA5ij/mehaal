from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine
from app.models.platform_settings import PlatformSettings
from app.models import Base

# Create tables if not exist
Base.metadata.create_all(bind=engine)

def seed():
    db: Session = SessionLocal()
    
    exists = db.query(PlatformSettings).first()
    if exists:
        print("⚠️  Platform settings already exist. Skipping seed.")
        db.close()
        return
    
    ps = PlatformSettings(
        primary_color="#6666FF",
        background_color="#000000",
        foreground_color="#FFFFFF",
        muted_color="#999999",
        surface_color="#0B0B0F",
        
        heading_font="Cabinet Grotesk",
        body_font="Cabinet Grotesk",
        font_weights=["300", "400", "600", "700"],
        
        logo_icon="/assets/brand/icon.svg",
        logo_wordmark="/assets/brand/wordmark.svg",
        logo_lockup="/assets/brand/lockup.svg",
        
        hero_layout="centered-display",
        hero_visual_style="magnetic-field",
        hero_background="dark-glass",
        
        hero_effects={
            "glow": True,
            "noise": True,
            "depth": True
        },
        hero_animation={
            "entry": "slow-fade-scale",
            "idle": "subtle-float",
            "cta": "soft-pulse"
        },
        motion_profile={
            "intensity": "low",
            "easing": "easeOut",
            "duration": "slow"
        }
    )
    
    db.add(ps)
    db.commit()
    print("✅ Platform settings seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed()
