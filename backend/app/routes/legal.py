from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import LegalDocument
from app.schemas.schemas import LegalDocumentCreate, LegalDocumentUpdate, LegalDocumentResponse
from app.database.database import get_db

router = APIRouter(
    prefix="/api/legal",
    tags=["legal"],
)

# Legal Document Routes
@router.get("", response_model=list[LegalDocumentResponse])
async def list_legal_documents(doc_type: str = None, db: Session = Depends(get_db)):
    """List all legal documents"""
    query = db.query(LegalDocument).filter(LegalDocument.is_active == True)
    if doc_type:
        query = query.filter(LegalDocument.type == doc_type)
    return query.all()

@router.get("/{slug}", response_model=LegalDocumentResponse)
async def get_legal_document(slug: str, db: Session = Depends(get_db)):
    """Get legal document by slug"""
    doc = db.query(LegalDocument).filter(
        LegalDocument.slug == slug,
        LegalDocument.is_active == True
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.get("/type/{doc_type}", response_model=list[LegalDocumentResponse])
async def get_legal_documents_by_type(doc_type: str, db: Session = Depends(get_db)):
    """Get legal documents by type"""
    docs = db.query(LegalDocument).filter(
        LegalDocument.type == doc_type,
        LegalDocument.is_active == True
    ).all()
    return docs

@router.post("", response_model=LegalDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_legal_document(doc: LegalDocumentCreate, db: Session = Depends(get_db)):
    """Create legal document"""
    db_doc = LegalDocument(**doc.dict())
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.put("/{doc_id}", response_model=LegalDocumentResponse)
async def update_legal_document(
    doc_id: int,
    doc_update: LegalDocumentUpdate,
    db: Session = Depends(get_db)
):
    """Update legal document"""
    db_doc = db.query(LegalDocument).filter(LegalDocument.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    update_data = doc_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_doc, key, value)
    
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_legal_document(doc_id: int, db: Session = Depends(get_db)):
    """Delete legal document (soft delete)"""
    db_doc = db.query(LegalDocument).filter(LegalDocument.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db_doc.is_active = False
    db.add(db_doc)
    db.commit()
