import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const orders = await prisma.order.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(status ? { status } : {}),
      },
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
        status: 'PENDING_ACTIVATION',
        payMethod: data.payMethod,
        channel: data.channel,
        agreementAccepted: data.agreementAccepted ?? false,
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

    const updateData: Record<string, unknown> = {
      status: data.status,
    }

    if (data.status === 'PAID') {
      updateData.paidAt = new Date()
    }

    if (data.status === 'PENDING_ACTIVATION') {
      updateData.agreementAccepted = data.agreementAccepted ?? true
    }

    const order = await prisma.order.update({
      where: { id: data.id },
      data: updateData,
      include: { product: true, user: true }
    })

    if (data.status === 'REFUNDED') {
      const member = await prisma.member.findFirst({
        where: {
          userId: order.userId,
          productId: order.productId,
        }
      })

      if (member) {
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
