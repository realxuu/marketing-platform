'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Package, CheckCircle } from 'lucide-react'

interface UserRight {
  id: string
  userId: string
  rightId: string
  memberId: string
  status: string
  totalCount: number
  usedCount: number
  expireAt: string
  createdAt: string
  right?: {
    id: string
    name: string
    type: string
  }
  member?: {
    id: string
    product?: {
      name: string
    }
  }
  usages: Usage[]
}

interface Usage {
  id: string
  type: string
  description: string | null
  operator: string | null
  createdAt: string
}

interface User {
  id: string
  name: string | null
  phone: string
}

export default function UsagesPage() {
  const [userRights, setUserRights] = useState<UserRight[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showVerify, setShowVerify] = useState(false)
  const [selectedRight, setSelectedRight] = useState<UserRight | null>(null)
  const [verifyForm, setVerifyForm] = useState({
    type: 'RESCUE',
    description: '',
    operator: '',
  })

  const loadData = () => {
    fetch('/api/user-rights')
      .then(res => res.json())
      .then(data => setUserRights(data))
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }

  useEffect(() => {
    loadData()
  }, [])

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.name || user?.phone || userId
  }

  const handleVerify = async () => {
    if (!selectedRight) return

    const res = await fetch('/api/user-rights', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedRight.id,
        action: 'use',
        type: verifyForm.type,
        description: verifyForm.description,
        operator: verifyForm.operator,
      }),
    })

    if (res.ok) {
      setShowVerify(false)
      setSelectedRight(null)
      setVerifyForm({ type: 'RESCUE', description: '', operator: '' })
      loadData()
    }
  }

  const openVerify = (ur: UserRight) => {
    setSelectedRight(ur)
    setShowVerify(true)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-500',
      USED: 'bg-gray-400',
      EXPIRED: 'bg-red-400',
    }
    const labels: Record<string, string> = {
      ACTIVE: '可用',
      USED: '已用完',
      EXPIRED: '已过期',
    }
    return <Badge className={styles[status] || 'bg-gray-400'}>{labels[status] || status}</Badge>
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      RESCUE: '救援',
      REPLACE: '更换',
      INSURANCE: '保险',
    }
    return labels[type] || type
  }

  const activeRights = userRights.filter(ur => ur.status === 'ACTIVE')
  const usedRights = userRights.filter(ur => ur.status !== 'ACTIVE')

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
          <Link href="/admin/usages" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
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
        <h1 className="text-2xl font-bold mb-6">权益核销</h1>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">可用权益</div>
              <div className="text-2xl font-bold text-green-600">{activeRights.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">已用权益</div>
              <div className="text-2xl font-bold text-gray-600">{usedRights.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">总核销次数</div>
              <div className="text-2xl font-bold text-blue-600">
                {userRights.reduce((sum, ur) => sum + ur.usedCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 核销弹窗 */}
        {showVerify && selectedRight && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">核销权益</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">权益信息</div>
                <div className="font-medium">{selectedRight.right?.name || '未知权益'}</div>
                <div className="text-sm text-gray-500 mt-1">
                  用户: {getUserName(selectedRight.userId)} |
                  剩余: {selectedRight.totalCount - selectedRight.usedCount}次
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>核销类型</Label>
                  <select
                    className="w-full h-9 rounded-md border border-gray-200 px-3"
                    value={verifyForm.type}
                    onChange={e => setVerifyForm({ ...verifyForm, type: e.target.value })}
                  >
                    <option value="RESCUE">救援</option>
                    <option value="REPLACE">更换</option>
                    <option value="INSURANCE">保险</option>
                  </select>
                </div>
                <div>
                  <Label>操作人</Label>
                  <Input
                    value={verifyForm.operator}
                    onChange={e => setVerifyForm({ ...verifyForm, operator: e.target.value })}
                    placeholder="如：张三"
                  />
                </div>
                <div>
                  <Label>备注说明</Label>
                  <Input
                    value={verifyForm.description}
                    onChange={e => setVerifyForm({ ...verifyForm, description: e.target.value })}
                    placeholder="如：高速救援1次"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => { setShowVerify(false); setSelectedRight(null) }}>取消</Button>
                <Button onClick={handleVerify}>确认核销</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 可用权益列表 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">可用权益 ({activeRights.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">用户</th>
                  <th className="text-left p-4 font-medium">权益名称</th>
                  <th className="text-left p-4 font-medium">关联产品</th>
                  <th className="text-left p-4 font-medium">剩余次数</th>
                  <th className="text-left p-4 font-medium">过期时间</th>
                  <th className="text-left p-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {activeRights.map((ur) => (
                  <tr key={ur.id} className="border-b last:border-0">
                    <td className="p-4">{getUserName(ur.userId)}</td>
                    <td className="p-4 font-medium">{ur.right?.name || '-'}</td>
                    <td className="p-4 text-gray-500">{ur.member?.product?.name || '-'}</td>
                    <td className="p-4">
                      <span className="text-green-600 font-medium">
                        {ur.totalCount - ur.usedCount} / {ur.totalCount}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(ur.expireAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Button size="sm" onClick={() => openVerify(ur)}>
                        核销
                      </Button>
                    </td>
                  </tr>
                ))}
                {activeRights.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">暂无可用权益</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* 已用权益列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">已用/过期权益 ({usedRights.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">用户</th>
                  <th className="text-left p-4 font-medium">权益名称</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">使用记录</th>
                  <th className="text-left p-4 font-medium">过期时间</th>
                </tr>
              </thead>
              <tbody>
                {usedRights.map((ur) => (
                  <tr key={ur.id} className="border-b last:border-0">
                    <td className="p-4">{getUserName(ur.userId)}</td>
                    <td className="p-4 font-medium">{ur.right?.name || '-'}</td>
                    <td className="p-4">{getStatusBadge(ur.status)}</td>
                    <td className="p-4">
                      {ur.usages.length > 0 ? (
                        <div className="space-y-1">
                          {ur.usages.map(u => (
                            <div key={u.id} className="text-sm">
                              <span className="text-gray-500">{getTypeLabel(u.type)}</span>
                              {u.description && <span className="text-gray-400 ml-1">({u.description})</span>}
                              <span className="text-gray-400 ml-2">{new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(ur.expireAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {usedRights.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">暂无已用权益</td>
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
