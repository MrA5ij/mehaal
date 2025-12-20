from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.models import Media
from app.schemas.schemas import MediaCreate, MediaUpdate, MediaResponse
from app.database.database import get_db
import os
import shutil
from datetime import datetime

router = APIRouter(
    prefix="/api/media",
    tags=["media"],
)

# File upload configuration
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
ALLOWED_EXTENSIONS = {'.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.glb', '.gltf'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# Create upload directory if not exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Media Routes
@router.get("", response_model=list[MediaResponse])
async def list_media(file_type: str = None, db: Session = Depends(get_db)):
    """List all media"""
    query = db.query(Media)
    if file_type:
        query = query.filter(Media.file_type == file_type)
    return query.all()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    alt_text: str = "",
    db: Session = Depends(get_db)
):
    """Upload media file"""
    
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max: {MAX_FILE_SIZE/(1024*1024)}MB"
        )
    
    # Create unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    with open(filepath, "wb") as f:
        f.write(contents)
    
    # Determine file type
    if ext in {'.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'}:
        file_type = "image"
    elif ext in {'.glb', '.gltf'}:
        file_type = "3d_model"
    else:
        file_type = "file"
    
    # Save to database
    db_media = Media(
        file_url=f"/uploads/{filename}",
        file_type=file_type,
        alt_text=alt_text or file.filename,
        size=len(contents)
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    
    return {
        "id": db_media.id,
        "file_url": db_media.file_url,
        "file_type": db_media.file_type,
        "alt_text": db_media.alt_text,
        "size": db_media.size
    }

@router.post("", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def create_media(media: MediaCreate, db: Session = Depends(get_db)):
    """Create media record (for external URLs)"""
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
