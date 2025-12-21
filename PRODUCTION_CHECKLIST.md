# Mehaal CMS - Production Deployment Checklist

## Pre-Deployment

- [ ] Database credentials changed in `.env.prod`
- [ ] JWT_SECRET configured with strong random value
- [ ] FOUNDER_KEY provisioned and stored securely
- [ ] SSO_METADATA_URL points to live IdP metadata
- [ ] SSL certificates placed in `ssl/` directory
- [ ] Domain name updated in `nginx.conf`
- [ ] CORS_ORIGINS updated to production domain
- [ ] Email configuration (SMTP) setup (optional)
- [ ] Backups directory created (`backups/`)
- [ ] Docker and Docker Compose installed
- [ ] Sufficient disk space available (min 20GB recommended)

## Deployment

### Option 1: Using Deployment Script (Recommended)
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Docker Compose
```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Post-Deployment

- [ ] Access https://yourdomain.com/api/docs (Swagger UI)
- [ ] Check database migration status
- [ ] Verify all services are running: `docker-compose -f docker-compose.prod.yml ps`
- [ ] Review logs: `docker-compose -f docker-compose.prod.yml logs -f`
- [ ] Test API endpoints
- [ ] Setup automated backups

## Monitoring

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f postgres
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Database Backup
```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U mehaal_user mehaal_db > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Database Restore
```bash
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U mehaal_user mehaal_db < backups/backup_file.sql
```

## Important Production Settings

### Database Configuration
- Max connections: 200 (configurable)
- Shared buffers: 512MB
- Effective cache size: 2GB
- Adjust based on server specifications

### Nginx Configuration
- Gzip compression enabled
- Rate limiting: 10 req/s for API, 50 req/s for general
- SSL/TLS 1.2 and 1.3 required
- Security headers configured

### FastAPI Configuration
- 4 workers (uvicorn)
- No hot reload
- Production logging

## Security Checklist

- [ ] SSL/TLS certificates valid
- [ ] SSH keys configured for server access
- [ ] Firewall rules configured (allow 80, 443 only)
- [ ] Database password strong (20+ characters)
- [ ] JWT_SECRET strong and unique
- [ ] Regular backups scheduled
- [ ] Monitoring and alerting setup

## Performance Optimization

### Scale Up (if needed)
- Increase uvicorn workers
- Increase database connections
- Increase nginx worker_connections
- Add load balancer (nginx/HAProxy)

### Database Optimization
```sql
CREATE INDEX idx_home_pages_published ON home_pages(is_published);
CREATE INDEX idx_articles_category ON doc_articles(category_id);
CREATE INDEX idx_plans_page ON pricing_plans(page_id);
ANALYZE;
```

## Rollback Procedure

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore database
docker-compose -f docker-compose.prod.yml up -d postgres
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U mehaal_user mehaal_db < backups/backup_previous.sql

# Restart with previous image
docker-compose -f docker-compose.prod.yml up -d
```

## Updating/Patching

```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose -f docker-compose.prod.yml build

# Restart services with zero downtime
docker-compose -f docker-compose.prod.yml up -d --no-deps --build
```

## Support

For issues or questions, refer to the main README or contact support.
