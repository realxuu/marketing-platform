import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.POSTGRES_PRISMA_URL
  if (!connectionString) {
    throw new Error('POSTGRES_PRISMA_URL is not set')
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)

  // Use type assertion to bypass TypeScript check
  // The adapter option is supported in Prisma 5.15+
  return new PrismaClient({ adapter } as { adapter: typeof adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
