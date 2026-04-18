'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { AlertTriangle, RefreshCw } from 'lucide-react'

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
    const params = new URLSearchParams()
    if (filterMonth) params.append('month', filterMonth)
    if (filterStatus) params.append('status', filterStatus)

    fetch(`/api/billing-engine?${params}`)
      .then(res => res.json())
      .then(setLogs)

    fetch('/api/billing-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'monthly_stats' }),
    })
      .then(res => res.json())
      .then(data => setStats(data.data))

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
    const styles: Record<string, { bg: string; color: string }> = {
      SUCCESS: { bg: '#f0fdf4', color: '#1aae39' },
      FAILED: { bg: '#fef2f2', color: '#dc2626' },
      PENDING: { bg: '#fff7ed', color: '#dd5b00' },
      CAPPED: { bg: '#f2f9ff', color: '#0075de' },
    }
    const labels: Record<string, string> = {
      SUCCESS: '成功',
      FAILED: '失败',
      PENDING: '待处理',
      CAPPED: '已封顶',
    }
    return <span style={{ background: styles[status]?.bg || '#f6f5f4', color: styles[status]?.color || '#615d59', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>{labels[status] || status}</span>
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MEMBERSHIP_FEE: '会员费',
      PER_USE_FEE: '次卡费',
    }
    return labels[type] || type
  }

  const testPerUseBilling = async () => {
    if (!testUserId) return
    const res = await fetch('/api/billing-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'calculate_per_use', userId: testUserId }),
    })
    const data = await res.json()
    setTestResult(data)
  }

  const checkCapStatus = async () => {
    if (!testUserId) return
    const res = await fetch('/api/billing-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check_monthly_cap', userId: testUserId }),
    })
    const data = await res.json()
    setTestResult(data)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin/billing-control" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>扣费控制</h1>
          <button onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>
            <RefreshCw style={{ width: 14, height: 14 }} />刷新
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: '本月扣费金额', value: `¥${stats.totalAmount.toFixed(2)}`, color: '#1aae39' },
              { label: '本月扣费笔数', value: stats.totalCount, color: 'rgba(0,0,0,0.95)' },
              { label: '封顶次数', value: stats.cappedCount, color: '#0075de' },
              { label: '统计月份', value: stats.month, color: 'rgba(0,0,0,0.95)' },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, color: '#615d59' }}>{stat.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Test Tools */}
        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, marginBottom: 24 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle style={{ width: 16, height: 16, color: '#dd5b00' }} />
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>扣费计算测试</h2>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#615d59', marginBottom: 6 }}>选择用户</label>
                <select value={testUserId} onChange={e => setTestUserId(e.target.value)} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14, background: '#fff' }}>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name || u.phone}</option>
                  ))}
                </select>
              </div>
              <button onClick={testPerUseBilling} style={{ padding: '10px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>计算次卡扣费</button>
              <button onClick={checkCapStatus} style={{ padding: '10px 16px', background: '#fff', color: '#0075de', border: '1px solid #0075de', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>检查封顶状态</button>
            </div>
            {testResult && (
              <div style={{ marginTop: 16, padding: 12, background: '#f6f5f4', borderRadius: 8 }}>
                <pre style={{ fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, marginBottom: 24, padding: 16, display: 'flex', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#615d59', marginBottom: 6 }}>月份</label>
            <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#615d59', marginBottom: 6 }}>状态</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14, background: '#fff', minWidth: 120 }}>
              <option value="">全部</option>
              <option value="SUCCESS">成功</option>
              <option value="FAILED">失败</option>
              <option value="CAPPED">已封顶</option>
              <option value="PENDING">待处理</option>
            </select>
          </div>
        </div>

        {/* Logs */}
        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>扣费日志</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f5f4', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                {['用户', '类型', '金额', '状态', '月份', '时间', '备注'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13, color: '#615d59' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#a39e98' }}>暂无扣费记录</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <td style={{ padding: '12px 16px' }}>{getUserName(log.userId)}</td>
                    <td style={{ padding: '12px 16px' }}>{getTypeLabel(log.type)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>¥{log.amount.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>{getStatusBadge(log.status)}</td>
                    <td style={{ padding: '12px 16px', color: '#615d59' }}>{log.month}</td>
                    <td style={{ padding: '12px 16px', color: '#615d59' }}>{new Date(log.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#615d59' }}>{log.reason || '-'}</td>
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
