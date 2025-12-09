# MEHAAL TECH AI - Copilot Instructions

## Project Overview
Marketing website for MEHAAL TECH AI—a voice-native AI ecosystem. Minimal Express.js app serving static HTML showcasing three AI products (Accountant, Accountant Pro, Assistant Shop) with brand-focused messaging around voice-first interfaces.

## Architecture

### Static-First Design Philosophy
- **Zero build step**: Direct Node.js execution of static file server—no webpack, no transpilation
- **Pure HTML/CSS**: `public/index.html` is the complete landing page (150 lines) with hero, vision, projects, custom features, and CTA sections
- **express.static() middleware** automatically serves `index.html` at `/`—no explicit route handler needed
- Additional legal pages: `contact.html`, `terms.html`, `partner.html` share `legal.css` stylesheet

### Entry Points & Middleware Chain
1. **`server.js`**: Production entry (cPanel/Passenger compatible)—reads `PORT` or `APP_PORT` env vars, handles `EADDRINUSE` errors
2. **`app.js`**: Express configuration with strict middleware order:
   - Morgan logger (`dev` format)
   - JSON/URL-encoded body parsers
   - **Static assets** (`public/`)—must come before API routes
   - `/users` API route (in-memory JSON data)
   - 404 handler (checks `/api/` prefix for JSON vs HTML response)

### API Structure
- **`routes/users.js`**: Minimal in-memory roster (`{ users: [...] }` format)—placeholder for future database
- CommonJS modules (`require`/`module.exports`)—no ES6 imports
- JSON-only API responses (no XML, no streaming)

## Development Workflow

### Local Development
```powershell
npm install  # only installs express@4.18.2 and morgan@1.10.0
npm start    # node server.js on port 3000
```
- **Hot-reload not configured**: Restart server manually after changing `app.js` or `routes/`
- **Static files auto-reload**: Changes to `public/` files (HTML/CSS/images) are immediate—no restart needed
- Port conflicts: `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process`

### Testing Strategy
```powershell
npm test  # Jest with supertest (testEnvironment: 'node')
```
Tests verify three critical paths in `tests/app.test.js`:
1. Home page serves static HTML containing "MEHAAL" and "INTELLIGENCE BEYOND IMPOSSIBLE"
2. `/users` API returns JSON with `users` array (each user has `name`, `role`, `timezone`)
3. Non-existent routes return 404 status

**Pattern**: Use `response.text.toContain()` for HTML assertions, `response.body` for JSON

### Deployment (cPanel/Passenger)
- **GitHub Actions**: `deploy.yml` SSHs to cPanel server on push to `main`—runs remote `deploy.sh`
- **cPanel Node.js App**: Set "Application Startup File" to `server.js` (not `app.js`)
- **No build artifacts**: Passenger serves directly from repository—no `dist/` or `build/` folder
- Required secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_PORT`

## Project-Specific Conventions

### Brand Voice & Content
- **Name**: Always "MEHAAL" (all caps) or "MEHAAL TECH AI"—never lowercase
- **Tagline**: "INTELLIGENCE BEYOND IMPOSSIBLE" (hero headline in `index.html`)
- **Voice-first messaging**: Products emphasize conversational AI ("Your Voice. Your Ledger.", "Just speak — it handles everything")
- **Copy source**: `README.md` defines all marketing content—sync changes to `public/index.html`

### File Naming Patterns
- **Assets**: `LOGO.svg`, `LOGO.png` (all caps), `background.mp4`, `fevicon.ico`
- **Legal pages**: `contact.html`, `terms.html`, `partner.html` (lowercase, shared `legal.css`)
- **JavaScript**: Lowercase with extensions (e.g., `app.test.js`)—no hyphens in filenames
- **Routes**: Use `var router = express.Router()` convention (`var`, not `const`)

### Code Style (CommonJS Legacy)
- **Modules**: Always `require()`/`module.exports`—no ES6 imports allowed
- **Variables**: Prefer `var` in routes (consistency with Express generator pattern)
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings in JavaScript
- **No client-side JS**: Zero JavaScript in `public/index.html`—all interactions CSS-only

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

### Port Conflicts (Windows PowerShell)
If `npm start` fails with "EADDRINUSE", kill the process:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```
Or temporarily use different port: `$env:PORT=3001; npm start`

### Static File Behavior
- **Auto-reload**: Changes to `public/` HTML/CSS/images reflect immediately—no server restart
- **Cache issues**: Hard-refresh browser (Ctrl+F5) if CSS changes don't appear
- **New routes**: Adding routes in `app.js` or `routes/` requires manual server restart

### Testing Pitfalls
- **Markdown cells**: Don't execute notebook cells (not applicable—this is pure Node.js)
- **Test assertions**: Use `response.text` for HTML content, `response.body` for JSON responses
- **Port persistence**: Tests use ephemeral ports via `supertest`—no conflicts

## Key Files Reference
- **Entry points**: `server.js` (production), `app.js` (middleware config)
- **Routes**: `routes/users.js` (in-memory JSON API)
- **Frontend**: `public/index.html` (150-line landing page), `public/style.css`, `public/legal.css`
- **Tests**: `tests/app.test.js` (3 critical paths)
- **CI/CD**: `deploy.yml` (GitHub Actions SSH deploy to cPanel)
