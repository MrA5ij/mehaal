# Domain Setup Quick Reference

## کیوں Domain چاہیے؟

```
localhost:3000  (Development)  ❌ Production کے لیے نہیں
yourdomain.com (Production)     ✅ Professional, SSL, Email auth
```

---

## 3 Steps میں Domain Setup

### Step 1️⃣: Domain خریدیں (10 منٹ)

```
GoDaddy.com → yourdomain.com خریدیں → Nameservers یاد کریں
```

### Step 2️⃣: DNS Records شامل کریں (5 منٹ)

```
A Record:
  Name: @    Value: 1.2.3.4     (آپ کا server IP)
  Name: www  Value: 1.2.3.4
  Name: api  Value: 1.2.3.4
```

### Step 3️⃣: SSL Certificate لیں (5 منٹ)

```bash
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com
```

---

## Configuration Files میں تبدیلی

| File | تبدیلی |
|------|--------|
| `nginx.conf` | Domain ڈالیں: `yourdomain.com` |
| `.env.production` | API URL: `https://api.yourdomain.com` |
| `Mehaal.Backend/.env.prod` | ALLOWED_HOSTS, CORS_ORIGINS |

---

## Automated Setup

```bash
# ایک script script چلائیں
chmod +x ../scripts/setup-domain.sh
../scripts/setup-domain.sh

# یہ پوچھے گا:
# 1. Domain name
# 2. Email
# 3. Server IP
# 4. Database password

# خودکار طور پر یہ کریں گی:
# ✅ docker/nginx.conf update
# ✅ Environment files تیار
# ✅ SSL instructions دیں
```

---

## DNS Propagation Check

```bash
# Method 1: Online
https://www.whatsmydns.net/

# Method 2: Terminal
nslookup yourdomain.com

# Propagation عام طور پر: 1-48 گھنٹے
```

---

## SSL Certificate Renewal

```bash
# Auto-renewal setup
sudo crontab -e

# یہ line شامل کریں:
0 3 1 * * certbot renew --quiet && systemctl reload nginx
```

---

## Production Checklist

```
DNS Setup
├─ A records added
├─ Propagation verified
└─ nslookup working ✓

SSL Certificate
├─ Let's Encrypt obtained
├─ Auto-renewal configured
└─ Certificate valid ✓

Configuration
├─ nginx.conf updated
├─ .env files configured
├─ Docker compose ready
└─ Secrets set ✓

Deployment
├─ Code pushed to server
├─ Docker images built
├─ Database initialized
└─ Services running ✓

Testing
├─ https://yourdomain.com loads
├─ https://api.yourdomain.com/docs works
├─ Admin panel accessible
└─ All features working ✓
```

---

## Common Issues & Fixes

### DNS نہیں resolve ہو رہا

```bash
# Check nameservers
whois yourdomain.com | grep -i nameserver

# Wait 24-48 hours, then:
nslookup yourdomain.com
```

### SSL Certificate error

```bash
# Check certificate expiry
openssl s_client -connect yourdomain.com:443 | grep -A5 "Validity"

# Renew if needed
sudo certbot renew --force-renewal
```

### 502 Bad Gateway

```bash
# Check backend
docker-compose logs backend

# Check database
docker-compose exec backend python -c "
from app.database import SessionLocal
db = SessionLocal()
print('Database OK')
"
```

---

## Environment Variables Cheat Sheet

### Frontend (.env.production)
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Mehaal
```

### Backend (.env.prod)
```bash
DATABASE_URL=postgresql://user:pass@postgres:5432/db
ALLOWED_HOSTS=["yourdomain.com","www.yourdomain.com"]
CORS_ORIGINS=["https://yourdomain.com"]
SECRET_KEY=your-strong-secret-key
```

---

## Server Deployment

```bash
# 1. SSH to server
ssh user@your-server-ip

# 2. Setup directory
mkdir -p /var/www/mehaal
cd /var/www/mehaal

# 3. Clone code
git clone <repo> .

# 4. Run setup script
./setup-domain.sh

# 5. Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# 6. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 7. Initialize database
docker-compose -f docker-compose.prod.yml exec backend python init_db.py

# 8. Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## Monitoring Commands

```bash
# Check services
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Check database connection
docker-compose -f docker-compose.prod.yml exec backend \
  python -c "from app.database import SessionLocal; print('DB OK')"

# Test API
curl -I https://api.yourdomain.com/docs

# Test frontend
curl -I https://yourdomain.com
```

---

## Database Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump \
  -U mehaal_user mehaal_db > backup_${DATE}.sql

# Add to crontab:
0 2 * * * /path/to/backup-script.sh
```

---

## Emergency Procedures

### Restart Services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### View Real-time Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

### Reset Everything (⚠️ Data Loss)
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

---

## Support Resources

- **Nginx Issues**: https://nginx.org/
- **Let's Encrypt**: https://letsencrypt.org/
- **Docker Docs**: https://docs.docker.com/
- **DNS Checker**: https://www.whatsmydns.net/
- **SSL Test**: https://www.ssllabs.com/ssltest/

---

**Done! 🎉 Your domain is live!**

```
✅ yourdomain.com        (Frontend)
✅ www.yourdomain.com    (Frontend redirect)
✅ api.yourdomain.com    (API & Swagger)
```
