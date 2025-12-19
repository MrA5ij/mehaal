from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import SignupPage
from app.schemas.schemas import SignupPageCreate, SignupPageUpdate, SignupPageResponse
from app.database.database import get_db

router = APIRouter(
    prefix="/api/auth-pages",
    tags=["auth-pages"],
)

# Signup Page Routes
@router.get("/signup", response_model=SignupPageResponse)
async def get_signup_page(db: Session = Depends(get_db)):
    """Get signup page"""
    signup_page = db.query(SignupPage).first()
    if not signup_page:
        raise HTTPException(status_code=404, detail="Signup page not found")
    return signup_page

@router.post("/signup", response_model=SignupPageResponse, status_code=status.HTTP_201_CREATED)
async def create_signup_page(signup_page: SignupPageCreate, db: Session = Depends(get_db)):
    """Create signup page"""
    db_signup_page = SignupPage(**signup_page.dict())
    db.add(db_signup_page)
    db.commit()
    db.refresh(db_signup_page)
    return db_signup_page

@router.put("/signup/{page_id}", response_model=SignupPageResponse)
async def update_signup_page(
    page_id: int,
    signup_page_update: SignupPageUpdate,
    db: Session = Depends(get_db)
):
    """Update signup page"""
    db_signup_page = db.query(SignupPage).filter(SignupPage.id == page_id).first()
    if not db_signup_page:
        raise HTTPException(status_code=404, detail="Signup page not found")
    
    update_data = signup_page_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_signup_page, key, value)
    
    db.add(db_signup_page)
    db.commit()
    db.refresh(db_signup_page)
    return db_signup_page

@router.delete("/signup/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_signup_page(page_id: int, db: Session = Depends(get_db)):
    """Delete signup page"""
    db_signup_page = db.query(SignupPage).filter(SignupPage.id == page_id).first()
    if not db_signup_page:
        raise HTTPException(status_code=404, detail="Signup page not found")
    
    db.delete(db_signup_page)
    db.commit()
