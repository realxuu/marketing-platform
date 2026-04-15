'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Package, CheckCircle, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'

interface Member {
  id: string
  status: string
  startDate: string
  endDate: string
  isTrial: boolean
  plateNumber: string | null
  plateColor: string | null
  cancelReason: string | null
  cancelAt: string | null
  warrantyEndDate: string | null
  user: { name: string; phone: string }
  product: { name: string; type: string }
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelMember, setCancelMember] = useState<Member | null>(null)
  const [countdown, setCountdown] = useState(5)

  const loadMembers = () => {
    fetch('/api/members')
      .then(res => res.json())
      .then(setMembers)
  }

  useEffect(() => { loadMembers() }, [])

  useEffect(() => {
    if (!showCancelDialog) { setCountdown(5); return }
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [showCancelDialog, countdown])

  const statusMap: Record<string, { label: string; color: string }> = {
    TRIAL: { label: '体验期', color: 'bg-orange-500' },
    ACTIVE: { label: '生效中', color: 'bg-green-500' },
    EXPIRED: { label: '已过期', color: 'bg-gray-400' },
    CANCELLED: { label: '已取消', color: 'bg-red-500' },
    PENDING_CANCEL: { label: '待取消', color: 'bg-amber-500' },
  }

  const cancelReasonMap: Record<string, string> = {
    USER_CANCEL: '用户取消',
    ADMIN_CANCEL: '后台取消',
    BILLING_FAILED: '扣费失败',
    ETC_CANCELLED: 'ETC注销',
  }

  const plateColorMap: Record<string, string> = { BLUE: '蓝', YELLOW: '黄', GREEN: '绿' }

  const handleCancel = async () => {
    if (!cancelMember) return
    await fetch('/api/members/cancel', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: cancelMember.id, cancelReason: 'ADMIN_CANCEL' }),
    })
    setShowCancelDialog(false)
    setCancelMember(null)
    loadMembers()
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
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><TrendingUp className="w-5 h-5" /><span>仪表盘</span></Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Package className="w-5 h-5" /><span>产品管理</span></Link>
          <Link href="/admin/rights" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Shield className="w-5 h-5" /><span>权益管理</span></Link>
          <Link href="/admin/usages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><CheckCircle className="w-5 h-5" /><span>权益核销</span></Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><FileText className="w-5 h-5" /><span>订单管理</span></Link>
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white"><Users className="w-5 h-5" /><span>会员管理</span></Link>
          <Link href="/admin/billing-control" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><CreditCard className="w-5 h-5" /><span>扣费控制</span></Link>
          <Link href="/admin/settlement" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><DollarSign className="w-5 h-5" /><span>结算对账</span></Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Settings className="w-5 h-5" /><span>系统配置</span></Link>
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
                  <th className="text-left p-4 font-medium">绑定车牌</th>
                  <th className="text-left p-4 font-medium">会员产品</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">有效期</th>
                  <th className="text-left p-4 font-medium">剩余</th>
                  <th className="text-left p-4 font-medium">维保到期</th>
                  <th className="text-left p-4 font-medium">取消信息</th>
                  <th className="text-left p-4 font-medium">操作</th>
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
                      <td className="p-4">
                        {member.plateNumber ? (
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${member.plateColor === 'GREEN' ? 'bg-green-500' : member.plateColor === 'YELLOW' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                            <span>{plateColorMap[member.plateColor || 'BLUE'] || ''}牌 {member.plateNumber}</span>
                          </div>
                        ) : '-'}
                      </td>
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
                        <span className={daysLeft < 7 ? 'text-red-500 font-medium' : ''}>{daysLeft}天</span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {member.warrantyEndDate ? format(new Date(member.warrantyEndDate), 'yyyy-MM-dd') : '-'}
                      </td>
                      <td className="p-4 text-sm">
                        {member.cancelReason ? (
                          <div>
                            <div className="text-amber-600">{cancelReasonMap[member.cancelReason] || member.cancelReason}</div>
                            {member.cancelAt && <div className="text-gray-400">{format(new Date(member.cancelAt), 'MM-dd HH:mm')}</div>}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="p-4">
                        {['TRIAL', 'ACTIVE'].includes(member.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => { setCancelMember(member); setShowCancelDialog(true) }}
                          >
                            取消会员
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      {showCancelDialog && cancelMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">后台取消会员</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    取消 {cancelMember.user.name} 的 {cancelMember.product.name}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-2 mb-6">
                <p>1. 权益将保留至 {format(new Date(cancelMember.endDate), 'yyyy-MM-dd')} 到期</p>
                <p>2. 只换不修服务延续至会员期结束</p>
                <p>3. 取消后不退款，将通知粤运</p>
                <p>4. 取消原因将标记为"后台取消"</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setShowCancelDialog(false); setCancelMember(null) }} className="flex-1">返回</Button>
                <Button variant="destructive" onClick={handleCancel} disabled={countdown > 0} className="flex-1">
                  {countdown > 0 ? `请阅读 (${countdown}s)` : '确认取消'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
