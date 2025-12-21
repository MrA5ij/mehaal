# Deployment Troubleshooting Guide

## Issue Diagnosis Flowchart

```
کیا مسئلہ ہے؟
│
├─ Domain/DNS Issues
│  ├─ [A] Domain resolve نہیں ہو رہا
│  ├─ [B] DNS propagation سست ہے
│  └─ [C] Wrong IP pointing
│
├─ SSL/HTTPS Issues
│  ├─ [D] Certificate نہیں ملی
│  ├─ [E] Certificate expired
│  └─ [F] SSL mixed content warning
│
├─ Application Issues
│  ├─ [G] 502 Bad Gateway
│  ├─ [H] 503 Service Unavailable
│  ├─ [I] CORS errors
│  └─ [J] Database connection failed
│
└─ Server/Infrastructure Issues
   ├─ [K] Services not running
   ├─ [L] Disk space full
   └─ [M] Memory issues
```

---

## [A] Domain resolve نہیں ہو رہا ❌

### Symptoms:
```
ERR_NAME_NOT_RESOLVED
ERR_INTERNET_DISCONNECTED
```

### Diagnosis:
```bash
# 1. Nameserver check
whois yourdomain.com | grep -i nameserver

# 2. DNS records verify
nslookup yourdomain.com
nslookup www.yourdomain.com
nslookup api.yourdomain.com

# 3. Using dig
dig yourdomain.com
dig @8.8.8.8 yourdomain.com
```

### Solution:
```
1. Registrar میں verify کریں:
   ├─ Nameservers صحیح ہیں؟
   ├─ A records شامل ہیں؟
   └─ TTL proper ہے?

2. 24-48 گھنٹے wait کریں (DNS propagation)

3. Check: https://www.whatsmydns.net/

4. اگر ابھی بھی کام نہیں کر رہا:
   - Registrar support سے contact کریں
   - A records دوبارہ verify کریں
   - Nameservers reset کریں
```

---

## [B] DNS propagation سست ہے 🐢

### Symptoms:
```
کچھ devices پر domain کام کرتا ہے
کچھ devices پر نہیں کرتا
یا invalid certificate error
```

### Diagnosis:
```bash
# Global DNS propagation check
# https://www.whatsmydns.net/

# Check from different locations
# Google DNS
nslookup yourdomain.com 8.8.8.8

# Cloudflare DNS
nslookup yourdomain.com 1.1.1.1
```

### Solution:
```
TTL کو lower کریں (5 منٹ = 300 seconds):
├─ Registrar میں جائیں
├─ DNS records میں TTL update کریں
├─ 300 seconds set کریں
└─ Changes apply ہونے دیں

OR

صرف wait کریں:
└─ Maximum 48 گھنٹے
```

---

## [C] Wrong IP pointing ⚠️

### Symptoms:
```
404 Page Not Found (غلط server)
Connection refused
```

### Diagnosis:
```bash
# Your server IP check
hostname -I
ip addr show

# Check where domain is pointing
nslookup yourdomain.com
# نتیجہ میں address دیکھیں
```

### Solution:
```bash
# اگر IP غلط ہے:

1. Registrar میں جائیں
2. A Records update کریں:
   @ (root)     → YOUR_CORRECT_IP
   www           → YOUR_CORRECT_IP
   api           → YOUR_CORRECT_IP
3. Save کریں
4. 15 منٹ wait کریں
5. نوبارہ test کریں: nslookup yourdomain.com
```

---

## [D] SSL Certificate نہیں ملی 🔒

### Symptoms:
```
ERR_SSL_PROTOCOL_ERROR
SEC_ERROR_UNKNOWN_ISSUER
Your connection is not private
```

### Diagnosis:
```bash
# Check if certbot is installed
which certbot

# Check existing certificates
sudo certbot certificates

# Check dns resolution (required for certbot)
nslookup yourdomain.com

# Manual certificate test
openssl s_client -connect yourdomain.com:443
```

### Solution:
```bash
# Step 1: Verify DNS first
nslookup yourdomain.com
# Should return your server IP

# Step 2: Wait for DNS propagation
# Check: https://www.whatsmydns.net/
# Ensure "A" record is fully propagated

# Step 3: Get certificate
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  --email admin@yourdomain.com \
  -v  # verbose mode

# If error occurs, check logs:
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Step 4: Verify certificate
openssl s_client -connect yourdomain.com:443
# Should show certificate details

# Step 5: Copy to nginx
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /etc/nginx/ssl/
```

---

## [E] SSL Certificate expired ⏰

### Symptoms:
```
Certificate has expired
Your connection is not private (old date)
```

### Diagnosis:
```bash
# Check certificate expiry
openssl s_client -connect yourdomain.com:443 -showcerts | grep -A2 "Validity"

# Or
sudo certbot certificates
```

### Solution:
```bash
# Renew immediately
sudo certbot renew --force-renewal

# Setup auto-renewal
sudo crontab -e

# Add this line:
0 3 1 * * certbot renew --quiet && systemctl reload nginx

# Test auto-renewal works
sudo certbot renew --dry-run
```

---

## [F] SSL mixed content warning ⚠️

### Symptoms:
```
Mixed Content: The page at 'https://...' 
was loaded over HTTPS, but requested 
an insecure resource
```

### Diagnosis:
```bash
# Check nginx config
grep -i "http://" nginx.conf

# Check if backend is being called over HTTP
curl -I http://api.yourdomain.com
```

### Solution:
```
Backend .env میں یقینی بنائیں:
CORS_ORIGINS=["https://yourdomain.com"]
                        ↑
                        https ضروری ہے

Frontend .env میں:
VITE_API_URL=https://api.yourdomain.com
             ↑
             https ضروری ہے
```

---

## [G] 502 Bad Gateway 🔴

### Symptoms:
```
502 Bad Gateway
The server is temporarily unable to service your request
```

### Diagnosis:
```bash
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Check if backend is running
docker-compose -f docker-compose.prod.yml ps

# Check backend health
curl -I http://localhost:8000/health

# Check database connection
docker-compose -f docker-compose.prod.yml exec backend \
  python -c "from app.database import SessionLocal; SessionLocal()"
```

### Solution:
```bash
# Option 1: Restart backend
docker-compose -f docker-compose.prod.yml restart backend

# Option 2: Check database
docker-compose -f docker-compose.prod.yml ps postgres

# If database is down:
docker-compose -f docker-compose.prod.yml restart postgres

# Option 3: Check logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Option 4: Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Option 5: Check port conflicts
netstat -tlnp | grep 8000
# If something is running on 8000, stop it
```

---

## [H] 503 Service Unavailable 🌐

### Symptoms:
```
503 Service Unavailable
Server is temporarily overloaded
```

### Diagnosis:
```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats

# Check nginx
docker-compose -f docker-compose.prod.yml logs nginx

# Check if rate limiting is active
curl -H "X-Real-IP: 1.2.3.4" -I https://yourdomain.com
```

### Solution:
```bash
# Restart services
docker-compose -f docker-compose.prod.yml restart

# Or rebuild everything
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Check resource limits
docker stats

# If memory full, increase resources:
# Edit docker-compose.prod.yml, add:
# deploy:
#   resources:
#     limits:
#       memory: 2G
```

---

## [I] CORS errors 🚫

### Symptoms:
```javascript
Access to XMLHttpRequest at 'https://api.yourdomain.com/api/...' 
from origin 'https://yourdomain.com' has been blocked by CORS policy
```

### Diagnosis:
```bash
# Check backend CORS config
grep -i "CORS_ORIGINS" Mehaal.Backend/.env.prod

# Check nginx headers
curl -I https://api.yourdomain.com/api/home-page/
# Look for: Access-Control-Allow-Origin

# Check actual request
curl -v https://api.yourdomain.com/api/home-page/
```

### Solution:
```bash
# Backend .env.prod میں update کریں:
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]

# NOT localhost!
# NOT http (must be https)

# Restart backend
docker-compose -f docker-compose.prod.yml restart backend

# Test with curl
curl -H "Origin: https://yourdomain.com" \
  -I https://api.yourdomain.com/api/home-page/
```

---

## [J] Database connection failed 🗄️

### Symptoms:
```
FATAL: Ident authentication failed for user "mehaal_user"
Connection refused
```

### Diagnosis:
```bash
# Check postgres is running
docker-compose -f docker-compose.prod.yml ps postgres

# Test connection
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U mehaal_user -d mehaal_db -c "SELECT 1;"

# Check DATABASE_URL
echo $DATABASE_URL

# Check logs
docker-compose -f docker-compose.prod.yml logs postgres
```

### Solution:
```bash
# Option 1: Verify password
# .env.prod میں:
DATABASE_URL=postgresql://mehaal_user:YOUR_PASSWORD@postgres:5432/mehaal_db

# Option 2: Reset postgres
docker-compose -f docker-compose.prod.yml down postgres
docker volume rm mehaal_postgres_data  # ⚠️ Data loss!
docker-compose -f docker-compose.prod.yml up -d postgres

# Option 3: Check postgres logs
docker-compose -f docker-compose.prod.yml logs postgres

# Option 4: Manual test
docker exec mehaal_postgres psql -U mehaal_user -d mehaal_db -c "SELECT 1;"
```

---

## [K] Services not running 💤

### Symptoms:
```
Cannot GET /
Connection refused
```

### Diagnosis:
```bash
# Check status
docker-compose -f docker-compose.prod.yml ps

# Check which services are down
docker-compose -f docker-compose.prod.yml logs

# Check docker daemon
sudo systemctl status docker
```

### Solution:
```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Start specific service
docker-compose -f docker-compose.prod.yml up -d nginx

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# Full rebuild
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

---

## [L] Disk space full 💾

### Symptoms:
```
write error: No space left on device
Docker build fails
```

### Diagnosis:
```bash
# Check disk usage
df -h

# Check docker storage
docker system df

# Check largest files
du -sh /* | sort -hr | head -10
```

### Solution:
```bash
# Clean unused docker images
docker image prune -a

# Clean dangling volumes
docker volume prune

# Clean old logs
docker container prune

# Remove everything unused
docker system prune -a

# Manual cleanup
rm -rf /var/log/*.old
```

---

## [M] Memory issues 🧠

### Symptoms:
```
OOMKilled
Killed process
```

### Diagnosis:
```bash
# Check memory usage
docker stats

# Check if process was killed
dmesg | grep -i "OOM\|killed"
```

### Solution:
```bash
# Increase memory limits in docker-compose.prod.yml:
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

# Restart with new limits
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Or restart server with more RAM
```

---

## General Debugging Commands

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend

# View last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100

# Test API
curl -I https://api.yourdomain.com/docs

# Test website
curl -I https://yourdomain.com

# Test DNS
nslookup yourdomain.com

# Test SSL
openssl s_client -connect yourdomain.com:443

# Access container shell
docker-compose -f docker-compose.prod.yml exec backend bash

# Database shell
docker-compose -f docker-compose.prod.yml exec postgres psql -U mehaal_user -d mehaal_db
```

---

## Emergency Recovery

### Complete Reset (⚠️ Data Loss)
```bash
# Stop everything
docker-compose -f docker-compose.prod.yml down -v

# Remove all data
docker volume prune -a

# Rebuild and start fresh
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Re-initialize
docker-compose -f docker-compose.prod.yml exec backend python init_db.py
```

### Backup Before Reset
```bash
# Database backup
docker-compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U mehaal_user mehaal_db > backup_$(date +%s).sql

# Full data backup
tar -czf backup_$(date +%Y%m%d).tar.gz \
  database/ .env.prod docker-compose.prod.yml
```

---

## Support Resources

- **Docker Issues:** https://docs.docker.com/
- **Let's Encrypt:** https://letsencrypt.org/docs/
- **Nginx Config:** https://nginx.org/en/docs/
- **DNS Help:** https://www.whatsmydns.net/
- **SSL Test:** https://www.ssllabs.com/ssltest/

---

**کوئی اور مسئلہ؟**

```bash
# Collect diagnostic info
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs
docker stats
df -h
nslookup yourdomain.com

# یہ سب logs save کریں اور support سے پوچھیں
```
