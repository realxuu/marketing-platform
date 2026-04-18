'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { AlertTriangle } from 'lucide-react'
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

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    TRIAL: { label: '体验期', color: '#dd5b00', bg: '#fff7ed' },
    ACTIVE: { label: '生效中', color: '#1aae39', bg: '#f0fdf4' },
    EXPIRED: { label: '已过期', color: '#615d59', bg: '#f6f5f4' },
    CANCELLED: { label: '已取消', color: '#dc2626', bg: '#fef2f2' },
    PENDING_CANCEL: { label: '待取消', color: '#dd5b00', bg: '#fffbeb' },
  }

  const cancelReasonMap: Record<string, string> = {
    USER_CANCEL: '用户取消',
    ADMIN_CANCEL: '后台取消',
    BILLING_FAILED: '扣费失败',
    ETC_CANCELLED: 'ETC注销',
  }

  const plateColorDot: Record<string, string> = { BLUE: '#0075de', YELLOW: '#f59e0b', GREEN: '#22c55e' }
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
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin/members" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'rgba(0,0,0,0.95)' }}>会员管理</h1>

        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f5f4', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                {['用户', '绑定车牌', '会员产品', '状态', '有效期', '剩余', '维保到期', '取消信息', '操作'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13, color: '#615d59' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const daysLeft = Math.max(0, Math.ceil((new Date(member.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                return (
                  <tr key={member.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500 }}>{member.user.name}</div>
                      <div style={{ fontSize: 12, color: '#a39e98' }}>{member.user.phone}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {member.plateNumber ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: plateColorDot[member.plateColor || 'BLUE'] }} />
                          <span>{plateColorMap[member.plateColor || 'BLUE']}牌 {member.plateNumber}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{member.product.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: statusMap[member.status]?.bg, color: statusMap[member.status]?.color, padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                        {statusMap[member.status]?.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>
                      <div>{format(new Date(member.startDate), 'yyyy-MM-dd')}</div>
                      <div style={{ color: '#a39e98' }}>至 {format(new Date(member.endDate), 'yyyy-MM-dd')}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: daysLeft < 7 ? '#dc2626' : 'rgba(0,0,0,0.95)', fontWeight: daysLeft < 7 ? 600 : 400 }}>{daysLeft}天</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#615d59' }}>
                      {member.warrantyEndDate ? format(new Date(member.warrantyEndDate), 'yyyy-MM-dd') : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>
                      {member.cancelReason ? (
                        <div>
                          <div style={{ color: '#dd5b00' }}>{cancelReasonMap[member.cancelReason] || member.cancelReason}</div>
                          {member.cancelAt && <div style={{ color: '#a39e98' }}>{format(new Date(member.cancelAt), 'MM-dd HH:mm')}</div>}
                        </div>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {['TRIAL', 'ACTIVE'].includes(member.status) && (
                        <button
                          onClick={() => { setCancelMember(member); setShowCancelDialog(true) }}
                          style={{ padding: '6px 12px', background: 'transparent', color: '#dc2626', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}
                        >
                          取消会员
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>

      {showCancelDialog && cancelMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 400, width: '100%', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <AlertTriangle style={{ width: 24, height: 24, color: '#dd5b00', marginTop: 2 }} />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>后台取消会员</h3>
                <p style={{ fontSize: 14, color: '#615d59', marginTop: 4 }}>
                  取消 {cancelMember.user.name} 的 {cancelMember.product.name}
                </p>
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#615d59', marginBottom: 24 }}>
              <p style={{ marginBottom: 8 }}>1. 权益将保留至 {format(new Date(cancelMember.endDate), 'yyyy-MM-dd')} 到期</p>
              <p style={{ marginBottom: 8 }}>2. 只换不修服务延续至会员期结束</p>
              <p style={{ marginBottom: 8 }}>3. 取消后不退款，将通知粤运</p>
              <p>4. 取消原因将标记为"后台取消"</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setShowCancelDialog(false); setCancelMember(null) }} style={{ flex: 1, padding: '12px 16px', background: 'transparent', color: 'rgba(0,0,0,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}>返回</button>
              <button onClick={handleCancel} disabled={countdown > 0} style={{ flex: 1, padding: '12px 16px', background: countdown > 0 ? '#f6f5f4' : '#dc2626', color: countdown > 0 ? '#a39e98' : '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: countdown > 0 ? 'not-allowed' : 'pointer' }}>
                {countdown > 0 ? `请阅读 (${countdown}s)` : '确认取消'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
