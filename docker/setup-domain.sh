#!/bin/bash

# Mehaal Domain Setup Script
# یہ script آپ کے domain کو automatically configure کرتا ہے

set -e

echo "🚀 Mehaal Domain Setup Script"
echo "=================================="
echo ""

# Function: Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Domain input
echo -e "${BLUE}Step 1: Domain Information${NC}"
read -p "Enter your domain (e.g., yourdomain.com): " DOMAIN
read -p "Enter your email for SSL (e.g., admin@yourdomain.com): " ADMIN_EMAIL
read -p "Enter your server IP address: " SERVER_IP

echo -e "${GREEN}✓ Domain: $DOMAIN${NC}"
echo -e "${GREEN}✓ Email: $ADMIN_EMAIL${NC}"
echo -e "${GREEN}✓ Server IP: $SERVER_IP${NC}"
echo ""

# 2. Database password
echo -e "${BLUE}Step 2: Security Settings${NC}"
read -s -p "Enter database password (min 16 chars): " DB_PASSWORD
echo ""
read -s -p "Confirm password: " DB_PASSWORD_CONFIRM
echo ""

if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
    echo -e "${RED}✗ Passwords do not match!${NC}"
    exit 1
fi

if [ ${#DB_PASSWORD} -lt 16 ]; then
    echo -e "${RED}✗ Password must be at least 16 characters!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Password set${NC}"
echo ""

# 3. Generate security material
echo -e "${BLUE}Step 3: Generating Security Material${NC}"
JWT_SECRET=$(openssl rand -hex 64)
FOUNDER_KEY=$(openssl rand -hex 48)
echo -e "${GREEN}✓ JWT secret and founder key generated${NC}"
echo ""

# 4. Capture SSO metadata endpoint
echo -e "${BLUE}Step 4: Capturing SSO Metadata URL${NC}"
read -p "Enter IdP metadata URL (https://...): " SSO_METADATA_URL
if [[ -z "${SSO_METADATA_URL}" || "${SSO_METADATA_URL}" =~ (changeme|placeholder|example|dummy) ]]; then
   echo -e "${RED}✗ Provide a real metadata URL; placeholders are not allowed${NC}"
   exit 1
fi
echo -e "${GREEN}✓ SSO metadata URL captured${NC}"
echo ""

# 5. Create nginx config
echo -e "${BLUE}Step 5: Configuring Nginx${NC}"
if [ ! -f "nginx.conf.template" ]; then
    echo -e "${RED}✗ nginx.conf.template not found!${NC}"
    exit 1
fi

DOMAIN_ESCAPED=$(echo $DOMAIN | sed 's/\./\\\./g')
sed "s/\${DOMAIN}/$DOMAIN/g" nginx.conf.template > nginx.conf
echo -e "${GREEN}✓ nginx.conf created for $DOMAIN${NC}"
echo ""

# 6. Create backend .env.prod
echo -e "${BLUE}Step 6: Configuring Backend Environment${NC}"
cat > Mehaal.Backend/.env.prod << EOF
# Database
DATABASE_URL=postgresql+psycopg://mehaal_user:${DB_PASSWORD}@postgres:5432/mehaal_db
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40

# Environment
APP_ENV=prod
DEBUG=False
APP_ENV=production

# CORS
CORS_ORIGINS=["https://${DOMAIN}","https://www.${DOMAIN}"]

# Security
FOUNDER_KEY=${FOUNDER_KEY}
JWT_SECRET=${JWT_SECRET}
SSO_METADATA_URL=${SSO_METADATA_URL}
ALLOWED_HOSTS=["${DOMAIN}","www.${DOMAIN}","api.${DOMAIN}"]

# Email Configuration (Optional)
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASSWORD=${SMTP_PASSWORD}
ADMIN_EMAIL=${ADMIN_EMAIL}

# Logging
LOG_LEVEL=info

# API
API_RATE_LIMIT=1000/hour
EOF

echo -e "${GREEN}✓ Mehaal.Backend/.env.prod created${NC}"
echo ""

# 7. Create frontend .env.production
echo -e "${BLUE}Step 7: Configuring Frontend Environment${NC}"
cat > .env.production << EOF
# Frontend Environment Variables - Production
VITE_API_URL=https://api.${DOMAIN}
VITE_APP_NAME=Mehaal
VITE_APP_VERSION=1.0.0
VITE_FOUNDER_KEY=${FOUNDER_KEY}
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
EOF

echo -e "${GREEN}✓ .env.production created${NC}"
echo ""

# 8. Create docker-compose.prod config
echo -e "${BLUE}Step 8: Preparing Docker Compose${NC}"
# Update docker-compose.prod.yml with new database password
# This is a simplified version - adjust based on your actual compose file
cat > docker-compose.override.yml << EOF
version: '3.8'

services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
EOF

echo -e "${GREEN}✓ Docker configuration ready${NC}"
echo ""

# 8. DNS Instructions
echo -e "${BLUE}Step 8: DNS Configuration Instructions${NC}"
cat << EOF

${YELLOW}⚠️  IMPORTANT: Add these DNS records to your domain registrar:${NC}

Type | Name | Value | TTL
-----|------|-------|-----
A    | @    | ${SERVER_IP} | 3600
A    | www  | ${SERVER_IP} | 3600
A    | api  | ${SERVER_IP} | 3600

You can also use CNAME records if preferred:
CNAME | www.${DOMAIN} | ${DOMAIN} | 3600
CNAME | api.${DOMAIN} | ${DOMAIN} | 3600

Propagation may take 24-48 hours. Check: https://www.whatsmydns.net/

EOF

echo -e "${GREEN}✓ DNS records documented${NC}"
echo ""

# 9. SSL Certificate instructions
echo -e "${BLUE}Step 9: SSL Certificate Setup${NC}"
cat << EOF

${YELLOW}Two options for SSL certificates:${NC}

Option A: Let's Encrypt (Recommended - Free)
------------------------------------------
After DNS propagation, run:

  sudo certbot certonly --standalone \\
    -d ${DOMAIN} \\
    -d www.${DOMAIN} \\
    -d api.${DOMAIN} \\
    --email ${ADMIN_EMAIL} \\
    -n --agree-tos

Certificates will be in: /etc/letsencrypt/live/${DOMAIN}/

Option B: Self-signed (Development Only)
-----------------------------------------
  mkdir -p ssl
  openssl req -x509 -newkey rsa:4096 -nodes \\
    -out ssl/cert.pem -keyout ssl/key.pem -days 365

EOF

echo -e "${GREEN}✓ SSL instructions provided${NC}"
echo ""

# 10. Deployment checklist
echo -e "${BLUE}Step 10: Pre-Deployment Checklist${NC}"
cat << EOF

${YELLOW}Before deploying, verify:${NC}

1. DNS Records
   [ ] Added A/CNAME records to registrar
   [ ] DNS propagation checked (whatsmydns.net)

2. SSL Certificates
   [ ] Let's Encrypt certificates obtained
   [ ] Certificate files in /etc/nginx/ssl/live/${DOMAIN}/
   [ ] Auto-renewal cron job configured

3. Configuration Files
   [ ] nginx.conf updated with domain
   [ ] Mehaal.Backend/.env.prod configured
   [ ] .env.production configured
   [ ] docker-compose.prod.yml ready

4. Database
   [ ] Database password strong (16+ chars)
   [ ] Database migrations tested
   [ ] Backup strategy in place

5. Security
   [ ] JWT_SECRET rotated and stored securely
   [ ] FOUNDER_KEY synchronized with frontend
   [ ] SSO_METADATA_URL points to live IdP metadata
   [ ] ALLOWED_HOSTS configured
   [ ] CORS origins set correctly
   [ ] Rate limiting enabled

6. Monitoring
   [ ] Health check endpoint configured
   [ ] Error logging enabled
   [ ] Uptime monitoring setup (optional)

EOF

# 11. Deployment command
echo ""
echo -e "${BLUE}Step 11: Deployment Commands${NC}"
cat << EOF

${YELLOW}To deploy your application:${NC}

1. Copy configuration files to server:
   scp -r . user@${SERVER_IP}:/var/www/mehaal/

2. On your server, build and start:
   cd /var/www/mehaal
   docker-compose -f docker-compose.prod.yml up -d

3. Initialize database:
   docker-compose -f docker-compose.prod.yml exec backend \\
     python init_db.py

4. Check status:
   docker-compose -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.prod.yml logs -f

5. Access your application:
   https://${DOMAIN}
   https://api.${DOMAIN}/docs

EOF

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Configuration Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Add DNS records to your registrar"
echo "2. Wait 24-48 hours for DNS propagation"
echo "3. Obtain SSL certificate from Let's Encrypt"
echo "4. Deploy using the commands above"
echo ""
echo -e "${BLUE}Files created:${NC}"
echo "  ✓ nginx.conf"
echo "  ✓ Mehaal.Backend/.env.prod"
echo "  ✓ .env.production"
echo ""
