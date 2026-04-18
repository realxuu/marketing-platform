'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { RefreshCw, Zap } from 'lucide-react'
import { format } from 'date-fns'

interface Order {
  id: string
  amount: number
  status: string
  payMethod: string | null
  channel: string | null
  isActivated: boolean
  activatedAt: string | null
  agreementAccepted: boolean
  createdAt: string
  paidAt: string | null
  user: { name: string; phone: string }
  product: { name: string; type: string }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  const loadOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(setOrders)
  }

  useEffect(() => { loadOrders() }, [])

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: '待支付', color: '#dd5b00', bg: '#fff7ed' },
    PENDING_ACTIVATION: { label: '待激活', color: '#0075de', bg: '#f2f9ff' },
    PAID: { label: '已支付', color: '#1aae39', bg: '#f0fdf4' },
    CANCELLED: { label: '已取消', color: '#615d59', bg: '#f6f5f4' },
    REFUNDED: { label: '已退款', color: '#dc2626', bg: '#fef2f2' },
  }

  const channelMap: Record<string, string> = {
    WECHAT: '微信',
    ALIPAY: '支付宝',
    UNIONPAY: '银联',
  }

  const handleRefund = async (orderId: string) => {
    if (!confirm('确定要退款吗？')) return
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: 'REFUNDED' }),
    })
    loadOrders()
  }

  const handleActivate = async (orderId: string) => {
    if (!confirm('确定要模拟ETC激活吗？激活后将自动扣费并开通会员。')) return
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (data.success) {
        alert('激活成功！已扣费并开通会员，已通知粤运')
      } else {
        alert(data.error || '激活失败')
      }
    } catch {
      alert('激活失败')
    }
    loadOrders()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin/orders" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>订单管理</h1>
          <button onClick={loadOrders} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>
            <RefreshCw style={{ width: 14, height: 14 }} />刷新
          </button>
        </div>

        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f5f4', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                {['订单号', '用户', '产品', '金额', '签约渠道', '状态', '激活', '创建时间', '操作'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13, color: '#615d59' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13 }}>{order.id.slice(0, 8)}...</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div>{order.user.name}</div>
                    <div style={{ fontSize: 12, color: '#a39e98' }}>{order.user.phone}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{order.product.name}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>¥{order.amount.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {order.channel ? (
                      <span style={{ background: '#f6f5f4', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{channelMap[order.channel] || order.channel}</span>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: statusMap[order.status]?.bg, color: statusMap[order.status]?.color, padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                      {statusMap[order.status]?.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {order.isActivated ? (
                      <span style={{ background: '#f0fdf4', color: '#1aae39', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>已激活</span>
                    ) : (
                      <span style={{ background: '#f6f5f4', color: '#615d59', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>未激活</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#615d59' }}>{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {order.status === 'PENDING_ACTIVATION' && !order.isActivated && (
                      <button onClick={() => handleActivate(order.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, cursor: 'pointer', marginRight: 8 }}>
                        <Zap style={{ width: 12, height: 12 }} />激活
                      </button>
                    )}
                    {order.status === 'PAID' && (
                      <button onClick={() => handleRefund(order.id)} style={{ padding: '6px 12px', background: 'transparent', color: '#dc2626', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>退款</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
