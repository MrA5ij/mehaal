#!/bin/bash

# ==========================================
# 🌱 SAAS DATABASE SEEDER (FIXED & FORCED)
# ==========================================
# Purpose: Wipes auth errors by regenerating client and seeding fresh DB.

echo "🔧 Starting Database Repair & Seed..."

# 1. ENSURE ENV VARIABLES EXIST
# Agar .env nahi mili to default values set kardo taake script phatey na
export DATABASE_URL=${DATABASE_URL:-"postgresql://user:pass@localhost:5432/saas?schema=public"}

echo "🔌 Connecting to: $DATABASE_URL"

# 2. GENERATE PRISMA CLIENT (Fixes TS Errors)
# Pehlay client generate karna zaroori hai taake TS ko pata chalay tables exist kartay hain
echo "🔄 Force Generating Prisma Client..."
npx prisma generate --schema=packages/database/schema.prisma

# 3. PUSH SCHEMA TO DB (Fixes Auth/Table Errors)
echo "🔄 Pushing Schema to Database..."
npx prisma db push --schema=packages/database/schema.prisma --accept-data-loss

# 4. WRITE & RUN SEED FILE
echo "✍️ Writing Seed Logic..."
cat <<EOF > packages/database/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Data Injection...')

  // 1. TENANTS
  const hq = await prisma.tenant.upsert({
    where: { slug: 'hq' },
    update: {},
    create: { name: 'SaaS HQ', slug: 'hq', primaryColor: '#7c3aed' }
  })
  
  const franchise = await prisma.tenant.upsert({
    where: { slug: 'franchise-lahore' },
    update: {},
    create: { name: 'Lahore Franchise', slug: 'franchise-lahore', primaryColor: '#00f3ff' }
  })

  // 2. USERS
  const users = [
    { email: 'admin@mysaas.com', role: 'ADMIN', tenantId: hq.id },
    { email: 'owner@business.com', role: 'CLIENT', tenantId: hq.id },
    { email: 'franchise@lahore.com', role: 'FRANCHISE', tenantId: franchise.id },
    { email: 'client@shop.com', role: 'CLIENT', tenantId: franchise.id }
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: 'password123',
        role: u.role as any,
        tenantId: u.tenantId,
        credits: 1000
      }
    })
    console.log(\`👤 User Ready: \${u.email}\`)
  }

  // 3. LANDING PAGE CONTENT (Safe Injection)
  try {
    const heroContent = {
        title_start: "Control SaaS with",
        title_gradient: "Voice & 3D Gestures",
        subtitle: "System Online. Database Connected.",
        cta_primary: "Start Now",
        cta_secondary: "Demo"
    };
    
    // Using explicit cast to avoid TS issues if type generation lagged
    const siteConfig = (prisma as any).siteConfig;
    if (siteConfig) {
        await siteConfig.upsert({
            where: { key: 'landing_hero' },
            update: { value: heroContent },
            create: { key: 'landing_hero', value: heroContent }
        });
        console.log('📝 CMS Content Injected');
    }
  } catch (e) {
    console.log('⚠️ Skipping CMS Content (Optional)');
  }

  console.log('✅ SEEDING COMPLETE.')
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.\$disconnect(); })
EOF

echo "🌱 Executing Seeder..."
# ts-node ko batana parta hai ke modules kese handle kare
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' npx ts-node --skip-project packages/database/seed.ts

echo "✅ SUCCESS. Ab 'npm run dev' chalayen."