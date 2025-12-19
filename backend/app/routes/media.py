from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import Media
from app.schemas.schemas import MediaCreate, MediaUpdate, MediaResponse
from app.database.database import get_db

router = APIRouter(
    prefix="/api/media",
    tags=["media"],
)

# Media Routes
@router.get("", response_model=list[MediaResponse])
async def list_media(file_type: str = None, db: Session = Depends(get_db)):
    """List all media"""
    query = db.query(Media)
    if file_type:
        query = query.filter(Media.file_type == file_type)
    return query.all()

@router.post("", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(media: MediaCreate, db: Session = Depends(get_db)):
    """Upload media"""
    db_media = Media(**media.dict())
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media

@router.get("/{media_id}", response_model=MediaResponse)
async def get_media(media_id: int, db: Session = Depends(get_db)):
    """Get media by ID"""
    db_media = db.query(Media).filter(Media.id == media_id).first()
    if not db_media:
        raise HTTPException(status_code=404, detail="Media not found")
    return db_media

@router.put("/{media_id}", response_model=MediaResponse)
async def update_media(
    media_id: int,
    media_update: MediaUpdate,
    db: Session = Depends(get_db)
):
    """Update media"""
    db_media = db.query(Media).filter(Media.id == media_id).first()
    if not db_media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    update_data = media_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_media, key, value)
    
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media

@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(media_id: int, db: Session = Depends(get_db)):
    """Delete media"""
    db_media = db.query(Media).filter(Media.id == media_id).first()
    if not db_media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    db.delete(db_media)
    db.commit()
