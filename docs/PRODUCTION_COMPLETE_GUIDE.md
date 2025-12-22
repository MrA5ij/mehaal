# Comprehensive Production Setup Guide

## 📁 Directory Structure - Production میں

```
mehaal/
├── docker-compose.prod.yml      ← Production orchestration
├── docker-compose.yml           ← Development (local)
├── .env.prod                    ← Production secrets
├── nginx.conf                   ← Reverse proxy config
│
├── frontend/
│   ├── Dockerfile              ← Multi-stage production build
│   ├── package.json
│   ├── vite.config.js
│   └── src/                     ← React/TSX code
│
├── backend/
│   ├── Dockerfile.prod         ← Gunicorn production
│   ├── requirements.txt         ← Python deps
│   ├── init_db.py              ← Database initialization
│   ├── seed_db.py              ← Default data seeding
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   └── database/
│   └── .env.example
│
├── ssl/                         ← SSL certificates (production)
│   ├── cert.pem
│   └── key.pem
│
├── backups/                     ← Database backups
│
└── docs/
    ├── DATABASE_SETUP.md
    ├── PRODUCTION_BUILD.md
    ├── PRODUCTION_CHECKLIST.md
    └── README.md
```

## 🗄️ Database Setup - Step by Step

### Step 1: PostgreSQL Installation

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Run installer, remember password for postgres user
# Default port: 5432
```

**Linux/WSL:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql
```

**Using Docker (Recommended):**
```bash
docker run -d \
  --name mehaal-db \
  -e POSTGRES_USER=mehaal_user \
  -e POSTGRES_PASSWORD=mehaal_password \
  -e POSTGRES_DB=mehaal_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

### Step 2: Create Database

```bash
# SSH into container
docker exec -it mehaal-db psql -U mehaal_user -d mehaal_db

# Or local PostgreSQL
psql -U postgres
```

```sql
-- Create user
CREATE USER mehaal_user WITH PASSWORD 'mehaal_password';

-- Create database
CREATE DATABASE mehaal_db OWNER mehaal_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mehaal_db TO mehaal_user;

-- Connect to database
\c mehaal_db

-- Create tables (automatic via SQLAlchemy)
```

### Step 3: Initialize Tables and Indexes

```bash
# Backend folder میں
cd backend

# Initialize database
python init_db.py

# Seed default data
python seed_db.py
```

## 🏗️ Production Build Process

### Frontend Build

```bash
# Step 1: Install dependencies
npm install

# Step 2: Build production bundle
npm run build

# Output: dist/ folder (optimized)
# Size: Typical 150-300KB gzipped

# Step 3: Docker build
docker build -t mehaal-frontend:1.0.0 .
```

### Backend Build

```bash
cd backend

# Step 1: Install dependencies
pip install -r requirements.txt

# Step 2: Test locally
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Step 3: Docker build with gunicorn
docker build -f Dockerfile.prod -t mehaal-backend:1.0.0 .
```

### Full Stack Deployment

```bash
# Option 1: Using production compose
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Option 2: Using deployment script
chmod +x deploy.sh
./deploy.sh

# Verify status
docker-compose -f docker-compose.prod.yml ps
```

## 🔐 Security Configuration

### 1. Environment Variables (.env.prod)

```bash
# Database
DB_USER=mehaal_user
DB_PASSWORD=strong_password_here  # Change this!
DB_NAME=mehaal_db

# FastAPI
DEBUG=False
ENVIRONMENT=production
APP_ENV=prod
FOUNDER_KEY=$(openssl rand -hex 48)
JWT_SECRET=$(openssl rand -hex 64)
SSO_METADATA_URL=https://idp.example.com/sso/metadata  # replace with IdP metadata endpoint

# CORS
CORS_ORIGINS=["https://yourdomain.com"]

# SSL
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
```

### 2. SSL/TLS Certificates

```bash
# Self-signed (testing):
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -days 365 -nodes

# Production (Let's Encrypt):
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
# Copy to: ssl/cert.pem, ssl/key.pem
```

### 3. Nginx Configuration (nginx.conf)

```nginx
# Key settings:
- SSL: TLSv1.2+
- Rate limiting: 10 req/s API, 50 req/s general
- Compression: gzip on
- Headers: Security headers configured
- Proxy: Load balancing to backends
```

## 📊 Database Indexes (Performance)

Production میں automatically بنتی ہیں `init_db.py` سے:

```sql
-- Pages
CREATE INDEX idx_home_pages_published ON home_pages(is_published);
CREATE INDEX idx_pricing_pages_published ON pricing_pages(is_published);

-- Articles
CREATE INDEX idx_doc_articles_category_id ON doc_articles(category_id);
CREATE INDEX idx_doc_articles_published_at ON doc_articles(published_at);

-- Relations
CREATE INDEX idx_pricing_plans_page_id ON pricing_plans(page_id);

-- Legal
CREATE INDEX idx_legal_documents_type ON legal_documents(type, is_active);

-- Media
CREATE INDEX idx_media_type ON media(file_type);
```

## 🚀 Deployment Steps

### Pre-deployment

```bash
# 1. Git commit changes
git add .
git commit -m "Production build"

# 2. Build images
docker build -t mehaal-frontend:1.0.0 .
docker build -f backend/Dockerfile.prod -t mehaal-backend:1.0.0 backend/

# 3. Test locally
docker-compose -f docker-compose.prod.yml up
# Verify at http://localhost
```

### Deployment

```bash
# 1. Push to registry (Docker Hub/ECR)
docker push mehaal-frontend:1.0.0
docker push mehaal-backend:1.0.0

# 2. Deploy to server
ssh user@server
cd /app/mehaal
git pull origin main
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# 3. Verify
docker-compose -f docker-compose.prod.yml ps
curl https://yourdomain.com/health
```

## 📈 Performance Optimization

### Frontend
- Minified: ✓
- Code splitting: ✓
- Lazy loading: ✓
- Gzip compression: ✓

### Backend
- Workers: 4 (configurable)
- Connection pooling: ✓
- Database indexes: ✓
- Rate limiting: ✓

### Database
- Indexes on foreign keys: ✓
- Indexes on frequently filtered columns: ✓
- Connection limit: 200
- Shared buffers: 512MB

## 🔄 Monitoring & Logs

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f postgres
docker-compose -f docker-compose.prod.yml logs -f nginx

# Database backups
docker-compose -f docker-compose.prod.yml exec postgres pg_dump \
  -U mehaal_user mehaal_db > backups/backup_$(date +%Y%m%d).sql

# Database size
docker-compose -f docker-compose.prod.yml exec postgres psql \
  -U mehaal_user mehaal_db -c "SELECT pg_size_pretty(pg_database_size('mehaal_db'));"
```

## ⚠️ Common Issues

### Database connection failed
```bash
# Check if postgres is running
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check credentials in .env.prod
cat .env.prod | grep DB_
```

### Backend health check failing
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Test endpoint
curl -v http://localhost:8000/health
```

### Nginx not forwarding
```bash
# Check nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```
