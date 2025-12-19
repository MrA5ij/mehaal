from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.platform_settings import PlatformSettings
from app.schemas.platform_settings import (
    PlatformSettingsResponse,
    PlatformSettingsUpdate,
    PlatformSettingsCreate
)
from app.database.database import get_db

router = APIRouter(
    prefix="/api/platform-settings",
    tags=["platform-settings"],
)

@router.get("", response_model=PlatformSettingsResponse)
async def get_platform_settings(db: Session = Depends(get_db)):
    """Get platform settings (public endpoint)"""
    ps = db.query(PlatformSettings).first()
    
    if not ps:
        raise HTTPException(
            status_code=404,
            detail="Platform settings not found. Please initialize first."
        )
    
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

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_platform_settings(
    settings: PlatformSettingsCreate,
    db: Session = Depends(get_db)
):
    """Create platform settings (founder only)"""
    # Check if settings already exist
    existing = db.query(PlatformSettings).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Platform settings already exist. Use PUT to update."
        )
    
    ps = PlatformSettings(**settings.dict())
    db.add(ps)
    db.commit()
    db.refresh(ps)
    
    return {"message": "Platform settings created successfully", "id": str(ps.id)}

@router.put("", response_model=PlatformSettingsResponse)
async def update_platform_settings(
    settings: PlatformSettingsUpdate,
    db: Session = Depends(get_db)
):
    """Update platform settings (founder only)"""
    ps = db.query(PlatformSettings).first()
    
    if not ps:
        raise HTTPException(
            status_code=404,
            detail="Platform settings not found. Create first."
        )
    
    update_data = settings.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ps, key, value)
    
    db.add(ps)
    db.commit()
    db.refresh(ps)
    
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

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def reset_platform_settings(db: Session = Depends(get_db)):
    """Reset platform settings to defaults (founder only)"""
    ps = db.query(PlatformSettings).first()
    if ps:
        db.delete(ps)
        db.commit()
    return None

# Additional endpoints for specific sections
@router.patch("/colors")
async def update_colors(
    colors: dict,
    db: Session = Depends(get_db)
):
    """Update only colors"""
    ps = db.query(PlatformSettings).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    for key, value in colors.items():
        if hasattr(ps, f"{key}_color"):
            setattr(ps, f"{key}_color", value)
    
    db.commit()
    return {"message": "Colors updated successfully"}

@router.patch("/typography")
async def update_typography(
    typography: dict,
    db: Session = Depends(get_db)
):
    """Update only typography"""
    ps = db.query(PlatformSettings).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    if "heading" in typography:
        ps.heading_font = typography["heading"]
    if "body" in typography:
        ps.body_font = typography["body"]
    if "weights" in typography:
        ps.font_weights = typography["weights"]
    
    db.commit()
    return {"message": "Typography updated successfully"}

@router.patch("/hero")
async def update_hero(
    hero: dict,
    db: Session = Depends(get_db)
):
    """Update only hero settings"""
    ps = db.query(PlatformSettings).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    if "layout" in hero:
        ps.hero_layout = hero["layout"]
    if "visual_style" in hero:
        ps.hero_visual_style = hero["visual_style"]
    if "background" in hero:
        ps.hero_background = hero["background"]
    if "effects" in hero:
        ps.hero_effects = hero["effects"]
    if "animation" in hero:
        ps.hero_animation = hero["animation"]
    
    db.commit()
    return {"message": "Hero settings updated successfully"}
