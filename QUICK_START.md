# 🚀 MEHAAL TECH AI - QUICK START GUIDE

## Docker Setup (Recommended)

### Step 1: Copy Environment Template
```powershell
Copy-Item .env.docker.template .env
```

### Step 2: Edit .env with Your Credentials
```env
# Database (required)
DB_ROOT_PASSWORD=your_secure_password
DB_NAME=mehaal_db
DB_USER=mehaal_user
DB_PASSWORD=your_db_password

# Application (required)
SESSION_SECRET=generate-random-32-chars

# Email (optional - for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_EMAIL=contact@mehaal.tech
```

**Generate secure passwords:**
```powershell
[System.Web.Security.Membership]::GeneratePassword(32,8)
```

### Step 3: Start Docker Services
```powershell
npm run docker:up
```

This automatically:
- ✅ Starts MySQL database container
- ✅ Creates database schema
- ✅ Starts Node.js application
- ✅ Sets up networking between containers

### Step 4: Access Application
- Website: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- API: http://localhost:3000/api/projects

### Step 5: View Logs
```powershell
npm run docker:logs
```

---

## Manual Setup (Without Docker)

Only if you cannot use Docker:

### Step 1: Install MySQL
- **Windows**: Download MySQL Installer
- **Linux**: `sudo apt install mysql-server`
- **macOS**: `brew install mysql`

### Step 2: Create Database
```bash
mysql -u root -p
CREATE DATABASE mehaal_db;
CREATE USER 'mehaal_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON mehaal_db.* TO 'mehaal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Import Schema
```bash
mysql -u mehaal_user -p mehaal_db < config/schema.sql
mysql -u mehaal_user -p mehaal_db < cpanel-setup.sql
```

### Step 4: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your database credentials and email settings.

### Step 5: Start Server
```bash
npm install
npm start
```

---

## 📧 What You Get

| Feature | Location | Status |
|---------|----------|--------|
| Contact Form | /contact.html | ✅ Working |
| Admin Panel | /admin | ✅ Working |
| Projects API | /api/projects | ✅ Working |
| Team API | /api/team | ✅ Working |
| Email System | Contact forms | ✅ Working |
| Privacy Policy | /privacy.html | ✅ Complete |

---

## 🐳 Docker Commands

```powershell
# Start services
npm run docker:up

# View logs
npm run docker:logs

# Restart app only
npm run docker:restart

# Stop all services
npm run docker:down

# Remove all data (⚠️ deletes database)
npm run docker:clean

# Rebuild containers
npm run docker:build
```

---

## 🔧 Email Configuration (Optional)

Docker setup works without email. To enable contact forms:

### Gmail Setup
1. Enable 2-FA: https://myaccount.google.com/security
2. Get App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

### Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_USER=your-email@company.onmicrosoft.com
SMTP_PASSWORD=your-password
```

---

## 📊 Email Routing

Contact forms route to different emails based on inquiry type:

**Inquiry Type → Email Address**
- general → Set in CONTACT_EMAIL env var
- technical → tech@mehaal.tech
- business → business@mehaal.tech
- founder → founder@mehaal.tech

---

## ✅ Testing Checklist

### Docker Setup
- [ ] `npm run docker:up` (services start)
- [ ] http://localhost:3000 loads
- [ ] http://localhost:3000/admin (admin login)
- [ ] http://localhost:3000/api/projects (API works)
- [ ] Contact form submission
- [ ] Email delivery (if configured)

### Manual Setup
- [ ] MySQL database created
- [ ] Schema imported successfully
- [ ] `npm start` runs without errors
- [ ] http://localhost:3000 loads
- [ ] Admin panel accessible

---

## 🚀 Deploy to Production

### Docker Deployment
See **[DOCKER_SETUP.md](DOCKER_SETUP.md)** for production deployment with Docker Swarm or Kubernetes.

### cPanel Deployment
1. Create database in cPanel MySQL Databases
2. Import `config/schema.sql` and `cpanel-setup.sql`
3. Upload code via Git/SFTP
4. Create `.env` with production credentials
5. Setup Node.js App in cPanel
6. Set startup file to `server.js`
7. Click "Run NPM Install"
8. Start application

---

## 🆘 Troubleshooting

### Docker Issues
```powershell
# View logs
npm run docker:logs

# Restart services
npm run docker:down
npm run docker:up

# Check container status
docker ps

# Access MySQL
docker exec -it mehaal-mysql mysql -u root -p
```

### Email Issues
- Check `.env` has SMTP credentials
- Use App Password for Gmail (not regular password)
- Check spam folder
- View logs: `npm run docker:logs`

### Database Connection Issues
- Ensure `.env` has correct DB credentials
- Check MySQL container is running: `docker ps`
- View MySQL logs: `docker logs mehaal-mysql`

---

## 📚 Complete Documentation

- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Complete Docker guide
- **[CMS_SETUP.md](CMS_SETUP.md)** - Admin panel setup
- **[EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)** - Email configuration
- **[SECURITY_AUDIT.md](SECURITY_AUDIT.md)** - Security best practices

---

## ✨ You're All Set!

Your MEHAAL TECH AI website now has:
- ✅ Docker containerization
- ✅ MySQL database
- ✅ Admin panel & CMS
- ✅ REST API
- ✅ Email system
- ✅ Production-ready setup
- ✅ Modal popups
- ✅ Newsletter system
- ✅ Privacy policy
- ✅ Social media links

Ready to go live! 🎉
