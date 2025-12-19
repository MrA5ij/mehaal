# PostgreSQL Database Guide

## Database Structure

```
PostgreSQL Server (Container: mehaal-db)
    │
    └── mehaal_db (Database)
        ├── public (Schema)
        │   ├── home_pages (Table)
        │   ├── pricing_pages (Table)
        │   ├── pricing_plans (Table)
        │   ├── features (Table)
        │   ├── features_pages (Table)
        │   ├── doc_categories (Table)
        │   ├── doc_articles (Table)
        │   ├── login_pages (Table)
        │   ├── signup_pages (Table)
        │   ├── legal_documents (Table)
        │   ├── site_settings (Table)
        │   └── media (Table)
```

## Setup Methods

### Method 1: Docker (Recommended - Production)
یہ docker-compose.prod.yml میں خودکار بنتا ہے:

```bash
docker-compose -f docker-compose.prod.yml up -d postgres
```

**کیا ہوتا ہے:**
- PostgreSQL 15 Alpine image download ہوتی ہے
- Volume میں data persist ہوتا ہے (`postgres_data_prod`)
- User: `mehaal_user`
- Password: `.env.prod` سے

### Method 2: Local Installation (Development)

#### Windows میں:
1. PostgreSQL installer download کریں: https://www.postgresql.org/download/windows/
2. Install کریں (port 5432, default)
3. pgAdmin 4 install ہو جائے گا

#### Linux میں:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### macOS میں:
```bash
brew install postgresql
brew services start postgresql
```

### Method 3: Using Docker Desktop (Development)

```bash
# PostgreSQL چلائیں
docker run -d \
  --name mehaal-db \
  -e POSTGRES_USER=mehaal_user \
  -e POSTGRES_PASSWORD=mehaal_password \
  -e POSTGRES_DB=mehaal_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Database میں جائیں
docker exec -it mehaal-db psql -U mehaal_user -d mehaal_db
```

## Tables Details

### Tables میں کیا Store ہوتا ہے:

**home_pages**: 🏠 Homepage کا content
- hero_title, hero_subtitle, sections (JSON)
- seo_title, seo_description

**pricing_pages**: 💰 Pricing page
- pricing_plans (FK relation)
- سے pricing tiers

**features**: ✨ Features list
- title, description, icon

**doc_articles**: 📚 Documentation
- Organized by categories
- Version control
- Published_at timestamp

**legal_documents**: ⚖️ Terms, Privacy
- Type: 'tos' या 'privacy'
- Version: document versioning

**site_settings**: ⚙️ Global config
- site_name, logo, colors
- footer_links, social_links

**media**: 🖼️ Asset library
- file_url, file_type, alt_text
- uploaded_at timestamp
