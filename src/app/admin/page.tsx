'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CreditCard, TrendingUp, DollarSign, Settings, Shield, FileText, BarChart3, Package, CheckCircle } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalMembers: number
  activeMembers: number
  trialMembers: number
  totalRevenue: number
  monthlyRevenue: number
  productStats: { productId: string; _count: number }[]
  billingRecords: {
    id: string
    amount: number
    type: string
    createdAt: string
    member: { user: { name: string } }
  }[]
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="font-bold">营销平台管理</span>
        </div>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
            <TrendingUp className="w-5 h-5" />
            <span>仪表盘</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Package className="w-5 h-5" />
            <span>产品管理</span>
          </Link>
          <Link href="/admin/rights" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Shield className="w-5 h-5" />
            <span>权益管理</span>
          </Link>
          <Link href="/admin/usages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <CheckCircle className="w-5 h-5" />
            <span>权益核销</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <FileText className="w-5 h-5" />
            <span>订单管理</span>
          </Link>
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Users className="w-5 h-5" />
            <span>会员管理</span>
          </Link>
          <Link href="/admin/billing-control" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <CreditCard className="w-5 h-5" />
            <span>扣费控制</span>
          </Link>
          <Link href="/admin/settlement" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <DollarSign className="w-5 h-5" />
            <span>结算对账</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Settings className="w-5 h-5" />
            <span>系统配置</span>
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/" className="block text-center text-sm text-slate-400 hover:text-white">
            返回用户端
          </Link>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">总用户数</div>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">会员总数</div>
                  <div className="text-2xl font-bold">{stats.totalMembers}</div>
                  <div className="text-xs text-gray-400">体验期 {stats.trialMembers} / 正式 {stats.activeMembers}</div>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">总收入</div>
                  <div className="text-2xl font-bold">¥{stats.totalRevenue.toFixed(2)}</div>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">本月收入</div>
                  <div className="text-2xl font-bold">¥{stats.monthlyRevenue.toFixed(2)}</div>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 最近扣费记录 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">最近扣费记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.billingRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="font-medium">{record.member.user.name}</div>
                      <div className="text-xs text-gray-500">
                        {record.type === 'MEMBERSHIP_FEE' ? '会员费' : '通行费'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-500">-¥{record.amount}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 产品分布 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">会员产品分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.productStats.map((item, index) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-500">产品 {index + 1}</div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(item._count / stats.totalMembers) * 100}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-right">{item._count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
