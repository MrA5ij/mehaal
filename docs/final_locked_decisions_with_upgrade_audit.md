# FINAL LOCKED DECISIONS — UPGRADE AUDIT INCLUDED

This document consolidates **ALL FINAL DECISIONS** and explicitly incorporates the **pre-upgrade changes** to prevent conflicts, regressions, or broken flows.

---

## 0. UPGRADE BASELINE (DO NOT BREAK)

The following items are **ALREADY IMPLEMENTED** and are now part of the locked foundation:

### Backend Test & Dependency Integrity

- SQLite-backed dependency overrides added for FastAPI testing
  - Implemented in `tests/conftest.py`
  - Ensures isolated, deterministic test runs

- Smoke test coverage added
  - Implemented in `tests/test_smoke.py`
  - Confirms core endpoints boot and respond

- `httpx` explicitly added to `requirements.txt`
  - Required for Starlette `TestClient`
  - Must NEVER be removed

- Reserved SSO metadata attribute renamed
  - Change applied in `sso.py` (line ~14)
  - All references updated in `sso.py` (lines ~48–83)
  - Prevents import failure under pytest

### Test Status

- `python -m pytest -vv` passes
- Existing Pydantic deprecation warnings acknowledged and tolerated
- No failing tests, no import errors

**This state is the baseline. Any change breaking this is INVALID.**

---

## 1. STRUCTURE — LOCKED (RECONFIRMED)

- `PROJECT_STRUCTURE.md` remains the authoritative source
- No folder moves, renames, or splits allowed
- New code must conform to existing layout

### Conflict Guard

- Tests rely on current module paths
- Changing structure WILL break pytest imports

---

## 2. HERO ARCHITECTURE — LOCKED

- `hero/` directory is the single design-system source
- `components/Hero.tsx` is a thin wrapper ONLY

### Conflict Guard

- Do NOT introduce parallel hero implementations
- Tests may later assert hero availability via wrapper

---

## 3. PLATFORM SETTINGS — LOCKED + TEST-SAFE

- Single-row `platform_settings` table
- Seeded once
- Updated only via founder panel

### Conflict Guard

- Platform settings must be loadable under SQLite test DB
- No PostgreSQL-only constructs inside application logic

---

## 4. CMS — CONTENT ONLY (LOCKED)

- CMS controls text, posts, docs, legal
- CMS does NOT control theme, layout, motion, logos

### Conflict Guard

- CMS routes must remain testable with SQLite overrides
- No raw DB connections in route handlers

---

## 5. SSO / SCIM — LOCKED WITH FIX APPLIED

- Renamed reserved SSO metadata attribute is FINAL
- Do NOT revert attribute name

### Conflict Guard

- Any future SSO changes must respect pytest import safety
- Reserved keywords MUST be avoided

---

## 6. BILLING / USAGE / ORGS — LOCKED

- Schemas exist
- Routes exist
- Empty states allowed

### Conflict Guard

- All endpoints must be discoverable by smoke tests
- No conditional imports

---

## 7. TESTING CONTRACT — LOCKED

- SQLite override in tests is mandatory
- `httpx` dependency is mandatory
- Starlette `TestClient` must remain functional

### Forbidden Actions

- ❌ Removing `httpx`
- ❌ Hard-coding PostgreSQL-only behavior in routes
- ❌ Importing app modules at top-level that require live services

---

## 8. PYDANTIC WARNINGS — ACKNOWLEDGED

- Existing deprecation warnings are known
- Do NOT silence unless upgrading Pydantic version explicitly
- Warnings do not block production

---

## 9. PRODUCTION GATE (FINAL)

System is considered **PRODUCTION-READY ONLY IF**:

- pytest passes without errors
- No import failures
- No test overrides broken
- No reserved-name regressions

---

## FINAL STATEMENT (NON-NEGOTIABLE)

This document supersedes all previous decision notes.

Any change that:
- breaks pytest
- reintroduces reserved keywords
- removes `httpx`
- alters folder structure

is **REJECTED BY DESIGN**.

System status: **LOCKED, STABLE, PRODUCTION-GRADE**.

