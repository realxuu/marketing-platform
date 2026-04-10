import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        amount: data.amount,
        status: 'PENDING',
        payMethod: data.payMethod,
      },
      include: { product: true, user: true }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json()

    const order = await prisma.order.update({
      where: { id: data.id },
      data: {
        status: data.status,
        paidAt: data.status === 'PAID' ? new Date() : undefined,
      },
      include: { product: true, user: true }
    })

    // 支付成功后创建会员记录并发放权益
    if (data.status === 'PAID') {
      const product = await prisma.memberProduct.findUnique({
        where: { id: order.productId },
        include: {
          rights: {
            include: { right: true }
          }
        }
      })

      if (product) {
        // 创建会员记录
        const member = await prisma.member.create({
          data: {
            userId: order.userId,
            productId: order.productId,
            status: 'TRIAL',
            startDate: new Date(),
            endDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000), // 61天试用期
            isTrial: true,
          }
        })

        // 发放权益
        for (const pr of product.rights) {
          await prisma.userRight.create({
            data: {
              userId: order.userId,
              rightId: pr.rightId,
              memberId: member.id,
              status: 'ACTIVE',
              totalCount: 1,
              usedCount: 0,
              expireAt: member.endDate,
            }
          })
        }
      }
    }

    // 退款时收回权益
    if (data.status === 'REFUNDED') {
      // 查找相关会员
      const member = await prisma.member.findFirst({
        where: {
          userId: order.userId,
          productId: order.productId,
        }
      })

      if (member) {
        // 标记权益为已过期
        await prisma.userRight.updateMany({
          where: { memberId: member.id },
          data: { status: 'EXPIRED' }
        })
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('PATCH /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
