from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from core.database import get_db
from pydantic import BaseModel
from typing import Any, Dict
import json

router = APIRouter()

# Schema for updating content
class ConfigUpdate(BaseModel):
    key: str
    value: Dict[str, Any]

@router.get("/cms/config/{key}")
async def get_site_config(key: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT value FROM \"SiteConfig\" WHERE key = :key"), {"key": key})
    row = result.fetchone()
    
    if not row:
        # Default Fallback Data (Agar DB khali ho to ye return karo)
        default_data = {
            "title_start": "Control SaaS with",
            "title_gradient": "Voice & 3D Gestures",
            "subtitle": "The industry standard platform powered by Database CMS."
        }
        return default_data
        
    return row.value

@router.post("/cms/config")
async def update_site_config(config: ConfigUpdate, db: AsyncSession = Depends(get_db)):
    # Upsert Logic (Insert or Update)
    # Note: Postgres JSONB requires careful handling, we stick to simple JSON replace
    value_json = json.dumps(config.value)
    
    # Check if exists
    exists = await db.execute(text("SELECT 1 FROM \"SiteConfig\" WHERE key = :key"), {"key": config.key})
    
    if exists.fetchone():
        await db.execute(
            text("UPDATE \"SiteConfig\" SET value = :val, \"updatedAt\" = NOW() WHERE key = :key"),
            {"val": value_json, "key": config.key}
        )
    else:
        await db.execute(
            text("INSERT INTO \"SiteConfig\" (key, value, \"updatedAt\") VALUES (:key, :val, NOW())"),
            {"key": config.key, "val": value_json}
        )
        
    await db.commit()
    return {"status": "success", "message": "Website content updated successfully"}
