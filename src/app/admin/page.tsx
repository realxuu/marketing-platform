'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, CreditCard, TrendingUp, DollarSign, Shield, FileText, Package, CheckCircle, RotateCcw } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalMembers: number
  activeMembers: number
  trialMembers: number
  totalRevenue: number
  monthlyRevenue: number
  productStats: { productId: string; _count: number }[]
  billingRecords: {
    id: string
    amount: number
    type: string
    createdAt: string
    member: { user: { name: string } }
  }[]
}

const navItems = [
  { href: '/admin', icon: TrendingUp, label: '仪表盘' },
  { href: '/admin/products', icon: Package, label: '产品管理' },
  { href: '/admin/rights', icon: Shield, label: '权益管理' },
  { href: '/admin/usages', icon: CheckCircle, label: '权益核销' },
  { href: '/admin/orders', icon: FileText, label: '订单管理' },
  { href: '/admin/members', icon: Users, label: '会员管理' },
  { href: '/admin/billing-control', icon: CreditCard, label: '扣费控制' },
  { href: '/admin/settlement', icon: DollarSign, label: '结算对账' },
]

function Sidebar({ activePath }: { activePath: string }) {
  return (
    <aside style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 220, background: '#1e293b', color: '#fff', padding: 16, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, background: '#0075de', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp style={{ width: 18, height: 18 }} />
        </div>
        <span style={{ fontWeight: 600, fontSize: 14 }}>营销平台管理</span>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              color: activePath === item.href ? '#fff' : '#94a3b8',
              background: activePath === item.href ? '#334155' : 'transparent',
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            <item.icon style={{ width: 18, height: 18 }} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #334155' }}>
        <Link href="/" style={{ display: 'block', textAlign: 'center', fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
          返回用户端
        </Link>
      </div>
    </aside>
  )
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
  }, [])

  const handleReset = async () => {
    if (!confirm('确定要重置所有演示数据吗？此操作不可恢复，将恢复到初始状态。')) return
    setResetting(true)
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        alert('演示数据已重置为初始状态')
        window.location.reload()
      } else {
        alert('重置失败：' + (data.error || '未知错误'))
      }
    } catch {
      alert('重置失败，请重试')
    } finally {
      setResetting(false)
    }
  }

  if (!stats) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f5f4' }}>
        <p style={{ color: '#615d59' }}>加载中...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>仪表盘</h1>
          <button
            onClick={handleReset}
            disabled={resetting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 500,
              color: '#fff',
              background: '#dc2626',
              border: 'none',
              borderRadius: 6,
              cursor: resetting ? 'not-allowed' : 'pointer',
              opacity: resetting ? 0.7 : 1,
            }}
          >
            <RotateCcw style={{ width: 14, height: 14, animation: resetting ? 'spin 1s linear infinite' : 'none' }} />
            {resetting ? '重置中...' : '重置演示数据'}
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: '总用户数', value: stats.totalUsers, icon: Users, color: '#0075de' },
            { label: '会员总数', value: stats.totalMembers, sub: `体验期 ${stats.trialMembers} / 正式 ${stats.activeMembers}`, icon: CreditCard, color: '#1aae39' },
            { label: '总收入', value: `¥${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: '#f59e0b' },
            { label: '本月收入', value: `¥${stats.monthlyRevenue.toFixed(2)}`, icon: TrendingUp, color: '#8b5cf6' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#615d59' }}>{stat.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>{stat.value}</div>
                  {stat.sub && <div style={{ fontSize: 12, color: '#a39e98' }}>{stat.sub}</div>}
                </div>
                <div style={{ width: 40, height: 40, background: `${stat.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon style={{ width: 20, height: 20, color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {/* Recent Billing */}
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>最近扣费记录</h2>
            </div>
            <div style={{ padding: 8 }}>
              {stats.billingRecords.map((record) => (
                <div key={record.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{record.member.user.name}</div>
                    <div style={{ fontSize: 12, color: '#a39e98' }}>{record.type === 'MEMBERSHIP_FEE' ? '会员费' : '通行费'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, color: '#dc2626' }}>-¥{record.amount}</div>
                    <div style={{ fontSize: 12, color: '#a39e98' }}>{new Date(record.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Distribution */}
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>会员产品分布</h2>
            </div>
            <div style={{ padding: 16 }}>
              {stats.productStats.map((item, index) => (
                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 60, fontSize: 13, color: '#615d59' }}>产品 {index + 1}</div>
                  <div style={{ flex: 1, height: 8, background: '#f6f5f4', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#0075de', borderRadius: 4, width: `${(item._count / stats.totalMembers) * 100}%` }} />
                  </div>
                  <div style={{ width: 32, fontSize: 14, textAlign: 'right' }}>{item._count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
