import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const rights = await prisma.right.findMany({
    include: {
      products: {
        include: { product: true }
      },
      userRights: {
        select: { id: true }
      }
    }
  })
  return NextResponse.json(rights)
}

export async function POST(request: Request) {
  const data = await request.json()

  const right = await prisma.right.create({
    data: {
      name: data.name,
      description: data.description,
      totalLimit: data.totalLimit ? parseInt(data.totalLimit) : null,
      detailHtml: data.detailHtml || null,
    }
  })

  return NextResponse.json(right)
}

export async function PATCH(request: Request) {
  const data = await request.json()

  const updateData: Record<string, unknown> = {}

  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.totalLimit !== undefined) updateData.totalLimit = data.totalLimit ? parseInt(data.totalLimit) : null
  if (data.detailHtml !== undefined) updateData.detailHtml = data.detailHtml

  if (data.isActive === false) {
    updateData.isActive = false
    const affectedUserRights = await prisma.userRight.updateMany({
      where: {
        rightId: data.id,
        status: 'ACTIVE',
      },
      data: {
        rightDisabledAt: new Date(),
      }
    })
    console.log(`Marked ${affectedUserRights.count} user rights with rightDisabledAt`)
  } else if (data.isActive === true) {
    updateData.isActive = true
  }

  const right = await prisma.right.update({
    where: { id: data.id },
    data: updateData,
  })

  return NextResponse.json(right)
}
