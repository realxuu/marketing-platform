import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // 统计数据
  const totalUsers = await prisma.user.count()
  const totalMembers = await prisma.member.count()
  const activeMembers = await prisma.member.count({
    where: { status: 'ACTIVE' }
  })
  const trialMembers = await prisma.member.count({
    where: { status: 'TRIAL' }
  })

  // 收入统计
  const paidOrders = await prisma.order.findMany({
    where: { status: 'PAID' }
  })
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.amount, 0)

  // 本月收入
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  const monthlyRevenue = paidOrders
    .filter(order => order.paidAt && order.paidAt >= thisMonth)
    .reduce((sum, order) => sum + order.amount, 0)

  // 产品分布
  const productStats = await prisma.member.groupBy({
    by: ['productId'],
    _count: true,
  })

  // 扣费记录
  const billingRecords = await prisma.billingRecord.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      member: {
        include: { user: true }
      }
    }
  })

  return NextResponse.json({
    totalUsers,
    totalMembers,
    activeMembers,
    trialMembers,
    totalRevenue,
    monthlyRevenue,
    productStats,
    billingRecords,
  })
}
