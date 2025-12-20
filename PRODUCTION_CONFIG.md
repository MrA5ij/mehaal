# Production Configuration Guide

## Environment Variables

Create a `.env.production` file with the following:

```bash
# Frontend
NEXT_PUBLIC_FOUNDER_KEY=your_secure_founder_key_here
NEXT_PUBLIC_CMS_URL=https://cms.mehaal.ai
NEXT_PUBLIC_API_URL=https://api.mehaal.ai
NODE_ENV=production

# Backend
FOUNDER_KEY=your_secure_founder_key_here
DATABASE_URL=postgresql://user:password@prod-db-host:5432/mehaal_prod
ENVIRONMENT=production
LOG_LEVEL=info

# Security
ALLOWED_ORIGINS=https://mehaal.ai,https://www.mehaal.ai
SECURE_COOKIES=true
ENABLE_CORS=true
```

## CDN & Caching Strategy

### Cloudflare or similar CDN configuration:

```
Cache Rules:
- /platform-settings → Cache 60s (with purge on admin save)
- /home-page → Cache 30s
- /assets/* → Cache 1 year (immutable)
- /api/* → Don't cache
```

### Cache Control Headers (Backend)

Add to platform_settings route:

```python
from fastapi.responses import JSONResponse

@router.get("")
async def get_platform_settings(...):
    # ... existing code ...
    response = JSONResponse(content=data)
    response.headers["Cache-Control"] = "public, max-age=60, s-maxage=60"
    return response
```

### Cache Invalidation

On every update:

```python
# In update endpoint
async def purge_cdn_cache(endpoint: str):
    """Purge Cloudflare cache"""
    cf_response = requests.post(
        f"https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/purge_cache",
        headers={"Authorization": f"Bearer {CF_API_TOKEN}"},
        json={"files": [f"https://mehaal.ai/api/{endpoint}"]}
    )
    return cf_response.ok
```

## Production Deployment Checklist

### Before Launch
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] CDN zones configured
- [ ] Monitoring/logging enabled
- [ ] Backup strategy in place

### Post-Launch Monitoring
- [ ] API response times < 200ms
- [ ] Cache hit ratio > 80%
- [ ] 0 database connection errors
- [ ] Error rate < 0.1%

## Security Hardening

1. **Founder Key Management**
   - Use AWS Secrets Manager or similar
   - Rotate quarterly
   - Never commit to repo

2. **Rate Limiting**
   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   
   @router.put("", dependencies=[Depends(limiter.limit("10/minute"))])
   async def update_settings(...):
       ...
   ```

3. **Request Validation**
   - All inputs validated via Pydantic
   - Max payload size: 1MB
   - SQL injection prevention via ORM

## Rollback Procedure

If critical issue detected:

```bash
# 1. Check version history
curl https://api.mehaal.ai/api/platform-settings/history/versions \
  -H "X-Platform-Key: $FOUNDER_KEY"

# 2. Rollback to previous version
curl -X POST https://api.mehaal.ai/api/platform-settings/rollback/2 \
  -H "X-Platform-Key: $FOUNDER_KEY" \
  -H "Content-Type: application/json"

# 3. Purge CDN cache
# (Automatically triggered by rollback endpoint)
```

## Monitoring & Alerting

Set up alerts for:
- API latency > 500ms
- Error rate > 1%
- Failed platform settings updates
- Unauthorized access attempts
- Database connection pool exhaustion
