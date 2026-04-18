'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'

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
  right?: { id: string; name: string; type: string }
  member?: { id: string; product?: { name: string } }
  usages: { id: string; type: string; description: string | null; operator: string | null; createdAt: string }[]
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
  const [verifyForm, setVerifyForm] = useState({ type: 'RESCUE', description: '', operator: '' })

  const loadData = () => {
    fetch('/api/user-rights')
      .then(res => res.json())
      .then(data => setUserRights(data))
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }

  useEffect(() => { loadData() }, [])

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
    const styles: Record<string, { bg: string; color: string }> = {
      ACTIVE: { bg: '#f0fdf4', color: '#1aae39' },
      USED: { bg: '#f6f5f4', color: '#615d59' },
      EXPIRED: { bg: '#fef2f2', color: '#dc2626' },
    }
    const labels: Record<string, string> = {
      ACTIVE: '可用',
      USED: '已用完',
      EXPIRED: '已过期',
    }
    return <span style={{ background: styles[status]?.bg || '#f6f5f4', color: styles[status]?.color || '#615d59', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>{labels[status] || status}</span>
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { RESCUE: '救援', REPLACE: '更换', INSURANCE: '保险' }
    return labels[type] || type
  }

  const activeRights = userRights.filter(ur => ur.status === 'ACTIVE')
  const usedRights = userRights.filter(ur => ur.status !== 'ACTIVE')

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin/usages" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'rgba(0,0,0,0.95)' }}>权益核销</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, color: '#615d59' }}>可用权益</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1aae39' }}>{activeRights.length}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, color: '#615d59' }}>已用权益</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#615d59' }}>{usedRights.length}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, color: '#615d59' }}>总核销次数</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0075de' }}>{userRights.reduce((sum, ur) => sum + ur.usedCount, 0)}</div>
          </div>
        </div>

        {/* Verify Dialog */}
        {showVerify && selectedRight && (
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, marginBottom: 24 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>核销权益</h2>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ padding: 12, background: '#f6f5f4', borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#615d59' }}>权益信息</div>
                <div style={{ fontWeight: 500 }}>{selectedRight.right?.name || '未知权益'}</div>
                <div style={{ fontSize: 13, color: '#615d59', marginTop: 4 }}>
                  用户: {getUserName(selectedRight.userId)} | 剩余: {selectedRight.totalCount - selectedRight.usedCount}次
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>核销类型</label>
                  <select value={verifyForm.type} onChange={e => setVerifyForm({ ...verifyForm, type: e.target.value })} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14, background: '#fff' }}>
                    <option value="RESCUE">救援</option>
                    <option value="REPLACE">更换</option>
                    <option value="INSURANCE">保险</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>操作人</label>
                  <input value={verifyForm.operator} onChange={e => setVerifyForm({ ...verifyForm, operator: e.target.value })} placeholder="如：张三" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>备注说明</label>
                  <input value={verifyForm.description} onChange={e => setVerifyForm({ ...verifyForm, description: e.target.value })} placeholder="如：高速救援1次" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => { setShowVerify(false); setSelectedRight(null) }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>取消</button>
              <button onClick={handleVerify} style={{ padding: '8px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>确认核销</button>
            </div>
          </div>
        )}

        {/* Active Rights */}
        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>可用权益 ({activeRights.length})</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f5f4', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                {['用户', '权益名称', '关联产品', '剩余次数', '过期时间', '操作'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13, color: '#615d59' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeRights.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#a39e98' }}>暂无可用权益</td></tr>
              ) : (
                activeRights.map((ur) => (
                  <tr key={ur.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <td style={{ padding: '12px 16px' }}>{getUserName(ur.userId)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{ur.right?.name || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#615d59' }}>{ur.member?.product?.name || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: '#1aae39', fontWeight: 500 }}>{ur.totalCount - ur.usedCount} / {ur.totalCount}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#615d59' }}>{new Date(ur.expireAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => openVerify(ur)} style={{ padding: '6px 12px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>核销</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Used Rights */}
        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>已用/过期权益 ({usedRights.length})</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f5f4', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                {['用户', '权益名称', '状态', '使用记录', '过期时间'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13, color: '#615d59' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usedRights.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#a39e98' }}>暂无已用权益</td></tr>
              ) : (
                usedRights.map((ur) => (
                  <tr key={ur.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <td style={{ padding: '12px 16px' }}>{getUserName(ur.userId)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{ur.right?.name || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{getStatusBadge(ur.status)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {ur.usages.length > 0 ? (
                        <div>
                          {ur.usages.map(u => (
                            <div key={u.id} style={{ fontSize: 13, marginBottom: 4 }}>
                              <span style={{ color: '#615d59' }}>{getTypeLabel(u.type)}</span>
                              {u.description && <span style={{ color: '#a39e98', marginLeft: 4 }}>({u.description})</span>}
                              <span style={{ color: '#a39e98', marginLeft: 8 }}>{new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#a39e98' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#615d59' }}>{new Date(ur.expireAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
