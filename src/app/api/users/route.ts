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

  // 如果提供了手机号，先查找是否已存在
  if (data.phone) {
    const existingUser = await prisma.user.findUnique({
      where: { phone: data.phone }
    })
    if (existingUser) {
      // 更新用户信息（如果有新信息）
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: data.name || existingUser.name,
          plateNumber: data.plateNumber || existingUser.plateNumber,
          plateColor: data.plateColor || existingUser.plateColor,
        }
      })
      return NextResponse.json(updatedUser)
    }
  }

  // 创建新用户
  const user = await prisma.user.create({
    data: {
      phone: data.phone,
      name: data.name,
      plateNumber: data.plateNumber,
      plateColor: data.plateColor,
    }
  })
  return NextResponse.json(user)
}
