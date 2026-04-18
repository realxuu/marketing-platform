import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 接收互联网系统的ETC注销通知
// 用户注销ETC设备时，自动取消会员
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, plateNumber, reason } = data

    if (!userId && !plateNumber) {
      return NextResponse.json({ error: 'Missing userId or plateNumber' }, { status: 400 })
    }

    // 查找该用户的生效中会员
    const member = await prisma.member.findFirst({
      where: {
        ...(userId ? { userId } : {}),
        ...(plateNumber ? { plateNumber } : {}),
        status: { in: ['TRIAL', 'ACTIVE', 'PENDING_CANCEL'] },
      },
      include: { user: true },
    })

    if (!member) {
      return NextResponse.json({
        success: false,
        message: '未找到生效中的会员',
      })
    }

    // ETC注销立即取消会员（无过渡期）
    await prisma.$transaction([
      prisma.member.update({
        where: { id: member.id },
        data: {
          status: 'CANCELLED',
          cancelReason: 'ETC_CANCELLED',
          cancelAt: new Date(),
        },
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
          content: '由于ETC设备已注销，您的会员服务已取消。',
          channel: 'IN_APP',
          status: 'PENDING',
        },
      }),
    ])

    // 通知粤运系统
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/notify/yueyun`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          action: 'MEMBER_CANCELLED',
          plateNumber: member.plateNumber,
          cancelReason: 'ETC_CANCELLED',
        }),
      })
    } catch (e) {
      // 记录但不影响主流程
    }

    // 通知ETC记账系统
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/notify/etc-billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          action: 'MEMBER_CANCELLED',
          userId: member.userId,
        }),
      })
    } catch (e) {
      // 记录但不影响主流程
    }

    // 通知综合服务系统（取消只换不修）
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/notify/comprehensive-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          action: 'WARRANTY_CANCEL',
          userId: member.userId,
        }),
      })
    } catch (e) {
      // 记录但不影响主流程
    }

    // 通知互联网系统（解约请求）
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/notify/internet-system`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          action: 'UNBIND_REQUEST',
          userId: member.userId,
          reason: 'ETC_CANCELLED',
        }),
      })
    } catch (e) {
      // 记录但不影响主流程
    }

    return NextResponse.json({
      success: true,
      message: 'ETC注销成功，会员已取消',
      memberId: member.id,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process ETC cancellation' }, { status: 500 })
  }
}
