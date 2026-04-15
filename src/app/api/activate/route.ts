import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { orderId, plateNumber, plateColor } = data

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: {
            rights: {
              include: { right: true }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.isActivated) {
      return NextResponse.json({ error: 'Order already activated' }, { status: 400 })
    }

    if (plateNumber) {
      const existingMember = await prisma.member.findFirst({
        where: {
          plateNumber,
          status: { in: ['TRIAL', 'ACTIVE', 'PENDING_CANCEL'] }
        }
      })
      if (existingMember) {
        return NextResponse.json({ error: '该车牌已有生效中的会员，每辆车只能购买一个会员' }, { status: 400 })
      }
    }

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
        plateNumber: plateNumber || null,
        plateColor: plateColor || null,
        warrantyEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    })

    for (const pr of order.product.rights) {
      const right = pr.right
      if (right.totalLimit !== null && right.currentTotal >= right.totalLimit) {
        console.log(`Right ${right.name} has reached total limit, skipping`)
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
        }
      })

      await prisma.right.update({
        where: { id: pr.rightId },
        data: { currentTotal: { increment: 1 } }
      })
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isActivated: true,
        activatedAt: new Date(),
        status: 'PAID',
        paidAt: new Date(),
      }
    })

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/notify/yueyun`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          action: 'MEMBER_ACTIVATED',
          plateNumber: plateNumber || null,
          plateColor: plateColor || null,
          userId: order.userId,
        }),
      })
    } catch (e) {
      console.error('Failed to notify yueyun:', e)
    }

    return NextResponse.json({
      success: true,
      member,
      message: '激活成功，已开通2个月免费体验期'
    })
  } catch (error) {
    console.error('POST /api/activate error:', error)
    return NextResponse.json({ error: 'Failed to activate' }, { status: 500 })
  }
}
