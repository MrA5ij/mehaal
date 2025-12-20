# Media Upload Implementation - Local Storage

## 🎯 Goal

Logo, SVG, GLB اور دوسری media files کو **اپنی مرضی کی جگہ** upload اور manage کریں۔

---

## Current State

```
✅ Media table موجود ہے
✅ Media API endpoints ہیں
❌ File upload functionality نہیں ہے
```

---

## Local File Upload - Full Control

### Step 1: Backend - Media Upload Endpoint

```python
# backend/app/routes/media.py میں add کریں

from fastapi import UploadFile, File, HTTPException
import os
import shutil
from datetime import datetime

UPLOAD_DIR = "uploads"  # آپ کی مرضی کی directory
ALLOWED_EXTENSIONS = {'.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.glb', '.gltf'}  # 3D models included
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB - GLB files کے لیے

# Create upload dir if not exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_media(
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
            detail=f"Invalid file type. Allowed: {ALLOWED_EXTENSIONS}"
        )
    
    # Validate file size
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
```

### Step 2: Nginx Configuration

```nginx
# nginx.conf میں add کریں

location /uploads/ {
    alias /var/www/mehaal/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}

location /assets/ {
    alias /var/www/mehaal/assets/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Step 3: Frontend Upload Component

```tsx
// src/components/MediaUploader.tsx

import React, { useState } from 'react';

export default function MediaUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', file.name);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + '/api/media/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      onUpload(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        accept="image/*"
        className="block w-full text-sm"
      />
      {uploading && <p className="text-blue-500">Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

### Step 4: Use in Platform Settings Admin

```tsx
// src/admin/PlatformSettingsAdmin.tsx میں

import MediaUploader from '../components/MediaUploader';

export default function PlatformSettingsAdmin() {
  const [settings, setSettings] = useState(null);

  const handleLogoUpload = (media) => {
    // Logo icon set کریں
    updateSetting('logo_icon', media.file_url);
  };

  return (
    <div className="space-y-6">
      {/* ... other settings ... */}

      {/* Logo Upload Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-bold mb-4">📸 Logo Upload</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Logo Icon
            </label>
            <MediaUploader onUpload={handleLogoUpload} />
            {settings?.logo_icon && (
              <div className="mt-2">
                <img
                  src={settings.logo_icon}
                  alt="Logo Icon"
                  className="w-16 h-16 border rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Logo Wordmark
            </label>
            <MediaUploader
              onUpload={(media) => updateSetting('logo_wordmark', media.file_url)}
            />
            {settings?.logo_wordmark && (
              <div className="mt-2">
                <img
                  src={settings.logo_wordmark}
                  alt="Logo Wordmark"
                  className="h-8 border rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Logo Lockup
            </label>
            <MediaUploader
              onUpload={(media) => updateSetting('logo_lockup', media.file_url)}
            />
            {settings?.logo_lockup && (
              <div className="mt-2">
                <img
                  src={settings.logo_lockup}
                  alt="Logo Lockup"
                  className="h-10 border rounded"
                />
              </div>
            )}
          </div>
        </div>
   Custom Upload Directory

آپ اپنی مرضی کی directory set کر سکتے ہیں:

```python
# backend/.env میں
UPLOAD_DIR=/var/www/mehaal/assets/uploads
# یا
UPLOAD_DIR=/mnt/storage/media
# یا کوئی بھی path
```

```python
# backend/app/config.py میں
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")  # Default: uploads
    
settings = Settings()
```

```python
# backend/app/routes/media.py میں UPLOAD_DIR use کریں
from app.config import settings

UPLOAD_DIR = settings.UPLOAD_DIR
os.makedirs(UPLOAD_DIR, exist_ok=True)`tsx
// URL change کریں
const response = await fetch(
  import.meta.env.VITE_API_URL + '/api/media/upload-cloudinary',
  {
    method: 'POST',
    body: formData
  }
);
```

---

## Testing

### Local Upload Test

```bash
# Terminal سے test کریں
curl -X POST http://localhost:8000/api/media/upload \
  -F "file=@path/to/logo.svg" \
  -F "alt_text=My Logo"

# Response:
{
  "id": 1,
  "file_url": "/uploads/20251220_120000_logo.svg",
  "file_type": "image",
  "alt_text": "My Logo",
  "size": 2048
}
```

### Verify File Serving

```bash
# File accessible ہے یا نہیں؟
curl -I http://localhost:8000/uploads/20251220_120000_logo.svg

# 200 OK ملے تو working ہے
```

### Check Database

```bash
# Database میں entry check کریں
docker-compose exec postgres psql -U mehaal_user -d mehaal_db \
  -c "SELECT * FROM media;"
```

---

## Production Setup

### Docker Configuration

```yaml
# docker-compose.prod.yml میں

services:
  backend:
    volumes:
      - ./uploads:/var/www/mehaal/uploads
      - ./assets:/var/www/mehaal/assets
```

### Nginx Static Files

```nginx
location /uploads/ {
    alias /var/www/mehaal/uploads/;
    expires 7d;
    add_header Cache-Control "public";
}

location /assets/ {
    alias /var/www/mehaal/assets/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Backup Strategy

```bash
#!/bin/bash
# backup-uploads.sh

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz uploads/

# Backup database
docker-compose exec -T postgres pg_dump -U mehaal_user mehaal_db \
  > $BACKUP_DIR/db_$TIMESTAMP.sql

echo "Backup complete: $TIMESTAMP"
```

---

## Admin Panel Integration

### Full Logo Management UI

```tsx
// src/admin/LogoManager.tsx

import React, { useState } from 'react';
import MediaUploader from '../components/MediaUploader';

export default function LogoManager() {
  const [logos, setLogos] = useState({
    icon: '',
    wordmark: '',
    lockup: ''
  });

  const handleUpload = (type, media) => {
    setLogos(prev => ({
      ...prev,
      [type]: media.file_url
    }));
    savePlatformSettings();
  };

  const savePlatformSettings = async () => {
    await fetch('/api/platform-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        logo_icon: logos.icon,
        logo_wordmark: logos.wordmark,
        logo_lockup: logos.lockup
      })
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Logo Management</h1>

      <div className="space-y-8">
        {/* Logo Icon */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Logo Icon</h2>
          <p className="text-gray-600 mb-4">Small icon version (favicon, nav)</p>
          <MediaUploader onUpload={(m) => handleUpload('icon', m)} />
          {logos.icon && (
            <div className="mt-4">
              <img src={logos.icon} alt="Logo Icon" className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Logo Wordmark */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Logo Wordmark</h2>
          <p className="text-gray-600 mb-4">Text-only version</p>
          <MediaUploader onUpload={(m) => handleUpload('wordmark', m)} />
          {logos.wordmark && (
            <div className="mt-4">
              <img src={logos.wordmark} alt="Logo Wordmark" className="h-8" />
            </div>
          )}
        </div>

        {/* Logo Lockup */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Logo Lockup</h2>
          <p className="text-gray-600 mb-4">Full logo (icon + text)</p>
          <MediaUploader onUpload={(m) => handleUpload('lockup', m)} />
          {logos.lockup && (
            <div className="mt-4">
              <img src={logos.lockup} alt="Logo Lockup" className="h-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Troubleshooting

### Issue: File Upload 413 Request Entity Too Large

```nginx
# nginx.conf میں add کریں
client_max_body_size 50M;
```

### Issue: CORS Error on Upload

```python
# backend/app/main.py میں
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: File Not Found 404

```bash
# Check directory exists
ls -la uploads/
mkdir -p uploads

# Check Nginx config
docker-compose logs nginx

# Check file permissions
chmod 755 uploads
chmod 644 uploads/*
```

---

## Summary

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| Local Files | Simple, No cost | Limited storage | Dev/Small sites |
| Cloudinary | CDN, Optimization | $12+/month | Production |
| AWS S3 | Scalable, Reliable | Complex setup | Large sites |
| Supabase | Built-in DB | Limited free tier | Development |

---

**Choose:** Local files for now, upgrade to Cloudinary when scaling!
✅ **Local file storage - آپ کی مرضی کی جگہ**
- SVG, PNG, JPG, WebP images
- GLB, GLTF 3D models
- کوئی بھی directory set کر سکتے ہیں
- کوئی third-party service نہیں
- مکمل control آپ کے پاس

---

**Simple. Local. Full Control.**