# 🎯 Production Quality Gates Checklist

## Pre-Launch Validation

### ✅ Brand & Visual System
- [ ] Brand tokens locked in platform_settings (colors, typography)
- [ ] Hero 3D component renders without CMS/API outage
- [ ] 3D effects degrade gracefully (glow, rotation optional)
- [ ] All fonts loaded correctly
- [ ] Logo assets accessible and cached
- [ ] Dark mode / light mode tested

### ✅ Hero Component
- [ ] Entry animations smooth (60 FPS)
- [ ] CTA buttons functional and clickable
- [ ] Hover states work on desktop & touch devices
- [ ] Responsive at all breakpoints (320px - 4K)
- [ ] Performance: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] 3D background doesn't break on low-end devices

### ✅ CMS Integration
- [ ] Home page content loads from `/api/home-page`
- [ ] Platform settings load from `/api/platform-settings`
- [ ] Fallback content shows if CMS is down
- [ ] Cache headers configured (30s for CMS, 60s for settings)

### ✅ Founder Admin Panel
- [ ] Authentication required (X-Platform-Key header)
- [ ] Update settings → increments version
- [ ] Version history shows all changes
- [ ] Rollback works (restores to previous version)
- [ ] Unauthorized access rejected with 403

### ✅ Database & Migrations
- [ ] Migration `002_add_versioning.sql` executed
- [ ] platform_settings table has `version` column
- [ ] platform_settings_history table created with indexes
- [ ] No orphaned data or constraints

### ✅ API Endpoints
- [ ] GET `/api/platform-settings` → returns full settings
- [ ] PUT `/api/platform-settings` + founder key → updates + versioning
- [ ] GET `/api/platform-settings/history/versions` → version list
- [ ] POST `/api/platform-settings/rollback/{version}` → restores state
- [ ] All endpoints return proper error codes (401, 403, 404, 500)

### ✅ Frontend Configuration
- [ ] VITE_FOUNDER_KEY set in .env.production
- [ ] VITE_API_URL points to production backend
- [ ] API utilities handle founder key in headers
- [ ] Error handling for missing founder key

### ✅ Security
- [ ] FOUNDER_KEY never committed to repo
- [ ] All sensitive endpoints require header validation
- [ ] CORS configured for production domain only
- [ ] SQL injection prevention (SQLAlchemy ORM)
- [ ] Rate limiting on admin endpoints (10/min)
- [ ] APP_ENV matches activated virtualenv (venv.<env>)
- [ ] Env guard passes with no runtime overrides
- [ ] SSO_METADATA_URL verified against IdP change log

### ✅ Performance & Reliability
- [ ] API latency < 200ms (p95)
- [ ] Database query optimization (indexes on foreign keys)
- [ ] CDN cache hit ratio > 80%
- [ ] Error rate < 0.1%
- [ ] Uptime target: 99.9%

### ✅ Deployment
- [ ] Docker builds pass (backend & frontend)
- [ ] Environment variables in CI/CD secrets
- [ ] Database backups configured
- [ ] Rollback procedure documented & tested
- [ ] Monitoring/logging in place
- [ ] `.env.<env>` files synced with deployment secrets
- [ ] JWT secrets rotated pre-launch

### ✅ Documentation
- [ ] PRODUCTION_CONFIG.md complete
- [ ] API endpoint docs updated
- [ ] Environment variable list documented
- [ ] Rollback procedure clear & tested
- [ ] Team trained on emergency procedures

---

## Launch Day Checklist

### 1 Hour Before Launch
- [ ] Final database backup
- [ ] Monitoring dashboards open
- [ ] On-call team ready
- [ ] Communication channels open

### At Launch
- [ ] Deploy backend
- [ ] Run database migrations
- [ ] Deploy frontend
- [ ] Verify all endpoints responding
- [ ] Check logs for errors

### 1 Hour After Launch
- [ ] Monitor error rate
- [ ] Check API latencies
- [ ] Verify cache hit ratios
- [ ] Test founder admin panel
- [ ] Confirm no 5xx errors

### Daily for First Week
- [ ] Review logs for anomalies
- [ ] Check performance metrics
- [ ] Test rollback procedure once
- [ ] Verify backups running

---

## Emergency Procedures

### If Hero Doesn't Render
1. Check `/api/platform-settings` response
2. Verify 3D library loaded (check Network tab)
3. Fallback to CSS-only background
4. Contact support team

### If Settings Update Fails
1. Check founder key in browser console
2. Verify X-Platform-Key header sent
3. Check database connection
4. Review server logs

### If Rollback Needed
1. Get current version: `GET /history/versions`
2. Rollback: `POST /rollback/{version}`
3. Purge CDN cache
4. Verify on frontend

### If Database Is Down
1. Switch to read-only mode
2. Show cached version of site
3. Notify team immediately
4. Restore from backup

---

## Success Criteria

✅ **Launch is successful when:**
- All hero components render within 2.5s
- Platform settings update completes in < 500ms
- Version history tracks all changes
- Founder admin panel fully functional
- Zero unauthorized access attempts
- Error rate trending toward 0
- Team confident in rollback procedure
