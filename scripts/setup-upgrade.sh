#!/bin/bash
# Quick Setup Script for Production Upgrade

set -e

echo "🚀 Mehaal Professional Upgrade - Quick Setup"
echo "============================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found. Backend setup will skip."
fi

echo ""
echo "✅ Prerequisites verified"
echo ""

# Step 1: Install frontend dependencies
echo "1️⃣  Installing Three.js dependencies..."
cd "$(dirname "$0")"
npm install three @react-three/fiber @react-three/drei --legacy-peer-deps
echo "✅ Frontend dependencies installed"
echo ""

# Step 2: Environment setup
echo "2️⃣  Setting up environment variables..."
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found"
    echo "   Copying from template: .env.production.template"
    cp .env.production.template .env.production
    echo "   ⚠️  IMPORTANT: Edit .env.production with your actual values"
else
    echo "✅ .env.production already exists"
fi
echo ""

# Step 3: Database migration info
echo "3️⃣  Database Migration Required"
echo "   Run the following SQL in your PostgreSQL database:"
echo ""
echo "   ALTER TABLE platform_settings ADD COLUMN version INTEGER DEFAULT 1;"
echo ""
echo "   Then run: python backend/migrations/002_add_versioning.py"
echo ""
echo "   OR execute the migration file directly"
echo ""

# Step 4: Files created/updated
echo "4️⃣  Files Created/Updated:"
echo ""
echo "   Frontend:"
echo "   • hero/HeroBackground3D.tsx - 3D background component"
echo "   • hero/Hero.jsx - Updated with 3D layer"
echo "   • src/lib/api.ts - Added founder key support"
echo ""
echo "   Backend:"
echo "   • backend/app/core/auth.py - Founder authentication"
echo "   • backend/app/models/platform_settings.py - Added versioning"
echo "   • backend/app/models/platform_settings_history.py - History tracking"
echo "   • backend/app/routes/platform_settings.py - Updated with auth & rollback"
echo "   • backend/migrations/002_add_versioning.py - SQL migration"
echo ""
echo "   Documentation:"
echo "   • PRODUCTION_CONFIG.md - Production setup guide"
echo "   • QUALITY_GATES_CHECKLIST.md - Launch checklist"
echo "   • UPGRADE_COMPLETE.md - Complete upgrade guide"
echo "   • .env.production.template - Environment template"
echo ""

# Step 5: Next steps
echo "5️⃣  Next Steps:"
echo ""
echo "   1. Edit .env.production with your actual values"
echo "   2. Run database migration:"
echo "      cd backend && python run_migrations.py"
echo ""
echo "   3. Test locally:"
echo "      npm run dev"
echo ""
echo "   4. Verify 3D hero loads in browser"
echo "   5. Test founder auth with platform key"
echo ""
echo "   6. Review and complete QUALITY_GATES_CHECKLIST.md"
echo ""
echo "   7. Deploy to production"
echo ""

echo "============================================"
echo "✅ Setup complete! Review UPGRADE_COMPLETE.md for details"
echo ""
