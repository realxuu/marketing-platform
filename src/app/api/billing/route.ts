import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const memberId = searchParams.get('memberId')

  const records = await prisma.billingRecord.findMany({
    where: memberId ? { memberId } : undefined,
    include: {
      member: {
        include: { user: true, product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(records)
}

export async function POST(request: Request) {
  const data = await request.json()

  const record = await prisma.billingRecord.create({
    data: {
      memberId: data.memberId,
      amount: data.amount,
      type: data.type,
      status: data.status || 'SUCCESS',
      remark: data.remark,
    },
    include: {
      member: {
        include: { user: true, product: true }
      }
    }
  })

  return NextResponse.json(record)
}
