# MEHAAL TECH AI - Docker Setup Guide

## Overview
Complete Docker setup for MEHAAL TECH AI project with MySQL database and Node.js application in separate containers.

## Prerequisites
- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- Git (for cloning repository)

## Quick Start

### 1. Environment Setup
Create `.env` file in project root:

```powershell
# Copy template
Copy-Item .env.docker.template .env

# Generate strong password (PowerShell)
[System.Web.Security.Membership]::GeneratePassword(32,8)
```

Example `.env` file:
```env
# Database Configuration
DB_ROOT_PASSWORD=Xy9#mK2$pL8@vN4&qR6!wT3
DB_NAME=mehaal_db
DB_USER=mehaal_app_user
DB_PASSWORD=Hs7$fJ9@bN3&mP5!xQ2#zW8

# Application Configuration
SESSION_SECRET=aB3$dE6#fG9@hJ2!kL5&mN8@pQ1#rS4$tU7

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_EMAIL=contact@mehaal.tech
```

**⚠️ SECURITY WARNING:**
- Never use example passwords in production
- Generate unique random passwords for each environment
- Never commit `.env` file to Git

### 2. Build and Run
```powershell
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

### 3. Access Application
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **MySQL**: localhost:3306

**⚠️ SECURITY: First Login**
- Use the credentials set in your database setup
- Change admin password immediately after first login
- Default credentials are set during database initialization (see `cpanel-setup.sql`)

## Docker Architecture

### Services

#### 1. MySQL Database (`mysql`)
- **Image**: mysql:8.0
- **Container**: mehaal-mysql
- **Port**: 3306
- **Volume**: Persistent data in `mysql_data` volume
- **Initialization**: Auto-runs `schema.sql` and `cpanel-setup.sql` on first start

#### 2. Node.js App (`app`)
- **Base Image**: node:18-alpine
- **Container**: mehaal-app
- **Port**: 3000
- **Depends On**: MySQL (waits for health check)
- **Auto-restart**: Unless manually stopped

### Docker Compose Features
✅ **Health Checks**: Ensures MySQL is ready before starting app  
✅ **Auto-restart**: Services restart on failure  
✅ **Named Volumes**: Database persists across container restarts  
✅ **Bridge Network**: Secure communication between services  
✅ **Environment Variables**: Configured via `.env` file  

## Docker Commands Reference

### Container Management
```powershell
# Start services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# Stop services
docker-compose down

# Restart specific service
docker-compose restart app

# View running containers
docker-compose ps

# Remove stopped containers
docker-compose rm
```

### Logs & Debugging
```powershell
# View all logs
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# View specific service logs
docker-compose logs app
docker-compose logs mysql

# Last 100 lines
docker-compose logs --tail=100
```

### Database Management
```powershell
# Access MySQL CLI
docker exec -it mehaal-mysql mysql -u mehaal_user -p

# Backup database
docker exec mehaal-mysql mysqldump -u root -p mehaal_db > backup.sql

# Restore database
docker exec -i mehaal-mysql mysql -u root -p mehaal_db < backup.sql

# View database files
docker volume inspect mehaal_mysql_data
```

### Application Management
```powershell
# Access app container shell
docker exec -it mehaal-app sh

# Run npm commands inside container
docker exec -it mehaal-app npm install
docker exec -it mehaal-app npm test

# View app environment variables
docker exec mehaal-app env
```

### Cleanup
```powershell
# Remove all stopped containers, networks, volumes
docker-compose down -v

# Remove images
docker rmi mehaal-app mehaal-mysql

# Prune system (remove unused data)
docker system prune -a
```

## Development Workflow

### Local Development Mode
For hot-reload during development, use volume mounts:

```yaml
# Add to docker-compose.yml under 'app' service
volumes:
  - .:/app
  - /app/node_modules
```

Then use `nodemon`:
```powershell
docker exec mehaal-app npm install -g nodemon
docker exec mehaal-app nodemon server.js
```

### Rebuilding After Code Changes
```powershell
# Rebuild app container
docker-compose build app

# Restart with new build
docker-compose up -d --build app
```

## Troubleshooting

### MySQL Connection Issues
```powershell
# Check MySQL health
docker exec mehaal-mysql mysqladmin ping -h localhost -u root -p

# View MySQL logs
docker-compose logs mysql

# Verify environment variables
docker exec mehaal-mysql env | grep DB
```

### Port Already in Use
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000

# Stop process
Stop-Process -Id <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Access on localhost:3001
```

### Container Won't Start
```powershell
# View container status
docker-compose ps

# Check exit code and error
docker-compose logs app

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Initialization Failed
```powershell
# Remove volume and restart
docker-compose down -v
docker volume rm mehaal_mysql_data
docker-compose up -d

# Check SQL files syntax
docker exec -i mehaal-mysql mysql -u root -p < config/schema.sql
```

## Production Deployment

### Security Checklist
- [ ] Change default admin password
- [ ] Use strong `SESSION_SECRET`
- [ ] Set `DB_ROOT_PASSWORD` to complex password
- [ ] Configure firewall rules (block port 3306 externally)
- [ ] Enable SSL/TLS for MySQL connections
- [ ] Use reverse proxy (nginx) for HTTPS

### Performance Optimization
```yaml
# Add to docker-compose.yml under 'mysql'
command: --default-authentication-plugin=mysql_native_password --max_connections=500

# Add to 'app' service
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
```

### Using Docker Swarm (Optional)
```powershell
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml mehaal

# Scale app service
docker service scale mehaal_app=3
```

## Backup Strategy

### Automated Backups
Create backup script `backup.ps1`:
```powershell
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
docker exec mehaal-mysql mysqldump -u root -p"$env:DB_ROOT_PASSWORD" mehaal_db > "backups/backup_$date.sql"
```

Run daily via Task Scheduler:
```powershell
# Create backup directory
New-Item -ItemType Directory -Path backups

# Schedule task (run as Administrator)
$action = New-ScheduledTaskAction -Execute 'pwsh.exe' -Argument '-File C:\path\to\backup.ps1'
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "MEHAAL Backup" -Action $action -Trigger $trigger
```

## Migration from Existing Setup

### From cPanel/Passenger
```powershell
# 1. Export database
mysqldump -u username -p mehaal_db > migration.sql

# 2. Copy to Docker
docker cp migration.sql mehaal-mysql:/tmp/

# 3. Import
docker exec -i mehaal-mysql mysql -u root -p mehaal_db < /tmp/migration.sql
```

### Environment Variables
Map cPanel environment variables to `.env`:
- `APP_PORT` → `PORT` (default: 3000)
- MySQL credentials → `DB_*` variables
- Session secret → `SESSION_SECRET`

## Docker Hub Deployment (Optional)

### Push to Docker Hub
```powershell
# Build image
docker build -t yourusername/mehaal-app:latest .

# Login to Docker Hub
docker login

# Push image
docker push yourusername/mehaal-app:latest

# Pull on server
docker pull yourusername/mehaal-app:latest
```

### Update docker-compose.yml
```yaml
app:
  image: yourusername/mehaal-app:latest
  # Remove 'build' section
```

## Health Monitoring

### Check Health Status
```powershell
# All services
docker-compose ps

# Specific health check
docker inspect mehaal-app | grep -A 10 Health
docker inspect mehaal-mysql | grep -A 10 Health
```

### Custom Health Endpoint
Add to `app.js`:
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});
```

## Resources & Links
- Docker Documentation: https://docs.docker.com
- Docker Compose Reference: https://docs.docker.com/compose/compose-file/
- Node.js Official Images: https://hub.docker.com/_/node
- MySQL Official Images: https://hub.docker.com/_/mysql

## Support
For issues specific to Docker setup, check logs first:
```powershell
docker-compose logs -f --tail=50
```

For MEHAAL TECH AI application issues, see `README.md` and `CMS_SETUP.md`.
