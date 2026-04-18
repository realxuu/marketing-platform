import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.billingLog.deleteMany()
  await prisma.billingRecord.deleteMany()
  await prisma.rightUsage.deleteMany()
  await prisma.userRight.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.settlement.deleteMany()
  await prisma.systemConfig.deleteMany()
  await prisma.member.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productRight.deleteMany()
  await prisma.right.deleteMany()
  await prisma.memberProduct.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()
  await prisma.systemConfig.deleteMany()

  const rescueRight = await prisma.right.create({
    data: {
      name: '粤运拯救',
      description: '省内高速救援服务，享1次免费救援',
      totalLimit: 100000,
      currentTotal: 0,
      detailHtml: '<h3>粤运拯救服务</h3><p>享受省内高速一次粤运拯救服务，不限制金额。</p><ul><li>因故障在高速上拖至最近服务区或高速出口为免费范围</li><li>仅免除拖车费（其余如拆轴费用、人员转移等费用由车主承担）</li><li>需包含一型客车（含9座）</li></ul>',
      isActive: true,
    },
  })

  const replaceRight = await prisma.right.create({
    data: {
      name: '只换不修',
      description: 'ETC设备故障免费更换，含往返邮寄',
      totalLimit: null,
      currentTotal: 0,
      detailHtml: '<h3>只换不修服务</h3><p>面向购买会员的ETC产品自然损坏用户，提供"只换不修"服务。</p><ul><li>覆盖双片式、单片式产品</li><li>产品出现故障时直接更换</li><li>同时承担往返邮寄费</li></ul>',
      isActive: true,
    },
  })

  const insuranceRight = await prisma.right.create({
    data: {
      name: '高速意外险',
      description: '最高560万保额保障',
      totalLimit: null,
      currentTotal: 0,
      isActive: true,
    },
  })

  const sinopecRight = await prisma.right.create({
    data: {
      name: '中石化年卡权益',
      description: '易捷满减券、加油/充电/洗车折扣',
      totalLimit: null,
      currentTotal: 0,
      detailHtml: '<h3>中石化钜惠包权益</h3><ul><li>98汽油满300减50优惠券3张（限油车）</li><li>充电服务费92折优惠券3张（限电车）</li><li>满30减20洗车机洗车券3张</li><li>易捷现磨咖啡7.9元换购券1张</li><li>鸥露抽纸8.8元换购券1张</li><li>卓玛泉18元换购券1张</li><li>易捷便利店满100减12优惠券3张</li></ul><p><strong>新开卡会员特别福利：</strong>总价值90元新客礼包</p>',
      isActive: true,
    },
  })

  const yearlyProduct = await prisma.memberProduct.create({
    data: {
      name: '年卡会员',
      type: 'YEARLY',
      price: 138,
      description: '粤运拯救服务1次 + 中石化年卡权益',
      effectiveStartTime: new Date(),
      isActive: true,
      rights: {
        create: [
          { rightId: rescueRight.id },
          { rightId: replaceRight.id },
          { rightId: sinopecRight.id },
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
      effectiveStartTime: new Date(),
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
      effectiveStartTime: new Date(),
      isActive: true,
      rights: {
        create: [
          { rightId: rescueRight.id },
          { rightId: insuranceRight.id },
        ],
      },
    },
  })

  // 创建用户：第一个用户无会员（演示用）
  const user1 = await prisma.user.create({
    data: {
      phone: '13800138001',
      name: '赵六',
      plateNumber: '粤D88888',
      plateColor: 'BLUE',
    },
  })

  await prisma.vehicle.create({
    data: {
      userId: user1.id,
      plateNumber: '粤D88888',
      plateColor: 'BLUE',
      isPrimary: true,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      phone: '13800138002',
      name: '张三',
      plateNumber: '粤A12345',
      plateColor: 'BLUE',
      idNumber: '440101199001011234',
    },
  })

  await prisma.vehicle.create({
    data: {
      userId: user2.id,
      plateNumber: '粤A12345',
      plateColor: 'BLUE',
      isPrimary: true,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      phone: '13800138003',
      name: '李四',
      plateNumber: '粤B67890',
      plateColor: 'BLUE',
    },
  })

  await prisma.vehicle.create({
    data: {
      userId: user3.id,
      plateNumber: '粤B67890',
      plateColor: 'BLUE',
      isPrimary: true,
    },
  })

  const user4 = await prisma.user.create({
    data: {
      phone: '13800138004',
      name: '王五',
      plateNumber: '粤C11111',
      plateColor: 'GREEN',
    },
  })

  await prisma.vehicle.create({
    data: {
      userId: user4.id,
      plateNumber: '粤D88888',
      plateColor: 'BLUE',
      isPrimary: true,
    },
  })

  const member1 = await prisma.member.create({
    data: {
      userId: user2.id, // 张三
      productId: yearlyProduct.id,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isTrial: false,
      plateNumber: '粤A12345',
      plateColor: 'BLUE',
      warrantyEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })

  const member2 = await prisma.member.create({
    data: {
      userId: user3.id, // 李四
      productId: monthlyProduct.id,
      status: 'TRIAL',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 54 * 24 * 60 * 60 * 1000),
      isTrial: true,
      plateNumber: '粤B67890',
      plateColor: 'BLUE',
      warrantyEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })

  const member3 = await prisma.member.create({
    data: {
      userId: user4.id, // 王五
      productId: perUseProduct.id,
      status: 'TRIAL',
      startDate: new Date(),
      endDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000),
      isTrial: true,
      plateNumber: '粤C11111',
      plateColor: 'GREEN',
      warrantyEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.order.create({
    data: {
      userId: user2.id, // 张三
      productId: yearlyProduct.id,
      amount: 138,
      status: 'PAID',
      payMethod: 'WECHAT',
      channel: 'WECHAT',
      isActivated: true,
      activatedAt: new Date(),
      agreementAccepted: true,
      paidAt: new Date(),
    },
  })

  await prisma.order.create({
    data: {
      userId: user3.id, // 李四
      productId: monthlyProduct.id,
      amount: 16.8,
      status: 'PAID',
      payMethod: 'ALIPAY',
      channel: 'ALIPAY',
      isActivated: true,
      activatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      agreementAccepted: true,
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.order.create({
    data: {
      userId: user4.id, // 王五
      productId: perUseProduct.id,
      amount: 0,
      status: 'PAID',
      payMethod: 'WECHAT',
      channel: 'WECHAT',
      isActivated: true,
      activatedAt: new Date(),
      agreementAccepted: true,
      paidAt: new Date(),
    },
  })

  await prisma.userRight.createMany({
    data: [
      {
        userId: user2.id, // 张三
        rightId: rescueRight.id,
        memberId: member1.id,
        status: 'ACTIVE',
        totalCount: 1,
        usedCount: 0,
        expireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user2.id, // 张三
        rightId: replaceRight.id,
        memberId: member1.id,
        status: 'ACTIVE',
        totalCount: 1,
        usedCount: 0,
        expireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user2.id, // 张三
        rightId: sinopecRight.id,
        memberId: member1.id,
        status: 'ACTIVE',
        totalCount: 1,
        usedCount: 0,
        expireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user3.id, // 李四
        rightId: rescueRight.id,
        memberId: member2.id,
        status: 'ACTIVE',
        totalCount: 1,
        usedCount: 0,
        expireAt: new Date(Date.now() + 54 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user4.id, // 王五
        rightId: rescueRight.id,
        memberId: member3.id,
        status: 'ACTIVE',
        totalCount: 1,
        usedCount: 0,
        expireAt: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user4.id, // 王五
        rightId: insuranceRight.id,
        memberId: member3.id,
        status: 'ACTIVE',
        totalCount: 1,
        usedCount: 0,
        expireAt: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000),
      },
    ],
  })

  await prisma.right.update({ where: { id: rescueRight.id }, data: { currentTotal: 3 } })
  await prisma.right.update({ where: { id: replaceRight.id }, data: { currentTotal: 1 } })
  await prisma.right.update({ where: { id: sinopecRight.id }, data: { currentTotal: 1 } })
  await prisma.right.update({ where: { id: insuranceRight.id }, data: { currentTotal: 1 } })

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
    ],
  })

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

  await prisma.systemConfig.createMany({
    data: [
      { key: 'monthly_cap', value: '20', description: '次卡月度封顶金额', category: 'BILLING' },
      { key: 'per_use_fee', value: '1', description: '次卡单次扣费金额', category: 'BILLING' },
      { key: 'trial_days', value: '61', description: '免费体验期天数', category: 'MEMBER' },
      { key: 'rescue_limit_per_use', value: '500', description: '次卡单次救援限额', category: 'GENERAL' },
      { key: 'rescue_limit_yearly', value: '1500', description: '次卡年度累计救援限额', category: 'GENERAL' },
    ],
  })

  console.log('✅ 演示数据创建完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
