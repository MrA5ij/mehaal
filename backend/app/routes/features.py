from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import Feature, FeaturesPage
from app.schemas.schemas import FeatureCreate, FeatureUpdate, FeatureResponse, FeaturesPageCreate, FeaturesPageUpdate, FeaturesPageResponse
from app.database.database import get_db

router = APIRouter(
    prefix="/api/features",
    tags=["features"],
)

# Feature Routes
@router.get("/list", response_model=list[FeatureResponse])
async def list_features(db: Session = Depends(get_db)):
    """List all features"""
    features = db.query(Feature).order_by(Feature.order).all()
    return features

@router.post("/", response_model=FeatureResponse, status_code=status.HTTP_201_CREATED)
async def create_feature(feature: FeatureCreate, db: Session = Depends(get_db)):
    """Create feature"""
    db_feature = Feature(**feature.dict())
    db.add(db_feature)
    db.commit()
    db.refresh(db_feature)
    return db_feature

@router.get("/{feature_id}", response_model=FeatureResponse)
async def get_feature(feature_id: int, db: Session = Depends(get_db)):
    """Get feature"""
    db_feature = db.query(Feature).filter(Feature.id == feature_id).first()
    if not db_feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return db_feature

@router.put("/{feature_id}", response_model=FeatureResponse)
async def update_feature(
    feature_id: int,
    feature_update: FeatureUpdate,
    db: Session = Depends(get_db)
):
    """Update feature"""
    db_feature = db.query(Feature).filter(Feature.id == feature_id).first()
    if not db_feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    
    update_data = feature_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_feature, key, value)
    
    db.add(db_feature)
    db.commit()
    db.refresh(db_feature)
    return db_feature

@router.delete("/{feature_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feature(feature_id: int, db: Session = Depends(get_db)):
    """Delete feature"""
    db_feature = db.query(Feature).filter(Feature.id == feature_id).first()
    if not db_feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    
    db.delete(db_feature)
    db.commit()

# Features Page Routes
@router.get("/page", response_model=FeaturesPageResponse)
async def get_features_page(db: Session = Depends(get_db)):
    """Get features page"""
    features_page = db.query(FeaturesPage).first()
    if not features_page:
        raise HTTPException(status_code=404, detail="Features page not found")
    return features_page

@router.get("/page/published", response_model=FeaturesPageResponse)
async def get_published_features_page(db: Session = Depends(get_db)):
    """Get published features page"""
    features_page = db.query(FeaturesPage).filter(FeaturesPage.is_published == True).first()
    if not features_page:
        raise HTTPException(status_code=404, detail="Published features page not found")
    return features_page

@router.post("/page", response_model=FeaturesPageResponse, status_code=status.HTTP_201_CREATED)
async def create_features_page(features_page: FeaturesPageCreate, db: Session = Depends(get_db)):
    """Create features page"""
    db_features_page = FeaturesPage(**features_page.dict())
    db.add(db_features_page)
    db.commit()
    db.refresh(db_features_page)
    return db_features_page

@router.put("/page/{page_id}", response_model=FeaturesPageResponse)
async def update_features_page(
    page_id: int,
    features_page_update: FeaturesPageUpdate,
    db: Session = Depends(get_db)
):
    """Update features page"""
    db_features_page = db.query(FeaturesPage).filter(FeaturesPage.id == page_id).first()
    if not db_features_page:
        raise HTTPException(status_code=404, detail="Features page not found")
    
    update_data = features_page_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_features_page, key, value)
    
    db.add(db_features_page)
    db.commit()
    db.refresh(db_features_page)
    return db_features_page

@router.patch("/page/{page_id}/publish", response_model=FeaturesPageResponse)
async def publish_features_page(page_id: int, db: Session = Depends(get_db)):
    """Publish features page"""
    db_features_page = db.query(FeaturesPage).filter(FeaturesPage.id == page_id).first()
    if not db_features_page:
        raise HTTPException(status_code=404, detail="Features page not found")
    
    db_features_page.is_published = True
    db.add(db_features_page)
    db.commit()
    db.refresh(db_features_page)
    return db_features_page
