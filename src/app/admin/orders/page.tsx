'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, RefreshCw, Package, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Order {
  id: string
  amount: number
  status: string
  payMethod: string | null
  createdAt: string
  paidAt: string | null
  user: { name: string; phone: string }
  product: { name: string; type: string }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(setOrders)
  }, [])

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: '待支付', color: 'bg-yellow-500' },
    PAID: { label: '已支付', color: 'bg-green-500' },
    CANCELLED: { label: '已取消', color: 'bg-gray-400' },
    REFUNDED: { label: '已退款', color: 'bg-red-500' },
  }

  const handleRefund = async (orderId: string) => {
    if (!confirm('确定要退款吗？')) return

    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: 'REFUNDED' }),
    })

    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'REFUNDED' } : o))
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
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
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
      </aside>

      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">订单管理</h1>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">订单号</th>
                  <th className="text-left p-4 font-medium">用户</th>
                  <th className="text-left p-4 font-medium">产品</th>
                  <th className="text-left p-4 font-medium">金额</th>
                  <th className="text-left p-4 font-medium">支付方式</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">创建时间</th>
                  <th className="text-left p-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                    <td className="p-4">
                      <div>{order.user.name}</div>
                      <div className="text-xs text-gray-500">{order.user.phone}</div>
                    </td>
                    <td className="p-4">{order.product.name}</td>
                    <td className="p-4 font-medium">¥{order.amount.toFixed(2)}</td>
                    <td className="p-4">
                      {order.payMethod === 'WECHAT' ? '微信支付' : order.payMethod === 'ALIPAY' ? '支付宝' : '-'}
                    </td>
                    <td className="p-4">
                      <Badge className={`${statusMap[order.status]?.color} text-white`}>
                        {statusMap[order.status]?.label}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}
                    </td>
                    <td className="p-4">
                      {order.status === 'PAID' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleRefund(order.id)}
                        >
                          退款
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
