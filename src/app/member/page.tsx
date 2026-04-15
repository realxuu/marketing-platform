'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, Shield, Car, Calendar, ChevronRight, LogOut, AlertTriangle } from 'lucide-react'
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
  product: {
    id: string
    name: string
    type: string
    price: number
  }
}

export default function MemberPage() {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then((data: Member[]) => {
        if (data.length > 0) {
          setMember(data[0])
        }
        setLoading(false)
      })
  }, [])

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    TRIAL: { label: '体验期', color: 'text-orange-600', bg: 'bg-orange-100' },
    ACTIVE: { label: '生效中', color: 'text-green-600', bg: 'bg-green-100' },
    EXPIRED: { label: '已过期', color: 'text-gray-600', bg: 'bg-gray-100' },
    CANCELLED: { label: '已取消', color: 'text-red-600', bg: 'bg-red-100' },
    PENDING_CANCEL: { label: '待取消', color: 'text-amber-600', bg: 'bg-amber-100' },
  }

  const cancelReasonMap: Record<string, string> = {
    USER_CANCEL: '用户主动取消',
    ADMIN_CANCEL: '后台系统取消',
    BILLING_FAILED: '扣费失败取消',
    ETC_CANCELLED: 'ETC注销取消',
  }

  const plateColorMap: Record<string, string> = {
    BLUE: '蓝色',
    YELLOW: '黄色',
    GREEN: '绿色',
  }

  const handleCancel = async () => {
    if (!member) return
    setCancelling(true)

    try {
      const res = await fetch('/api/members/cancel', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          cancelReason: 'USER_CANCEL',
        }),
      })
      const data = await res.json()

      if (data.success) {
        setMember({ ...member, status: 'PENDING_CANCEL', cancelReason: 'USER_CANCEL', cancelAt: new Date().toISOString() })
        setShowCancelDialog(false)
      } else {
        alert(data.error || '取消失败')
      }
    } catch {
      alert('取消失败，请重试')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">我的会员</h1>
          <Link href="/admin" className="text-xs text-blue-200 hover:text-white">管理后台</Link>
        </div>
        {member && (
          <Card className="bg-white/10 border-0 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <span className="font-medium">{member.product.name}</span>
                </div>
                <Badge className={`${statusMap[member.status]?.bg} ${statusMap[member.status]?.color}`}>
                  {statusMap[member.status]?.label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-200">有效期至</div>
                  <div className="font-medium">{format(new Date(member.endDate), 'yyyy-MM-dd')}</div>
                </div>
                <div>
                  <div className="text-blue-200">{member.isTrial ? '试用剩余' : '剩余天数'}</div>
                  <div className="font-medium">
                    {Math.max(0, Math.ceil((new Date(member.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} 天
                  </div>
                </div>
              </div>
              {member.plateNumber && (
                <div className="mt-3 pt-3 border-t border-white/20 text-sm">
                  <div className="text-blue-200">绑定车牌</div>
                  <div className="font-medium">
                    {plateColorMap[member.plateColor || 'BLUE'] || ''} {member.plateNumber}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="max-w-md mx-auto p-4">
        {!member ? (
          <Card className="text-center py-8">
            <CardContent>
              <Crown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">您还未开通会员</p>
              <Link href="/"><Button>立即开通</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">会员信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">产品类型</span>
                    <span>{member.product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">开通时间</span>
                    <span>{format(new Date(member.startDate), 'yyyy-MM-dd')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">到期时间</span>
                    <span>{format(new Date(member.endDate), 'yyyy-MM-dd')}</span>
                  </div>
                  {member.plateNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">绑定车牌</span>
                      <span>{plateColorMap[member.plateColor || 'BLUE'] || ''} {member.plateNumber}</span>
                    </div>
                  )}
                  {member.warrantyEndDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">维保到期</span>
                      <span>{format(new Date(member.warrantyEndDate), 'yyyy-MM-dd')}</span>
                    </div>
                  )}
                  {member.isTrial && (
                    <div className="flex justify-between text-orange-600">
                      <span>体验状态</span>
                      <span>免费体验期</span>
                    </div>
                  )}
                  {member.status === 'PENDING_CANCEL' && member.cancelReason && (
                    <div className="flex justify-between text-amber-600">
                      <span>取消原因</span>
                      <span>{cancelReasonMap[member.cancelReason] || member.cancelReason}</span>
                    </div>
                  )}
                  {member.status === 'PENDING_CANCEL' && member.cancelAt && (
                    <div className="flex justify-between text-amber-600">
                      <span>取消时间</span>
                      <span>{format(new Date(member.cancelAt), 'yyyy-MM-dd HH:mm')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {member.status === 'PENDING_CANCEL' && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">会员取消中</p>
                      <p>您的会员权益将保留至 {format(new Date(member.endDate), 'yyyy-MM-dd')} 到期。到期后会员服务将正式取消。</p>
                      <p className="mt-1">只换不修服务将延续至会员期结束，到期后维保期恢复为产品发行时记录的维保期。</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-0">
                <Link href="/rights" className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span>权益中心</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <Link href="/billing" className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>扣费记录</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <span>车辆管理</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {member.status !== 'CANCELLED' && member.status !== 'EXPIRED' && member.status !== 'PENDING_CANCEL' && (
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowCancelDialog(true)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                取消会员服务
              </Button>
            )}

            <div className="text-xs text-gray-400 space-y-1">
              <p>• 体验期内取消即时生效</p>
              <p>• 会员生效后取消，权益保留至到期日</p>
              <p>• 已扣费会员原则上不予退款</p>
              <p>• 取消后只换不修服务延续至会员期结束</p>
            </div>
          </div>
        )}
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">确认取消会员服务？</h3>
                  <p className="text-sm text-gray-500 mt-1">请仔细阅读以下内容</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-2 mb-6">
                <p>1. 取消后权益将保留至 {member ? format(new Date(member.endDate), 'yyyy-MM-dd') : '到期日'}，到期后正式取消。</p>
                <p>2. 只换不修服务将延续至会员期结束，到期后维保期恢复为产品发行时记录的维保期。</p>
                <p>3. 取消后不进行退款。</p>
                <p>4. 取消后将通知粤运暂停权益服务。</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">再想想</Button>
                <Button variant="destructive" onClick={handleCancel} disabled={cancelling} className="flex-1">
                  {cancelling ? '取消中...' : '确认取消'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto flex">
          <Link href="/" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Crown className="w-5 h-5" />
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link href="/rights" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-xs mt-1">权益</span>
          </Link>
          <Link href="/member" className="flex-1 flex flex-col items-center py-2 text-blue-600">
            <Car className="w-5 h-5" />
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
