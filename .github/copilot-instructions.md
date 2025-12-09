# MEHAAL TECH AI - Copilot Instructions

## Project Overview
Marketing website for MEHAAL TECH AI—a voice-native AI ecosystem. This is a clean Express.js application serving a static HTML landing page showcasing AI products (Accountant, Accountant Pro, Assistant Shop) with scrollable sections, animated hero, and brand-focused content per README.md specifications.

## Architecture & Key Patterns

### Single Frontend Approach
- **Static HTML**: `public/index.html` — complete multi-section landing page with hero, vision, projects, and CTA sections
- Video background with violet-blue gradient theme matching README design
- All content served via `express.static()` middleware
- No template engine - pure static HTML/CSS

### Entry Points
- **`server.js`**: Production entry point for cPanel/Passenger deployment (handles `PORT` or `APP_PORT` env vars)
- **`app.js`**: Express configuration—minimal middleware (morgan logger, JSON parser), static file serving, API routes

### Routes Structure
- `/` — Serves `public/index.html` automatically via static middleware
- `/users` — JSON API endpoint with in-memory user roster (future DB placeholder)
- No view engine or server-side rendering

## Development Workflow

### Running Locally
```bash
npm install   # installs express and morgan only
npm start     # starts server.js on port 3000
```
- Port configurable via `PORT` or `APP_PORT` environment variables
- Server logs "Express server listening on port X" on startup
- Open http://localhost:3000 to see full landing page

### Testing
```bash
npm test  # runs Jest with supertest integration
```
- Tests in `tests/app.test.js` validate:
  - Home page serves static HTML with "MEHAAL" and "INTELLIGENCE BEYOND IMPOSSIBLE"
  - `/users` endpoint returns JSON array with `name` and `role` fields
  - 404 handling for non-existent routes

### Deployment (cPanel/Passenger)
- Set **Application Startup File** to `server.js` in cPanel Node.js App settings
- Passenger automatically sets `PORT` environment variable
- **No build step required**—direct Node.js execution of static file server
- Only dependencies: `express` and `morgan`
- See README.md for full cPanel deployment instructions

## Project-Specific Conventions

### Naming & Style
- **Brand**: "MEHAAL" (all caps) or "MEHAAL TECH AI"
- **Taglines**: Voice-centric messaging ("Your Voice. Your Ledger.") in README.md informs copy
- **File naming**: Lowercase with hyphens (e.g., `app.test.js`), except `LOGO.svg`, `LOGO.png`

### Static Assets
- Video background: `public/background.mp4` (loops seamlessly with CSS)
- Logo: `public/LOGO.svg` (primary), `public/LOGO.png` (fallback)
- Styles: `public/style.css` (violet-blue gradient theme, responsive design)
- No JavaScript animations—all CSS-based for performance

### Code Style
- **JavaScript**: CommonJS (`require`/`module.exports`), no ES6 imports
- **Indentation**: Consistent 2 spaces
- **Error handling**: Simple 404 handler in `app.js`
- **Minimal dependencies**: Only `express` and `morgan`

## Critical Integration Points

### Middleware Order (in `app.js`)
1. Morgan logger (`dev` format)
2. JSON/URL-encoded parsers
3. **Static assets** (`public/`) — serves `index.html` by default
4. API route (`/users`)
5. 404 handler

**Important**: `express.static('public')` automatically serves `public/index.html` at the root path `/`. No route handlers needed for the home page.

### External Dependencies
- **Morgan**: HTTP request logging for debugging
- **Express**: Core framework (v4.x)
- No database—all data in-memory or static
- No template engine—pure HTML/CSS

## Common Pitfalls

### Port Conflicts
If `npm start` fails with "EADDRINUSE", another process owns port 3000. Use:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```
Or set `$env:PORT=3001; npm start`

### Static File Changes
- Modifying `public/` files requires no server restart—changes are immediate
- Always clear browser cache if CSS/JS changes don't appear
- HTML changes to `public/index.html` are served fresh on each request

## Key Files Reference
- **Core logic**: `app.js` (middleware), `server.js` (startup)
- **Routes**: `routes/users.js` (API only)
- **Frontend**: `public/index.html` (complete landing page), `public/style.css` (design)
- **Tests**: `tests/app.test.js` (Jest/Supertest)
- **Deployment**: README.md (cPanel instructions)
