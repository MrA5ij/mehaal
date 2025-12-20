from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import PricingPage, PricingPlan
from app.schemas.schemas import PricingPageCreate, PricingPageUpdate, PricingPageResponse, PricingPlanCreate, PricingPlanUpdate, PricingPlanResponse
from app.database.database import get_db

router = APIRouter(
    prefix="/api/pricing",
    tags=["pricing"],
)

# Pricing Page Routes
@router.get("/", response_model=PricingPageResponse)
async def get_pricing_page(db: Session = Depends(get_db)):
    """Get pricing page"""
    pricing_page = db.query(PricingPage).first()
    if not pricing_page:
        raise HTTPException(status_code=404, detail="Pricing page not found")
    return pricing_page

@router.get("/published", response_model=PricingPageResponse)
async def get_published_pricing_page(db: Session = Depends(get_db)):
    """Get published pricing page"""
    pricing_page = db.query(PricingPage).filter(PricingPage.is_published == True).first()
    if not pricing_page:
        raise HTTPException(status_code=404, detail="Published pricing page not found")
    return pricing_page

@router.post("/", response_model=PricingPageResponse, status_code=status.HTTP_201_CREATED)
async def create_pricing_page(pricing_page: PricingPageCreate, db: Session = Depends(get_db)):
    """Create pricing page"""
    db_pricing_page = PricingPage(
        heading=pricing_page.heading,
        subheading=pricing_page.subheading,
        currency=pricing_page.currency,
        seo_title=pricing_page.seo_title,
        seo_description=pricing_page.seo_description,
        is_published=pricing_page.is_published,
    )
    
    if pricing_page.plans:
        for plan in pricing_page.plans:
            db_plan = PricingPlan(**plan.dict())
            db_pricing_page.plans.append(db_plan)
    
    db.add(db_pricing_page)
    db.commit()
    db.refresh(db_pricing_page)
    return db_pricing_page

@router.put("/{page_id}", response_model=PricingPageResponse)
async def update_pricing_page(
    page_id: int,
    pricing_page_update: PricingPageUpdate,
    db: Session = Depends(get_db)
):
    """Update pricing page"""
    db_pricing_page = db.query(PricingPage).filter(PricingPage.id == page_id).first()
    if not db_pricing_page:
        raise HTTPException(status_code=404, detail="Pricing page not found")
    
    update_data = pricing_page_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_pricing_page, key, value)
    
    db.add(db_pricing_page)
    db.commit()
    db.refresh(db_pricing_page)
    return db_pricing_page

@router.patch("/{page_id}/publish", response_model=PricingPageResponse)
async def publish_pricing_page(page_id: int, db: Session = Depends(get_db)):
    """Publish pricing page"""
    db_pricing_page = db.query(PricingPage).filter(PricingPage.id == page_id).first()
    if not db_pricing_page:
        raise HTTPException(status_code=404, detail="Pricing page not found")
    
    db_pricing_page.is_published = True
    db.add(db_pricing_page)
    db.commit()
    db.refresh(db_pricing_page)
    return db_pricing_page

# Pricing Plan Routes
@router.post("/{page_id}/plans", response_model=PricingPlanResponse, status_code=status.HTTP_201_CREATED)
async def create_pricing_plan(
    page_id: int,
    plan: PricingPlanCreate,
    db: Session = Depends(get_db)
):
    """Create pricing plan"""
    pricing_page = db.query(PricingPage).filter(PricingPage.id == page_id).first()
    if not pricing_page:
        raise HTTPException(status_code=404, detail="Pricing page not found")
    
    db_plan = PricingPlan(**plan.dict(), page_id=page_id)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.get("/plans/{plan_id}", response_model=PricingPlanResponse)
async def get_pricing_plan(plan_id: int, db: Session = Depends(get_db)):
    """Get pricing plan"""
    db_plan = db.query(PricingPlan).filter(PricingPlan.id == plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Pricing plan not found")
    return db_plan

@router.put("/plans/{plan_id}", response_model=PricingPlanResponse)
async def update_pricing_plan(
    plan_id: int,
    plan_update: PricingPlanUpdate,
    db: Session = Depends(get_db)
):
    """Update pricing plan"""
    db_plan = db.query(PricingPlan).filter(PricingPlan.id == plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Pricing plan not found")
    
    update_data = plan_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_plan, key, value)
    
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.delete("/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pricing_plan(plan_id: int, db: Session = Depends(get_db)):
    """Delete pricing plan"""
    db_plan = db.query(PricingPlan).filter(PricingPlan.id == plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Pricing plan not found")
    
    db.delete(db_plan)
    db.commit()
