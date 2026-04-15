import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

async function getConfig(key: string): Promise<string> {
  const config = await prisma.systemConfig.findUnique({ where: { key } })
  return config?.value || '0'
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, amount: tollFee, action } = data

    if (action === 'calculate_per_use') {
      const perUsePrice = parseFloat(await getConfig('per_use_price'))
      const monthlyCap = parseFloat(await getConfig('monthly_cap'))
      const currentMonth = getCurrentMonth()

      const member = await prisma.member.findFirst({
        where: { userId, status: { in: ['TRIAL', 'ACTIVE'] } },
        include: { product: { include: { rights: { include: { right: true } } } } }
      })

      if (!member) {
        return NextResponse.json({ success: false, error: '无有效会员' }, { status: 400 })
      }

      if (!member.product.isActive) {
        return NextResponse.json({ success: false, error: '产品已下架，暂停扣费' })
      }

      const allRightsDisabled = member.product.rights.every(pr => !pr.right.isActive)
      if (allRightsDisabled && member.product.rights.length > 0) {
        return NextResponse.json({ success: false, error: '所有权益已禁用，暂停扣费' })
      }

      const monthlyBilling = await prisma.billingLog.aggregate({
        where: { userId, type: 'PER_USE_FEE', status: 'SUCCESS', month: currentMonth },
        _sum: { amount: true },
      })

      const billedAmount = monthlyBilling._sum.amount || 0
      const remainingCap = Math.max(0, monthlyCap - billedAmount)

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
      const { memberId, type, amount } = data
      const currentMonth = getCurrentMonth()

      const member = await prisma.member.findUnique({
        where: { id: memberId },
        include: { product: true }
      })

      if (!member) {
        return NextResponse.json({ success: false, error: '会员不存在' }, { status: 404 })
      }

      if (!['TRIAL', 'ACTIVE'].includes(member.status)) {
        return NextResponse.json({ success: false, error: '会员状态异常，无法扣费' })
      }

      if (!member.product.isActive) {
        return NextResponse.json({ success: false, error: '产品已下架，暂停扣费' })
      }

      const log = await prisma.billingLog.create({
        data: { userId, memberId, type, amount, status: 'SUCCESS', month: currentMonth }
      })

      await prisma.billingRecord.create({
        data: {
          memberId,
          amount,
          type: type === 'PER_USE_FEE' ? 'TOLL_FEE' : 'MEMBERSHIP_FEE',
          status: 'SUCCESS',
          remark: type === 'PER_USE_FEE' ? '次卡通行扣费' : '会员费扣费',
        }
      })

      return NextResponse.json({ success: true, log })
    }

    if (action === 'check_consecutive_failures') {
      const { memberId } = data
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

      const recentFailures = await prisma.billingLog.count({
        where: {
          memberId,
          status: 'FAILED',
          createdAt: { gte: threeDaysAgo },
        }
      })

      if (recentFailures >= 3) {
        const member = await prisma.member.update({
          where: { id: memberId },
          data: {
            status: 'PENDING_CANCEL',
            cancelReason: 'BILLING_FAILED',
            cancelAt: new Date(),
          }
        })

        await prisma.notification.create({
          data: {
            userId: member.userId,
            type: 'BILLING_FAILED',
            title: '扣费失败通知',
            content: '您的会员费连续3天扣费失败，会员服务将被取消。权益保留至到期日。',
            channel: 'IN_APP',
            status: 'PENDING',
          }
        })

        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          await fetch(`${baseUrl}/api/notify/yueyun`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              memberId: member.id,
              action: 'BILLING_FAILED_CANCEL',
              plateNumber: member.plateNumber,
              cancelReason: 'BILLING_FAILED',
            }),
          })
        } catch (e) {
          console.error('Failed to notify yueyun:', e)
        }

        return NextResponse.json({
          success: true,
          cancelled: true,
          message: '连续3天扣费失败，已自动取消会员',
        })
      }

      return NextResponse.json({
        success: true,
        cancelled: false,
        consecutiveFailures: recentFailures,
      })
    }

    if (action === 'check_monthly_cap') {
      const monthlyCap = parseFloat(await getConfig('monthly_cap'))
      const currentMonth = getCurrentMonth()

      const monthlyBilling = await prisma.billingLog.aggregate({
        where: { userId, type: 'PER_USE_FEE', status: 'SUCCESS', month: currentMonth },
        _sum: { amount: true },
      })

      const billedAmount = monthlyBilling._sum.amount || 0
      const isCapped = billedAmount >= monthlyCap

      return NextResponse.json({
        success: true,
        data: { month: currentMonth, billed: billedAmount, cap: monthlyCap, remaining: Math.max(0, monthlyCap - billedAmount), isCapped }
      })
    }

    if (action === 'monthly_stats') {
      const currentMonth = getCurrentMonth()

      const stats = await prisma.billingLog.groupBy({
        by: ['status'],
        where: { month: currentMonth },
        _count: true,
        _sum: { amount: true },
      })

      const totalBilled = await prisma.billingLog.aggregate({
        where: { month: currentMonth, status: 'SUCCESS' },
        _sum: { amount: true },
        _count: true,
      })

      const cappedCount = await prisma.billingLog.count({
        where: { month: currentMonth, status: 'CAPPED' },
      })

      return NextResponse.json({
        success: true,
        data: { month: currentMonth, totalAmount: totalBilled._sum.amount || 0, totalCount: totalBilled._count, cappedCount, byStatus: stats }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('POST /api/billing-engine error:', error)
    return NextResponse.json({ error: 'Failed to process billing' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const month = searchParams.get('month')
    const status = searchParams.get('status')

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
