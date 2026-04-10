import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Vercel Postgres/Neon 环境
  if (process.env.POSTGRES_PRISMA_URL) {
    const adapter = new PrismaNeon(
      new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ adapter } as any)
  }

  // 本地开发环境 (SQLite 或本地 Postgres)
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
