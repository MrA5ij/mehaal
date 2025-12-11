# MEHAAL CMS Setup Guide

## Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** v2.0+

## Quick Start (Docker - Recommended)

### 1. Install Dependencies
Docker handles all dependencies automatically. No manual npm install needed.

### 2. Setup Environment

Copy template to `.env`:
```powershell
Copy-Item .env.docker.template .env
```

Edit `.env` with your secure credentials:
```env
DB_ROOT_PASSWORD=your_secure_root_password
DB_NAME=mehaal_db
DB_USER=mehaal_app_user
DB_PASSWORD=your_secure_db_password
SESSION_SECRET=generate-random-32-char-string
```

**Generate secure values:**
```powershell
# Strong password (32 characters)
[System.Web.Security.Membership]::GeneratePassword(32,8)

# Session secret (64 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start Services

```powershell
# Start Docker containers (MySQL + App)
npm run docker:up

# View logs
npm run docker:logs
```

### 4. Access Application
```powershell
npm start
```

### 5. Access Admin Panel

Open browser to:
- **Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

**Admin credentials:**
- Initial credentials are created during Docker container initialization
- Username: `admin` (or check your `cpanel-setup.sql`)
- Password: Set via database initialization
- **⚠️ CHANGE PASSWORD IMMEDIATELY after first login!**

**Security Best Practices:**
- Use strong unique passwords (minimum 16 characters)
- Never use default or common passwords
- Rotate passwords regularly

---

## Alternative Setup: cPanel (Without Docker)

If deploying to cPanel shared hosting:

### 1. Create Database Manually
1. Go to **cPanel → MySQL Databases**
2. Create new database: `your_username_mehaal_db`
3. Create database user with secure password
4. Add user to database with ALL PRIVILEGES

### 2. Import Database Schema
1. Go to **phpMyAdmin**
2. Select your database
3. Go to **Import** tab
4. Upload `config/schema.sql`
5. Upload `cpanel-setup.sql`
6. Click **Go** to import

### 3. Configure Environment
Create `.env` file with cPanel database credentials:
```env
DB_HOST=localhost
DB_USER=cpanel_username_dbuser
DB_PASSWORD=your_db_password
DB_NAME=cpanel_username_mehaal_db
SESSION_SECRET=generate-random-string
```

### 4. Deploy Application
Follow cPanel deployment steps in README.md

---

## Admin Panel Features

### Dashboard (`/admin/dashboard`)
- Quick stats overview
- Recent activity
- Quick action buttons

### Projects Management (`/admin/projects`)
- Add/Edit/Delete projects
- Manage features for each project
- Reorder projects (display_order)

### Team Management (`/admin/team`)
- Add/Edit/Delete team members
- Manage roles and timezones

### Settings (`/admin/settings`)
- Site-wide settings (vision text, CTAs, emails)
- Admin-only access

## API Endpoints

All API endpoints are available at `/api/*`:

### Public Endpoints (No Authentication)
```
GET  /api/projects        - List all active projects with features
GET  /api/projects/:slug  - Get single project by slug
GET  /api/team           - List all active team members
GET  /api/settings       - Get all site settings
```

### Protected Endpoints (Requires Login)
```
POST   /api/projects     - Create new project
PUT    /api/projects/:id - Update project
DELETE /api/projects/:id - Delete project (admin only)

POST   /api/team         - Create team member
PUT    /api/team/:id     - Update team member
DELETE /api/team/:id     - Soft-delete team member

PUT    /api/settings/:key - Update setting (admin only)
```

## Using API in Frontend

Update `public/index.html` to load projects dynamically:

```javascript
// Add before </body> tag
<script>
fetch('/api/projects')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Render projects dynamically
      console.log(data.projects);
    }
  });
</script>
```

## Database Schema

### Tables Created
- `admin_users` - Admin authentication
- `projects` - AI products (Accountant, etc.)
- `features` - Project features (linked to projects)
- `team_members` - Team roster
- `site_settings` - Key-value configuration

### Default Data Inserted
- Admin user (username: `admin`)
- 3 projects (Accountant, Accountant Pro, Assistant Shop)
- 18 features (6 per project)
- 2 team members
- 5 site settings

## Security Notes

1. **Change default admin password** immediately
2. **Never commit `.env`** file to Git (already in .gitignore)
3. **Use strong SESSION_SECRET** in production
4. **Enable HTTPS** in production (set `cookie.secure = true`)
5. **Backup database** regularly via cPanel

## Troubleshooting

### Database Connection Failed
```
✗ MySQL connection failed: Access denied for user
```
**Fix:** Check DB_USER, DB_PASSWORD in `.env` file

### Port Already in Use
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Session Not Persisting
- Check SESSION_SECRET is set in `.env`
- Clear browser cookies
- Restart server

### Template Not Found
- Verify `views/` directory exists
- Check `app.set('view engine', 'ejs')` is set
- Run `npm install` to ensure EJS is installed

## Production Deployment (cPanel)

1. Upload all files via Git or SFTP
2. Create database and import `schema.sql`
3. Create `.env` file with production credentials
4. In cPanel Node.js App:
   - Set startup file to `server.js`
   - Click "Run NPM Install"
   - Start application
5. Access admin at: `https://yourdomain.com/admin/login`

## Next Steps

1. Login to admin panel
2. Update project descriptions
3. Add/remove team members
4. Customize site settings
5. (Optional) Update `public/index.html` to fetch from API
