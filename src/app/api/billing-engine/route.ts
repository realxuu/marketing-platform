import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取当前月份 YYYY-MM
function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// 获取系统配置
async function getConfig(key: string): Promise<string> {
  const config = await prisma.systemConfig.findUnique({
    where: { key }
  })
  return config?.value || '0'
}

// 计算次卡扣费（带封顶判断）
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, amount: tollFee, action } = data

    if (action === 'calculate_per_use') {
      // 计算次卡扣费
      const perUsePrice = parseFloat(await getConfig('per_use_price'))
      const monthlyCap = parseFloat(await getConfig('monthly_cap'))
      const currentMonth = getCurrentMonth()

      // 查询当月已扣费金额
      const monthlyBilling = await prisma.billingLog.aggregate({
        where: {
          userId,
          type: 'PER_USE_FEE',
          status: 'SUCCESS',
          month: currentMonth,
        },
        _sum: { amount: true },
      })

      const billedAmount = monthlyBilling._sum.amount || 0
      const remainingCap = Math.max(0, monthlyCap - billedAmount)

      // 计算本次可扣费金额
      let actualAmount = perUsePrice
      let status = 'SUCCESS'
      let reason = null

      if (remainingCap <= 0) {
        actualAmount = 0
        status = 'CAPPED'
        reason = '本月已达封顶金额'
      } else if (perUsePrice > remainingCap) {
        actualAmount = remainingCap
        status = 'CAPPED'
        reason = `已扣至封顶，本次扣费${remainingCap}元`
      }

      return NextResponse.json({
        success: true,
        data: {
          amount: actualAmount,
          status,
          reason,
          monthlyTotal: billedAmount + actualAmount,
          monthlyCap,
          remaining: Math.max(0, monthlyCap - billedAmount - actualAmount),
        }
      })
    }

    if (action === 'execute_billing') {
      // 执行扣费
      const { memberId, type, amount } = data
      const currentMonth = getCurrentMonth()

      const log = await prisma.billingLog.create({
        data: {
          userId,
          memberId,
          type,
          amount,
          status: 'SUCCESS',
          month: currentMonth,
        }
      })

      // 同时创建 BillingRecord
      const member = await prisma.member.findUnique({
        where: { id: memberId },
        include: { product: true }
      })

      if (member) {
        await prisma.billingRecord.create({
          data: {
            memberId,
            amount,
            type: type === 'PER_USE_FEE' ? 'TOLL_FEE' : 'MEMBERSHIP_FEE',
            status: 'SUCCESS',
            remark: type === 'PER_USE_FEE' ? '次卡通行扣费' : '会员费扣费',
          }
        })
      }

      return NextResponse.json({ success: true, log })
    }

    if (action === 'check_monthly_cap') {
      // 检查月度封顶状态
      const monthlyCap = parseFloat(await getConfig('monthly_cap'))
      const currentMonth = getCurrentMonth()

      const monthlyBilling = await prisma.billingLog.aggregate({
        where: {
          userId,
          type: 'PER_USE_FEE',
          status: 'SUCCESS',
          month: currentMonth,
        },
        _sum: { amount: true },
      })

      const billedAmount = monthlyBilling._sum.amount || 0
      const isCapped = billedAmount >= monthlyCap

      return NextResponse.json({
        success: true,
        data: {
          month: currentMonth,
          billed: billedAmount,
          cap: monthlyCap,
          remaining: Math.max(0, monthlyCap - billedAmount),
          isCapped,
        }
      })
    }

    if (action === 'monthly_stats') {
      // 月度扣费统计
      const currentMonth = getCurrentMonth()

      const stats = await prisma.billingLog.groupBy({
        by: ['status'],
        where: { month: currentMonth },
        _count: true,
        _sum: { amount: true },
      })

      const totalBilled = await prisma.billingLog.aggregate({
        where: {
          month: currentMonth,
          status: 'SUCCESS',
        },
        _sum: { amount: true },
        _count: true,
      })

      const cappedCount = await prisma.billingLog.count({
        where: {
          month: currentMonth,
          status: 'CAPPED',
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          month: currentMonth,
          totalAmount: totalBilled._sum.amount || 0,
          totalCount: totalBilled._count,
          cappedCount,
          byStatus: stats,
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('POST /api/billing-engine error:', error)
    return NextResponse.json({ error: 'Failed to process billing' }, { status: 500 })
  }
}

// 获取扣费日志
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = await searchParams.get('userId')
    const month = await searchParams.get('month')
    const status = await searchParams.get('status')

    const logs = await prisma.billingLog.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(month ? { month } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('GET /api/billing-engine error:', error)
    return NextResponse.json({ error: 'Failed to fetch billing logs' }, { status: 500 })
  }
}
