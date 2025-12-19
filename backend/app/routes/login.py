from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import LoginPage
from app.schemas.schemas import LoginPageCreate, LoginPageUpdate, LoginPageResponse
from app.database.database import get_db

router = APIRouter(
    prefix="/api/auth-pages",
    tags=["auth-pages"],
)

# Login Page Routes
@router.get("/login", response_model=LoginPageResponse)
async def get_login_page(db: Session = Depends(get_db)):
    """Get login page"""
    login_page = db.query(LoginPage).first()
    if not login_page:
        raise HTTPException(status_code=404, detail="Login page not found")
    return login_page

@router.post("/login", response_model=LoginPageResponse, status_code=status.HTTP_201_CREATED)
async def create_login_page(login_page: LoginPageCreate, db: Session = Depends(get_db)):
    """Create login page"""
    db_login_page = LoginPage(**login_page.dict())
    db.add(db_login_page)
    db.commit()
    db.refresh(db_login_page)
    return db_login_page

@router.put("/login/{page_id}", response_model=LoginPageResponse)
async def update_login_page(
    page_id: int,
    login_page_update: LoginPageUpdate,
    db: Session = Depends(get_db)
):
    """Update login page"""
    db_login_page = db.query(LoginPage).filter(LoginPage.id == page_id).first()
    if not db_login_page:
        raise HTTPException(status_code=404, detail="Login page not found")
    
    update_data = login_page_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_login_page, key, value)
    
    db.add(db_login_page)
    db.commit()
    db.refresh(db_login_page)
    return db_login_page

@router.delete("/login/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_login_page(page_id: int, db: Session = Depends(get_db)):
    """Delete login page"""
    db_login_page = db.query(LoginPage).filter(LoginPage.id == page_id).first()
    if not db_login_page:
        raise HTTPException(status_code=404, detail="Login page not found")
    
    db.delete(db_login_page)
    db.commit()
