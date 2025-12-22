# PRODUCTION GO-LIVE GATES & INTELLIGENT ERROR HANDLING

> Purpose: **No guesswork, no placeholders, no infinite loops**
> This document defines **error handling strategy, env activation locks, data/media handling, and GREEN-only go-live gates**.

---

## 1. PYTHON ENV — ACTIVATION & LOCK (MANDATORY)

### Environment Strategy

- **One virtualenv per environment**
  - `venv.dev`
  - `venv.staging`
  - `venv.prod`

### Creation (example: prod)
```bash
python3.11 -m venv venv.prod
source venv.prod/bin/activate
```

### Activation Lock

- Backend **will refuse to start** if:
  - wrong venv is active
  - env file does not match venv name

### Implementation

`backend/core/env_guard.py`
```python
import os, sys

EXPECTED_ENV = os.getenv("APP_ENV")
VENV = sys.prefix.split("/")[-1]

if EXPECTED_ENV not in VENV:
    raise RuntimeError("Environment mismatch: wrong virtualenv activated")
```

Loaded at app boot.

---

## 2. ENV FILES — NO DUMMY VALUES RULE

### Rule
- ❌ No `changeme`, `dummy`, `placeholder`
- ❌ App will crash if value is missing

### Required ENV (Backend)

| Variable | Source | Why |
|------|------|----|
| APP_ENV | Ops | env guard |
| DATABASE_URL | DBA | DB connection |
| FOUNDER_KEY | Founder | platform settings auth |
| JWT_SECRET | Security | token signing |
| SSO_METADATA_URL | IdP | SSO validation |

Validation at startup using Pydantic settings.

---

## 3. ERROR HANDLING — INTELLIGENT, NON-LOOPING

### Global Rule
- **Fail once, degrade gracefully, never retry blindly**

### Error Classification

| Class | Action |
|----|----|
| ConfigError | Crash startup |
| NetworkError | Serve cached / last-known |
| AuthError | Logout + notify |
| CMSDown | Render last published |
| DBTimeout | Circuit break |

---

## 4. CIRCUIT BREAKER (NO INFINITE LOOPS)

`backend/core/circuit_breaker.py`
```python
FAILURES = {}

def should_open(service):
    return FAILURES.get(service, 0) > 3


def record_failure(service):
    FAILURES[service] = FAILURES.get(service, 0) + 1
```

Used for DB, CMS, SSO.

---

## 5. FRONTEND ERROR STRATEGY

- ErrorBoundary wraps every route
- One error = one log
- UI shows degraded state, not spinner loop

---

## 6. DATA & MEDIA HANDLING (CMS RULES)

### Media Storage

- Images / video stored in object storage (S3-compatible)
- CMS stores **metadata only**

### CMS Media Fields

| Field | Purpose |
|----|----|
| media_id | reference |
| type | image/video |
| width/height | render safety |
| checksum | integrity |

### Folder Structure (Logical)

```
media/
 ├── hero/
 ├── posts/
 ├── docs/
```

CMS never serves raw files directly.

---

## 7. CORE FEATURE LOGIC — VERIFIED IMPLEMENTATIONS

### Hero
- Reads platform settings
- Reads CMS content
- Renders even if CMS down

### Billing
- Plan → Subscription → Invoice flow validated

### Usage
- Write-once, read-aggregated

### Orgs
- User cannot exist without org

### SSO / SCIM
- Metadata validated at save time
- No runtime parsing failures

---

## 8. GREEN GATE CHECKLIST (NO OVERRIDE)

### System
- [ ] Env guard passes
- [ ] No missing env vars
- [ ] pytest green
- [ ] CMS offline test passes
- [ ] DB timeout handled

### Security
- [ ] JWT rotation tested
- [ ] Founder key rotated
- [ ] Rate limits hit test

### Data
- [ ] Media checksum validated
- [ ] No orphan records

### Ops
- [ ] Backup restore tested
- [ ] Circuit breaker opens correctly

---

## FINAL RULE

> **If ANY checkbox is red, production deploy is blocked.**

This document is mandatory and supersedes all ad-hoc decisions.

