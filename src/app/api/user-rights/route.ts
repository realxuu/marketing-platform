import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = await searchParams.get('userId')
    const memberId = await searchParams.get('memberId')
    const status = await searchParams.get('status')

    const userRights = await prisma.userRight.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(memberId ? { memberId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        usages: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // 获取权益详情
    const rights = await prisma.right.findMany()
    const rightsMap = new Map(rights.map(r => [r.id, r]))

    // 获取会员信息
    const members = await prisma.member.findMany({
      include: { product: true }
    })
    const membersMap = new Map(members.map(m => [m.id, m]))

    const result = userRights.map(ur => ({
      ...ur,
      right: rightsMap.get(ur.rightId),
      member: membersMap.get(ur.memberId),
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/user-rights error:', error)
    return NextResponse.json({ error: 'Failed to fetch user rights' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json()

    // 核销权益
    if (data.action === 'use') {
      const userRight = await prisma.userRight.findUnique({
        where: { id: data.id }
      })

      if (!userRight) {
        return NextResponse.json({ error: 'User right not found' }, { status: 404 })
      }

      if (userRight.status !== 'ACTIVE') {
        return NextResponse.json({ error: '权益不可用' }, { status: 400 })
      }

      if (userRight.usedCount >= userRight.totalCount) {
        return NextResponse.json({ error: '权益已用完' }, { status: 400 })
      }

      // 创建使用记录
      const usage = await prisma.rightUsage.create({
        data: {
          userRightId: data.id,
          type: data.type || 'RESCUE',
          description: data.description,
          operator: data.operator,
        }
      })

      // 更新使用次数
      const newUsedCount = userRight.usedCount + 1
      const newStatus = newUsedCount >= userRight.totalCount ? 'USED' : 'ACTIVE'

      const updated = await prisma.userRight.update({
        where: { id: data.id },
        data: {
          usedCount: newUsedCount,
          status: newStatus,
        }
      })

      return NextResponse.json({ usage, userRight: updated })
    }

    // 过期权益
    if (data.action === 'expire') {
      const updated = await prisma.userRight.update({
        where: { id: data.id },
        data: { status: 'EXPIRED' }
      })
      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('PATCH /api/user-rights error:', error)
    return NextResponse.json({ error: 'Failed to update user right' }, { status: 500 })
  }
}
