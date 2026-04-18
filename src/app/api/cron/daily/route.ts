import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CRON_SECRET = process.env.CRON_SECRET

function verifyAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${CRON_SECRET}`
}

async function getConfig(key: string, defaultValue: string): Promise<string> {
  const config = await prisma.systemConfig.findUnique({ where: { key } })
  return config?.value || defaultValue
}

// 体验期到期扣费
async function processTrialExpiry() {
  const trialDays = parseInt(await getConfig('trial_days', '61'))
  const now = new Date()
  const expiryDate = new Date(now.getTime() - trialDays * 24 * 60 * 60 * 1000)

  const expiringMembers = await prisma.member.findMany({
    where: {
      status: 'TRIAL',
      startDate: { lte: expiryDate },
    },
    include: { product: true, user: true },
  })

  const results = []

  for (const member of expiringMembers) {
    try {
      // 年卡：一次性扣费 ¥138
      // 月卡：扣 ¥16.8
      // 次卡：无此环节
      let amount = 0
      if (member.product.type === 'YEARLY') {
        amount = member.product.price
      } else if (member.product.type === 'MONTHLY') {
        amount = member.product.price
      } else {
        // 次卡跳过
        results.push({ memberId: member.id, status: 'skipped', reason: '次卡无需到期扣费' })
        continue
      }

      // 模拟扣费（实际应调用ETC记账系统）
      const billingSuccess = true // 模拟扣费成功

      if (billingSuccess) {
        await prisma.$transaction([
          prisma.billingRecord.create({
            data: {
              memberId: member.id,
              amount,
              type: 'MEMBERSHIP_FEE',
              status: 'SUCCESS',
              remark: '体验期到期扣费',
            },
          }),
          prisma.billingLog.create({
            data: {
              userId: member.userId,
              memberId: member.id,
              type: 'MEMBERSHIP_FEE',
              amount,
              status: 'SUCCESS',
              month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
            },
          }),
          prisma.member.update({
            where: { id: member.id },
            data: {
              status: 'ACTIVE',
              isTrial: false,
            },
          }),
        ])

        results.push({ memberId: member.id, status: 'success', amount })
      } else {
        await prisma.billingRecord.create({
          data: {
            memberId: member.id,
            amount,
            type: 'MEMBERSHIP_FEE',
            status: 'FAILED',
            remark: '体验期到期扣费失败',
          },
        })
        results.push({ memberId: member.id, status: 'failed', amount })
      }
    } catch (error) {
      results.push({ memberId: member.id, status: 'error', error: String(error) })
    }
  }

  return results
}

// 扣费重试
async function processBillingRetry() {
  const pendingBillings = await prisma.billingRecord.findMany({
    where: { status: 'PENDING' },
    include: { member: { include: { product: true, user: true } } },
    take: 50,
  })

  const results = []

  for (const billing of pendingBillings) {
    try {
      // 模拟重试扣费
      const success = true // Math.random() > 0.3 // 模拟70%成功率

      if (success) {
        await prisma.$transaction([
          prisma.billingRecord.update({
            where: { id: billing.id },
            data: { status: 'SUCCESS' },
          }),
          prisma.billingLog.create({
            data: {
              userId: billing.member.userId,
              memberId: billing.memberId,
              type: billing.type,
              amount: billing.amount,
              status: 'SUCCESS',
              month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
            },
          }),
        ])
        results.push({ billingId: billing.id, status: 'success' })
      } else {
        await prisma.billingRecord.update({
          where: { id: billing.id },
          data: { status: 'FAILED', remark: '扣费重试失败' },
        })
        results.push({ billingId: billing.id, status: 'failed' })
      }
    } catch (error) {
      results.push({ billingId: billing.id, status: 'error', error: String(error) })
    }
  }

  return results
}

// 执行取消
async function processPendingCancel() {
  const now = new Date()

  const membersToCancel = await prisma.member.findMany({
    where: {
      status: 'PENDING_CANCEL',
      endDate: { lte: now },
    },
    include: { user: true },
  })

  const results = []

  for (const member of membersToCancel) {
    try {
      await prisma.$transaction([
        prisma.member.update({
          where: { id: member.id },
          data: { status: 'CANCELLED' },
        }),
        prisma.userRight.updateMany({
          where: { memberId: member.id, status: 'ACTIVE' },
          data: { status: 'EXPIRED' },
        }),
        prisma.notification.create({
          data: {
            userId: member.userId,
            type: 'MEMBER_STATUS_CHANGE',
            title: '会员已取消',
            content: '您的会员服务已正式取消，感谢您的使用。',
            channel: 'IN_APP',
            status: 'PENDING',
          },
        }),
      ])

      // 通知互联网系统解约
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        await fetch(`${baseUrl}/api/notify/internet-system`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId: member.id,
            action: 'UNBIND_REQUEST',
            userId: member.userId,
            reason: member.cancelReason || 'PENDING_CANCEL_EXPIRED',
          }),
        })
      } catch (e) {
        // 记录但不影响主流程
      }

      results.push({ memberId: member.id, status: 'cancelled' })
    } catch (error) {
      results.push({ memberId: member.id, status: 'error', error: String(error) })
    }
  }

  return results
}

// 到期提醒
async function processExpiryReminder() {
  const trialDays = parseInt(await getConfig('trial_days', '61'))
  const now = new Date()

  // 前3天提醒
  const threeDaysBefore = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(threeDaysBefore.getTime() - trialDays * 24 * 60 * 60 * 1000)

  // 前1天提醒
  const oneDayBefore = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
  const oneDayAgo = new Date(oneDayBefore.getTime() - trialDays * 24 * 60 * 60 * 1000)

  const results = []

  // 前3天提醒
  const members3Days = await prisma.member.findMany({
    where: {
      status: 'TRIAL',
      startDate: {
        gte: new Date(threeDaysAgo.getTime() - 24 * 60 * 60 * 1000),
        lt: threeDaysAgo,
      },
    },
  })

  for (const member of members3Days) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId: member.userId,
        type: 'TRIAL_EXPIRING',
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
    })

    if (!existing) {
      await prisma.notification.create({
        data: {
          userId: member.userId,
          type: 'TRIAL_EXPIRING',
          title: '会员即将到期',
          content: '您的会员体验期将在3天后到期，届时将自动扣费开通正式会员。如需取消，请及时操作。',
          channel: 'IN_APP',
          status: 'PENDING',
        },
      })
      results.push({ memberId: member.id, reminder: '3_days' })
    }
  }

  // 前1天提醒
  const members1Day = await prisma.member.findMany({
    where: {
      status: 'TRIAL',
      startDate: {
        gte: new Date(oneDayAgo.getTime() - 24 * 60 * 60 * 1000),
        lt: oneDayAgo,
      },
    },
  })

  for (const member of members1Day) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId: member.userId,
        type: 'TRIAL_EXPIRING',
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
    })

    if (!existing) {
      await prisma.notification.create({
        data: {
          userId: member.userId,
          type: 'TRIAL_EXPIRING',
          title: '会员明天到期',
          content: '您的会员体验期将在明天到期，届时将自动扣费开通正式会员。如需取消，请立即操作。',
          channel: 'IN_APP',
          status: 'PENDING',
        },
      })
      results.push({ memberId: member.id, reminder: '1_day' })
    }
  }

  return results
}

// 检查连续扣费失败
async function processConsecutiveFailures() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  const failedMembers = await prisma.billingRecord.groupBy({
    by: ['memberId'],
    where: {
      status: 'FAILED',
      createdAt: { gte: threeDaysAgo },
    },
    _count: true,
    having: { memberId: { _count: { gte: 3 } } },
  })

  const results = []

  for (const { memberId } of failedMembers) {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { user: true },
    })

    if (member && ['TRIAL', 'ACTIVE'].includes(member.status)) {
      await prisma.$transaction([
        prisma.member.update({
          where: { id: memberId },
          data: {
            status: 'PENDING_CANCEL',
            cancelReason: 'BILLING_FAILED',
            cancelAt: new Date(),
          },
        }),
        prisma.notification.create({
          data: {
            userId: member.userId,
            type: 'BILLING_FAILED',
            title: '扣费失败通知',
            content: '您的会员费连续3天扣费失败，会员服务将被取消。权益保留至到期日。',
            channel: 'IN_APP',
            status: 'PENDING',
          },
        }),
      ])

      results.push({ memberId, status: 'pending_cancel' })
    }
  }

  return results
}

export async function GET(request: Request) {
  if (!verifyAuth(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const results = {
    trialExpiry: [] as unknown[],
    billingRetry: [] as unknown[],
    pendingCancel: [] as unknown[],
    expiryReminder: [] as unknown[],
    consecutiveFailures: [] as unknown[],
    timestamp: new Date().toISOString(),
  }

  try {
    results.trialExpiry = await processTrialExpiry()
  } catch (e) {
    results.trialExpiry = [{ error: String(e) }]
  }

  try {
    results.billingRetry = await processBillingRetry()
  } catch (e) {
    results.billingRetry = [{ error: String(e) }]
  }

  try {
    results.pendingCancel = await processPendingCancel()
  } catch (e) {
    results.pendingCancel = [{ error: String(e) }]
  }

  try {
    results.expiryReminder = await processExpiryReminder()
  } catch (e) {
    results.expiryReminder = [{ error: String(e) }]
  }

  try {
    results.consecutiveFailures = await processConsecutiveFailures()
  } catch (e) {
    results.consecutiveFailures = [{ error: String(e) }]
  }

  return NextResponse.json(results)
}
