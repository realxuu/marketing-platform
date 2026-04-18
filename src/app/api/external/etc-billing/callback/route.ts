import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 接收ETC记账系统的扣费结果回调
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { memberId, userId, amount, status, transactionId, reason } = data

    if (!memberId || !userId || amount === undefined || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`

    // 创建扣费日志
    const billingLog = await prisma.billingLog.create({
      data: {
        userId,
        memberId,
        type: 'PER_USE_FEE',
        amount,
        status,
        reason: reason || null,
        month: currentMonth,
      },
    })

    // 创建扣费记录
    await prisma.billingRecord.create({
      data: {
        memberId,
        amount,
        type: 'TOLL_FEE',
        status,
        remark: `次卡通行扣费 - ${transactionId || 'N/A'}`,
      },
    })

    // 如果扣费失败，检查连续失败次数
    if (status === 'FAILED') {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

      const recentFailures = await prisma.billingLog.count({
        where: {
          memberId,
          status: 'FAILED',
          createdAt: { gte: threeDaysAgo },
        },
      })

      if (recentFailures >= 3) {
        const member = await prisma.member.findUnique({
          where: { id: memberId },
        })

        if (member && ['TRIAL', 'ACTIVE'].includes(member.status)) {
          await prisma.member.update({
            where: { id: memberId },
            data: {
              status: 'PENDING_CANCEL',
              cancelReason: 'BILLING_FAILED',
              cancelAt: new Date(),
            },
          })

          await prisma.notification.create({
            data: {
              userId,
              type: 'BILLING_FAILED',
              title: '扣费失败通知',
              content: '您的会员费连续3天扣费失败，会员服务将被取消。权益保留至到期日。',
              channel: 'IN_APP',
              status: 'PENDING',
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      billingLog,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process billing callback' }, { status: 500 })
  }
}
