'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Package, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Member {
  id: string
  status: string
  startDate: string
  endDate: string
  isTrial: boolean
  user: { name: string; phone: string; plateNumber: string | null }
  product: { name: string; type: string }
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(setMembers)
  }, [])

  const statusMap: Record<string, { label: string; color: string }> = {
    TRIAL: { label: '体验期', color: 'bg-orange-500' },
    ACTIVE: { label: '生效中', color: 'bg-green-500' },
    EXPIRED: { label: '已过期', color: 'bg-gray-400' },
    CANCELLED: { label: '已取消', color: 'bg-red-500' },
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="font-bold">营销平台管理</span>
        </div>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
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
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
            <Users className="w-5 h-5" />
            <span>会员管理</span>
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
      </aside>

      <main className="ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">会员管理</h1>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">用户</th>
                  <th className="text-left p-4 font-medium">车牌号</th>
                  <th className="text-left p-4 font-medium">会员产品</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">有效期</th>
                  <th className="text-left p-4 font-medium">剩余天数</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const daysLeft = Math.max(0, Math.ceil((new Date(member.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  return (
                    <tr key={member.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{member.user.name}</div>
                        <div className="text-xs text-gray-500">{member.user.phone}</div>
                      </td>
                      <td className="p-4">{member.user.plateNumber || '-'}</td>
                      <td className="p-4">{member.product.name}</td>
                      <td className="p-4">
                        <Badge className={`${statusMap[member.status]?.color} text-white`}>
                          {statusMap[member.status]?.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        <div>{format(new Date(member.startDate), 'yyyy-MM-dd')}</div>
                        <div className="text-gray-400">至 {format(new Date(member.endDate), 'yyyy-MM-dd')}</div>
                      </td>
                      <td className="p-4">
                        <span className={daysLeft < 7 ? 'text-red-500 font-medium' : ''}>
                          {daysLeft} 天
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
