# CMS BACKEND – FASTAPI (PRODUCTION‑READY)
# This file assumes:
# - SQLAlchemy async setup already exists
# - Auth dependency get_current_admin()
# - Database session dependency get_db()

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from uuid import uuid4
from datetime import datetime
import os
import json

from app.db import get_db
from app.auth import get_current_admin
from app.models.cms import CMSPage, CMSNavigation, BrandAsset

router = APIRouter()

UPLOAD_ROOT = "/app/uploads/brand"
os.makedirs(UPLOAD_ROOT, exist_ok=True)

# -------------------------------------------------------------------
# PAGES
# -------------------------------------------------------------------

@router.get("/cms/pages/{slug}")
async def get_public_page(slug: str, db: AsyncSession = Depends(get_db)):
    q = select(CMSPage).where(CMSPage.slug == slug, CMSPage.status == "published")
    res = await db.execute(q)
    page = res.scalar_one_or_none()
    if not page:
        raise HTTPException(404, "Page not found")
    return {
        "slug": page.slug,
        "title": page.title,
        "content": page.content,
    }


@router.get("/admin/pages")
async def list_pages(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    q = select(CMSPage)
    res = await db.execute(q)
    return res.scalars().all()


@router.post("/admin/pages")
async def create_or_update_page(
    slug: str,
    title: str,
    content: dict,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    q = select(CMSPage).where(CMSPage.slug == slug)
    res = await db.execute(q)
    page = res.scalar_one_or_none()

    if page:
        page.title = title
        page.content = content
        page.updated_at = datetime.utcnow()
    else:
        page = CMSPage(
            id=uuid4(),
            slug=slug,
            title=title,
            content=content,
            status="draft",
        )
        db.add(page)

    await db.commit()
    return {"status": "saved", "slug": slug}


@router.post("/admin/pages/publish/{slug}")
async def publish_page(
    slug: str,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    q = update(CMSPage).where(CMSPage.slug == slug).values(
        status="published", updated_at=datetime.utcnow()
    )
    await db.execute(q)
    await db.commit()
    return {"status": "published"}

# -------------------------------------------------------------------
# NAVIGATION
# -------------------------------------------------------------------

@router.get("/cms/navigation")
async def get_navigation(db: AsyncSession = Depends(get_db)):
    q = select(CMSNavigation).order_by(CMSNavigation.position)
    res = await db.execute(q)
    return res.scalars().all()


@router.post("/admin/navigation")
async def set_navigation(
    items: list[dict],
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    await db.execute("DELETE FROM cms_navigation")
    for i, item in enumerate(items):
        db.add(
            CMSNavigation(
                id=uuid4(),
                label=item["label"],
                slug=item["slug"],
                position=i,
            )
        )
    await db.commit()
    return {"status": "navigation_updated"}

# -------------------------------------------------------------------
# BRAND / LOGO
# -------------------------------------------------------------------

@router.post("/admin/brand/logo")
async def upload_logo(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    if not file.filename.lower().endswith((".svg", ".png", ".jpg")):
        raise HTTPException(400, "Invalid file type")

    path = os.path.join(UPLOAD_ROOT, file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())

    q = select(BrandAsset).where(BrandAsset.key == "logo_main")
    res = await db.execute(q)
    asset = res.scalar_one_or_none()

    if asset:
        asset.file_path = path
        asset.updated_at = datetime.utcnow()
    else:
        db.add(BrandAsset(key="logo_main", file_path=path))

    await db.commit()
    return {"status": "logo_updated", "path": path}
