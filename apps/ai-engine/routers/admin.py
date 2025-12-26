from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from core.database import get_db

router = APIRouter()

@router.get("/admin/stats")
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    # Real DB Counts
    users = await db.execute(text("SELECT COUNT(*) FROM \"User\""))
    tenants = await db.execute(text("SELECT COUNT(*) FROM \"Tenant\""))
    return {
        "total_users": users.scalar(),
        "total_tenants": tenants.scalar(),
        "revenue": "2,450", # Mock revenue until Stripe is live
        "system_status": "Operational"
    }

@router.get("/admin/users")
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT id, email, role, credits FROM \"User\""))
    # Convert rows to dict
    return [{"id": row.id, "email": row.email, "role": row.role, "credits": row.credits} for row in result]
