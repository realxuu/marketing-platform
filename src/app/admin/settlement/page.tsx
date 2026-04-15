'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Plus, ArrowUpCircle, ArrowDownCircle, Package, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Settlement {
  id: string
  type: string
  amount: number
  description: string | null
  status: string
  createdAt: string
}

interface SettlementData {
  settlements: Settlement[]
  summary: {
    income: number
    expense: number
    profit: number
    pendingIncome: number
    pendingExpense: number
  }
}

export default function SettlementPage() {
  const [data, setData] = useState<SettlementData | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [formData, setFormData] = useState({ type: 'INCOME', amount: '', description: '' })

  const loadData = () => {
    fetch('/api/settlements')
      .then(res => res.json())
      .then(setData)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = async () => {
    await fetch('/api/settlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
      }),
    })
    setShowAdd(false)
    setFormData({ type: 'INCOME', amount: '', description: '' })
    loadData()
  }

  if (!data) return null

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
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Users className="w-5 h-5" />
            <span>会员管理</span>
          </Link>
          <Link href="/admin/billing-control" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <CreditCard className="w-5 h-5" />
            <span>扣费控制</span>
          </Link>
          <Link href="/admin/settlement" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
            <DollarSign className="w-5 h-5" />
            <span>结算对账</span>
          </Link>
          {/* <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Settings className="w-5 h-5" />
            <span>系统配置</span>
          </Link> */}
        </nav>
      </aside>

      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">结算对账</h1>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新增记录
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ArrowUpCircle className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">总收入</div>
                  <div className="text-xl font-bold text-green-600">¥{data.summary.income.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ArrowDownCircle className="w-8 h-8 text-red-500" />
                <div>
                  <div className="text-sm text-gray-500">总支出</div>
                  <div className="text-xl font-bold text-red-600">¥{data.summary.expense.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">净利润</div>
                  <div className="text-xl font-bold text-blue-600">¥{data.summary.profit.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">待处理</div>
              <div className="text-lg">
                <span className="text-green-600">+¥{data.summary.pendingIncome.toFixed(2)}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-red-600">-¥{data.summary.pendingExpense.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 新增表单 */}
        {showAdd && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">新增结算记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>类型</Label>
                  <select
                    className="w-full h-9 rounded-md border border-gray-200 px-3"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="INCOME">收入</option>
                    <option value="EXPENSE">支出</option>
                  </select>
                </div>
                <div>
                  <Label>金额</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="请输入金额"
                  />
                </div>
                <div>
                  <Label>说明</Label>
                  <Input
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入说明"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAdd(false)}>取消</Button>
                <Button onClick={handleAdd}>确认添加</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 记录列表 */}
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">类型</th>
                  <th className="text-left p-4 font-medium">金额</th>
                  <th className="text-left p-4 font-medium">说明</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">时间</th>
                </tr>
              </thead>
              <tbody>
                {data.settlements.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {item.type === 'INCOME' ? (
                          <ArrowUpCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <ArrowDownCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span>{item.type === 'INCOME' ? '收入' : '支出'}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      <span className={item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                        {item.type === 'INCOME' ? '+' : '-'}¥{item.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{item.description || '-'}</td>
                    <td className="p-4">
                      <Badge className={item.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {item.status === 'COMPLETED' ? '已完成' : '待处理'}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')}
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
