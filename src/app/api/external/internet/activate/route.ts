import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 接收互联网系统的ETC激活通知
// 用户收到ETC卡签后激活，互联网系统通知营销系统
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, plateNumber, plateColor, etcCardId, deviceId } = data

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // 查找用户的待激活订单
    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: 'PENDING_ACTIVATION',
        isActivated: false,
      },
      include: {
        user: true,
        product: {
          include: {
            rights: { include: { right: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!order) {
      return NextResponse.json({
        success: false,
        message: '未找到待激活订单，用户可能尚未购买会员',
      })
    }

    // 检查车牌是否已有会员
    const userPlateNumber = plateNumber || order.user.plateNumber
    if (userPlateNumber) {
      const existingMember = await prisma.member.findFirst({
        where: {
          plateNumber: userPlateNumber,
          status: { in: ['TRIAL', 'ACTIVE', 'PENDING_CANCEL'] },
        },
      })
      if (existingMember) {
        return NextResponse.json({
          success: false,
          error: '该车牌已有生效中的会员',
        })
      }
    }

    // 激活会员
    const trialDays = 61
    const startDate = new Date()
    const endDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)

    const member = await prisma.member.create({
      data: {
        userId: order.userId,
        productId: order.productId,
        status: 'TRIAL',
        startDate,
        endDate,
        isTrial: true,
        plateNumber: userPlateNumber || null,
        plateColor: plateColor || order.user.plateColor || null,
        warrantyEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })

    // 分配权益
    for (const pr of order.product.rights) {
      const right = pr.right
      if (right.totalLimit !== null && right.currentTotal >= right.totalLimit) {
        continue
      }

      await prisma.userRight.create({
        data: {
          userId: order.userId,
          rightId: pr.rightId,
          memberId: member.id,
          status: 'ACTIVE',
          totalCount: 1,
          usedCount: 0,
          expireAt: endDate,
        },
      })

      await prisma.right.update({
        where: { id: pr.rightId },
        data: { currentTotal: { increment: 1 } },
      })
    }

    // 更新订单状态
    await prisma.order.update({
      where: { id: order.id },
      data: {
        isActivated: true,
        activatedAt: new Date(),
        status: 'PAID',
        paidAt: new Date(),
      },
    })

    // 通知粤运系统
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/notify/yueyun`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          action: 'MEMBER_ACTIVATED',
          plateNumber: userPlateNumber,
          plateColor: plateColor || order.user.plateColor,
          userId: order.userId,
        }),
      })
    } catch (e) {
      // 记录但不影响主流程
    }

    // 通知ETC记账系统（会员信息同步）
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/notify/etc-billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          action: 'MEMBER_CREATED',
          userId: order.userId,
          plateNumber: userPlateNumber,
          productType: order.product.type,
        }),
      })
    } catch (e) {
      // 记录但不影响主流程
    }

    // 通知综合服务系统（只换不修权益开通）
    if (order.product.type === 'YEARLY') {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        await fetch(`${baseUrl}/api/notify/comprehensive-service`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId: member.id,
            action: 'WARRANTY_OPEN',
            userId: order.userId,
            plateNumber: userPlateNumber,
            warrantyEndDate: member.warrantyEndDate,
          }),
        })
      } catch (e) {
        // 记录但不影响主流程
      }
    }

    return NextResponse.json({
      success: true,
      member,
      message: 'ETC激活成功，已开通会员体验期',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process ETC activation' }, { status: 500 })
  }
}
