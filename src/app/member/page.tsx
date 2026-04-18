'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    const currentUserId = localStorage.getItem('currentUserId')

    fetch('/api/members')
      .then(res => res.json())
      .then((data: Member[]) => {
        const userMembers = currentUserId
          ? data.filter(m => m.userId === currentUserId || m.user?.id === currentUserId)
          : data

        setMembers(userMembers)
        if (userMembers.length > 0) {
          const savedPlate = localStorage.getItem('selectedPlate')
          const activeMember = userMembers.find(m => ['TRIAL', 'ACTIVE', 'PENDING_CANCEL'].includes(m.status))
          const defaultPlate = userMembers.find(m => m.plateNumber === savedPlate)?.plateNumber || activeMember?.plateNumber || userMembers[0]?.plateNumber || null
          setSelectedPlate(defaultPlate)
        }
        setLoading(false)

        if (userMembers.length === 0 && currentUserId) {
          return fetch(`/api/orders?status=PENDING_ACTIVATION&userId=${currentUserId}`)
            .then(res => res.json())
            .then((orders: PendingOrder[]) => {
              setPendingOrders(orders)
            })
        }
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
    TRIAL: { label: '体验期', color: '#dd5b00', bg: '#fff7ed' },
    ACTIVE: { label: '生效中', color: '#1aae39', bg: '#f0fdf4' },
    EXPIRED: { label: '已过期', color: '#615d59', bg: '#f6f5f4' },
    CANCELLED: { label: '已取消', color: '#dc2626', bg: '#fef2f2' },
    PENDING_CANCEL: { label: '待取消', color: '#dd5b00', bg: '#fffbeb' },
  }

  const cancelReasonMap: Record<string, string> = {
    USER_CANCEL: '用户主动取消',
    ADMIN_CANCEL: '后台系统取消',
    BILLING_FAILED: '扣费失败取消',
    ETC_CANCELLED: 'ETC注销取消',
  }

  const plateColorDot: Record<string, string> = { BLUE: '#0075de', YELLOW: '#f59e0b', GREEN: '#22c55e' }

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <p style={{ color: '#615d59' }}>加载中...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', paddingBottom: 80 }}>
      {/* 顶部会员卡 */}
      <div style={{ background: 'linear-gradient(135deg, #0075de 0%, #097fe8 50%, #005bb5 100%)', color: '#ffffff', padding: '48px 16px 32px', borderRadius: '0 0 24px 24px' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          {/* 车牌切换 */}
          {members.length > 1 && (
            <div style={{ marginBottom: 16, position: 'relative' }}>
              <button
                onClick={() => setShowPlatePicker(!showPlatePicker)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 9999, padding: '6px 16px', color: '#fff', fontSize: 14, cursor: 'pointer' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: plateColorDot[currentMember?.plateColor || 'BLUE'] }} />
                <span>{currentMember?.plateNumber || '选择车辆'}</span>
                <ChevronDown style={{ width: 14, height: 14 }} />
              </button>
              {showPlatePicker && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 10, overflow: 'hidden', minWidth: 200 }}>
                  {members.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedPlate(m.plateNumber)
                        localStorage.setItem('selectedPlate', m.plateNumber || '')
                        setShowPlatePicker(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: m.plateNumber === selectedPlate ? '#f2f9ff' : '#fff',
                        color: m.plateNumber === selectedPlate ? '#0075de' : '#615d59',
                        fontSize: 14,
                        cursor: 'pointer',
                        textAlign: 'left' as const,
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: plateColorDot[m.plateColor || 'BLUE'] }} />
                      <span>{m.plateNumber}</span>
                      <span style={{ marginLeft: 'auto', background: statusMap[m.status]?.bg, color: statusMap[m.status]?.color, padding: '2px 8px', borderRadius: 9999, fontSize: 12 }}>
                        {statusMap[m.status]?.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!currentMember ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Crown style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.4)', margin: '0 auto 12px' }} />
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>您还未开通会员</p>
              <Link href="/">
                <button style={{ background: '#fff', color: '#0075de', border: 'none', padding: '10px 24px', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>立即开通</button>
              </Link>
            </div>
          ) : (
            <>
              {/* 会员卡主体 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Crown style={{ width: 20, height: 20, color: '#fcd34d' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>{currentMember.product.name}</div>
                    {currentMember.plateNumber && (
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: plateColorDot[currentMember.plateColor || 'BLUE'] }} />
                        {currentMember.plateNumber}
                      </div>
                    )}
                  </div>
                </div>
                <span style={{ background: statusMap[currentMember.status]?.bg, color: statusMap[currentMember.status]?.color, padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                  {statusMap[currentMember.status]?.label}
                </span>
              </div>

              {/* 关键数据 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{daysLeft}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>{currentMember.isTrial ? '试用剩余' : '剩余天数'}</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{format(new Date(currentMember.startDate), 'MM/dd')}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>开通日期</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{format(new Date(currentMember.endDate), 'MM/dd')}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>到期日期</div>
                </div>
              </div>

              {/* 体验期提示 */}
              {currentMember.isTrial && (
                <div style={{ marginTop: 12, textAlign: 'center', fontSize: 14, color: '#fef3c7', background: 'rgba(251, 191, 36, 0.2)', borderRadius: 9999, padding: '8px 16px' }}>
                  免费体验期中，到期后自动扣费
                </div>
              )}

              {/* 待取消提示 */}
              {currentMember.status === 'PENDING_CANCEL' && (
                <div style={{ marginTop: 12, background: 'rgba(251, 191, 36, 0.2)', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <AlertTriangle style={{ width: 16, height: 16, color: '#fcd34d', marginTop: 2, flexShrink: 0 }} />
                    <div style={{ fontSize: 14 }}>
                      <p style={{ fontWeight: 500, margin: 0 }}>会员取消中</p>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>
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
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '24px 16px' }}>
        {/* 待激活订单 */}
        {pendingOrders.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#615d59', marginBottom: 12 }}>待激活订单</h3>
            {pendingOrders.map(order => (
              <div
                key={order.id}
                style={{
                  background: '#f2f9ff',
                  border: '1px solid rgba(0, 117, 222, 0.2)',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap style={{ width: 16, height: 16, color: '#0075de' }} />
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{order.product.name}</span>
                  </div>
                  <span style={{ background: '#0075de', color: '#fff', padding: '2px 8px', borderRadius: 9999, fontSize: 12 }}>待激活</span>
                </div>
                <div style={{ fontSize: 12, color: '#615d59', marginBottom: 12 }}>
                  <p>申办时间：{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}</p>
                  <p>签约渠道：{order.channel === 'ALIPAY' ? '支付宝' : order.channel === 'WECHAT' ? '微信' : order.channel || '-'}</p>
                </div>
                <button
                  style={{ width: '100%', padding: '10px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer', opacity: activating === order.id ? 0.7 : 1 }}
                  onClick={() => handleActivate(order.id)}
                  disabled={activating === order.id}
                >
                  {activating === order.id ? '激活中...' : '模拟ETC激活（演示）'}
                </button>
                <p style={{ fontSize: 12, color: '#a39e98', textAlign: 'center', marginTop: 8 }}>收到ETC产品后激活，自动扣费开通会员</p>
              </div>
            ))}
          </div>
        )}

        {currentMember && (
          <div>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              <Link href="/rights" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', color: 'inherit', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, background: '#fff7ed', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield style={{ width: 16, height: 16, color: '#dd5b00' }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>权益中心</span>
                </div>
                <ChevronRight style={{ width: 16, height: 16, color: '#a39e98' }} />
              </Link>
            </div>

            {currentMember.status !== 'CANCELLED' && currentMember.status !== 'EXPIRED' && currentMember.status !== 'PENDING_CANCEL' && (
              <button
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  color: '#dc2626',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 4,
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                onClick={() => setShowCancelDialog(true)}
              >
                <LogOut style={{ width: 16, height: 16 }} />
                取消会员服务
              </button>
            )}

            <div style={{ fontSize: 12, color: '#a39e98', marginTop: 12 }}>
              <p style={{ marginBottom: 4 }}>• 每辆车只能购买一个会员产品</p>
              <p style={{ marginBottom: 4 }}>• 体验期内取消即时生效，不产生费用</p>
              <p>• 会员生效后取消，权益保留至到期日</p>
            </div>
          </div>
        )}
      </div>

      {/* 取消确认弹窗 */}
      {showCancelDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 400, width: '100%', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <AlertTriangle style={{ width: 24, height: 24, color: '#dd5b00', marginTop: 2 }} />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>确认取消会员服务？</h3>
                <p style={{ fontSize: 14, color: '#615d59', marginTop: 4 }}>请仔细阅读以下内容</p>
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#615d59', marginBottom: 24 }}>
              <p style={{ marginBottom: 8 }}>1. 取消后权益将保留至 {currentMember ? format(new Date(currentMember.endDate), 'yyyy-MM-dd') : '到期日'}，到期后正式取消。</p>
              <p style={{ marginBottom: 8 }}>2. 只换不修服务将延续至会员期结束。</p>
              <p style={{ marginBottom: 8 }}>3. 取消后不进行退款。</p>
              <p>4. 取消后将通知粤运暂停权益服务。</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowCancelDialog(false)} style={{ flex: 1, padding: '12px 16px', background: 'transparent', color: 'rgba(0,0,0,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}>再想想</button>
              <button onClick={handleCancel} disabled={cancelling || countdown > 0} style={{ flex: 1, padding: '12px 16px', background: cancelling || countdown > 0 ? '#f6f5f4' : '#dc2626', color: cancelling || countdown > 0 ? '#a39e98' : '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: cancelling || countdown > 0 ? 'not-allowed' : 'pointer' }}>
                {cancelling ? '取消中...' : countdown > 0 ? `请阅读 (${countdown}s)` : '确认取消'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部导航 */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTop: '1px solid rgba(0, 0, 0, 0.1)', zIndex: 40 }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', display: 'flex' }}>
          <Link href="/" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', color: '#a39e98' }}>
            <Car style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500 }}>ETC申办</span>
          </Link>
          <Link href="/rights" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', color: '#a39e98' }}>
            <Shield style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500 }}>权益</span>
          </Link>
          <Link href="/member" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', color: '#0075de' }}>
            <Crown style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500 }}>我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
