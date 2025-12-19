# Media Files Management - Mehaal CMS

## 📁 موجودہ Media System

### Current Implementation
```
Mehaal میں media files یوں handle ہو رہی ہیں:
├─ Database میں URLs/paths store ہوتے ہیں
├─ Actual files external storage میں ہوتی ہیں
├─ Media table میں metadata رہتی ہے
└─ Frontend URLs fetch کر کے display کرتا ہے
```

---

## 🗄️ Media Database Model

### Media Table Schema

```python
class Media(Base):
    __tablename__ = "media"
    
    id = Column(Integer, primary_key=True)           # Unique ID
    file_url = Column(String(500))                  # URL یا file path
    file_type = Column(String(50))                  # 'image', 'video', 'document'
    alt_text = Column(String(255))                  # Accessibility text
    size = Column(Integer)                          # File size in bytes
    uploaded_at = Column(DateTime)                  # Upload timestamp
```

### Database میں کیا store ہوتا ہے:

```sql
SELECT * FROM media;

id | file_url                        | file_type | size      | alt_text
---|----------------------------------|-----------|-----------|-------------------
1  | /assets/logo.svg               | image     | 2048      | Mehaal Logo
2  | /uploads/hero-bg.jpg           | image     | 102400    | Hero Background
3  | /uploads/pricing-icon.png      | image     | 5120      | Pricing Feature Icon
4  | https://cdn.example.com/logo   | image     | 1024      | CDN Logo
```

---

## 🎨 Logo Configuration (Platform Settings)

### Logo Storage

```python
# Platform Settings میں 3 logo types ہیں:

logo_icon = "/assets/logo-icon.svg"          # صرف آئیکن (small)
logo_wordmark = "/assets/logo-wordmark.svg"  # صرف text (horizontal)
logo_lockup = "/assets/logo-lockup.svg"      # Icon + text (full)
```

### Logo Usage Example

```json
{
  "id": "uuid...",
  "logo_icon": "/assets/logo-icon.svg",
  "logo_wordmark": "/assets/logo-wordmark.svg",
  "logo_lockup": "/assets/logo-lockup.svg"
}
```

---

## 📚 Media References in CMS

### جہاں media استعمال ہو رہی ہے:

```
1. HomePage Model
   └─ hero_media_id → background image

2. PricingPage → PricingPlan
   └─ icon_media_id → feature icon

3. Feature
   └─ icon (string) → feature icon

4. FeaturesPage
   └─ background_media_id → page background

5. SiteSettings
   └─ logo_media_id → site logo

6. PlatformSettings
   ├─ logo_icon
   ├─ logo_wordmark
   └─ logo_lockup
```

---

## 🌐 Media Storage Options

### Option 1: Local File System (Current)

```
/assets/
├─ Fonts/
├─ Images/
├─ PNGS/
└─ (manually add files here)

In Database:
logo_icon = "/assets/logo-icon.svg"
```

**Pros:**
- ✅ Setup آسان
- ✅ کوئی extra cost نہیں
- ✅ Fast access

**Cons:**
- ❌ Scalability issue
- ❌ Backup management
- ❌ CDN integration مشکل

---

### Option 2: Cloud Storage (Recommended)

#### AWS S3

```python
# Backend code example
import boto3

s3_client = boto3.client('s3')

# Upload
response = s3_client.upload_file(
    'logo.svg',
    'mehaal-bucket',
    'logos/logo-icon.svg'
)

# Use URL
logo_url = "https://s3.amazonaws.com/mehaal-bucket/logos/logo-icon.svg"
```

**Database میں:**
```
logo_icon = "https://s3.amazonaws.com/mehaal-bucket/logos/logo-icon.svg"
```

#### Cloudinary (Easiest)

```python
import cloudinary
import cloudinary.uploader

# Upload
result = cloudinary.uploader.upload('logo.svg')

# Use URL
logo_url = result['secure_url']
# Output: https://res.cloudinary.com/xyz/image/upload/v123/logo.svg
```

#### Supabase Storage

```python
from supabase import create_client

supabase = create_client(url, key)

# Upload
with open('logo.svg', 'rb') as f:
    response = supabase.storage.from_('logos').upload('logo-icon.svg', f)

# Use URL
logo_url = supabase.storage.from_('logos').get_public_url('logo-icon.svg')
```

---

### Option 3: CDN (Best for Performance)

```
Local Files → CDN → Users

Benefits:
✅ Global distribution
✅ Fast delivery
✅ Caching
✅ DDoS protection
```

**CDN Providers:**
- Cloudflare
- CloudFront (AWS)
- Bunny CDN
- Akamai

---

## 📤 Media Upload Implementation

### Current Media API

```python
# POST /api/media
{
  "file_url": "/assets/logo.svg",      # یا CDN URL
  "file_type": "image",                 # image, video, document
  "alt_text": "Company Logo"
}

Response:
{
  "id": 1,
  "file_url": "/assets/logo.svg",
  "file_type": "image",
  "alt_text": "Company Logo",
  "size": 2048,
  "uploaded_at": "2025-12-20T..."
}
```

### API Endpoints

```
GET    /api/media              # تمام media list کریں
POST   /api/media              # نئی media add کریں
GET    /api/media/{id}         # کوئی media دیکھیں
PUT    /api/media/{id}         # update کریں
DELETE /api/media/{id}         # delete کریں

Filter:
GET    /api/media?file_type=image     # صرف images
GET    /api/media?file_type=document  # صرف documents
```

---

## 💾 Logo Files Setup

### موجودہ Logo Paths

```
/assets/
├─ logo-icon.svg        → /assets/logo-icon.svg
├─ logo-wordmark.svg    → /assets/logo-wordmark.svg
└─ logo-lockup.svg      → /assets/logo-lockup.svg

Docker میں:
/var/www/mehaal/assets/
```

### Frontend میں استعمال

```tsx
// React Component
import { useState, useEffect } from 'react';

export function Logo() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Platform settings fetch کریں
    fetch('http://localhost:8000/api/platform-settings')
      .then(r => r.json())
      .then(data => setSettings(data));
  }, []);

  return (
    <img 
      src={settings?.logo_icon} 
      alt="Logo"
      width={40}
      height={40}
    />
  );
}
```

---

## 🔧 Implementation Guide - Logo Upload

### Step 1: Database Setup

```bash
# Logo entry create کریں
curl -X POST http://localhost:8000/api/media \
  -H "Content-Type: application/json" \
  -d '{
    "file_url": "/assets/logo-icon.svg",
    "file_type": "image",
    "alt_text": "Mehaal Logo"
  }'
```

### Step 2: File Upload (Manual)

```bash
# Assets folder میں copy کریں
cp my-logo.svg ./assets/logo-icon.svg
```

### Step 3: Platform Settings Update

```bash
curl -X PUT http://localhost:8000/api/platform-settings \
  -H "Content-Type: application/json" \
  -d '{
    "logo_icon": "/assets/logo-icon.svg",
    "logo_wordmark": "/assets/logo-wordmark.svg",
    "logo_lockup": "/assets/logo-lockup.svg"
  }'
```

### Step 4: Frontend Display

```tsx
<img src={platformSettings.logo_icon} alt="Logo" />
```

---

## 🚀 Recommended Setup - Cloudinary

### Why Cloudinary?

```
✅ Free tier موجود (25GB/month)
✅ Automatic optimization
✅ CDN built-in
✅ Image transformations
✅ No server setup needed
```

### Cloudinary Setup

#### 1. Account بنائیں

```
https://cloudinary.com/users/register/free
```

#### 2. Backend Integration

```python
# backend/requirements.txt میں شامل کریں
cloudinary==1.35.0

# backend/.env میں
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

#### 3. Backend Code

```python
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=settings.CLOUDINARY_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

# Upload function
def upload_to_cloudinary(file):
    result = cloudinary.uploader.upload(file)
    return result['secure_url']
```

#### 4. API Endpoint

```python
from fastapi import UploadFile
from typing import Optional

@router.post("/api/media/upload")
async def upload_media(file: UploadFile, alt_text: Optional[str] = None):
    # File upload کریں
    url = upload_to_cloudinary(file.file)
    
    # Database میں save کریں
    db_media = Media(
        file_url=url,
        file_type="image",
        alt_text=alt_text or file.filename
    )
    db.add(db_media)
    db.commit()
    
    return {"url": url, "id": db_media.id}
```

#### 5. Frontend Upload

```tsx
function LogoUpload() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const { url } = await response.json();
    
    // Platform settings میں update کریں
    await fetch('/api/platform-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        logo_icon: url
      })
    });
  };

  return (
    <input 
      type="file" 
      onChange={handleUpload}
      accept="image/*"
    />
  );
}
```

---

## 🎯 Current Workflow

### How Logo Works Now:

```
1. Logo File
   └─ /assets/logo-icon.svg (manually added)

2. Platform Settings
   └─ logo_icon = "/assets/logo-icon.svg"

3. API Response
   ├─ GET /api/platform-settings
   └─ Returns: { "logo_icon": "/assets/logo-icon.svg" }

4. Frontend
   ├─ Fetches settings
   └─ Displays: <img src="/assets/logo-icon.svg" />

5. Nginx (Docker)
   ├─ Serves static files from /assets/
   └─ Returns file to browser
```

---

## 🔄 Full Media Management Workflow

### Upload Process

```
User selects file
  ↓
Frontend sends to API
  ↓
Backend validates file
  ↓
Upload to storage (local/cloud)
  ↓
Save URL in database
  ↓
Return to frontend
  ↓
Display in admin panel
  ↓
Save platform settings
  ↓
Frontend fetches and displays
```

### Code Example

```python
# routes/media.py

from fastapi import UploadFile, File
import os

@router.post("/api/media/upload")
async def upload_media(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload media file"""
    
    # Step 1: Validate
    if file.size > 10 * 1024 * 1024:  # 10MB max
        raise HTTPException(status_code=400, detail="File too large")
    
    # Step 2: Save locally
    file_path = f"assets/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    # Step 3: Save to database
    db_media = Media(
        file_url=f"/assets/{file.filename}",
        file_type="image",
        alt_text=file.filename,
        size=file.size
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    
    return db_media
```

---

## 🛡️ Security Considerations

### File Validation

```python
ALLOWED_EXTENSIONS = {'.svg', '.png', '.jpg', '.jpeg', '.gif'}
ALLOWED_TYPES = {'image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(file: UploadFile):
    # Extension check
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # MIME type check
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid MIME type")
    
    # Size check
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    return True
```

---

## 📊 Media Management Checklist

```markdown
[ ] Logo files موجود ہیں
    ├─ /assets/logo-icon.svg
    ├─ /assets/logo-wordmark.svg
    └─ /assets/logo-lockup.svg

[ ] Database میں entries ہیں
    └─ GET /api/media

[ ] Platform Settings configured ہے
    ├─ logo_icon set
    ├─ logo_wordmark set
    └─ logo_lockup set

[ ] Frontend display working ہے
    └─ Logo visible in app

[ ] Admin upload working ہے (اگر needed ہو)
    └─ POST /api/media/upload

[ ] Production deployment ready
    ├─ Files backed up
    ├─ CDN configured (optional)
    └─ Nginx serving correctly
```

---

## 🚀 Next Steps

### Immediate
```
1. ✅ Logo files /assets/ میں ہیں
2. ✅ Platform Settings میں paths set ہیں
3. ✅ Frontend display کر رہا ہے
```

### Optional Enhancements
```
1. Cloudinary integration شامل کریں
2. File upload API implement کریں
3. Image optimization add کریں
4. CDN configuration کریں
5. Batch upload functionality شامل کریں
```

---

## 📚 File Structure

```
mehaal/
├─ assets/
│  ├─ Fonts/
│  ├─ Images/
│  │  ├─ logo-icon.svg          ← Logo icon
│  │  ├─ logo-wordmark.svg      ← Logo text
│  │  └─ logo-lockup.svg        ← Logo full
│  ├─ PNGS/
│  └─ (other assets)
│
├─ backend/
│  ├─ app/
│  │  ├─ models/
│  │  │  ├─ models.py           ← Media model
│  │  │  └─ platform_settings.py ← Logo paths
│  │  ├─ routes/
│  │  │  └─ media.py            ← Media API
│  │  └─ schemas/
│  │     └─ schemas.py          ← Media schema
│  └─ uploads/                   ← Upload folder (optional)
│
├─ src/
│  ├─ components/
│  │  └─ Hero.tsx              ← Uses logo
│  ├─ admin/
│  │  └─ PlatformSettingsAdmin.tsx ← Configure logo
│  └─ services/
│     └─ api.ts                ← Fetch settings
│
└─ nginx.conf                   ← Serves /assets/
```

---

## 🔍 How Logo is Actually Used

### In PlatformSettingsAdmin.tsx

```tsx
<input
  type="text"
  value={settings.logo_icon}
  onChange={(e) => updateSetting('logo_icon', e.target.value)}
  placeholder="/assets/logo-icon.svg"
/>
```

### In Hero.tsx

```tsx
<img 
  src={platformSettings?.logo_icon || '/assets/logo-icon.svg'}
  alt="Logo"
  className="w-8 h-8"
/>
```

### API Response

```json
{
  "logo_icon": "/assets/logo-icon.svg",
  "logo_wordmark": "/assets/logo-wordmark.svg",
  "logo_lockup": "/assets/logo-lockup.svg"
}
```

---

## 💡 Best Practices

```
✅ SVG استعمال کریں (logos کے لیے)
✅ Responsive images بنائیں
✅ Alt text ہمیشہ شامل کریں
✅ File size optimize کریں
✅ Backups رکھیں
✅ CDN استعمال کریں (production میں)
✅ Version control میں SVG شامل کریں
```

---

**Summary:**

یہاں media (logo) اس طرح کام کر رہا ہے:
1. **Storage:** `/assets/` folder میں یا CDN پر
2. **Database:** صرف URLs store ہوتے ہیں
3. **API:** Media CRUD endpoints
4. **Frontend:** Settings fetch کر کے display کرتا ہے
5. **Serving:** Nginx static files serve کرتا ہے
