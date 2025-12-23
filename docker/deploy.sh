#!/bin/bash

# Mehaal CMS - Production Deployment Script

set -e

echo "🚀 Starting Mehaal CMS Production Deployment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo -e "${RED}❌ .env.prod file not found!${NC}"
    echo "Please create .env.prod with production credentials"
    exit 1
fi

# Load production environment
export $(cat .env.prod | grep -v '#' | xargs)

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Check for SSL certificates
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    echo -e "${YELLOW}⚠️  SSL certificates not found. Using self-signed for now.${NC}"
    echo "For production, update nginx.conf with your domain and provide valid SSL certs."
fi

# Create backup directory
mkdir -p backups

echo -e "${YELLOW}🔧 Building and starting services...${NC}"

# Build and start services
docker-compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}📦 Starting containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
if docker-compose -f docker-compose.prod.yml ps | grep -q "unhealthy"; then
    echo -e "${RED}❌ Some services are unhealthy${NC}"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

echo -e "${GREEN}✓ All services are running${NC}"

echo -e "${YELLOW}📊 Services status:${NC}"
docker-compose -f docker-compose.prod.yml ps

echo -e "${GREEN}✅ Production Deployment Complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Update nginx.conf with your domain name"
echo "2. Install SSL certificates in ssl/ directory"
echo "3. Update CORS_ORIGINS in .env.prod"
echo ""
echo "📚 API Documentation: https://mehaal.tech/api/docs"
echo "🌐 Frontend: https://mehaal.tech"