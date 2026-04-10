import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 清空现有数据
  await prisma.billingRecord.deleteMany()
  await prisma.settlement.deleteMany()
  await prisma.member.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productRight.deleteMany()
  await prisma.right.deleteMany()
  await prisma.memberProduct.deleteMany()
  await prisma.user.deleteMany()

  // 创建权益
  const rescueRight = await prisma.right.create({
    data: {
      name: '粤运拯救',
      description: '省内高速救援服务，享1次免费救援',
      type: 'COMMISSION',
      isActive: true,
    },
  })

  const replaceRight = await prisma.right.create({
    data: {
      name: '只换不修',
      description: 'ETC设备故障免费更换，含往返邮寄',
      type: 'SELF_OPERATED',
      isActive: true,
    },
  })

  const insuranceRight = await prisma.right.create({
    data: {
      name: '高速意外险',
      description: '最高560万保额保障',
      type: 'COMMISSION',
      isActive: true,
    },
  })

  // 创建会员产品
  const yearlyProduct = await prisma.memberProduct.create({
    data: {
      name: '年卡会员',
      type: 'YEARLY',
      price: 138,
      description: '粤运拯救服务1次 + 中石化年卡权益',
      duration: 365,
      isActive: true,
      rights: {
        create: [
          { rightId: rescueRight.id },
          { rightId: replaceRight.id },
        ],
      },
    },
  })

  const monthlyProduct = await prisma.memberProduct.create({
    data: {
      name: '月卡会员',
      type: 'MONTHLY',
      price: 16.8,
      description: '粤运拯救服务1次（最高500元）',
      duration: 30,
      isActive: true,
      rights: {
        create: [{ rightId: rescueRight.id }],
      },
    },
  })

  const perUseProduct = await prisma.memberProduct.create({
    data: {
      name: '次卡会员',
      type: 'PER_USE',
      price: 1,
      description: '每次通行享省内高速救援1次',
      duration: null,
      isActive: true,
      rights: {
        create: [
          { rightId: rescueRight.id },
          { rightId: insuranceRight.id },
        ],
      },
    },
  })

  // 创建测试用户
  const user1 = await prisma.user.create({
    data: {
      phone: '13800138001',
      name: '张三',
      plateNumber: '粤A12345',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      phone: '13800138002',
      name: '李四',
      plateNumber: '粤B67890',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      phone: '13800138003',
      name: '王五',
      plateNumber: '粤C11111',
    },
  })

  // 创建订单
  await prisma.order.create({
    data: {
      userId: user1.id,
      productId: yearlyProduct.id,
      amount: 138,
      status: 'PAID',
      payMethod: 'WECHAT',
      paidAt: new Date(),
    },
  })

  await prisma.order.create({
    data: {
      userId: user2.id,
      productId: monthlyProduct.id,
      amount: 16.8,
      status: 'PAID',
      payMethod: 'ALIPAY',
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.order.create({
    data: {
      userId: user3.id,
      productId: perUseProduct.id,
      amount: 0,
      status: 'PAID',
      payMethod: 'WECHAT',
      paidAt: new Date(),
    },
  })

  // 创建会员记录
  const member1 = await prisma.member.create({
    data: {
      userId: user1.id,
      productId: yearlyProduct.id,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isTrial: false,
    },
  })

  const member2 = await prisma.member.create({
    data: {
      userId: user2.id,
      productId: monthlyProduct.id,
      status: 'ACTIVE',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      isTrial: false,
    },
  })

  const member3 = await prisma.member.create({
    data: {
      userId: user3.id,
      productId: perUseProduct.id,
      status: 'TRIAL',
      startDate: new Date(),
      endDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000),
      isTrial: true,
    },
  })

  // 创建扣费记录
  await prisma.billingRecord.createMany({
    data: [
      {
        memberId: member1.id,
        amount: 138,
        type: 'MEMBERSHIP_FEE',
        status: 'SUCCESS',
        remark: '年卡会员开通',
      },
      {
        memberId: member2.id,
        amount: 16.8,
        type: 'MEMBERSHIP_FEE',
        status: 'SUCCESS',
        remark: '月卡会员开通',
      },
      {
        memberId: member3.id,
        amount: 1,
        type: 'TOLL_FEE',
        status: 'SUCCESS',
        remark: '通行扣费',
      },
      {
        memberId: member3.id,
        amount: 1,
        type: 'TOLL_FEE',
        status: 'SUCCESS',
        remark: '通行扣费',
      },
    ],
  })

  // 创建结算记录
  await prisma.settlement.createMany({
    data: [
      {
        type: 'INCOME',
        amount: 154.8,
        description: '会员费收入',
        status: 'COMPLETED',
      },
      {
        type: 'EXPENSE',
        amount: 29.9,
        description: '粤运权益结算',
        status: 'PENDING',
      },
    ],
  })

  console.log('演示数据创建完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
