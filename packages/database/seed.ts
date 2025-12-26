import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Functional Data...')

  // 1. Tenants
  const hq = await (prisma as any).tenant.upsert({
    where: { slug: 'hq' }, update: {}, create: { name: 'SaaS HQ', slug: 'hq', primaryColor: '#7c3aed' }
  })
  
  const franchise = await (prisma as any).tenant.upsert({
    where: { slug: 'lahore' }, update: {}, create: { name: 'Lahore Franchise', slug: 'lahore', primaryColor: '#00f3ff' }
  })

  // 2. Users (Admin & Client)
  // Password is 'password123'
  await (prisma as any).user.upsert({
    where: { email: 'admin@mysaas.com' }, update: {},
    create: { email: 'admin@mysaas.com', password: 'password123', role: 'ADMIN', tenantId: hq.id }
  })
  
  await (prisma as any).user.upsert({
    where: { email: 'client@shop.com' }, update: {},
    create: { email: 'client@shop.com', password: 'password123', role: 'CLIENT', tenantId: franchise.id }
  })

  console.log('✅ DATABASE READY.')
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect())
