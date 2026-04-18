'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Crown, Shield, Car, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface BillingRecord {
  id: string
  amount: number
  type: string
  status: string
  remark: string | null
  createdAt: string
  member: {
    product: { name: string }
    user: { name: string }
  }
}

export default function BillingPage() {
  const [records, setRecords] = useState<BillingRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/billing')
      .then(res => res.json())
      .then((data: BillingRecord[]) => {
        setRecords(data)
        setLoading(false)
      })
  }, [])

  const typeMap: Record<string, { label: string; bg: string; text: string }> = {
    MEMBERSHIP_FEE: { label: '会员费', bg: '#f2f9ff', text: '#0075de' },
    TOLL_FEE: { label: '通行费', bg: '#f0fdf4', text: '#1aae39' },
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    SUCCESS: { label: '成功', color: '#1aae39' },
    FAILED: { label: '失败', color: '#dc2626' },
    PENDING: { label: '处理中', color: '#dd5b00' },
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
      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'rgba(0,0,0,0.95)', letterSpacing: '-0.32px', textAlign: 'center' }}>扣费记录</h1>
        </div>
      </header>

      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '16px' }}>
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px' }}>
            <Calendar style={{ width: 48, height: 48, color: '#a39e98', margin: '0 auto 16px' }} />
            <p style={{ color: '#615d59' }}>暂无扣费记录</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {records.map((record) => (
              <div
                key={record.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ background: typeMap[record.type]?.bg, color: typeMap[record.type]?.text, padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                        {typeMap[record.type]?.label}
                      </span>
                      <span style={{ fontSize: '13px', color: statusMap[record.status]?.color, fontWeight: 500 }}>
                        {statusMap[record.status]?.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#615d59' }}>
                      {record.member.product.name} · {record.member.user.name}
                    </div>
                    {record.remark && (
                      <div style={{ fontSize: '12px', color: '#a39e98', marginTop: 4 }}>{record.remark}</div>
                    )}
                    <div style={{ fontSize: '12px', color: '#a39e98', marginTop: 4 }}>
                      {format(new Date(record.createdAt), 'yyyy-MM-dd HH:mm')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: record.type === 'TOLL_FEE' ? '#dd5b00' : '#0075de' }}>
                      -¥{record.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
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
          <Link href="/member" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', color: '#a39e98' }}>
            <Crown style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 12, marginTop: 4, fontWeight: 500 }}>我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
