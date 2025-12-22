# Domain Setup Guide - Mehaal CMS

یہ guide آپ کو اپنے custom domain پر Mehaal کو deploy کرنے کا طریقہ بتاتا ہے۔

## مرحلہ 1: Domain خریدیں

1. Domain registrar سے domain خریدیں (GoDaddy, Namecheap, Google Domains وغیرہ)
2. Example: `yourdomain.com`

---

## مرحلہ 2: DNS Settings

### A Records شامل کریں

اپنے domain registrar میں DNS settings میں جائیں اور یہ records شامل کریں:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_SERVER_IP | 3600 |
| A | www | YOUR_SERVER_IP | 3600 |
| A | api | YOUR_SERVER_IP | 3600 |

**جہاں `YOUR_SERVER_IP` آپ کے server کا IP ہے** (Digital Ocean, AWS, Linode وغیرہ)

### CNAME Records (Optional)

اگر subdomain استعمال کر رہے ہیں:

```
CNAME api.yourdomain.com -> yourdomain.com
CNAME www.yourdomain.com -> yourdomain.com
```

---

## مرحلہ 3: SSL Certificate

### آپشن A: Let's Encrypt (Free - Recommended)

```bash
# Docker container میں
docker exec -it mehaal_nginx bash

# Install Certbot
apt-get update && apt-get install -y certbot python3-certbot-nginx

# Certificate حاصل کریں
certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  --email admin@yourdomain.com \
  -n --agree-tos

# Certificates یہ location پر ہوں گے:
# /etc/letsencrypt/live/yourdomain.com/
```

### آپشن B: docker-compose میں

```bash
# Production compose file میں یہ service شامل کریں

services:
  certbot:
    image: certbot/certbot
    volumes:
      - ./ssl:/etc/letsencrypt
    command: >
      certonly --standalone 
      -d yourdomain.com 
      -d www.yourdomain.com
      --email admin@yourdomain.com
      -n --agree-tos
```

---

## مرحلہ 4: Nginx Configuration

### nginx.conf میں Domain Settings

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;
    return 301 https://$host$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;

    # SSL Certificates
    ssl_certificate /etc/nginx/ssl/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # API Routes
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## مرحلہ 5: Environment Variables

### `.env.production` کو اپڈیٹ کریں

```dotenv
# Frontend (.env.production)
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Mehaal
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
```

### Backend `.env.prod` کو اپڈیٹ کریں

```bash
# Mehaal.Backend/.env.prod

# Database
DATABASE_URL=postgresql://mehaal_user:STRONG_PASSWORD@postgres:5432/mehaal_db

# Environment
DEBUG=False
APP_ENV=production
ALLOWED_HOSTS=["yourdomain.com","www.yourdomain.com","api.yourdomain.com"]

# CORS - اپنے domain کے لیے
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]

# Security - STRONG SECRET KEY بنائیں
SECRET_KEY=your-very-strong-secret-key-min-32-chars


```

---

## مرحلہ 6: Docker Compose Setup

### docker-compose.prod.yml میں SSL Volume

```yaml


services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: 
      POSTGRES_PASSWORD: your-strong-password
      POSTGRES_DB: mehaal_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mehaal_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      DATABASE_URL: postgresql://mehaal_user:your-strong-password@postgres:5432/mehaal_db
      APP_ENV: production
    depends_on:
      - postgres
    networks:
      - mehaal_network

  frontend:
    build:
      context: ./
      args:
        VITE_API_URL: https://api.yourdomain.com
    networks:
      - mehaal_network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ../docker/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    networks:
      - mehaal_network

volumes:
  postgres_data:

networks:
  mehaal_network:
    driver: bridge
```

---

## مرحلہ 7: Deployment Steps

### Step 1: Server پر Code اپ لوڈ کریں

```bash
# آپ کے server پر
cd /var/www/mehaal
git clone <your-repo> .
```

### Step 2: SSL Certificates حاصل کریں

```bash
# Let's Encrypt سے
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email admin@yourdomain.com

# Certificates یہاں ہوں گی:
# /etc/letsencrypt/live/yourdomain.com/
```

### Step 3: nginx.conf میں Domain ڈالیں

```bash
# nginx.conf میں آپ کے domain کا نام
cd ../docker
sed -i 's/yourdomain.com/your-actual-domain.com/g' nginx.conf
cd ..
```

### Step 4: Environment Variables سیٹ کریں

```bash
# Backend
cp Mehaal.Backend/.env.example Mehaal.Backend/.env.prod
# .env.prod میں اپنے values ڈالیں

# Frontend
echo "VITE_API_URL=https://api.yourdomain.com" > .env.production
```

### Step 5: Docker Containers چلائیں

```bash
# Production setup
cd docker
docker-compose -f docker-compose.prod.yml up -d
cd ..

# Logs چیک کریں
docker-compose -f docker-compose.prod.yml logs -f

# Database initialize کریں
docker-compose -f docker-compose.prod.yml exec backend python init_db.py
```

---

## مرحلہ 8: SSL Auto-Renewal

### Certbot Auto-Renewal Setup

```bash
# Let's Encrypt certificates auto-renew کریں (ہر 60 دن)

# Cron job شامل کریں:
sudo crontab -e

# یہ line شامل کریں:
0 3 1 * * /usr/bin/certbot renew --quiet && nginx -s reload
```

---

## مرحلہ 9: Verification

### Domain اور SSL چیک کریں

```bash
# DNS چیک کریں
nslookup yourdomain.com

# SSL Certificate چیک کریں
openssl s_client -connect yourdomain.com:443

# Nginx چیک کریں
curl -I https://yourdomain.com
curl -I https://api.yourdomain.com/docs
```

### Browser میں Test کریں

1. https://yourdomain.com - Frontend دیکھیں
2. https://api.yourdomain.com/docs - Swagger UI دیکھیں
3. https://www.yourdomain.com - Redirect دیکھیں

---

## مرحلہ 10: Troubleshooting

### Problem: Certificate نہیں ملی

```bash
# Certbot logs دیکھیں
sudo certbot renew --dry-run -v

# Manual certificate request
sudo certbot certonly --manual \
  -d yourdomain.com \
  --email admin@yourdomain.com
```

### Problem: CORS Error

**Backend `.env` میں یہ سیٹ کریں:**

```bash
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

### Problem: Nginx 502 Bad Gateway

```bash
# Backend health check کریں
cd docker
docker-compose logs backend
cd ..

# Database connection check کریں
cd docker
docker-compose exec backend python -c "
from app.database import SessionLocal
db = SessionLocal()
print('Database Connected!')
"
cd ..
```

### Problem: DNS نہیں resolve ہو رہا

```bash
# DNS propagation check کریں (24-48 ghants لگ سکتے ہیں)
# https://www.whatsmydns.net/

# اپنے registrar میں verify کریں:
# 1. A record صحیح ہے؟
# 2. Nameservers صحیح ہیں؟
# 3. TTL expire ہو گیا؟
```

---

## Complete Domain Setup Checklist

```
✅ Domain خریدی
✅ Nameservers set کیے
✅ A Records شامل کیے
✅ SSL Certificate لی
✅ nginx.conf میں domain ڈالا
✅ .env.production میں URL اپڈیٹ کیا
✅ Backend .env.prod تیار کیا
✅ Docker containers چلائے
✅ SSL auto-renewal setup کیا
✅ Domain test کیا
✅ Admin dashboard accessed کیا
✅ API working ہے
```

---

## Production Ready Checklist

```
✅ Database backups scheduled
✅ Monitoring setup (Optional)
✅ Log aggregation setup (Optional)
✅ Email notifications configured
✅ Rate limiting enabled
✅ Security headers configured
✅ CORS properly configured
✅ Secret keys changed
✅ Database passwords strong
✅ SSL auto-renewal working
```

---

## Support اور FAQs

### Q: Domain propagation میں کتنا وقت لگتا ہے?
**A:** عام طور پر 24-48 گھنٹے لگتے ہیں۔ [whatsmydns.net](https://www.whatsmydns.net/) سے check کریں۔

### Q: مریں subdomain استعمال کر سکتا ہوں?
**A:** ہاں! CNAME records شامل کریں اور nginx میں subdomain لکھیں۔

### Q: SSL سرٹیفیکیٹ expire ہو رہا ہے؟
**A:** Cron job auto-renewal set کریں (Step 8)

### Q: Multiple domains کے لیے?
**A:** nginx میں متعدد server blocks شامل کریں۔

---

## Next Steps

✅ Domain setup complete ہونے کے بعد:

1. **Admin Dashboard**: https://yourdomain.com/admin
2. **Home Page Editor**: https://yourdomain.com/admin/home-page
3. **Platform Settings**: https://yourdomain.com/admin/platform-settings
4. **API Docs**: https://api.yourdomain.com/docs

---

**Need Help?** Backend logs دیکھیں:
```bash
docker-compose -f docker-compose.prod.yml logs -f backend
```
