from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import SiteSettings
from app.schemas.schemas import SiteSettingsCreate, SiteSettingsUpdate, SiteSettingsResponse
from app.database.database import get_db

router = APIRouter(
    prefix="/api/settings",
    tags=["settings"],
)

# Site Settings Routes
@router.get("/", response_model=SiteSettingsResponse)
async def get_site_settings(db: Session = Depends(get_db)):
    """Get site settings"""
    settings = db.query(SiteSettings).first()
    if not settings:
        # Create default settings if none exist
        settings = SiteSettings(site_name="Mehaal")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.post("/", response_model=SiteSettingsResponse, status_code=status.HTTP_201_CREATED)
async def create_site_settings(settings: SiteSettingsCreate, db: Session = Depends(get_db)):
    """Create site settings"""
    db_settings = SiteSettings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings

@router.put("/", response_model=SiteSettingsResponse)
async def update_site_settings(
    settings_update: SiteSettingsUpdate,
    db: Session = Depends(get_db)
):
    """Update site settings"""
    db_settings = db.query(SiteSettings).first()
    if not db_settings:
        db_settings = SiteSettings()
    
    update_data = settings_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_settings, key, value)
    
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings
