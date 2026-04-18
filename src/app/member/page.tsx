'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, Shield, Car, ChevronRight, LogOut, AlertTriangle, ChevronDown, Zap } from 'lucide-react'
import { format } from 'date-fns'

interface PendingOrder {
  id: string
  amount: number
  channel: string | null
  createdAt: string
  product: { name: string; type: string }
}

interface Member {
  id: string
  userId: string
  status: string
  startDate: string
  endDate: string
  isTrial: boolean
  plateNumber: string | null
  plateColor: string | null
  cancelReason: string | null
  cancelAt: string | null
  product: {
    id: string
    name: string
    type: string
    price: number
  }
  user?: {
    id: string
  }
}

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([])
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showPlatePicker, setShowPlatePicker] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [activating, setActivating] = useState<string | null>(null)

  useEffect(() => {
    // 从 localStorage 获取当前用户 ID（模拟登录态）
    const currentUserId = localStorage.getItem('currentUserId')

    // 获取会员信息
    fetch('/api/members')
      .then(res => res.json())
      .then((data: Member[]) => {
        // 如果有登录态，只显示当前用户的会员
        const userMembers = currentUserId
          ? data.filter(m => m.userId === currentUserId || m.user?.id === currentUserId)
          : data

        setMembers(userMembers)
        if (userMembers.length > 0) {
          // 从 localStorage 获取选中的车牌，或默认选第一个有效会员
          const savedPlate = localStorage.getItem('selectedPlate')
          const activeMember = userMembers.find(m => ['TRIAL', 'ACTIVE', 'PENDING_CANCEL'].includes(m.status))
          const defaultPlate = userMembers.find(m => m.plateNumber === savedPlate)?.plateNumber || activeMember?.plateNumber || userMembers[0]?.plateNumber || null
          setSelectedPlate(defaultPlate)
        }
        setLoading(false)
      })
    fetch('/api/orders?status=PENDING_ACTIVATION')
      .then(res => res.json())
      .then((orders: PendingOrder[]) => {
        setPendingOrders(orders)
      })
  }, [])

  useEffect(() => {
    if (!showCancelDialog) { setCountdown(5); return }
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [showCancelDialog, countdown])

  const currentMember = members.find(m => m.plateNumber === selectedPlate) || members[0] || null

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

  const plateColorMap: Record<string, string> = { BLUE: '蓝', YELLOW: '黄', GREEN: '绿' }
  const plateColorDot: Record<string, string> = { BLUE: 'bg-blue-500', YELLOW: 'bg-yellow-500', GREEN: 'bg-green-500' }

  const daysLeft = currentMember
    ? Math.max(0, Math.ceil((new Date(currentMember.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  const handleCancel = async () => {
    if (!currentMember) return
    setCancelling(true)
    try {
      const res = await fetch('/api/members/cancel', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: currentMember.id, cancelReason: 'USER_CANCEL' }),
      })
      const data = await res.json()
      if (data.success) {
        setMembers(members.map(m =>
          m.id === currentMember.id
            ? { ...m, status: 'PENDING_CANCEL', cancelReason: 'USER_CANCEL', cancelAt: new Date().toISOString() }
            : m
        ))
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

  const handleActivate = async (orderId: string) => {
    setActivating(orderId)
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (data.success) {
        setPendingOrders(prev => prev.filter(o => o.id !== orderId))
        window.location.reload()
      } else {
        alert(data.error || '激活失败')
      }
    } catch {
      alert('激活失败，请重试')
    } finally {
      setActivating(null)
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
      {/* 顶部会员卡 */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          {/* 车牌切换 */}
          {members.length > 1 && (
            <div className="mb-4 relative">
              <button
                onClick={() => setShowPlatePicker(!showPlatePicker)}
                className="flex items-center gap-2 text-sm bg-white/15 rounded-full px-4 py-1.5"
              >
                <span className={`w-2 h-2 rounded-full ${plateColorDot[currentMember?.plateColor || 'BLUE']}`} />
                <span>{currentMember?.plateNumber || '选择车辆'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showPlatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl z-10 overflow-hidden min-w-[200px]">
                  {members.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedPlate(m.plateNumber)
                        localStorage.setItem('selectedPlate', m.plateNumber || '')
                        setShowPlatePicker(false)
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 ${
                        m.plateNumber === selectedPlate ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${plateColorDot[m.plateColor || 'BLUE']}`} />
                      <span>{m.plateNumber}</span>
                      <Badge className={`ml-auto text-xs ${statusMap[m.status]?.bg} ${statusMap[m.status]?.color}`}>
                        {statusMap[m.status]?.label}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!currentMember ? (
            <div className="text-center py-6">
              <Crown className="w-12 h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/70 mb-4">您还未开通会员</p>
              <Link href="/">
                <Button className="bg-white text-blue-700 hover:bg-white/90">立即开通</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* 会员卡主体 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{currentMember.product.name}</div>
                    {currentMember.plateNumber && (
                      <div className="text-blue-200 text-xs flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${plateColorDot[currentMember.plateColor || 'BLUE']}`} />
                        {currentMember.plateNumber}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={`${statusMap[currentMember.status]?.bg} ${statusMap[currentMember.status]?.color} text-xs`}>
                  {statusMap[currentMember.status]?.label}
                </Badge>
              </div>

              {/* 关键数据 */}
              <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{daysLeft}</div>
                  <div className="text-blue-200 text-xs mt-0.5">{currentMember.isTrial ? '试用剩余' : '剩余天数'}</div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-lg font-bold">{format(new Date(currentMember.startDate), 'yyyy/MM/dd')}</div>
                  <div className="text-blue-200 text-xs mt-0.5">开通日期</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{format(new Date(currentMember.endDate), 'yyyy/MM/dd')}</div>
                  <div className="text-blue-200 text-xs mt-0.5">到期日期</div>
                </div>
              </div>

              {/* 体验期提示 */}
              {currentMember.isTrial && (
                <div className="mt-3 text-center text-sm text-orange-200 bg-orange-500/20 rounded-full py-1.5">
                  🎉 免费体验期中，到期后自动扣费
                </div>
              )}

              {/* 待取消提示 */}
              {currentMember.status === 'PENDING_CANCEL' && (
                <div className="mt-3 bg-amber-500/20 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-100">
                      <p className="font-medium">会员取消中</p>
                      <p className="text-amber-200 text-xs mt-0.5">
                        权益保留至 {format(new Date(currentMember.endDate), 'yyyy-MM-dd')} 到期
                        {currentMember.cancelReason && ` · ${cancelReasonMap[currentMember.cancelReason]}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 功能区域 */}
      <div className="max-w-md mx-auto px-4 -mt-2">
        {/* 待激活订单 */}
        {pendingOrders.length > 0 && (
          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium text-gray-500 px-1">待激活订单</h3>
            {pendingOrders.map(order => (
              <Card key={order.id} className="overflow-hidden border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">{order.product.name}</span>
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">待激活</Badge>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <p>申办时间：{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}</p>
                    <p>签约渠道：{order.channel === 'ALIPAY' ? '支付宝' : order.channel === 'WECHAT' ? '微信' : order.channel || '-'}</p>
                  </div>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleActivate(order.id)}
                    disabled={activating === order.id}
                  >
                    {activating === order.id ? '激活中...' : '模拟ETC激活（演示）'}
                  </Button>
                  <p className="text-xs text-gray-400 mt-2 text-center">收到ETC产品后激活，自动扣费开通会员</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentMember && (
          <div className="space-y-3 mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Link href="/rights" className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">权益中心</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              </CardContent>
            </Card>

            {currentMember.status !== 'CANCELLED' && currentMember.status !== 'EXPIRED' && currentMember.status !== 'PENDING_CANCEL' && (
              <Button
                variant="outline"
                className="w-full text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-200 h-11"
                onClick={() => setShowCancelDialog(true)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                取消会员服务
              </Button>
            )}

            <div className="text-xs text-gray-400 px-1 space-y-1 pt-1">
              <p>• 每辆车只能购买一个会员产品</p>
              <p>• 体验期内取消即时生效，不产生费用</p>
              <p>• 会员生效后取消，权益保留至到期日</p>
            </div>
          </div>
        )}
      </div>

      {/* 取消确认弹窗 */}
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
                <p>1. 取消后权益将保留至 {currentMember ? format(new Date(currentMember.endDate), 'yyyy-MM-dd') : '到期日'}，到期后正式取消。</p>
                <p>2. 只换不修服务将延续至会员期结束。</p>
                <p>3. 取消后不进行退款。</p>
                <p>4. 取消后将通知粤运暂停权益服务。</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">再想想</Button>
                <Button variant="destructive" onClick={handleCancel} disabled={cancelling || countdown > 0} className="flex-1">
                  {cancelling ? '取消中...' : countdown > 0 ? `请阅读 (${countdown}s)` : '确认取消'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto flex">
          <Link href="/" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Car className="w-5 h-5" /><span className="text-xs mt-1">ETC申办</span>
          </Link>
          <Link href="/rights" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Shield className="w-5 h-5" /><span className="text-xs mt-1">权益</span>
          </Link>
          <Link href="/member" className="flex-1 flex flex-col items-center py-2 text-blue-600">
            <Crown className="w-5 h-5" /><span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
