import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Vercel Postgres 环境
  if (process.env.POSTGRES_PRISMA_URL) {
    const adapter = new PrismaPg(new Pool({
      connectionString: process.env.POSTGRES_PRISMA_URL,
    }))
    return new PrismaClient({ adapter })
  }

  // 本地开发环境 (SQLite 或本地 Postgres)
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
