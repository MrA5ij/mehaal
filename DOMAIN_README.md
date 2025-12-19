# Domain & Production Deployment Guide

## تمام Domain Setup Documents

Mehaal میں domain setup کے لیے یہ documents موجود ہیں:

### 1. **DOMAIN_QUICK_REFERENCE.md** ⚡
- **مقصد:** فوری setup کے لیے
- **وقت:** 5 منٹ میں پڑھیں
- **استعمال:** جلدی سے domain setup کرنی ہو

### 2. **DOMAIN_SETUP.md** 📚
- **مقصد:** تفصیلی step-by-step guide
- **وقت:** 30 منٹ میں پڑھیں
- **استعمال:** ہر تفصیل سمجھنی ہو

### 3. **setup-domain.sh** 🔧
- **مقصد:** Linux server پر خودکار setup
- **استعمال:** `./setup-domain.sh` (Linux/Mac)
- **کیا کرتا ہے:** تمام files خود configure کرے

### 4. **setup-domain.ps1** 🪟
- **مقصد:** Windows پر خودکار setup
- **استعمال:** `PowerShell -ExecutionPolicy Bypass -File setup-domain.ps1`
- **کیا کرتا ہے:** تمام files خود configure کرے

---

## کون سا Document استعمال کریں؟

```
میری situation کیا ہے?
│
├─ میں سب کچھ فوری حل چاہتا ہوں
│  └─ DOMAIN_QUICK_REFERENCE.md پڑھیں
│
├─ میں تمام تفصیلات سمجھنا چاہتا ہوں
│  └─ DOMAIN_SETUP.md پڑھیں
│
├─ میں Linux server پر ہوں
│  └─ ./setup-domain.sh چلائیں
│
└─ میں Windows پر ہوں
   └─ setup-domain.ps1 چلائیں
```

---

## سب سے تیز Setup (10 منٹ)

### 1. Windows پر:
```powershell
# Setup script چلائیں
PowerShell -ExecutionPolicy Bypass -File setup-domain.ps1

# یہ پوچھے گا:
# - Domain name
# - Email
# - Server IP
# - Database password

# فوری طور پر یہ تیار ہوں گی:
# ✅ nginx.conf
# ✅ .env.production
# ✅ backend/.env.prod
```

### 2. Linux/Mac پر:
```bash
# Setup script چلائیں
chmod +x setup-domain.sh
./setup-domain.sh

# باقی DOMAIN_QUICK_REFERENCE.md دیکھیں
```

---

## DNS Setup (تمام Registrars کے لیے)

### GoDaddy
1. DNS → DNS Management
2. Add A Records
3. Save

### Namecheap
1. Dashboard → Manage
2. DNS → Custom DNS
3. Add Records

### Google Domains
1. DNS → Custom Records
2. Add A Records

### کیا records add کریں:

```
Type: A
Name: @
Value: 1.2.3.4 (آپ کا server IP)

Type: A
Name: www
Value: 1.2.3.4

Type: A
Name: api
Value: 1.2.3.4
```

---

## SSL Certificate (Let's Encrypt)

### آپ کے server پر:

```bash
# 1. Certbot install کریں
sudo apt-get install certbot python3-certbot-nginx

# 2. DNS propagation wait کریں (24-48 hours)

# 3. Certificate حاصل کریں
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  --email admin@yourdomain.com

# 4. Auto-renewal setup کریں
sudo crontab -e

# یہ line شامل کریں:
0 3 1 * * certbot renew --quiet && systemctl reload nginx
```

---

## Production Checklist

```markdown
[ ] Domain خریدی
    └─ GoDaddy/Namecheap سے

[ ] DNS Records شامل کیے
    ├─ A @ -> server IP
    ├─ A www -> server IP
    └─ A api -> server IP

[ ] DNS Propagation verified
    ├─ whatsmydns.net چیک کیا
    └─ nslookup یا dig سے verify کیا

[ ] SSL Certificate لی
    ├─ Let's Encrypt سے
    ├─ Auto-renewal configured
    └─ Certificate paths सरि ہیں

[ ] Files Configure کیے
    ├─ nginx.conf میں domain
    ├─ .env.production (frontend)
    ├─ backend/.env.prod
    └─ docker-compose.prod.yml

[ ] Database Setup
    ├─ Strong password set
    ├─ Tables created
    └─ Migrations applied

[ ] Security Configured
    ├─ SECRET_KEY set
    ├─ ALLOWED_HOSTS updated
    ├─ CORS origins configured
    └─ Rate limiting enabled

[ ] Services Running
    ├─ PostgreSQL ✓
    ├─ Backend (8000) ✓
    ├─ Frontend (3000) ✓
    └─ Nginx (443) ✓

[ ] Testing Done
    ├─ https://yourdomain.com loads
    ├─ Admin panel accessible
    ├─ API responds
    └─ SSL certificate valid

[ ] Monitoring Setup
    ├─ Logs configured
    ├─ Health checks enabled
    └─ Backups scheduled (optional)
```

---

## Server Requirements

```
Minimum:
├─ 2GB RAM
├─ 10GB Disk
├─ 2 CPU cores
└─ Linux (Ubuntu 20.04+)

Recommended:
├─ 4GB RAM
├─ 50GB SSD
├─ 4 CPU cores
└─ Ubuntu 22.04
```

---

## Server Providers

**جہاں سے server خرید سکتے ہیں:**

1. **DigitalOcean** - $5/month سے شروع
   - خریدارانہ setup: `ufw enable`, `docker install`
   
2. **Linode** - $5/month سے شروع
   - Static IP ملتا ہے

3. **AWS** - Free tier موجود
   - EC2 instance لیں

4. **Vultr** - $2.50/month سے شروع
   - ہلکا اور تیز

---

## Deployment Steps

### 1. Server پر Setup
```bash
# SSH کریں
ssh root@your-server-ip

# Directory بنائیں
mkdir -p /var/www/mehaal
cd /var/www/mehaal

# Code clone کریں
git clone <your-repo> .
```

### 2. Configuration
```bash
# Setup script چلائیں (اگر Linux ہو)
./setup-domain.sh

# یا manually configure کریں
# - nginx.conf update کریں
# - .env files تیار کریں
```

### 3. SSL Certificate
```bash
# DNS propagation کے بعد
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com
```

### 4. Deploy
```bash
# Docker images build کریں
docker-compose -f docker-compose.prod.yml build

# Services start کریں
docker-compose -f docker-compose.prod.yml up -d

# Database initialize کریں
docker-compose -f docker-compose.prod.yml exec backend \
  python init_db.py
```

### 5. Verify
```bash
# Services check کریں
docker-compose -f docker-compose.prod.yml ps

# Logs دیکھیں
docker-compose -f docker-compose.prod.yml logs -f

# API test کریں
curl -I https://api.yourdomain.com/docs

# Website test کریں
curl -I https://yourdomain.com
```

---

## Common Issues اور Fixes

### Issue: DNS نہیں resolve ہو رہا

```bash
# Check nameservers
whois yourdomain.com

# DNS propagation wait کریں: 24-48 hours
# Check: https://www.whatsmydns.net/
```

### Issue: SSL Certificate نہیں ملی

```bash
# Verify DNS first
nslookup yourdomain.com

# Then get certificate
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email admin@yourdomain.com \
  -v
```

### Issue: 502 Bad Gateway

```bash
# Backend logs دیکھیں
docker-compose -f docker-compose.prod.yml logs backend

# Database connection check کریں
docker-compose -f docker-compose.prod.yml exec backend \
  python -c "from app.database import SessionLocal; print('OK')"

# Backend restart کریں
docker-compose -f docker-compose.prod.yml restart backend
```

### Issue: CORS Error

```
Backend .env.prod میں:
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]

پھر restart کریں:
docker-compose -f docker-compose.prod.yml restart backend
```

---

## Monitoring & Maintenance

### Daily Check
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Database Backup
```bash
docker-compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U mehaal_user mehaal_db > backup.sql
```

### Update Application
```bash
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

---

## Support

**اگر مسائل ہوں تو:**

1. DOMAIN_SETUP.md میں troubleshooting سیکشن دیکھیں
2. Docker logs دیکھیں: `docker-compose logs`
3. SSL test کریں: https://www.ssllabs.com/ssltest/
4. DNS checker: https://www.whatsmydns.net/

---

## Quick Links

- [DOMAIN_QUICK_REFERENCE.md](./DOMAIN_QUICK_REFERENCE.md) - فوری reference
- [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) - تفصیلی guide
- [setup-domain.sh](./setup-domain.sh) - Linux script
- [setup-domain.ps1](./setup-domain.ps1) - Windows script
- [nginx.conf.template](./nginx.conf.template) - Nginx template

---

**Your domain is ready! 🎉**

```
✅ yourdomain.com        → Frontend
✅ www.yourdomain.com    → Frontend (redirected)
✅ api.yourdomain.com    → API + Swagger
```

استعمال کریں اور اپنے منتظر عملاء کو خدمت دیں! 🚀
