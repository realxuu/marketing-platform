import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 接收ETC记账系统的扣费指令（次卡通行扣费）
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { plateNumber, tollFee, timestamp, transactionId } = data

    if (!plateNumber || tollFee === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 查找该车牌的会员
    const member = await prisma.member.findFirst({
      where: {
        plateNumber,
        status: { in: ['TRIAL', 'ACTIVE'] },
      },
      include: {
        product: { include: { rights: { include: { right: true } } } },
        user: true,
      },
    })

    if (!member) {
      return NextResponse.json({
        success: false,
        error: '该车牌无有效会员',
        action: 'NORMAL_BILLING', // 正常扣费（非会员）
      })
    }

    // 检查产品状态
    if (!member.product.isActive) {
      return NextResponse.json({
        success: false,
        error: '产品已下架',
        action: 'NORMAL_BILLING',
      })
    }

    // 次卡才走通行扣费逻辑
    if (member.product.type !== 'PER_USE') {
      return NextResponse.json({
        success: true,
        message: '年卡/月卡会员，无需单独扣费',
        action: 'SKIP_BILLING', // 跳过扣费
        memberId: member.id,
      })
    }

    // 获取系统配置
    const perUsePrice = parseFloat(
      (await prisma.systemConfig.findUnique({ where: { key: 'per_use_price' } }))?.value || '1'
    )
    const monthlyCap = parseFloat(
      (await prisma.systemConfig.findUnique({ where: { key: 'monthly_cap' } }))?.value || '20'
    )

    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`

    // 计算本月已扣费金额
    const monthlyBilling = await prisma.billingLog.aggregate({
      where: {
        userId: member.userId,
        type: 'PER_USE_FEE',
        status: 'SUCCESS',
        month: currentMonth,
      },
      _sum: { amount: true },
    })

    const billedAmount = monthlyBilling._sum.amount || 0
    const remainingCap = Math.max(0, monthlyCap - billedAmount)

    let actualAmount = perUsePrice
    let status = 'SUCCESS'
    let reason = null

    if (remainingCap <= 0) {
      actualAmount = 0
      status = 'CAPPED'
      reason = '本月已达封顶金额'
    } else if (perUsePrice > remainingCap) {
      actualAmount = remainingCap
      status = 'CAPPED'
      reason = `已扣至封顶，本次扣费${remainingCap}元`
    }

    // 返回扣费指令给ETC记账系统
    return NextResponse.json({
      success: true,
      action: 'EXECUTE_BILLING',
      billing: {
        memberId: member.id,
        userId: member.userId,
        plateNumber,
        amount: actualAmount,
        status,
        reason,
        monthlyTotal: billedAmount + actualAmount,
        monthlyCap,
        remaining: Math.max(0, monthlyCap - billedAmount - actualAmount),
        transactionId,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process billing instruction' }, { status: 500 })
  }
}
