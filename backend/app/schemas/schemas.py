from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# PRICING PAGE SCHEMAS
class PricingPlanBase(BaseModel):
    name: str
    slug: str
    price_monthly: float
    price_yearly: float
    features: Optional[List[str]] = None
    limits: Optional[Dict[str, Any]] = None
    highlight: bool = False
    order: int = 0

class PricingPlanCreate(PricingPlanBase):
    pass

class PricingPlanUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    price_monthly: Optional[float] = None
    price_yearly: Optional[float] = None
    features: Optional[List[str]] = None
    limits: Optional[Dict[str, Any]] = None
    highlight: Optional[bool] = None
    order: Optional[int] = None

class PricingPlanResponse(PricingPlanBase):
    id: int
    page_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PricingPageBase(BaseModel):
    heading: str
    subheading: Optional[str] = None
    currency: str = "USD"
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    is_published: bool = False

class PricingPageCreate(PricingPageBase):
    plans: Optional[List[PricingPlanCreate]] = None

class PricingPageUpdate(BaseModel):
    heading: Optional[str] = None
    subheading: Optional[str] = None
    currency: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    is_published: Optional[bool] = None

class PricingPageResponse(PricingPageBase):
    id: int
    plans: List[PricingPlanResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# FEATURES PAGE SCHEMAS
class FeatureBase(BaseModel):
    title: str
    slug: str
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    icon_media_id: Optional[str] = None
    order: int = 0
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class FeatureCreate(FeatureBase):
    pass

class FeatureUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    icon_media_id: Optional[str] = None
    order: Optional[int] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class FeatureResponse(FeatureBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FeaturesPageBase(BaseModel):
    intro_text: Optional[str] = None
    feature_ids: Optional[List[int]] = None
    is_published: bool = False

class FeaturesPageCreate(FeaturesPageBase):
    pass

class FeaturesPageUpdate(BaseModel):
    intro_text: Optional[str] = None
    feature_ids: Optional[List[int]] = None
    is_published: Optional[bool] = None

class FeaturesPageResponse(FeaturesPageBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# DOCS SCHEMAS
class DocCategoryBase(BaseModel):
    name: str
    slug: str
    order: int = 0

class DocCategoryCreate(DocCategoryBase):
    pass

class DocCategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    order: Optional[int] = None

class DocCategoryResponse(DocCategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DocArticleBase(BaseModel):
    title: str
    slug: str
    content: str
    version: int = 1
    related_docs: Optional[List[int]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class DocArticleCreate(DocArticleBase):
    category_id: int

class DocArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    version: Optional[int] = None
    related_docs: Optional[List[int]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class DocArticleResponse(DocArticleBase):
    id: int
    category_id: int
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# LOGIN PAGE SCHEMAS
class LoginPageBase(BaseModel):
    heading: str
    subheading: Optional[str] = None
    show_social_login: bool = False
    background_media_id: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class LoginPageCreate(LoginPageBase):
    pass

class LoginPageUpdate(BaseModel):
    heading: Optional[str] = None
    subheading: Optional[str] = None
    show_social_login: Optional[bool] = None
    background_media_id: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class LoginPageResponse(LoginPageBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# SIGNUP PAGE SCHEMAS
class SignupPageBase(BaseModel):
    heading: str
    subheading: Optional[str] = None
    signup_fields: Optional[List[Dict[str, Any]]] = None
    show_social_signup: bool = False
    terms_required: bool = True
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class SignupPageCreate(SignupPageBase):
    pass

class SignupPageUpdate(BaseModel):
    heading: Optional[str] = None
    subheading: Optional[str] = None
    signup_fields: Optional[List[Dict[str, Any]]] = None
    show_social_signup: Optional[bool] = None
    terms_required: Optional[bool] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class SignupPageResponse(SignupPageBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# LEGAL DOCUMENT SCHEMAS
class LegalDocumentBase(BaseModel):
    type: str  # 'tos' or 'privacy'
    title: str
    slug: str
    content: str
    version: int = 1
    effective_date: Optional[datetime] = None
    last_reviewed_at: Optional[datetime] = None
    is_active: bool = True

class LegalDocumentCreate(LegalDocumentBase):
    pass

class LegalDocumentUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    version: Optional[int] = None
    effective_date: Optional[datetime] = None
    last_reviewed_at: Optional[datetime] = None
    is_active: Optional[bool] = None

class LegalDocumentResponse(LegalDocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# SITE SETTINGS SCHEMAS
class SiteSettingsBase(BaseModel):
    site_name: str
    logo_media_id: Optional[str] = None
    primary_color: str = "#000000"
    support_email: Optional[str] = None
    footer_links: Optional[List[Dict[str, str]]] = None
    social_links: Optional[Dict[str, str]] = None
    default_seo_title: Optional[str] = None
    default_seo_description: Optional[str] = None

class SiteSettingsCreate(SiteSettingsBase):
    pass

class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    logo_media_id: Optional[str] = None
    primary_color: Optional[str] = None
    support_email: Optional[str] = None
    footer_links: Optional[List[Dict[str, str]]] = None
    social_links: Optional[Dict[str, str]] = None
    default_seo_title: Optional[str] = None
    default_seo_description: Optional[str] = None

class SiteSettingsResponse(SiteSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# MEDIA SCHEMAS
class MediaBase(BaseModel):
    file_url: str
    file_type: str
    alt_text: Optional[str] = None
    size: Optional[int] = None

class MediaCreate(MediaBase):
    pass

class MediaUpdate(BaseModel):
    alt_text: Optional[str] = None

class MediaResponse(MediaBase):
    id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True
