import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 默认配置
const DEFAULT_CONFIGS = [
  { key: 'trial_days', value: '61', description: '免费体验期天数', category: 'MEMBER' },
  { key: 'yearly_price', value: '138', description: '年卡价格（元）', category: 'BILLING' },
  { key: 'monthly_price', value: '16.8', description: '月卡价格（元）', category: 'BILLING' },
  { key: 'per_use_price', value: '1', description: '次卡单次价格（元）', category: 'BILLING' },
  { key: 'monthly_cap', value: '20', description: '次卡月扣费封顶（元）', category: 'BILLING' },
  { key: 'max_retry_days', value: '3', description: '扣费失败最大重试天数', category: 'BILLING' },
  { key: 'rescue_limit_yearly', value: '0', description: '年卡救援次数限制（0=不限）', category: 'MEMBER' },
  { key: 'rescue_limit_monthly', value: '1', description: '月卡救援次数限制', category: 'MEMBER' },
  { key: 'rescue_limit_per_use', value: '1', description: '次卡单次救援限制', category: 'MEMBER' },
  { key: 'rescue_amount_monthly', value: '500', description: '月卡单次救援限额（元）', category: 'MEMBER' },
  { key: 'rescue_amount_per_use', value: '500', description: '次卡单次救援限额（元）', category: 'MEMBER' },
  { key: 'rescue_yearly_cap', value: '1500', description: '次卡年度救援累计限额（元）', category: 'MEMBER' },
]

interface ConfigItem {
  key: string
  value: string
  description: string | null
  category: string
}

export async function GET() {
  try {
    let configs = await prisma.systemConfig.findMany()

    // 如果没有配置，初始化默认配置
    if (configs.length === 0) {
      await prisma.systemConfig.createMany({
        data: DEFAULT_CONFIGS
      })
      configs = await prisma.systemConfig.findMany()
    }

    // 按分类组织
    const result = {
      BILLING: {} as Record<string, string>,
      MEMBER: {} as Record<string, string>,
      GENERAL: {} as Record<string, string>,
    }

    configs.forEach((c: ConfigItem) => {
      result[c.category as keyof typeof result][c.key] = c.value
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/config error:', error)
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json()

    // 批量更新配置
    for (const item of data.configs) {
      await prisma.systemConfig.update({
        where: { key: item.key },
        data: { value: item.value }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/config error:', error)
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}
