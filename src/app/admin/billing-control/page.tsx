'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Package, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'

interface BillingLog {
  id: string
  userId: string
  memberId: string | null
  type: string
  amount: number
  status: string
  reason: string | null
  month: string
  createdAt: string
}

interface Stats {
  month: string
  totalAmount: number
  totalCount: number
  cappedCount: number
  byStatus: { status: string; _count: number; _sum: { amount: number | null } }[]
}

interface User {
  id: string
  name: string | null
  phone: string
}

export default function BillingControlPage() {
  const [logs, setLogs] = useState<BillingLog[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filterMonth, setFilterMonth] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [testUserId, setTestUserId] = useState('')
  const [testResult, setTestResult] = useState<any>(null)

  const loadData = () => {
    // 加载扣费日志
    const params = new URLSearchParams()
    if (filterMonth) params.append('month', filterMonth)
    if (filterStatus) params.append('status', filterStatus)

    fetch(`/api/billing-engine?${params}`)
      .then(res => res.json())
      .then(setLogs)

    // 加载月度统计
    fetch('/api/billing-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'monthly_stats' }),
    })
      .then(res => res.json())
      .then(data => setStats(data.data))

    // 加载用户列表
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        if (data.length > 0 && !testUserId) {
          setTestUserId(data[0].id)
        }
      })
  }

  useEffect(() => {
    loadData()
  }, [filterMonth, filterStatus])

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.name || user?.phone || userId.slice(0, 8)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      SUCCESS: 'bg-green-500',
      FAILED: 'bg-red-500',
      PENDING: 'bg-yellow-500',
      CAPPED: 'bg-blue-500',
    }
    const labels: Record<string, string> = {
      SUCCESS: '成功',
      FAILED: '失败',
      PENDING: '待处理',
      CAPPED: '已封顶',
    }
    return <Badge className={styles[status] || 'bg-gray-400'}>{labels[status] || status}</Badge>
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MEMBERSHIP_FEE: '会员费',
      PER_USE_FEE: '次卡费',
    }
    return labels[type] || type
  }

  // 测试次卡扣费计算
  const testPerUseBilling = async () => {
    if (!testUserId) return

    const res = await fetch('/api/billing-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'calculate_per_use',
        userId: testUserId,
      }),
    })
    const data = await res.json()
    setTestResult(data)
  }

  // 检查封顶状态
  const checkCapStatus = async () => {
    if (!testUserId) return

    const res = await fetch('/api/billing-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'check_monthly_cap',
        userId: testUserId,
      }),
    })
    const data = await res.json()
    setTestResult(data)
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
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Users className="w-5 h-5" />
            <span>会员管理</span>
          </Link>
          <Link href="/admin/billing-control" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
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
          <h1 className="text-2xl font-bold">扣费控制</h1>
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">本月扣费金额</div>
                <div className="text-2xl font-bold text-green-600">¥{stats.totalAmount.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">本月扣费笔数</div>
                <div className="text-2xl font-bold">{stats.totalCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">封顶次数</div>
                <div className="text-2xl font-bold text-blue-600">{stats.cappedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">统计月份</div>
                <div className="text-2xl font-bold">{stats.month}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 测试工具 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              扣费计算测试
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-500">选择用户</label>
                <select
                  className="w-full h-9 rounded-md border border-gray-200 px-3 mt-1"
                  value={testUserId}
                  onChange={e => setTestUserId(e.target.value)}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.phone}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={testPerUseBilling}>计算次卡扣费</Button>
              <Button variant="outline" onClick={checkCapStatus}>检查封顶状态</Button>
            </div>
            {testResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm">{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 筛选 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div>
                <label className="text-sm text-gray-500">月份</label>
                <Input
                  type="month"
                  value={filterMonth}
                  onChange={e => setFilterMonth(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">状态</label>
                <select
                  className="w-full h-9 rounded-md border border-gray-200 px-3 mt-1"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">全部</option>
                  <option value="SUCCESS">成功</option>
                  <option value="FAILED">失败</option>
                  <option value="CAPPED">已封顶</option>
                  <option value="PENDING">待处理</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 扣费日志 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">扣费日志</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">用户</th>
                  <th className="text-left p-4 font-medium">类型</th>
                  <th className="text-left p-4 font-medium">金额</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">月份</th>
                  <th className="text-left p-4 font-medium">时间</th>
                  <th className="text-left p-4 font-medium">备注</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0">
                    <td className="p-4">{getUserName(log.userId)}</td>
                    <td className="p-4">{getTypeLabel(log.type)}</td>
                    <td className="p-4 font-medium">¥{log.amount.toFixed(2)}</td>
                    <td className="p-4">{getStatusBadge(log.status)}</td>
                    <td className="p-4 text-gray-500">{log.month}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{log.reason || '-'}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">暂无扣费记录</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
