'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Crown, Car, Wrench, CheckCircle, Clock, ChevronRight } from 'lucide-react'

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
    description: string | null
    detailHtml: string | null
  }
  member?: {
    id: string
    plateNumber: string | null
    plateColor: string | null
    product?: { name: string }
  }
  usages: {
    id: string
    type: string
    description: string | null
    createdAt: string
  }[]
}

interface Member {
  id: string
  userId: string
  status: string
  plateNumber: string | null
  plateColor: string | null
  product: { name: string }
}

const plateColorDot: Record<string, string> = { BLUE: '#0075de', YELLOW: '#f59e0b', GREEN: '#22c55e' }
const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  TRIAL: { label: '体验期', bg: '#fff7ed', text: '#dd5b00' },
  ACTIVE: { label: '生效中', bg: '#f0fdf4', text: '#1aae39' },
  PENDING_CANCEL: { label: '待取消', bg: '#fffbeb', text: '#dd5b00' },
}

export default function RightsPage() {
  const [userRights, setUserRights] = useState<UserRight[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasMember, setHasMember] = useState(false)
  const [detailHtml, setDetailHtml] = useState<string | null>(null)
  const [detailTitle, setDetailTitle] = useState('')

  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId')

    if (!currentUserId) {
      setHasMember(false)
      setLoading(false)
      return
    }

    fetch('/api/members')
      .then(res => res.json())
      .then((data: Member[]) => {
        const userMembers = data.filter(m =>
          m.userId === currentUserId && ['TRIAL', 'ACTIVE', 'PENDING_CANCEL'].includes(m.status)
        )
        setMembers(userMembers)

        if (userMembers.length === 0) {
          setHasMember(false)
          setLoading(false)
          return null
        }

        setHasMember(true)
        const savedPlate = localStorage.getItem('selectedPlate')
        const defaultPlate = userMembers.find(m => m.plateNumber === savedPlate)?.plateNumber || userMembers[0].plateNumber
        setSelectedPlate(defaultPlate)

        return fetch(`/api/user-rights?userId=${currentUserId}`)
          .then(res => res?.json())
      })
      .then(data => {
        if (data) setUserRights(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedPlate' && e.newValue) {
        setSelectedPlate(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const filteredRights = selectedPlate
    ? userRights.filter(ur => ur.member?.plateNumber === selectedPlate)
    : userRights

  const currentMember = members.find(m => m.plateNumber === selectedPlate)

  const getIcon = (name: string) => {
    if (name.includes('拯救') || name.includes('救援')) return Shield
    if (name.includes('更换') || name.includes('维修')) return Wrench
    return Crown
  }

  const getStatusBadge = (status: string, usedCount: number, totalCount: number) => {
    if (status === 'ACTIVE') return <span style={{ background: '#f0fdf4', color: '#1aae39', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>剩余 {totalCount - usedCount} 次</span>
    if (status === 'USED') return <span style={{ background: '#f6f5f4', color: '#615d59', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>已用完</span>
    if (status === 'EXPIRED') return <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>已过期</span>
    return null
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { RESCUE: '救援', REPLACE: '更换', INSURANCE: '保险' }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <p style={{ color: '#615d59' }}>加载中...</p>
      </div>
    )
  }

  const activeRights = filteredRights.filter(ur => ur.status === 'ACTIVE')
  const usedRights = filteredRights.filter(ur => ur.status !== 'ACTIVE')

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'rgba(0,0,0,0.95)', letterSpacing: '-0.32px' }}>权益中心</h1>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', color: '#615d59' }}>
            <span>可用权益: <strong style={{ color: 'rgba(0,0,0,0.95)' }}>{activeRights.length}</strong></span>
            <span>已用: <strong style={{ color: 'rgba(0,0,0,0.95)' }}>{usedRights.length}</strong></span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '16px' }}>
        {!hasMember ? (
          <div style={{ textAlign: 'center', padding: '48px 16px' }}>
            <Shield style={{ width: 48, height: 48, color: '#a39e98', margin: '0 auto 16px' }} />
            <p style={{ color: '#615d59', marginBottom: 8 }}>您还未开通会员</p>
            <p style={{ color: '#a39e98', fontSize: '14px', marginBottom: 16 }}>开通会员后即可享受专属权益</p>
            <Link href="/">
              <button style={{ background: '#0075de', color: '#fff', padding: '8px 16px', borderRadius: 4, border: 'none', fontWeight: 600, cursor: 'pointer' }}>立即开通会员</button>
            </Link>
          </div>
        ) : (
          <>
            {currentMember && (
              <div style={{ marginBottom: 16, background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: plateColorDot[currentMember.plateColor || 'BLUE'] }} />
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{currentMember.plateNumber}</span>
                <span style={{ background: statusMap[currentMember.status]?.bg, color: statusMap[currentMember.status]?.text, padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 }}>
                  {statusMap[currentMember.status]?.label}
                </span>
              </div>
            )}

            {filteredRights.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                <Shield style={{ width: 48, height: 48, color: '#a39e98', margin: '0 auto 16px' }} />
                <p style={{ color: '#615d59' }}>该车辆暂无权益</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {activeRights.length > 0 && (
                  <>
                    <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#615d59', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle style={{ width: 16, height: 16, color: '#1aae39' }} />可用权益
                    </h2>
                    {activeRights.map((ur) => {
                      const Icon = ur.right ? getIcon(ur.right.name) : Crown
                      const hasDetail = !!ur.right?.detailHtml
                      return (
                        <div
                          key={ur.id}
                          onClick={() => {
                            if (hasDetail) {
                              setDetailTitle(ur.right!.name)
                              setDetailHtml(ur.right!.detailHtml!)
                            }
                          }}
                          style={{
                            background: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 12,
                            padding: 16,
                            cursor: hasDetail ? 'pointer' : 'default',
                          }}
                        >
                          <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 48, height: 48, background: '#f6f5f4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon style={{ width: 24, height: 24, color: '#0075de' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 600 }}>{ur.right?.name || '未知权益'}</span>
                                {getStatusBadge(ur.status, ur.usedCount, ur.totalCount)}
                              </div>
                              <p style={{ fontSize: '14px', color: '#615d59', marginBottom: 8 }}>{ur.right?.description || '暂无描述'}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: '#a39e98' }}>有效期至: {new Date(ur.expireAt).toLocaleDateString()}</span>
                                {hasDetail && <ChevronRight style={{ width: 16, height: 16, color: '#a39e98' }} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}

                {usedRights.length > 0 && (
                  <>
                    <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#615d59', display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                      <Clock style={{ width: 16, height: 16, color: '#a39e98' }} />已用权益
                    </h2>
                    {usedRights.map((ur) => {
                      const Icon = ur.right ? getIcon(ur.right.name) : Crown
                      return (
                        <div
                          key={ur.id}
                          style={{
                            background: '#f6f5f4',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 12,
                            padding: 16,
                          }}
                        >
                          <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 48, height: 48, background: '#ebebeb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon style={{ width: 24, height: 24, color: '#a39e98' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 600, color: '#615d59' }}>{ur.right?.name || '未知权益'}</span>
                                {getStatusBadge(ur.status, ur.usedCount, ur.totalCount)}
                              </div>
                              {ur.usages.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                  {ur.usages.map(u => (
                                    <div key={u.id} style={{ fontSize: '12px', color: '#a39e98', display: 'flex', gap: 8, marginBottom: 4 }}>
                                      <span style={{ background: '#ebebeb', padding: '2px 6px', borderRadius: 4 }}>{getTypeLabel(u.type)}</span>
                                      {u.description && <span>{u.description}</span>}
                                      <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}

                <div style={{ background: '#f2f9ff', border: '1px solid rgba(0, 117, 222, 0.2)', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: 8, color: '#0075de' }}>温馨提示</p>
                  <ul style={{ fontSize: '13px', color: '#097fe8', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li>• 权益在会员有效期内可用</li>
                    <li>• 点击权益可查看详情</li>
                    <li>• 部分权益需提前预约</li>
                    <li>• 如有问题请联系客服：400-xxx-xxxx</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {detailHtml && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 400, width: '100%', maxHeight: '80vh', overflow: 'auto', padding: 24 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 16 }}>{detailTitle}</h3>
            <div dangerouslySetInnerHTML={{ __html: detailHtml }} />
            <button onClick={() => { setDetailHtml(null); setDetailTitle('') }} style={{ width: '100%', marginTop: 16, padding: '8px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>关闭</button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTop: '1px solid rgba(0, 0, 0, 0.1)', zIndex: 40 }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', display: 'flex' }}>
          <Link href="/" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', color: '#a39e98' }}>
            <Car style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500 }}>ETC申办</span>
          </Link>
          <Link href="/rights" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', color: 'rgba(0,0,0,0.95)' }}>
            <Shield style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500 }}>权益</span>
          </Link>
          <Link href="/member" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', color: '#a39e98' }}>
            <Crown style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500 }}>我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
