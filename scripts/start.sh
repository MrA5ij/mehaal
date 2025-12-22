#!/bin/bash
# Bash startup script for Mehaal Project on Linux/Mac

echo "🚀 Starting Mehaal Project..."
echo ""

# Check if Docker is running
echo "🔍 Checking Docker..."
if ! docker ps >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi
echo "✅ Docker is running"

# Check if docker-compose is available
echo "🔍 Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install it."
    exit 1
fi
echo "✅ Docker Compose is available"

echo ""
echo "📦 Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

# Navigate to docker directory
cd "$(dirname "$0")/../docker"

# Build and start containers
docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Mehaal Project is now running!"
    echo ""
    echo "🌐 Access your services:"
    echo "   Frontend:    http://localhost:5173"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs:    http://localhost:8000/docs"
    echo "   phpMyAdmin:  http://localhost:8080"
    echo ""
    echo "📊 Database Credentials:"
    echo "   Username: mehaal_user"
    echo "   Password: mehaal_password"
    echo "   Database: mehaal_db"
    echo ""
    echo "📝 View logs: docker-compose logs -f"
    echo "🛑 Stop:      docker-compose down"
    echo ""
else
    echo ""
    echo "❌ Failed to start containers. Check the logs above."
    echo ""
    exit 1
fi
