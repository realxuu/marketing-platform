import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const rights = await prisma.right.findMany({
    include: {
      products: {
        include: { product: true }
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
      type: data.type,
    }
  })

  return NextResponse.json(right)
}

export async function PATCH(request: Request) {
  const data = await request.json()

  const right = await prisma.right.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      isActive: data.isActive,
    }
  })

  return NextResponse.json(right)
}
