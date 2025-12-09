# MEHAAL TECH AI - Copilot Instructions

## Project Overview
Marketing website for MEHAAL TECH AI—a voice-native AI ecosystem. This is a hybrid Express.js application with dual rendering strategies:
- **Pug templates** for server-side rendering (`views/`)
- **Static HTML** for direct serving (`public/index.html`)

The project showcases AI products (Accountant, Accountant Pro, Assistant Shop) with animated hero sections and brand-focused content.

## Architecture & Key Patterns

### Dual Frontend Approach
- **Primary**: `public/index.html` — standalone hero page with video backgrounds, logo animations, and settings panel
- **Secondary**: Pug views (`views/index.pug`, `views/layout.pug`) — traditional Express SSR setup
- Both coexist; `public/` takes precedence due to `express.static()` middleware ordering in `app.js`

### Entry Points
- **`server.js`**: Production entry point used by cPanel/Passenger (custom port handling via `PORT` or `APP_PORT` env vars)
- **`bin/www`**: Legacy entry point, not actively used but kept for compatibility
- **`app.js`**: Express configuration—middleware, routes, error handling

### Routes Structure
- `routes/index.js`: Home page renderer (Pug-based)
- `routes/users.js`: JSON API with in-memory user roster (placeholder for future DB integration)

### TypeScript Configuration
- `src/index.ts` exists but is not compiled/used in production
- `tsconfig.json` targets ES2020/CommonJS but TypeScript isn't part of the build process
- JavaScript files (`.js`) are primary; TypeScript appears exploratory

## Development Workflow

### Running Locally
```bash
pnpm install  # or npm install
npm start     # starts server.js on port 3000
```
- Port configurable via `PORT` or `APP_PORT` environment variables
- Server logs "Express server listening on port X" on startup

### Testing
```bash
npm test  # runs Jest with supertest integration
```
- Tests in `tests/app.test.js` validate:
  - Home page renders with "MEHAAL" text
  - `/users` endpoint returns JSON array with `name` and `role` fields

### Deployment (cPanel/Passenger)
- Set **Application Startup File** to `server.js` in cPanel Node.js App settings
- Passenger automatically sets `PORT` environment variable
- No build step required—direct Node.js execution
- See README.md lines 310-318 for full cPanel deployment instructions

## Project-Specific Conventions

### Naming & Style
- **Brand**: "MEHAAL" (all caps) or "MEHAAL TECH AI"
- **Taglines**: Voice-centric messaging ("Your Voice. Your Ledger.") in README.md informs copy
- **File naming**: Lowercase with hyphens (e.g., `app.test.js`), except `LOGO.svg`, `LOGO.png`

### Static Assets
- Video backgrounds: `public/background.mp4` (dual video elements for seamless looping in `index.html`)
- Logo variants: `LOGO.svg` (primary), `LOGO.png` (fallback)
- Hero animations driven by `public/hero.js` (currently minimal—just a comment about CSS strips)
- Settings panel: `public/settings.js` handles logo/text customization UI

### Code Style
- **JavaScript**: CommonJS (`require`/`module.exports`), no ES6 imports in main codebase
- **Indentation**: Consistent 2 spaces
- **Error handling**: Centralized in `app.js` (404 catch-all → custom error handler)
- **Dev vs Prod**: Error details exposed only when `env === 'development'`

## Critical Integration Points

### Middleware Order (in `app.js`)
1. Morgan logger (`dev` format)
2. JSON/URL-encoded parsers
3. Cookie parser
4. **Static assets** (`public/`) — served before route handlers
5. Route handlers (`/`, `/users`)
6. 404 handler
7. Error handler

**Important**: Because `express.static('public')` precedes routes, `public/index.html` shadows the Pug-rendered home page when accessed via `/index.html`. The `/` route still hits `routes/index.js` unless `index.html` is explicitly set as directory index.

### External Dependencies
- **Morgan**: HTTP request logging (essential for debugging routing issues)
- **Pug**: Template engine (legacy `.jade` files exist but `.pug` is canonical)
- **Express**: Core framework (v4.x conventions)
- No database—all data in-memory or static

## Common Pitfalls

### Port Conflicts
If `npm start` fails with "EADDRINUSE", another process owns port 3000. Use:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```
Or set `$env:PORT=3001; npm start`

### Static vs Dynamic Routes
- Modifying `routes/index.js` won't affect users accessing `/` if `public/index.html` is served first
- Check `app.js` middleware order if routes aren't behaving as expected

### TypeScript Confusion
- Don't add TypeScript compilation steps without explicit request—project runs pure JavaScript
- `src/index.ts` is orphaned; production uses `routes/index.js`

## Key Files Reference
- **Core logic**: `app.js` (middleware), `server.js` (startup)
- **Routes**: `routes/index.js` (home), `routes/users.js` (API)
- **Frontend**: `public/index.html` (hero page), `views/index.pug` (SSR alternative)
- **Tests**: `tests/app.test.js` (Jest/Supertest)
- **Deployment**: README.md lines 310-318 (cPanel instructions)
