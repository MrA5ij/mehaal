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
- **`routes/users.js`**: Minimal in-memory roster (`{ users: [...] }` format)—placeholder for MySQL database
- CommonJS modules (`require`/`module.exports`)—no ES6 imports
- JSON-only API responses (no XML, no streaming)

### Database Configuration (MySQL)
- **Database**: MySQL (cPanel default)
- **Pattern**: Create DB connection in `config/` or environment variables
- **Credentials**: Store in `.env` file (never commit)—use `mysql2` or `mysql` package
- **Connection example**: `const mysql = require('mysql2'); const pool = mysql.createPool({ host, user, password, database })`
- Replace in-memory `users` array in `routes/users.js` with actual DB queries when ready

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
- **GitHub Actions**: `deploy.yml` (or `.github/workflows/deploy.yml`) SSHs to cPanel on push to `main`
  - Connects via `appleboy/ssh-action@v1.0.3`
  - Runs `deploy.sh` script on cPanel server (pulls latest code, restarts app)
  - Required GitHub secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_PORT`
- **cPanel Node.js App Setup**:
  - Set "Application Startup File" to `server.js` (not `app.js`)
  - Passenger automatically sets `PORT` environment variable
  - Click "Run NPM Install" to install dependencies
  - Start application—Passenger handles process management
- **No build artifacts**: Passenger serves directly from repository—no `dist/` or `build/` folder
- **MySQL Database**: Create database in cPanel MySQL Databases, add credentials to environment variables

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

### CSS Animations (Implemented)
- **Logo animations**: `logoFloat` (6s floating), `logoPulse` (3s glow pulse)
- **Headline**: `headlineGlow` (4s opacity pulse)
- **Hover transitions**: 0.3s ease on buttons and cards with `translateY()` transforms
- **Scroll behavior**: `scroll-behavior: smooth` in HTML for anchor navigation
- All animations defined in `public/style.css` using `@keyframes`—no JavaScript animation libraries

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

## CMS Architecture (MySQL + Custom Admin)

### Admin Panel Structure
- **Authentication**: Session-based login with bcrypt password hashing
- **Routes**: `/admin/*` (dashboard, projects, team, settings) - protected by `requireAuth` middleware
- **API**: `/api/*` (REST endpoints for CRUD operations) - some protected, some public
- **Templates**: EJS views in `views/admin/` with shared layout

### Database Tables
- `admin_users` - Admin authentication (username, password_hash, role)
- `projects` - AI products (slug, title, tagline, description, features)
- `features` - Project features (linked to projects via foreign key)
- `team_members` - Team roster (replaces in-memory users)
- `site_settings` - Key-value site configuration

### Key Patterns
- **Connection pooling**: `config/database.js` exports query helper and pool
- **Password security**: Always use `bcrypt.hash()` with 10 rounds for passwords
- **Middleware chain**: Session → Auth check → Route handler
- **Soft deletes**: Team members set `is_active = FALSE` instead of hard delete
- **Environment variables**: All credentials in `.env` (never commit), use `dotenv` package

### Admin Access
- Login: `/admin/login` (POST username/password)
- Dashboard: `/admin/dashboard` (requires auth)
- Logout: `/admin/logout` (destroys session)
- Default credentials: `admin` / `admin123` (change immediately!)

## Key Files Reference
- **Entry points**: `server.js` (production), `app.js` (middleware config)
- **Routes**: `routes/users.js` (legacy), `routes/admin.js` (admin panel), `routes/api.js` (REST API)
- **Frontend**: `public/index.html` (150-line landing page), `public/style.css`, `public/legal.css`
- **Admin UI**: `views/admin/*.ejs` (login, dashboard, projects, team, settings)
- **Database**: `config/database.js` (connection pool), `config/schema.sql` (table definitions)
- **Auth**: `middleware/auth.js` (loginUser, requireAuth, requireAdmin)
- **Tests**: `tests/app.test.js` (3 critical paths)
- **CI/CD**: `deploy.yml` (GitHub Actions SSH deploy to cPanel)
- **Setup**: `CMS_SETUP.md` (complete installation and usage guide)
