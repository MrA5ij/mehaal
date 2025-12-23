# pgAdmin Setup Guide

## Overview
The project now uses **pgAdmin 4** for PostgreSQL database management instead of phpMyAdmin (which is for MySQL only).

## Access Information

### Development Environment
- **URL**: http://localhost:8080
- **Email**: admin@mehaal.com
- **Password**: admin

### Production Environment
- **URL**: Configured via nginx proxy
- **Email**: Set via `PGADMIN_EMAIL` environment variable
- **Password**: Set via `PGADMIN_PASSWORD` environment variable

## First Time Setup

1. Open pgAdmin at http://localhost:8080
2. Login with the credentials above
3. Add new server connection:
   - **General Tab**:
     - Name: Mehaal Database
   - **Connection Tab**:
     - Host: postgres
     - Port: 5432
     - Maintenance database: mehaal_db
     - Username: mehaal_user
     - Password: mehaal_password
     - Save password: ✓

## Features
- Full PostgreSQL database management
- Query editor with syntax highlighting
- Table data viewer and editor
- Database backup and restore
- Query history and saved queries
- Schema designer
- User and permission management

## Migration from phpMyAdmin
The old phpMyAdmin folder is archived in `Mehaal.Backend/phpmyadmin.old/` and is no longer used. The folder can be safely deleted if not needed.

## Docker Configuration
- **Development**: Port 8080 exposed
- **Production**: Accessible via nginx proxy
- **Data Persistence**: pgAdmin settings stored in Docker volume

## Troubleshooting

### Cannot connect to database
- Ensure postgres container is running: `docker ps`
- Check postgres health: `docker compose logs postgres`
- Verify network connectivity: containers must be on `mehaal-network`

### Forgot pgAdmin password
- Stop containers: `docker compose down`
- Remove pgAdmin volume: `docker volume rm docker_pgadmin_data`
- Restart: `docker compose up -d`

## Security Notes
- Change default passwords in production
- Use strong passwords for `PGADMIN_PASSWORD`
- Enable master password in production
- Configure proper CORS and network settings
