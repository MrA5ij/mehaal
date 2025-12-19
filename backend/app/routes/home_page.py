from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import HomePage
from app.schemas.home_page_schema import HomePageCreate, HomePageUpdate, HomePageResponse
from app.database.database import get_db

router = APIRouter(
    prefix="/api/home-page",
    tags=["home-page"],
)

@router.get("/", response_model=HomePageResponse)
async def get_home_page(db: Session = Depends(get_db)):
    """Get the home page data"""
    home_page = db.query(HomePage).first()
    if not home_page:
        raise HTTPException(status_code=404, detail="Home page not found")
    return home_page

@router.get("/published", response_model=HomePageResponse)
async def get_published_home_page(db: Session = Depends(get_db)):
    """Get published home page"""
    home_page = db.query(HomePage).filter(HomePage.is_published == True).first()
    if not home_page:
        raise HTTPException(status_code=404, detail="Published home page not found")
    return home_page

@router.post("/", response_model=HomePageResponse, status_code=status.HTTP_201_CREATED)
async def create_home_page(home_page: HomePageCreate, db: Session = Depends(get_db)):
    """Create home page"""
    db_home_page = HomePage(**home_page.dict())
    db.add(db_home_page)
    db.commit()
    db.refresh(db_home_page)
    return db_home_page

@router.put("/{page_id}", response_model=HomePageResponse)
async def update_home_page(
    page_id: int,
    home_page_update: HomePageUpdate,
    db: Session = Depends(get_db)
):
    """Update home page"""
    db_home_page = db.query(HomePage).filter(HomePage.id == page_id).first()
    if not db_home_page:
        raise HTTPException(status_code=404, detail="Home page not found")
    
    update_data = home_page_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_home_page, key, value)
    
    db.add(db_home_page)
    db.commit()
    db.refresh(db_home_page)
    return db_home_page

@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_home_page(page_id: int, db: Session = Depends(get_db)):
    """Delete home page"""
    db_home_page = db.query(HomePage).filter(HomePage.id == page_id).first()
    if not db_home_page:
        raise HTTPException(status_code=404, detail="Home page not found")
    
    db.delete(db_home_page)
    db.commit()
    return None

@router.patch("/{page_id}/publish", response_model=HomePageResponse)
async def publish_home_page(page_id: int, db: Session = Depends(get_db)):
    """Publish home page"""
    db_home_page = db.query(HomePage).filter(HomePage.id == page_id).first()
    if not db_home_page:
        raise HTTPException(status_code=404, detail="Home page not found")
    
    db_home_page.is_published = True
    db.add(db_home_page)
    db.commit()
    db.refresh(db_home_page)
    return db_home_page
