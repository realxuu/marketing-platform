'use client'

import Link from 'next/link'
import { Users, CreditCard, TrendingUp, DollarSign, Shield, FileText, Package, CheckCircle } from 'lucide-react'

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

export function Sidebar({ activePath }: { activePath: string }) {
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
