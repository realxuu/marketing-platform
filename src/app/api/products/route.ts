import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.memberProduct.findMany({
    include: {
      rights: {
        include: { right: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const product = await prisma.memberProduct.create({
      data: {
        name: data.name,
        type: data.type,
        price: parseFloat(data.price),
        description: data.description,
        duration: data.duration ? parseInt(data.duration) : null,
        isActive: true,
        rights: data.rightIds?.length > 0 ? {
          create: data.rightIds.map((rightId: string) => ({
            rightId
          }))
        } : undefined
      },
      include: {
        rights: { include: { right: true } }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json()

    // 如果是更新状态
    if (data.isActive !== undefined && !data.name) {
      const product = await prisma.memberProduct.update({
        where: { id: data.id },
        data: { isActive: data.isActive }
      })
      return NextResponse.json(product)
    }

    // 更新产品信息
    const product = await prisma.memberProduct.update({
      where: { id: data.id },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        duration: data.duration ? parseInt(data.duration) : null,
      }
    })

    // 更新权益关联
    if (data.rightIds) {
      // 先删除现有关联
      await prisma.productRight.deleteMany({
        where: { productId: data.id }
      })
      // 创建新关联
      if (data.rightIds.length > 0) {
        await prisma.productRight.createMany({
          data: data.rightIds.map((rightId: string) => ({
            productId: data.id,
            rightId
          }))
        })
      }
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('PATCH /api/products error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
