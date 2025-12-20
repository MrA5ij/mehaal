from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.platform_settings import PlatformSettings
from app.models.platform_settings_history import PlatformSettingsHistory
from app.schemas.platform_settings import (
    PlatformSettingsResponse,
    PlatformSettingsUpdate,
    PlatformSettingsCreate
)
from app.database.database import get_db
from app.core.auth import founder_only

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

@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(founder_only)])
async def create_platform_settings(
    settings: PlatformSettingsCreate,
    db: Session = Depends(get_db),
    _: str = Depends(founder_only)
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

@router.put("", response_model=PlatformSettingsResponse, dependencies=[Depends(founder_only)])
async def update_platform_settings(
    settings: PlatformSettingsUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(founder_only)
):
    """Update platform settings (founder only)"""
    ps = db.query(PlatformSettings).first()
    
    if not ps:
        raise HTTPException(
            status_code=404,
            detail="Platform settings not found. Create first."
        )
    
    # Create history entry before updating
    history_entry = PlatformSettingsHistory(
        settings_id=ps.id,
        version=ps.version,
        primary_color=ps.primary_color,
        background_color=ps.background_color,
        foreground_color=ps.foreground_color,
        muted_color=ps.muted_color,
        surface_color=ps.surface_color,
        heading_font=ps.heading_font,
        body_font=ps.body_font,
        font_weights=ps.font_weights,
        logo_icon=ps.logo_icon,
        logo_wordmark=ps.logo_wordmark,
        logo_lockup=ps.logo_lockup,
        hero_layout=ps.hero_layout,
        hero_visual_style=ps.hero_visual_style,
        hero_background=ps.hero_background,
        hero_effects=ps.hero_effects,
        hero_animation=ps.hero_animation,
        motion_profile=ps.motion_profile,
    )
    db.add(history_entry)
    
    # Update settings and increment version
    update_data = settings.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ps, key, value)
    
    ps.version += 1
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

# Versioning and Rollback Endpoints
@router.get("/history/versions")
async def get_version_history(db: Session = Depends(get_db)):
    """Get complete version history"""
    ps = db.query(PlatformSettings).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    history = db.query(PlatformSettingsHistory).filter(
        PlatformSettingsHistory.settings_id == ps.id
    ).order_by(PlatformSettingsHistory.version.desc()).all()
    
    return {
        "current_version": ps.version,
        "total_versions": len(history) + 1,
        "history": [
            {
                "version": h.version,
                "created_at": h.created_at,
                "updated_at": h.updated_at
            }
            for h in history
        ]
    }


@router.post("/rollback/{version}", response_model=PlatformSettingsResponse, dependencies=[Depends(founder_only)])
async def rollback_to_version(
    version: int,
    db: Session = Depends(get_db),
    _: str = Depends(founder_only)
):
    """Rollback platform settings to a specific version"""
    ps = db.query(PlatformSettings).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    # Find the version in history
    history_entry = db.query(PlatformSettingsHistory).filter(
        PlatformSettingsHistory.settings_id == ps.id,
        PlatformSettingsHistory.version == version
    ).first()
    
    if not history_entry:
        raise HTTPException(
            status_code=404,
            detail=f"Version {version} not found in history"
        )
    
    # Save current state as new history entry
    current_history = PlatformSettingsHistory(
        settings_id=ps.id,
        version=ps.version,
        primary_color=ps.primary_color,
        background_color=ps.background_color,
        foreground_color=ps.foreground_color,
        muted_color=ps.muted_color,
        surface_color=ps.surface_color,
        heading_font=ps.heading_font,
        body_font=ps.body_font,
        font_weights=ps.font_weights,
        logo_icon=ps.logo_icon,
        logo_wordmark=ps.logo_wordmark,
        logo_lockup=ps.logo_lockup,
        hero_layout=ps.hero_layout,
        hero_visual_style=ps.hero_visual_style,
        hero_background=ps.hero_background,
        hero_effects=ps.hero_effects,
        hero_animation=ps.hero_animation,
        motion_profile=ps.motion_profile,
    )
    db.add(current_history)
    
    # Restore from history
    ps.primary_color = history_entry.primary_color
    ps.background_color = history_entry.background_color
    ps.foreground_color = history_entry.foreground_color
    ps.muted_color = history_entry.muted_color
    ps.surface_color = history_entry.surface_color
    ps.heading_font = history_entry.heading_font
    ps.body_font = history_entry.body_font
    ps.font_weights = history_entry.font_weights
    ps.logo_icon = history_entry.logo_icon
    ps.logo_wordmark = history_entry.logo_wordmark
    ps.logo_lockup = history_entry.logo_lockup
    ps.hero_layout = history_entry.hero_layout
    ps.hero_visual_style = history_entry.hero_visual_style
    ps.hero_background = history_entry.hero_background
    ps.hero_effects = history_entry.hero_effects
    ps.hero_animation = history_entry.hero_animation
    ps.motion_profile = history_entry.motion_profile
    ps.version += 1
    
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