import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      members: {
        include: { product: true }
      }
    }
  })
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const data = await request.json()
  const user = await prisma.user.create({
    data: {
      phone: data.phone,
      name: data.name,
      plateNumber: data.plateNumber,
    }
  })
  return NextResponse.json(user)
}
