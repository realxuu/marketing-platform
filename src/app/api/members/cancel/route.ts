import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request) {
  try {
    const data = await request.json()
    const { memberId, cancelReason, operator } = data

    const validReasons = ['USER_CANCEL', 'ADMIN_CANCEL', 'BILLING_FAILED', 'ETC_CANCELLED']
    if (!validReasons.includes(cancelReason)) {
      return NextResponse.json({ error: 'Invalid cancel reason' }, { status: 400 })
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { user: true, product: true }
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (member.status === 'CANCELLED' || member.status === 'PENDING_CANCEL') {
      return NextResponse.json({ error: 'Member already cancelled' }, { status: 400 })
    }

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        status: 'PENDING_CANCEL',
        cancelReason,
        cancelAt: new Date(),
      }
    })

    await prisma.notification.create({
      data: {
        userId: member.userId,
        type: 'CANCEL_CONFIRM',
        title: '会员取消确认',
        content: `您的${member.product?.type === 'YEARLY' ? '年卡' : member.product?.type === 'MONTHLY' ? '月卡' : '次卡'}会员服务已申请取消，权益将保留至${new Date(member.endDate).toLocaleDateString('zh-CN')}到期。`,
        channel: 'IN_APP',
        status: 'PENDING',
      }
    })

    return NextResponse.json({
      success: true,
      member: updatedMember,
      message: '会员已标记为待取消，权益保留至到期日'
    })
  } catch (error) {
    console.error('PATCH /api/members/cancel error:', error)
    return NextResponse.json({ error: 'Failed to cancel member' }, { status: 500 })
  }
}
