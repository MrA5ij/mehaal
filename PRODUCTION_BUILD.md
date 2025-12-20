# Production Build - Checklist اور Files

## Frontend (.tsx) کے لیے کیا کریں:

### 1. Vite Config میں Environment Variables

```javascript
// vite.config.js میں یہ شامل کریں:
import.meta.env.VITE_API_URL  // API endpoint
import.meta.env.VITE_APP_NAME // App name
import.meta.env.VITE_VERSION  // Version
```

### 2. Build Optimization

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'utils': ['src/utils'],
        },
      },
    },
  },
}
```

## Backend (FastAPI) کے لیے:

### 1. Requirements Production

```bash
# Development dependencies REMOVE کریں:
# pytest, pytest-cov, black, flake8

# Add کریں production میں:
gunicorn==21.2.0  # Better than uvicorn alone
psycopg2-binary==2.9.9  # DB driver
python-dotenv==1.0.0  # ENV vars
```

### 2. Database Migrations

SQLAlchemy automatically tables create کرتا ہے Base.metadata.create_all() سے
لیکن production میں Alembic استعمال کریں

### 3. CORS Properly Configure

```python
# main.py میں
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Content-Type", "Authorization"],
)
```

## Nginx Configuration

### 1. SSL/TLS Certificates

```bash
# Self-signed (testing کے لیے):
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes

# Production میں Let's Encrypt استعمال کریں:
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### 2. Environment-specific Nginx configs

```nginx
# production میں یہ settings ضروری:
- Worker processes: auto
- Worker connections: 2048
- Keepalive timeout: 65
- Gzip compression: on
- Rate limiting: enabled
- Security headers: all
- SSL: required (TLS 1.2+)
```

## Docker Configuration

### 1. Multi-stage Build (Dockerfile)

```dockerfile
# Frontend:
FROM node:18-alpine AS builder
RUN npm ci --only=production  # Exact versions
RUN npm run build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
# Serve as static
```

### 2. Backend Dockerfile

```dockerfile
FROM python:3.11-slim
RUN pip install gunicorn  # Production server
COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir
# NO --reload flag
CMD ["gunicorn", "-w 4", "-b 0.0.0.0:8000", "app.main:app"]
```

### 3. .dockerignore

```
node_modules
.git
.env
.env.local
dist
*.log
backups
```

## Spaceship Hosting (Static Frontend)

Since Spaceship is a static site host, deploy the built frontend:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to Spaceship's file manager or connect Git repository.

3. Set environment variables in Spaceship dashboard:
   - `VITE_API_URL`: Your backend API URL (e.g., https://your-backend.com)

4. For the backend, host separately on a platform that supports Python/FastAPI (e.g., Railway, Render, or VPS).

5. Update CORS in backend to allow your Spaceship domain.
