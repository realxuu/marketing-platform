import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const members = await prisma.member.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: {
          select: { id: true, name: true, phone: true }
        },
        product: {
          include: {
            rights: {
              include: {
                right: true
              }
            }
          }
        },
        billings: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('GET /api/members error:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}
