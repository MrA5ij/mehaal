from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class SectionBlock(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[Any] = None

class HomePageBase(BaseModel):
    hero_title: str
    hero_subtitle: Optional[str] = None
    hero_cta_text: Optional[str] = None
    hero_cta_url: Optional[str] = None
    hero_media_id: Optional[str] = None
    sections: Optional[Dict[str, List[Any]]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_image: Optional[str] = None
    is_published: bool = False

class HomePageCreate(HomePageBase):
    pass

class HomePageUpdate(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_cta_text: Optional[str] = None
    hero_cta_url: Optional[str] = None
    hero_media_id: Optional[str] = None
    sections: Optional[Dict[str, List[Any]]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_image: Optional[str] = None
    is_published: Optional[bool] = None

class HomePageResponse(HomePageBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
