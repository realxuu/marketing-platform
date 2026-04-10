import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const settlements = await prisma.settlement.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // 计算收入支出
  const income = settlements
    .filter(s => s.type === 'INCOME' && s.status === 'COMPLETED')
    .reduce((sum, s) => sum + s.amount, 0)

  const expense = settlements
    .filter(s => s.type === 'EXPENSE' && s.status === 'COMPLETED')
    .reduce((sum, s) => sum + s.amount, 0)

  const pendingIncome = settlements
    .filter(s => s.type === 'INCOME' && s.status === 'PENDING')
    .reduce((sum, s) => sum + s.amount, 0)

  const pendingExpense = settlements
    .filter(s => s.type === 'EXPENSE' && s.status === 'PENDING')
    .reduce((sum, s) => sum + s.amount, 0)

  return NextResponse.json({
    settlements,
    summary: {
      income,
      expense,
      profit: income - expense,
      pendingIncome,
      pendingExpense,
    }
  })
}

export async function POST(request: Request) {
  const data = await request.json()

  const settlement = await prisma.settlement.create({
    data: {
      type: data.type,
      amount: data.amount,
      description: data.description,
      status: data.status || 'PENDING',
    }
  })

  return NextResponse.json(settlement)
}
