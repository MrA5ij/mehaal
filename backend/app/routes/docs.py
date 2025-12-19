from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import DocCategory, DocArticle
from app.schemas.schemas import (
    DocCategoryCreate, DocCategoryUpdate, DocCategoryResponse,
    DocArticleCreate, DocArticleUpdate, DocArticleResponse
)
from app.database.database import get_db

router = APIRouter(
    prefix="/api/docs",
    tags=["docs"],
)

# Doc Category Routes
@router.get("/categories", response_model=list[DocCategoryResponse])
async def list_categories(db: Session = Depends(get_db)):
    """List all doc categories"""
    categories = db.query(DocCategory).order_by(DocCategory.order).all()
    return categories

@router.post("/categories", response_model=DocCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(category: DocCategoryCreate, db: Session = Depends(get_db)):
    """Create doc category"""
    db_category = DocCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories/{category_id}", response_model=DocCategoryResponse)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get doc category"""
    db_category = db.query(DocCategory).filter(DocCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.put("/categories/{category_id}", response_model=DocCategoryResponse)
async def update_category(
    category_id: int,
    category_update: DocCategoryUpdate,
    db: Session = Depends(get_db)
):
    """Update doc category"""
    db_category = db.query(DocCategory).filter(DocCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    """Delete doc category"""
    db_category = db.query(DocCategory).filter(DocCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()

# Doc Article Routes
@router.get("/articles", response_model=list[DocArticleResponse])
async def list_articles(db: Session = Depends(get_db)):
    """List all doc articles"""
    articles = db.query(DocArticle).all()
    return articles

@router.post("/articles", response_model=DocArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(article: DocArticleCreate, db: Session = Depends(get_db)):
    """Create doc article"""
    category = db.query(DocCategory).filter(DocCategory.id == article.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db_article = DocArticle(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.get("/articles/{article_id}", response_model=DocArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get doc article"""
    db_article = db.query(DocArticle).filter(DocArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@router.get("/categories/{category_id}/articles", response_model=list[DocArticleResponse])
async def get_category_articles(category_id: int, db: Session = Depends(get_db)):
    """Get articles by category"""
    articles = db.query(DocArticle).filter(DocArticle.category_id == category_id).all()
    return articles

@router.put("/articles/{article_id}", response_model=DocArticleResponse)
async def update_article(
    article_id: int,
    article_update: DocArticleUpdate,
    db: Session = Depends(get_db)
):
    """Update doc article"""
    db_article = db.query(DocArticle).filter(DocArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_data = article_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_article, key, value)
    
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.patch("/articles/{article_id}/publish", response_model=DocArticleResponse)
async def publish_article(article_id: int, db: Session = Depends(get_db)):
    """Publish doc article"""
    from datetime import datetime
    db_article = db.query(DocArticle).filter(DocArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db_article.published_at = datetime.utcnow()
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(article_id: int, db: Session = Depends(get_db)):
    """Delete doc article"""
    db_article = db.query(DocArticle).filter(DocArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(db_article)
    db.commit()
